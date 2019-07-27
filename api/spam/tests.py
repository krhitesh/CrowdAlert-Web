from django.test import TestCase
from django.conf import settings
from api.spam.models import Classifier
from api.utils.firestore_utils import delete_collection

import uuid

db = settings.FIRESTORE

Classifier.collection_name = 'test__' + Classifier.collection_name

class ClassifierTest(TestCase):
  test_uuid = None

  def create_classifier(self, flag_count=0, flag_users=[], toxic=None):
    return Classifier(flag_count, flag_users, toxic=toxic)

  def test_create_classifier(self):
    c = self.create_classifier(flag_count=1, flag_users=['uuid'], toxic={})
    d = self.create_classifier(flag_count=1, flag_users=['uuid'], toxic=None)
    self.assertTrue(isinstance(c, Classifier))
    self.assertEqual(c.flag_count, 1)
    self.assertEqual(c.flag_users, ['uuid'])
    self.assertEqual(c.toxic, {})
    self.assertEqual(d.toxic, {})

  def test_get(self):
    c = Classifier.get('uuid', db)
    self.assertEqual(c, None)

  def test_save(self):
    c = self.create_classifier(flag_count=1, flag_users=['uuid'], toxic={})
    self.test_uuid = str(uuid.uuid4())
    c.save(self.test_uuid, db)

    _c = Classifier.get(self.test_uuid, db)
    self.assertEqual(c.to_dict(), _c.to_dict())

  def test_update(self):
    c = self.create_classifier(flag_count=1, flag_users=['uuid'], toxic={})
    new_flag_count = 2 # Previously 1
    flag_user = 'new flag user'

    self.test_uuid = str(uuid.uuid4())
    c.save(self.test_uuid, db)
    c.update(new_flag_count, flag_user, self.test_uuid, db)

    _c = Classifier.get(self.test_uuid, db)
    self.assertEqual(c.to_dict(), _c.to_dict())

  def tearDown(self):
    print('Cleaning up classifer')
    delete_collection(db.collection(Classifier.collection_name), 5)
