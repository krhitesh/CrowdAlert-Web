import time
import urllib
import uuid
import json

from django.conf import settings
from django.test import TestCase
from firebase_admin.firestore import GeoPoint

from api.events.models import Event
from api.images.models import Image
from api.utils.firebase_utils import delete_collection
from api.utils.geohash_util import encode

db = settings.FIRESTORE
STORAGE = settings.FIREBASE.storage()

Image.field_name = 'test' + Image.field_name
Event.collection_name = 'test__' + Event.collection_name


def create_image(is_nsfw=False, is_trusted=False, uuid='', name=''):
    """
    Returns an instance of Image model
    :param is_nsfw:
    :param is_trusted:
    :param uuid:
    :param name:
    :return:
    """
    return Image(is_nsfw, is_trusted, uuid, name)


class ImageTest(TestCase):
    def setUp(self):
        with open('api/test_data/test_data.json') as f:
            self.test_data = json.load(f)

    def create_event(self):
        """
        Returns an instance of Event class
        :return:
        """
        center_location = self.test_data["events"]["centerLocation"]
        coords = [center_location["lat"], center_location["long"]]
        event_data = json.loads(self.test_data["events"]["eventData"]["eventData"])
        e = Event(
            category=event_data["category"],
            datetime=time.time() * 1000,
            description=event_data["description"],
            local_assistance=event_data["local_assistance"],
            location={
                u'coords': GeoPoint(event_data["location"]["coords"]["latitude"],
                                    event_data["location"]["coords"]["longitude"]),
                u"geohash": encode(coords),
            },
            public={
                'share': event_data["public"]["share"],
                'view': event_data["public"]["view"]
            },
            reported_by={
                'original': {
                    'anonymous': event_data["anonymous"]
                }
            },
            title=event_data["title"],
            images=[
                {
                    'isNsfw': False,
                    'isTrusted': True,
                    'uuid': 'images__image__uuid'
                }
            ]
        )
        return e

    def test_create_image(self):
        """
        Tests creation of a new Image object
        :return:
        """
        i = create_image()
        self.assertTrue(isinstance(i, Image))

    def test_save(self):
        """
        Saves the test image in the database and checks if the process is
        successful by comparing the dictionaries
        :return:
        """
        e = self.create_event()
        incident_id = e.save(db)

        i = create_image(uuid='image uuid', name='image.png')
        i.save(incident_id, db)

        e.images.append(i.to_dict())

        _e = Event.get(incident_id, db)
        self.assertEqual(e.to_dict(), _e.to_dict())

    def test_put(self):
        """
        Tests saving image in the file storage
        :return:
        """
        urllib.request.urlretrieve("http://www.gunnerkrigg.com//comics/00000001.jpg", "test_image.jpg")
        image_uuid = str(uuid.uuid4())
        i = create_image(uuid=image_uuid, name='test_image.jpg')
        i.put(STORAGE)

        try:
            STORAGE.child(Image.field_name).child(image_uuid).get_url('')
            STORAGE.delete(Image.path + image_uuid)
            self.assertTrue(True)
        except ValueError:
            self.assertTrue(False)

    def tearDown(self):
        print('Cleaning up images')
        delete_collection(db.collection(Event.collection_name))
