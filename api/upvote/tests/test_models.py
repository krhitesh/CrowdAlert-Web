import uuid

from django.conf import settings
from django.test import TestCase

from api.upvote.models import Upvote
from api.utils.firebase_utils import delete_collection

db = settings.FIRESTORE

Upvote.collection_name = 'test__' + Upvote.collection_name


def create_upvote(count=0, upvoters=None):
    """
    Returns an Upvote instance
    :param count:
    :param upvoters:
    :return:
    """
    if upvoters is None:
        upvoters = []
    return Upvote(count, upvoters)


class UpvoteTest(TestCase):
    def setUp(self):
        self.test_uuid = None

    def test_init(self):
        """
        Tests creation of Upvote model
        :return:
        """
        u = create_upvote()
        self.assertTrue(isinstance(u, Upvote))

    def test_get(self):
        """
        Tests boundary condition when an upvote does not exists in the DB
        :return:
        """
        u = Upvote.get('uuid', db)
        self.assertEqual(u, None)

    def test_save(self):
        """
        Saves the test upvote in the database and checks if the process is
        successful by comparing the incident id
        :return:
        """
        self.test_uuid = str(uuid.uuid4())
        u = create_upvote()
        u.save(self.test_uuid, db)

        _u = Upvote.get(self.test_uuid, db)
        self.assertEqual(u.to_dict(), _u.to_dict())

    def test_update_add_upvote(self):
        """
        Tests adding a new upvote
        :return:
        """
        self.test_uuid = str(uuid.uuid4())
        u = Upvote(1, ['upvoter 1 uuid'])
        u.save(self.test_uuid, db)
        u.update_add_upvote('upvoter 2 uuid', 2, self.test_uuid, db)

        _u = Upvote.get(self.test_uuid, db)
        self.assertEqual(u.to_dict(), _u.to_dict())

    def test_update_remove_upvote(self):
        """
        Tests removing an existing upvote
        :return:
        """
        self.test_uuid = str(uuid.uuid4())
        u = Upvote(1, ['upvoter 1 uuid'])
        u.save(self.test_uuid, db)
        u.update_remove_upvote('upvoter 1 uuid', 0, self.test_uuid, db)

        _u = Upvote.get(self.test_uuid, db)
        self.assertEqual(u.to_dict(), _u.to_dict())

    def tearDown(self):
        print('Cleaning up upvote')
        delete_collection(db.collection(Upvote.collection_name), 5)
