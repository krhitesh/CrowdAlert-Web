import json
import uuid

from django.test import TestCase
from rest_framework.test import APIRequestFactory, force_authenticate

from api.firebase_auth.users import FirebaseUser
from api.notifications.views import FCMTokenView
from api.utils.firebase_utils import get_authenticated_user_token

FCMTokenView.collection_name = 'test_' + FCMTokenView.collection_name


class FCMTokenViewTest(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.auth_token = get_authenticated_user_token()
        firebase_data = {
            'uid': str(uuid.uuid1()),
            'user_id': '',
            'name': '',
            'picture': '',
            'email_verified': True
        }
        self.user = FirebaseUser(firebase_data)

    def test_get(self):
        request = self.factory.get('/api/notifications/register', data=None)
        force_authenticate(request, user=self.user, token=self.auth_token)
        response = FCMTokenView.as_view()(request)
        self.assertEqual(response.status_code, 200)

    def test_post(self):
        data = json.dumps({'fcmtoken': 'fcm token'})
        request = self.factory.post('/api/notifications/register', data=data, content_type='application/json')
        force_authenticate(request, user=self.user, token=self.auth_token)
        response = FCMTokenView.as_view()(request)
        self.assertEqual(response.status_code, 200)
