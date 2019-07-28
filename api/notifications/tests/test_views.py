import json
import os

from django.test import TestCase, RequestFactory

from api.firebase_auth.users import FirebaseUser
from api.notifications.views import FCMTokenView
from api.utils.firebase_utils import get_anonymous_user_token, delete_anonymous_user, get_authenticated_user_token

FCMTokenView.collection_name = 'test_' + FCMTokenView.collection_name


class FCMTokenViewTest(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.auth_token = get_authenticated_user_token()
        self.token = get_anonymous_user_token()
        firebase_data = {
            'uid': '',
            'user_id': '',
            'name': '',
            'picture': '',
            'email_verified': True
        }
        self.user = FirebaseUser(firebase_data)

    def test_get(self):
        request = self.factory.get('/api/notifications/register', data=None, secure=False, HTTP_TOKEN=self.token)
        request.user = self.user
        response = FCMTokenView.as_view()(request)
        self.assertEqual(response.status_code, 200)

    def test_post(self):
        data = json.dumps({'fcmtoken': 'fcm token'})
        request = self.factory.post('/api/notifications/register', data=data, content_type='application/json',
                                    secure=False, HTTP_TOKEN=self.auth_token)
        response = FCMTokenView.as_view()(request)
        self.assertEqual(response.status_code, 200)

    def tearDown(self):
        print('Cleaning up notifications')
        delete_anonymous_user(self.token)
