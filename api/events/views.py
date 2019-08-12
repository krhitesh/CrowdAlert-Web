""" Django view module
"""

import os
import json
import time
import base64
import requests

from api.utils.geohash_util import encode
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.conf import settings
from django.http import JsonResponse, HttpResponseBadRequest
from firebase_admin.firestore import GeoPoint
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from api.comments.models import Comment
from api.firebase_auth.authentication import TokenAuthentication
from api.firebase_auth.permissions import FirebasePermissions
from api.notifications.dispatch import notify_incident
from api.spam.classifier import classify_text
from api.spam.views import get_spam_report_data
from api.users.models import User
from .models import Event, IncidentReport
from api.utils.event_colors import get_event_color

DB = settings.FIRESTORE
GMAPS = settings.GMAPS

class EventView(APIView):
    """ API view class for events
    """
    authentication_classes = (TokenAuthentication,)
    permission_classes = (FirebasePermissions,)

    def get(self, request):
        """Returns events within a certain radius for a given location

        GET request parameters:
            [REQUIRED]
            id: firebase event id
        Arguments:
            request {[type]} -- [ Contains the django request object]
        Returns:
            [HttpResponseBadRequest] -- [If  event id is not given]
            [JsonResponse] -- [Containing the event data]
        """
        query = request.GET.get('id', '')
        if query == '':
            return HttpResponseBadRequest("Bad request: No Id specified")

        event = Event.get(query, DB)
        for key in event.reported_by:
            if event.reported_by[key]['anonymous']:
                event.reported_by[key] = {
                    "displayName": "Anonymous",
                    "photoURL": 'https://crowdalert.herokuapp.com/static/images/meerkat.svg',
                }
            else:
                user_id = event.reported_by[key]['userId']
                udata = User.get(user_id, DB)
                event.reported_by[key] = {
                    "displayName": udata.display_name,
                    "photoURL": udata.photo_url,
                    "uid": user_id
                }
        data = event.to_response_dict()
        data['spam'] = get_spam_report_data(query)
        return JsonResponse(data, safe=False)

    def post(self, request):
        """
        When a signed in user adds a new incident, post event to firebase DB
        and check among all channels if this newly added event
        is in the proximity of that channel. If it is, then shovel that
        event to that channel. It is for the clients to decide whether or
        not this event satisfies their current distance criterion.

        Potential required features:
            Custom validation
            Location validation
            Spam classification
        """
        event_data = json.loads(request.body.decode()).get('eventData', '')
        if event_data == '':
            return HttpResponseBadRequest("Bad request")
        decoded_json = json.loads(event_data)
        uid = str(request.user)

        latitude = decoded_json['location']['coords']['latitude']
        longitude = decoded_json['location']['coords']['longitude']
        datetime = int(time.time() * 1000)

        # Compute geohash below
        event = Event(
            category=decoded_json['category'],
            datetime=datetime,
            description=decoded_json['description'],
            local_assistance=decoded_json['local_assistance'],
            location={
                "coords": GeoPoint(latitude, longitude),
                "geohash": encode(location=[latitude, longitude], precision=12)
            },
            public={
                "share": decoded_json['public']['share'],
                "view": decoded_json['public']['view'],
            },
            reported_by={
                "original": {
                    "userId": uid,
                    "anonymous": decoded_json['anonymous'],
                }
            },
            title=decoded_json['title'],
            images=[]
        )

        key = event.save(DB)

        incident_report = IncidentReport.get(uid, DB)
        if incident_report is None:
            incident_report = IncidentReport(uid, [key])
            incident_report.save(DB)
        else:
            incident_report.add_report(key, DB)

        comment = Comment(participants=[uid])
        comment.save(key, DB)

        user_name = request.user.name
        user_picture = request.user.user_picture
        if event.local_assistance and not settings.COVERAGE:
            notify_incident(sender_uid=uid, datetime=datetime,
                            event_id=key, event_type=event.category,
                            lat=latitude, lng=longitude,
                            user_text=event.title,
                            user_name=user_name, user_picture=user_picture)

        if not settings.COVERAGE:
            classify_text(event.description, key)

            channel_layer = get_channel_layer()
            # Send the event to all the websocket channels
            async_to_sync(channel_layer.group_send)(
                "geteventsbylocation_", {
                    "type": 'event_message',
                    "message": {
                        "actionType": 'WS_NEW_EVENT_RECEIVED',
                        "data": {
                            "lat": latitude,
                            "long": longitude,
                            "key": str(key),
                            "datetime": datetime,
                            "category": event.category,
                            "title": event.title
                        }
                    }
                }
            )

        return JsonResponse({"eventId": str(key)})

    def patch(self, request):
        """Patches an incident data 

        PATCH request parameters:
            [REQUIRED]
            eventData: stringified JSON data. Must have at eventid key.
        Arguments:
            request {[type]} -- [ Contains the django request object]
        Returns:
            [HttpResponseBadRequest] -- [If  eventData is not given]
            [JsonResponse] -- [Containing the event id]
        """
        event_data = json.loads(request.body.decode()).get('eventData', '')
        if event_data == '':
            return HttpResponseBadRequest("Bad request")
        decoded_json = json.loads(event_data)

        eventid = decoded_json['eventid']
        if 'location' in decoded_json.keys():
            decoded_json['location']['geohash'] = encode(location=[decoded_json['location']['coords']['latitude'], decoded_json['location']['coords']['longitude']])
            geopoint = GeoPoint(decoded_json['location']['coords']['latitude'], decoded_json['location']['coords']['longitude'])
            decoded_json['location']['coords'] = geopoint

        Event.patch(eventid, decoded_json, DB)
        event = Event.get(eventid, DB)
        if 'description' in decoded_json.keys() and not settings.COVERAGE:
            classify_text(decoded_json['description'], eventid)

        if not settings.COVERAGE:
            channel_layer = get_channel_layer()
            # Send the event in response to patch to all the websocket channels
            async_to_sync(channel_layer.group_send)(
                "geteventsbylocation_", {
                    "type": 'event_message',
                    "message": {
                        "actionType": 'WS_NEW_EVENT_RECEIVED',
                        "data": {
                            "lat": event.location['coords'].latitude,
                            "long": event.location['coords'].longitude,
                            "key": str(eventid),
                            "datetime": event.datetime,
                            "category": event.category,
                            "title": event.title
                        }
                    }
                }
            )
        return JsonResponse({"eventId": str(eventid)})


