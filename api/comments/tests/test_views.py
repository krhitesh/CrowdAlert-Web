import json
import uuid

from django.conf import settings
from django.test import TestCase
from rest_framework.test import APIRequestFactory, force_authenticate

from api.comments.models import Comment
from api.comments.views import CommentView
from api.firebase_auth.users import FirebaseUser
from api.utils.firebase_utils import get_authenticated_user_token, delete_collection

db = settings.FIRESTORE


class CommentViewTest(TestCase):
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

    def test_get_comment_thread(self):
        request = self.factory.get('/api/comments/comment', {'thread': '1234'})
        force_authenticate(request, user=self.user)
        response = CommentView.as_view()(request)
        self.assertEqual(response.status_code, 200)

    def test_get_comment_thread_bad_request(self):
        request = self.factory.get('/api/comments/comment', {})
        response = CommentView.as_view()(request)
        self.assertEqual(response.status_code, 400)

    def test_post_comment(self):
        c = Comment()
        c.save('sl6NOrYyjvTQwUtCsOha', db)
        settings.COVERAGE = True
        data = json.dumps({"commentData": '{"text":"test", "thread":"sl6NOrYyjvTQwUtCsOha"}'})
        request = self.factory.post(path='/api/comments/comment', data=data, content_type='application/json')
        force_authenticate(request, user=self.user, token=self.auth_token)
        response = CommentView.as_view()(request)
        self.assertEqual(response.status_code, 200)

    def tearDown(self):
        print('Cleaning up comments')
        delete_collection(db.collection(Comment.collection_name))
