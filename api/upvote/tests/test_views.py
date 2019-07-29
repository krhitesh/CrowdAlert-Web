import uuid

from django.conf import settings
from django.test import TestCase
from rest_framework.test import APIRequestFactory, force_authenticate

from api.firebase_auth.users import FirebaseUser
from api.upvote.models import Upvote
from api.upvote.views import UpvoteView
from api.utils.firebase_utils import delete_collection, get_authenticated_user_token

db = settings.FIRESTORE


class UpvoteViewTest(TestCase):
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
        self.test_uuid = str(uuid.uuid4())
        u = Upvote(0, [])
        u.save(self.test_uuid, db)

    def test_get(self):
        request = self.factory.get('/api/upvote/upvote', data={'uuid': self.test_uuid})
        force_authenticate(request, user=self.user, token=self.auth_token)
        response = UpvoteView.as_view()(request)
        self.assertEqual(response.status_code, 200)

    def test_post(self):
        request = self.factory.post('/api/upvote/upvote?uuid=' + self.test_uuid, data=None,
                                    content_type='application/json')
        force_authenticate(request, user=self.user, token=self.auth_token)
        response = UpvoteView.as_view()(request)
        self.assertEqual(response.status_code, 200)

    def tearDown(self):
        print('Cleaning up upvote')
        delete_collection(db.collection(Upvote.collection_name))
