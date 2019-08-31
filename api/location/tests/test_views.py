import json
from django.test import TestCase, RequestFactory

from api.location.views import PlacesView, ReverseGeocodeView, IPLocationView


class PlacesViewTest(TestCase):
    """
    Tests PlacesView
    """
    def setUp(self):
        self.factory = RequestFactory()

    def test_get(self):
        request = self.factory.get('/api/location/places_autocomplete', {'q': ''})
        response = PlacesView.as_view()(request)
        self.assertEqual(response.status_code, 400)


class ReverseGeocodeViewTest(TestCase):
    """
    Tests ReverseGeocodeView
    """
    def setUp(self):
        self.factory = RequestFactory()
        with open('api/test_data/test_data.json') as f:
            self.test_data = json.load(f)

    def test_get_high_accuracy(self):
        request = self.factory.get('/api/location/reverse_geocode', self.test_data["location"]["high accuracy"])
        response = ReverseGeocodeView.as_view()(request)
        self.assertEqual(response.status_code, 200)

    def test_get_low_accuracy(self):
        request = self.factory.get('/api/location/reverse_geocode', self.test_data["location"]["low accuracy"])
        response = ReverseGeocodeView.as_view()(request)
        self.assertEqual(response.status_code, 200)


class IPLocationViewTest(TestCase):
    """
    Tests IPLocationView
    """
    def setUp(self):
        self.factory = RequestFactory()
        with open('api/test_data/test_data.json') as f:
            self.test_data = json.load(f)

    def test_get(self):
        request = self.factory.get('/api/location/get_location', data=None, secure=False,
                                   HTTP_X_FORWARDED_FOR=self.test_data["location"]["HTTP_X_FORWARDED_FOR"])
        response = IPLocationView.as_view()(request)
        self.assertEqual(response.status_code, 200)
