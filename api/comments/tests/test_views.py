import json

from django.conf import settings
from django.test import TestCase, RequestFactory

from api.comments.models import Comment
from api.comments.views import CommentView
from api.firebase_auth.users import FirebaseUser
from api.utils.firebase_utils import get_anonymous_user_token, delete_anonymous_user, delete_collection

db = settings.FIRESTORE


class CommentViewTest(TestCase):
    """
    Tests comment app's APIViews
    """
    def setUp(self):
        self.token = get_anonymous_user_token()
        self.factory = RequestFactory()
        with open('api/test_data/test_data.json') as f:
            self.test_data = json.load(f)
            self.user = FirebaseUser(self.test_data["users"]["firebase_data"])

    def test_get_comment_thread(self):
        request = self.factory.get('/api/comments/comment', {'thread': '1234'})
        request.user = self.user
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
        data = json.dumps({"commentData": self.test_data["comments"]["commentData"]})
        request = self.factory.post(path='/api/comments/comment', data=data, content_type='application/json',
                                    secure=False, HTTP_TOKEN=self.token)
        request.user = self.user
        response = CommentView.as_view()(request)
        self.assertEqual(response.status_code, 200)

    def tearDown(self):
        print('Cleaning up comments')
        delete_collection(db.collection(Comment.collection_name))
        delete_anonymous_user(self.token)
