from django.test import TestCase
from rest_framework.test import APIRequestFactory

from api.location.views import DirectionsView, PlacesView, ReverseGeocodeView, IPLocationView


class DirectionsViewTest(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()

    def test_get(self):
        request = self.factory.get('/api/location/get_directions', {'startLat': 26.3423, 'startLong': 80.3433, 'endLat': 24.2342, 'endLong': 80.1111})
        response = DirectionsView.as_view()(request)
        self.assertEqual(response.status_code, 200)


class PlacesViewTest(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()

    def test_get(self):
        request = self.factory.get('/api/location/places_autocomplete', {'q': ''})
        response = PlacesView.as_view()(request)
        self.assertEqual(response.status_code, 400)


class ReverseGeocodeViewTest(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()

    def test_get_high_accuracy(self):
        request = self.factory.get('/api/location/reverse_geocode',
                                   {'lat': 26.3423, 'long': 80.4323, 'accuracy': 'high'})
        response = ReverseGeocodeView.as_view()(request)
        self.assertEqual(response.status_code, 200)

    def test_get_low_accuracy(self):
        request = self.factory.get('/api/location/reverse_geocode',
                                   {'lat': 26.3423, 'long': 80.4323, 'accuracy': 'low'})
        response = ReverseGeocodeView.as_view()(request)
        self.assertEqual(response.status_code, 200)


class IPLocationViewTest(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()

    def test_get(self):
        request = self.factory.get('/api/location/get_location',
                                   data=None, HTTP_X_FORWARDED_FOR='14.139.38.127')
        response = IPLocationView.as_view()(request)
        self.assertEqual(response.status_code, 200)
