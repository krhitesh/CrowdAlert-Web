import uuid

from django.conf import settings
from django.test import TestCase

from api.users.models import User
from api.utils.firebase_utils import delete_collection

db = settings.FIRESTORE

User.collection_name = 'test__' + User.collection_name


def create_user(uid, display_name='', photo_url=''):
    """
    Returns an instance of User model
    :param uid:
    :param display_name:
    :param photo_url:
    :return:
    """
    return User(uid, display_name, photo_url)


class UserTest(TestCase):
    def setUp(self):
        self.test_uuid = str(uuid.uuid4())

    def test_init(self):
        """
        Tests creation of User model
        :return:
        """
        u = create_user(self.test_uuid)
        self.assertTrue(isinstance(u, User))

    def test_get(self):
        """
        Tests boundary condition when a user does not exists in the DB
        :return:
        """
        u = User.get('random uid', db)
        self.assertEqual(u, None)

    def test_save(self):
        """
        Saves the test user in the database and checks if the process is
        successful by comparing the dictionaries
        :return:
        """
        u = create_user(self.test_uuid)
        u.save(db)

        _u = User.get(self.test_uuid, db)
        self.assertEqual(u.to_dict(), _u.to_dict())

    def test_update(self):
        """
        Tests updating user data
        :return:
        """
        u = create_user(uid=self.test_uuid)
        uid = u.save(db)

        u.update(display_name='updated display name', db=db)

        _u = User.get(uid, db)
        self.assertEqual(u.to_dict(), _u.to_dict())

    def tearDown(self):
        print('Cleaning up users')
        delete_collection(db.collection(User.collection_name), 5)
