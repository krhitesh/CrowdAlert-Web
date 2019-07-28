import uuid

from django.conf import settings
from django.test import TestCase

from api.spam.models import Classifier
from api.utils.firebase_utils import delete_collection

db = settings.FIRESTORE

Classifier.collection_name = 'test__' + Classifier.collection_name


def create_classifier(flag_count=0, flag_users=None, toxic=None):
    if flag_users is None:
        flag_users = []
    return Classifier(flag_count, flag_users, toxic=toxic)


class ClassifierTest(TestCase):
    test_uuid = None

    def test_create_classifier(self):
        c = create_classifier(flag_count=1, flag_users=['uuid'], toxic={})
        d = create_classifier(flag_count=1, flag_users=['uuid'], toxic=None)
        self.assertTrue(isinstance(c, Classifier))
        self.assertEqual(c.flag_count, 1)
        self.assertEqual(c.flag_users, ['uuid'])
        self.assertEqual(c.toxic, {})
        self.assertEqual(d.toxic, {})

    def test_get(self):
        c = Classifier.get('uuid', db)
        self.assertEqual(c, None)

    def test_save(self):
        c = create_classifier(flag_count=1, flag_users=['uuid'], toxic={})
        self.test_uuid = str(uuid.uuid4())
        c.save(self.test_uuid, db)

        _c = Classifier.get(self.test_uuid, db)
        self.assertEqual(c.to_dict(), _c.to_dict())

    def test_update(self):
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
