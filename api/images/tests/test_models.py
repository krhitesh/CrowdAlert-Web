import time
import urllib
import uuid

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


def create_event():
    coords = [2.594212267730896, -43.597971007389965]
    e = Event(
        category=u"category",
        datetime=time.time() * 1000,
        description=u"description",
        local_assistance=True,
        location={
            u'coords': GeoPoint(coords[0], coords[1]),
            u"geohash": encode(coords),
        },
        public={
            'share': True,
            'view': True
        },
        reported_by={
            'original': {
                'anonymous': True
            }
        },
        title=u"Title",
        images=[
            {
                'isNsfw': False,
                'isTrusted': True,
                'uuid': 'images__image__uuid'
            }
        ]
    )
    return e


def create_image(is_nsfw=False, is_trusted=False, uuid='', name=''):
    return Image(is_nsfw, is_trusted, uuid, name)


class ImageTest(TestCase):

    def test_create_image(self):
        i = create_image()
        self.assertTrue(isinstance(i, Image))

    def test_save(self):
        e = create_event()
        incident_id = e.save(db)

        i = create_image(uuid='image uuid', name='image.png')
        i.save(incident_id, db)

        e.images.append(i.to_dict())

        _e = Event.get(incident_id, db)
        self.assertEqual(e.to_dict(), _e.to_dict())

    def test_put(self):
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
