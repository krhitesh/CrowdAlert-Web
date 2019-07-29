import uuid

from django.conf import settings
from django.test import TestCase
from rest_framework.test import APIRequestFactory, force_authenticate

from api.firebase_auth.users import FirebaseUser
from api.images.views import ImagesView
from api.utils.firebase_utils import get_authenticated_user_token

db = settings.FIRESTORE


class ImagesViewTest(TestCase):
    def setUp(self):
        self.auth_token = get_authenticated_user_token()
        self.factory = APIRequestFactory()
        firebase_data = {
            'uid': str(uuid.uuid1()),
            'user_id': '',
            'name': '',
            'picture': '',
            'email_verified': True
        }
        self.user = FirebaseUser(firebase_data)

    def test_get(self):
        request = self.factory.get('/api/images/image', {'uuid': '84c7ed21-2a02-414b-a700-89d4b8084ee9.jpg'})
        force_authenticate(request, user=self.user)
        response = ImagesView.as_view()(request)
        self.assertEqual(response.status_code, 302)

    def test_get_thumbnail(self):
        request = self.factory.get('/api/images/image',
                                   {'uuid': '84c7ed21-2a02-414b-a700-89d4b8084ee9.jpg', 'mode': 'thumbnail'})
        force_authenticate(request, user=self.user)
        response = ImagesView.as_view()(request)
        self.assertEqual(response.status_code, 302)
