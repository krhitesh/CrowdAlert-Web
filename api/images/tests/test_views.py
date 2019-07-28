from django.conf import settings
from django.test import TestCase, RequestFactory

from api.firebase_auth.users import FirebaseUser
from api.images.views import ImagesView
from api.utils.firebase_utils import get_anonymous_user_token, delete_anonymous_user

db = settings.FIRESTORE


class ImagesViewTest(TestCase):
    def setUp(self):
        self.token = get_anonymous_user_token()
        self.factory = RequestFactory()
        firebase_data = {
            'uid': '',
            'user_id': '',
            'name': '',
            'picture': '',
            'email_verified': True
        }
        self.user = FirebaseUser(firebase_data)

    def test_get(self):
        request = self.factory.get('/api/images/image', {'uuid': '84c7ed21-2a02-414b-a700-89d4b8084ee9.jpg'})
        request.user = self.user
        response = ImagesView.as_view()(request)
        self.assertEqual(response.status_code, 302)

    def test_get_thumbnail(self):
        request = self.factory.get('/api/images/image',
                                   {'uuid': '84c7ed21-2a02-414b-a700-89d4b8084ee9.jpg', 'mode': 'thumbnail'})
        request.user = self.user
        response = ImagesView.as_view()(request)
        self.assertEqual(response.status_code, 302)

    def tearDown(self):
        print('Cleaning up images')
        delete_anonymous_user(self.token)
