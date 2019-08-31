import json
from django.conf import settings
from django.test import TestCase, RequestFactory

from api.firebase_auth.users import FirebaseUser
from api.images.views import ImagesView
from api.utils.firebase_utils import get_anonymous_user_token, delete_anonymous_user

db = settings.FIRESTORE


class ImagesViewTest(TestCase):
    """
    Tests images app's API views
    """
    def setUp(self):
        self.token = get_anonymous_user_token()
        self.factory = RequestFactory()
        with open('api/test_data/test_data.json') as f:
            self.test_data = json.load(f)
            self.user = FirebaseUser(self.test_data["users"]["firebase_data"])

    def test_get(self):
        request = self.factory.get('/api/images/image', {'uuid': self.test_data["images"]["image"]["uuid"]})
        request.user = self.user
        response = ImagesView.as_view()(request)
        self.assertEqual(response.status_code, 302)

    def test_get_thumbnail(self):
        request = self.factory.get('/api/images/image', self.test_data["images"]["image"])
        request.user = self.user
        response = ImagesView.as_view()(request)
        self.assertEqual(response.status_code, 302)

    def tearDown(self):
        print('Cleaning up images')
        delete_anonymous_user(self.token)
