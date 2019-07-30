""" Django API view module for locations app
"""

import geocoder as gc
from googlemaps import convert
import reverse_geocoder as rgc
from django.conf import settings
from django.http import JsonResponse, HttpResponseBadRequest
from rest_framework.views import APIView

GMAPS = settings.GMAPS


class DirectionsView(APIView):

    def get(self, request):
        try:
            start_lat = float(request.GET.get('startLat', ''))
            start_lng = float(request.GET.get('startLong', ''))
            end_lat = float(request.GET.get('endLat', ''))
            end_lng = float(request.GET.get('endLong', ''))
        except ValueError:
            return HttpResponseBadRequest("Bad request")

        directions_result = GMAPS.directions({ "lat": start_lat, "lng": start_lng},
                                     { "lat": end_lat, "lng": end_lng})

        res = {}
        polyline_points = []
        html_instructions = []
        distance = '0 km'
        if (len(directions_result) > 0):
            polyline_points = convert.decode_polyline(directions_result[0]['overview_polyline']['points'])
            steps = directions_result[0]['legs'][0]['steps']
            distance = directions_result[0]['legs'][0]['distance']['text']
            for step in steps:
                html_instructions.append(step['html_instructions'])

        res['polyline_points'] = polyline_points
        res['html_instructions'] = html_instructions
        res['distance'] = distance
        return JsonResponse(res, safe=False)


class PlacesView(APIView):
    """ Autocomplete place names using google maps

    Arguments:
        APIView -- [REST framework API view]
    """

    def get(self, request):
        """ 
        GET request parameters: 
            [REQUIRED]
            q: location name

        Returns:
            [HttpResponseBadRequest] -- [If  any of the required parameters is
                                            not given.]
            [JsonResponse] -- [Containing the location data]     
        """
        query = request.GET.get('q', '')
        if query == '':
            return HttpResponseBadRequest("Bad request")
        data = GMAPS.places_autocomplete(input_text=query[:50])
        return JsonResponse(data, safe=False)


class ReverseGeocodeView(APIView):
    """Returns reverse geocode for a given location
    """

    def get(self, request):
        """
        GET request parameters: 
            [REQUIRED]
            lat: latitude of the location

            long: longitude of the location

            accuracy: API to be used.
                high: Google API
                low:  generic API

        Returns:
            [HttpResponseBadRequest] -- [If  any of the required parameters is
                                            not given.]
            [JsonResponse] -- [Containing the location data]     
        """

        lat = float(request.GET.get('lat', ''))
        lng = float(request.GET.get('long', ''))
        accuracy = request.GET.get('accuracy', '')

        if lat == '' or lng == '':
            return HttpResponseBadRequest("Bad request")

        if accuracy == 'high':
            data = GMAPS.reverse_geocode(latlng=(lat, lng))
            return JsonResponse(data, safe=False)

        return JsonResponse((rgc.get((lat, lng))))


class IPLocationView(APIView):
    """Geocodes a request using IP
    """

    def get(self, request):
        """GET request method

        Returns:
            [HttpResponseBadRequest] -- [If  any of the required parameters is
                                            not given.]
            [JsonResponse] -- [Containing the location data] 
        """

        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            user_ip = x_forwarded_for.split(',')[0]
        else:
            user_ip = request.META.get('REMOTE_ADDR')
        return JsonResponse(gc.ip(user_ip).json, safe=False)
