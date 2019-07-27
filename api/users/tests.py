from django.test import TestCase
from django.conf import settings
from api.users.models import User
from api.utils.firestore_utils import delete_collection

import uuid

db = settings.FIRESTORE

User.collection_name = 'test__' + User.collection_name

class UserTest(TestCase):
  test_uuid = None

  def create_user(self, uid, display_name='', photo_url=''):
    return User(uid, display_name, photo_url)

  def test_init(self):
    self.test_uuid = str(uuid.uuid4())
    u = self.create_user(self.test_uuid)
    self.assertTrue(isinstance(u, User))

  def test_get(self):
    u = User.get('random uid', db)
    self.assertEqual(u, None)

  def test_save(self):
    self.test_uuid = str(uuid.uuid4())
    u = self.create_user(self.test_uuid)
    u.save(db)

    _u = User.get(self.test_uuid, db)
    self.assertEqual(u.to_dict(), _u.to_dict())

  def test_update(self):
    self.test_uuid = str(uuid.uuid4())
    u = self.create_user(uid=self.test_uuid)
    uid = u.save(db)

    u.update(display_name='updated display name', db=db)

    _u = User.get(uid, db)
    self.assertEqual(u.to_dict(), _u.to_dict())

  def tearDown(self):
    print('Cleaning up users')
    delete_collection(db.collection(User.collection_name), 5)
