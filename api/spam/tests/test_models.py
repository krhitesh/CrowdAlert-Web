import uuid

from django.conf import settings
from django.test import TestCase

from api.spam.models import Classifier
from api.utils.firebase_utils import delete_collection

db = settings.FIRESTORE

Classifier.collection_name = 'test__' + Classifier.collection_name


def create_classifier(flag_count=0, flag_users=None, toxic=None):
    """
    Returns a Classifier instance
    :param flag_count: number of times users have flagged this text
    :param flag_users: user ids of users
    :param toxic:
    :return:
    """
    if flag_users is None:
        flag_users = []
    return Classifier(flag_count, flag_users, toxic=toxic)


class ClassifierTest(TestCase):
    def setUp(self):
        self.test_uuid = None

    def test_create_classifier(self):
        """
        Tests creation of Classifier model
        :return:
        """
        c = create_classifier(flag_count=1, flag_users=['uuid'], toxic={})
        d = create_classifier(flag_count=1, flag_users=['uuid'], toxic=None)
        self.assertTrue(isinstance(c, Classifier))
        self.assertEqual(c.flag_count, 1)
        self.assertEqual(c.flag_users, ['uuid'])
        self.assertEqual(c.toxic, {})
        self.assertEqual(d.toxic, {})

    def test_get(self):
        """
        Test validation of non-existing Classifier data
        :return:
        """
        c = Classifier.get('uuid', db)
        self.assertEqual(c, None)

    def test_save(self):
        """
        Creates, saves a test Classifier data. Then fetches it from DB and asserts
        that both should be key-value pairwise exactly the same
        :return:
        """
        c = create_classifier(flag_count=1, flag_users=['uuid'], toxic={})
        self.test_uuid = str(uuid.uuid4())
        c.save(self.test_uuid, db)

        _c = Classifier.get(self.test_uuid, db)
        self.assertEqual(c.to_dict(), _c.to_dict())

    def test_update(self):
        """
        Creates, saves then updates a test Event data. Then fetches it from DB and asserts
        that both should be key-value pairwise exactly the same
        :return:
        """
        c = create_classifier(flag_count=1, flag_users=['uuid'], toxic={})
        new_flag_count = 2  # Previously 1
        flag_user = 'new flag user'

        self.test_uuid = str(uuid.uuid4())
        c.save(self.test_uuid, db)
        c.update(new_flag_count, flag_user, self.test_uuid, db)

        _c = Classifier.get(self.test_uuid, db)
        self.assertEqual(c.to_dict(), _c.to_dict())

    def tearDown(self):
        print('Cleaning up classifer')
        delete_collection(db.collection(Classifier.collection_name), 5)
