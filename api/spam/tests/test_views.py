import os
import uuid
import json

from django.conf import settings
from django.test import TestCase, RequestFactory

from api.firebase_auth.users import FirebaseUser
from api.spam.models import Classifier
from api.spam.views import SpamReportView
from api.utils.firebase_utils import get_anonymous_user_token, delete_collection, delete_anonymous_user, get_authenticated_user_token

db = settings.FIRESTORE


class SpamReportViewTest(TestCase):
    """
    Tests SpamReportView
    """
    def setUp(self):
        with open('api/test_data/test_data.json') as f:
            self.test_data = json.load(f)
            self.user = FirebaseUser(self.test_data["users"]["firebase_data"])
            
        self.factory = RequestFactory()
        self.auth_token = get_authenticated_user_token()
        self.token = get_anonymous_user_token()
        self.test_uuid = str(uuid.uuid4())
        c = Classifier(0, [])
        c.save(self.test_uuid, db)

    def test_get(self):
        request = self.factory.get('/api/spam/report', data={'uuid': self.test_uuid}, secure=False,
                                   HTTP_TOKEN=self.token)
        response = SpamReportView.as_view()(request)
        self.assertEqual(response.status_code, 200)

    def test_post(self):
        request = self.factory.post('/api/spam/report?uuid=' + self.test_uuid, data=None,
                                    content_type='application/json', secure=False,
                                    HTTP_TOKEN=self.auth_token)
        request.user = self.user
        response = SpamReportView.as_view()(request)
        self.assertEqual(response.status_code, 200)

    def tearDown(self):
        print('Cleaning up classifer')
        delete_collection(db.collection(Classifier.collection_name))
        delete_anonymous_user(self.token)
