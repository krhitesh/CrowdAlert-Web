""" Django view module
"""

import json
import time
from django.http import JsonResponse, HttpResponseBadRequest
from django.conf import settings
from rest_framework.views import APIView
from api.location.gps import distance
from api.firebase_auth.authentication import TokenAuthentication
from api.firebase_auth.permissions import FirebasePermissions
from api.spam.classifier import classify_text
from api.spam.views import get_spam_report_data
from api.notifications.dispatch import notify_incident
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer


DB = settings.FIREBASE.database()

def get_multiple_events(lat, lng, thresold, cluster_thresold):
    incidents = DB.child('incidents').get()
    data = []

    # Find events which are inside the circle

    # This method is highly inefficient
    # In takes O(n) time for each request
    # Should use a GeoHash based solution instead of this
    for incident in incidents.each():
        event = dict(incident.val())
        temp = {}
        temp['key'] = incident.key()
        temp['lat'] = event['location']['coords']['latitude']
        temp['long'] = event['location']['coords']['longitude']
        temp['category'] = event['category']
        temp['title'] = event['title']
        temp['datetime'] = event['datetime']
        tmplat = float(event['location']['coords']['latitude'])
        tmplng = float(event['location']['coords']['longitude'])
        dist = distance(tmplat, tmplng, lat, lng)
        if dist < thresold:
            data.append(temp)

    # Cluster the events
    # This code should also be present on client side
    if cluster_thresold:
        # clustered incidents data
        clustered_data = []
        # Consider each node as root for now
        for root in data:
            # If is clustered flag is not present
            if not root.get('isClustered', False):
                # Loop though the points
                for child in data:
                    # Base case
                    if child['key'] == root['key']:
                        continue
                    # If node is not clustered
                    if not child.get('isClustered', False):
                        # Calculate the distance
                        temp_distance = distance(root['lat'], root['long'],
                                                    child['lat'], child['long'])
                        # If two points are too close on map cluster them
                        if temp_distance < cluster_thresold:
                            # Update root
                            root['isClustered'] = True
                            root['lat'] = (root['lat'] + child['lat'])/2
                            root['long'] = (root['long'] + child['long'])/2
                            # Mark child
                            child['isClustered'] = True
                clustered_data.append(root)
        return clustered_data
    return data

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

        data = DB.child('incidents').child(query).get().val()
        for key in data['reportedBy']:
            if data['reportedBy'][key]['anonymous']:
                data['reportedBy'][key] = {
                    'displayName': "Anonymous",
                    'photoURL': 'https://crowdalert.herokuapp.com/static/images/meerkat.svg',
                }
            else:
                user_id = data['reportedBy'][key]['userId']
                udata = DB.child('users/' + user_id).get().val()
                data['reportedBy'][key] = {
                    'displayName': udata['displayName'],
                    'photoURL': udata['photoURL'],
                }
        data['spam'] = get_spam_report_data(query)
        return JsonResponse(data, safe=False)

    def post(self, request):
        """
        When a signed in user adds a new incident, post event to firebase DB
        and check among all channels if this newly added event
        is in the proximity of that channel. If it is, then shovel that
        event to that channel. It is for the clients to decide whether or
        not this event satifies their current distance criterion.

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
        datetime = int(time.time()*1000)
        incident_data = {
            "category": decoded_json['category'],
            "datetime": datetime,
            "description": decoded_json['description'],
            "local_assistance": decoded_json['local_assistance'],
            "location": {
                "coords": {
                    "latitude": latitude,
                    "longitude": longitude,
                },
            },
            "public": {
                "share": decoded_json['public']['share'],
                "view":  decoded_json['public']['view'],
            },
            "reportedBy": {
                "original": {
                    "userId": uid,
                    "anonymous": decoded_json['anonymous'],
                },
            },
            "title": decoded_json['title']
        }

        data = DB.child('incidents').push(incident_data)

        key = data['name']
        DB.child('incidentReports/' + uid).push({
            "incidentId": key,
        })
        # Add the comments section
        DB.child('comments/' + key + '/participants').update({
            uid: True
        })
        user_name = request.user.name
        user_picture = request.user.user_picture
        if decoded_json['local_assistance']:
            notify_incident(sender_uid=uid, datetime=datetime,
                            event_id=key, event_type=decoded_json['category'],
                            lat=latitude, lng=longitude,
                            user_text=decoded_json['title'],
                            user_name=user_name, user_picture=user_picture)
        classify_text(decoded_json['description'], key)

        channel_layer = get_channel_layer()
        # Send the event to all the websocket channels
        async_to_sync(channel_layer.group_send)(
            'geteventsbylocation_', {
                "type": "event_message",
                "message": {
                    'actionType': 'WS_NEW_EVENT_RECEIVED',
                    'data': {
                        'lat': latitude,
                        'long': longitude,
                        'key': str(key),
                        'datetime': datetime,
                        'category': decoded_json['category'],
                        'title': decoded_json['title']
                    }
                }
            }
        )

        return JsonResponse({"eventId":str(key)}) 

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

            cluster_thresold: maximum distance between any number events to cluster into one event

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
        thresold = float(request.GET.get('dist', ''))
        if lat == '' or lng == '' or thresold == '':
            return HttpResponseBadRequest("Bad request")
        
        cluster_thresold = float(request.GET.get('min', 0))
        data = get_multiple_events(lat, lng, thresold, cluster_thresold)
        return JsonResponse(data, safe=False)
