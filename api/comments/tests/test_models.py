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
    """
    Returns a Comment class object
    :param participants: list
    :return: A Comment class object
    """
    return Comment(participants=participants)


class CommentTest(TestCase):
    """
    Tests comment app's Comment model
    """
    def setUp(self):
        """
        Setup individual tests
        """
        self.test_incident_key = None

    def test_comment_creation(self):
        """
        Tests comment creation
        :return: None
        """
        c = create_comment()
        self.assertTrue(isinstance(c, Comment))
        self.assertEqual(c.participants, [])

    def test_save(self):
        """
        Saves the test comment in the database and checks if the process is
        successful by comparing the incident id
        :return:
        """
        c = create_comment()
        self.test_incident_key = str(uuid.uuid4())
        incident_id = c.save(self.test_incident_key, db)
        self.assertEqual(incident_id, self.test_incident_key)

    def test_get_comment_data(self):
        """
        Fetches the saved test comment thread and compares both of them as
        dictionaries
        :return:
        """
        thread_data = Comment.get_comment_data(self.test_incident_key, db)
        self.assertEqual({}, thread_data)

    def test_get(self):
        """
        Creates, saves a test comment. Then fetches it from DB and asserts
        that both should be key-value pairwise exactly the same
        :return:
        """
        c = create_comment()
        self.test_incident_key = str(uuid.uuid4())
        c.save(self.test_incident_key, db)
        _c = Comment.get(self.test_incident_key, db)
        self.assertEqual(c.to_dict(), _c.to_dict())

    def test_get_unsaved(self):
        """
        Tests boundary condition when a comment does not exists in the DB
        :return:
        """
        c = Comment.get(str(uuid.uuid4()), db)
        self.assertEqual(c.to_dict(), {u'participants': []})

    def test_update_add_participant(self):
        """
        Tests addition of a new participant to the comment thread
        :return:
        """
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
    """
    Returns an instance of CommentData class
    :param text: comment as string message
    :param timestamp: Timestamp
    :param user: user id of the comment's user
    :return:
    """
    return CommentData(text, timestamp, user)


class CommentDataTest(TestCase):
    """
    Tests comment app's Comment model
    """
    def setUp(self):
        """
        Setup individual tests
        """
        self.test_incident_key = None

    def test_comment_data_creation(self):
        """
        Checks the integrity of a newly created CommentData instance
        :return:
        """
        text = 'text'
        timestamp = int(time.time())
        user = 'user uuid'
        cd = create_comment_data(text, timestamp, user)
        self.assertTrue(isinstance(cd, CommentData))
        self.assertEqual(cd.text, text)
        self.assertEqual(cd.timestamp, timestamp)
        self.assertEqual(cd.user, user)

    def test_save(self):
        """
        Saves the test comment data in the database and checks if the process is
        successful by comparing them as dictionaries
        :return:
        """
        cd = create_comment_data()
        self.test_incident_key = str(uuid.uuid4())
        key = cd.save(self.test_incident_key, db)
        _cd = db.collection(Comment.collection_name).document(self.test_incident_key).collection(
            CommentData.collection_name).document(key).get().to_dict()
        self.assertEqual(cd.to_dict(), _cd)

    def test_from_dict(self):
        """
        Tests if comment data loads from a dictionary
        :return:
        """
        d = {
            'text': "text",
            'timestamp': int(time.time()),
            'user': "user uuid"
        }
        c = CommentData.from_dict(d)
        self.assertEqual(d, c.to_dict())

    def test_get_comment_data(self):
        """
        Creates, saves a test comment data. Then fetches it from DB and asserts
        that both should be key-value pairwise exactly the same
        :return:
        """
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
