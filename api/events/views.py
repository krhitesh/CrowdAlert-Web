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
from api.events.util import toGeoHash, fromGeoHash, getPrecisionForRadius

DB = settings.FIREBASE.database()

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
        """Post event to firebase DB.

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
        geohash = toGeoHash(latitude, longitude)
        incident_data = {
            "category": decoded_json['category'],
            "datetime": int(time.time()*1000),
            "description": decoded_json['description'],
            "local_assistance": decoded_json['local_assistance'],
            "location": {
                "coords": {
                    "latitude": latitude,
                    "longitude": longitude,
                },
                "geohash": geohash
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

        # Build the path
        path = ''
        for i in range(0, 12):
            path += '/' + geohash[i]

        data = DB.child('incidents' + path).push(incident_data)

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
            notify_incident(sender_uid=uid, datetime=int(time.time()*1000),
                            event_id=key, event_type=decoded_json['category'],
                            lat=latitude, lng=longitude,
                            user_text=decoded_json['title'],
                            user_name=user_name, user_picture=user_picture)
        classify_text(decoded_json['description'], key)
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

        geohash = toGeoHash(lat, lng)
        geohash_matching_length = getPrecisionForRadius(threshold)
        data = []

        # Build the path
        path = ''
        for i in range(0, geohash_matching_length): 
            path += '/' + geohash[i]

        incidents = DB.child('incidents' + path).get()
        
        # Safe call: Check if required node exists
        if incidents.each() is None:
            return JsonResponse(data, safe=False)

        # Cluster parameter
        cluster_threshold = float(request.GET.get('min', 0))

        # Represents how many characters in incident's GeoHash should we neglect for a cluster
        cluster_threshold_geohash_length = getPrecisionForRadius(cluster_threshold)

        for incident in incidents.each():
            temp = self.get_data_recursively(incident.val(), 11 - geohash_matching_length, cluster_threshold_geohash_length)
            data += temp

        if (11 - geohash_matching_length) <= cluster_threshold_geohash_length:
            # If the cluster threshold exceeds the radial threshold, wrap all incidents into a single cluster
            data = self.create_cluster(data)

        return JsonResponse(data, safe=False)


    def get_data_recursively(self, fetched_data, depth, clustering_depth):
        """Returns a list of events extracted recursively from a nested dictionary and does conditional clustering

        Arguments:
                [fetched_data] -- [Nested dictionary having event as its leaf node]
                [depth] -- [Depth up to which the dictionary is to be traversed]
                [clustering_depth] -- [Depth below which all the events have to be clustered]
        """
        if isinstance(fetched_data, list):
            # Handling unknown Firebase issue that returns list instead of dictionary
            temp = {}
            for i in range(0, len(fetched_data)):
                if fetched_data[i] is not None:
                    temp[str(i)] = fetched_data[i]

            fetched_data = temp

        data = []
        if fetched_data is None or len(fetched_data) is 0:
            return data
        elif depth == 0:
            for key, event in fetched_data.items():
                temp = {}
                temp['key'] = key
                temp['lat'] = event['location']['coords']['latitude']
                temp['long'] = event['location']['coords']['longitude']
                temp['category'] = event['category']
                temp['title'] = event['title']
                temp['datetime'] = event['datetime']
                data.append(temp)
            return data

        for key, level_data in fetched_data.items():
            incidents = self.get_data_recursively(level_data, depth - 1, clustering_depth)
            data = data + incidents

        if depth <= clustering_depth and len(data) > 0:
            return self.create_cluster(data)

        return data


    def create_cluster(self, data):
        """Returns a unit sized list having a clustered event.
        
        Arguments:
                    [data] -- [List of all events that need to be aggregated into one single event]
        """
        clustered_data = []
        temp = {}
        temp['isClustered'] = True
        temp['key'] = data[0]['key']
        temp['lat'] = 0.0
        temp['long'] = 0.0
        temp['category'] = data[0]['category']
        temp['title'] = data[0]['title']
        temp['datetime'] = data[0]['datetime']
        for incident in data:
            temp['lat'] += incident['lat']
            temp['long'] = incident['long']

        temp['lat'] = temp['lat']/float(len(data))
        temp['long'] = temp['long']/float(len(data))
        clustered_data.append(temp)
        return clustered_data
