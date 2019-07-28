import time
import uuid

from django.conf import settings
from django.test import TestCase, Client

from api.comments.models import Comment, CommentData
from api.utils.firebase_utils import delete_collection

client = Client()

db = settings.FIRESTORE

Comment.collection_name = 'test__' + Comment.collection_name
Comment.subcollection_name = 'test__' + Comment.subcollection_name
CommentData.collection_name = 'test__' + CommentData.collection_name


def create_comment(participants=None):
    return Comment(participants=participants)


class CommentTest(TestCase):
    test_incident_key = None

    def test_comment_creation(self):
        c = create_comment()
        self.assertTrue(isinstance(c, Comment))
        self.assertEqual(c.participants, [])

    def test_save(self):
        c = create_comment()
        self.test_incident_key = str(uuid.uuid4())
        incident_id = c.save(self.test_incident_key, db)
        self.assertEqual(incident_id, self.test_incident_key)

    def test_get_comment_data(self):
        thread_data = Comment.get_comment_data(self.test_incident_key, db)
        self.assertEqual({}, thread_data)

    def test_get(self):
        c = create_comment()
        self.test_incident_key = str(uuid.uuid4())
        c.save(self.test_incident_key, db)
        _c = Comment.get(self.test_incident_key, db)
        self.assertEqual(c.to_dict(), _c.to_dict())

    def test_get_unsaved(self):
        c = Comment.get(str(uuid.uuid4()), db)
        self.assertEqual(c.to_dict(), {u'participants': []})

    def test_update_add_participant(self):
        c = create_comment()
        self.test_incident_key = str(uuid.uuid4())
        c.save(self.test_incident_key, db)

        c.update_add_participant('new participant uuid', self.test_incident_key, db)
        _c = Comment.get(self.test_incident_key, db)
        self.assertEqual(c.to_dict(), _c.to_dict())

    def tearDown(self):
        print('Cleaning up comments')
        delete_collection(db.collection(Comment.collection_name))


def create_comment_data(text='comment data text', timestamp=int(time.time() * 1000), user='user uuid'):
    return CommentData(text, timestamp, user)


class CommentDataTest(TestCase):
    test_incident_key = None

    def test_comment_data_creation(self):
        text = 'text'
        timestamp = int(time.time())
        user = 'user uuid'
        cd = create_comment_data(text, timestamp, user)
        self.assertTrue(isinstance(cd, CommentData))
        self.assertEqual(cd.text, text)
        self.assertEqual(cd.timestamp, timestamp)
        self.assertEqual(cd.user, user)

    def test_save(self):
        cd = create_comment_data()
        self.test_incident_key = str(uuid.uuid4())
        key = cd.save(self.test_incident_key, db)
        _cd = db.collection(Comment.collection_name).document(self.test_incident_key).collection(
            CommentData.collection_name).document(key).get().to_dict()
        self.assertEqual(cd.to_dict(), _cd)

    def test_from_dict(self):
        d = {
            'text': "text",
            'timestamp': int(time.time()),
            'user': "user uuid"
        }
        c = CommentData.from_dict(d)
        self.assertEqual(d, c.to_dict())

    def test_get_comment_data(self):
        c = Comment()
        self.test_incident_key = str(uuid.uuid4())
        c.save(self.test_incident_key, db)

        # Add two new comments
        cd1 = create_comment_data()
        cd2 = create_comment_data()
        key1 = cd1.save(self.test_incident_key, db)
        key2 = cd2.save(self.test_incident_key, db)

        thread_data = {
            key1: cd1.to_dict(),
            key2: cd2.to_dict()
        }
        self.assertEqual(thread_data, Comment.get_comment_data(self.test_incident_key, db))

    def tearDown(self):
        print('Cleaning up comments')
        delete_collection(db.collection(Comment.collection_name))

        print('Cleaning up comment data')
        delete_collection(db.collection(CommentData.collection_name))
