import os
import uuid
import json

from django.conf import settings
from django.test import TestCase, RequestFactory

from api.firebase_auth.users import FirebaseUser
from api.upvote.models import Upvote
from api.upvote.views import UpvoteView
from api.utils.firebase_utils import get_anonymous_user_token, delete_collection, delete_anonymous_user, get_authenticated_user_token

db = settings.FIRESTORE


class UpvoteViewTest(TestCase):
    """
    Tests UpvoteView
    """
    def setUp(self):
        with open('api/test_data/test_data.json') as f:
            self.test_data = json.load(f)
            self.user = FirebaseUser(self.test_data["users"]["firebase_data"])

        self.factory = RequestFactory()
        self.auth_token = get_authenticated_user_token()
        self.token = get_anonymous_user_token()
        self.test_uuid = str(uuid.uuid4())
        u = Upvote(0, [])
        u.save(self.test_uuid, db)

    def test_get(self):
        request = self.factory.get('/api/upvote/upvote', data={'uuid': self.test_uuid}, secure=False,
                                   HTTP_TOKEN=self.token)
        response = UpvoteView.as_view()(request)
        self.assertEqual(response.status_code, 200)

    def test_post(self):
        request = self.factory.post('/api/upvote/upvote?uuid=' + self.test_uuid, data=None,
                                    content_type='application/json', secure=False,
                                    HTTP_TOKEN=self.auth_token)
        request.user = self.user
        response = UpvoteView.as_view()(request)
        self.assertEqual(response.status_code, 200)

    def tearDown(self):
        print('Cleaning up upvote')
        delete_collection(db.collection(Upvote.collection_name))
        delete_anonymous_user(self.token)