class MultipleEventsView(APIView):
    """API View for grouping incidents by location
    """

    def get(self, request):
        """Returns events within a certain radius for a given location

        POST request parameters:
            [REQUIRED]
            lat: latitude of the location

            long: longitude of the location

            dist: maximum radius of the location

            cluster_threshold: maximum distance between any number events to cluster into one event

        Arguments:
            request {[type]} -- [ Contains the django request object]

        Returns:
            [HttpResponseBadRequest] -- [If  any of the required parameters is
                                        not given.]
            [JsonResponse] -- [Containing the event data]
        """

        # Should use API View here
        lat = float(request.GET.get('lat', ''))
        lng = float(request.GET.get('long', ''))
        threshold = float(request.GET.get('dist', ''))
        if lat == '' or lng == '' or threshold == '':
            return HttpResponseBadRequest("Bad request")

        cluster_threshold = float(request.GET.get('min', 0))
        data = Event.get_events_around(
            center={"latitude": lat, "longitude": lng},
            max_distance=threshold,
            cluster_threshold=cluster_threshold,
            db=DB
        )
        return JsonResponse(data, safe=False)


class UserIncidents(APIView):
    """ API view class for events
    """
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        uid = str(request.user)
        incident_report = IncidentReport.get(uid, DB)
        if incident_report is None:
            return JsonResponse({ "data": [] }, safe=False)

        data = []
        for report in incident_report.reports:
            doc = report.get()
            event_dict = doc.to_dict()
            
            static_map_url = "http://maps.googleapis.com/maps/api/staticmap?key=" + os.getenv('REACT_APP_GOOGLE_MAPS_KEY') + "&zoom=15&size=320x320&maptype=roadmap&markers=color:" + get_event_color(event_dict['category']) + "|" + str(event_dict['location']['coords'].latitude) + "," + str(event_dict['location']['coords'].longitude)
            static_map_base64_bytes = base64.b64encode(requests.get(static_map_url).content)
            static_map_base64_string = "data:image/png;base64," + static_map_base64_bytes.decode('utf-8')

            rgc = GMAPS.reverse_geocode(latlng=(event_dict['location']['coords'].latitude, event_dict['location']['coords'].longitude))
            data.append({'key': doc.id, 'lat': event_dict['location']['coords'].latitude,
            'long': event_dict['location']['coords'].longitude, 'category': event_dict['category'],
            'title': event_dict['title'], 'description': event_dict['description'], 'datetime': event_dict['datetime'],
            'formatted_address': rgc[0]['formatted_address'],
            'static_map': static_map_base64_string})
        
        return JsonResponse({ "data": data }, safe=False)
