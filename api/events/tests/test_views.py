from django.test import TestCase, RequestFactory
from api.firebase_auth.users import FirebaseUser
from firebase_admin.firestore import GeoPoint
from django.conf import settings
import json
import os
import time

from api.utils.geohash_util import encode
from api.utils.firebase_utils import delete_collection, get_authenticated_user_token
from api.events.models import Event, IncidentReport
from api.events.views import EventView, MultipleEventsView

db = settings.FIRESTORE

class EventViewTest(TestCase):
  def create_event(self):
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

  def setUp(self):
    self.auth_token = get_authenticated_user_token()
    self.factory = RequestFactory()
    firebase_data = {
      'uid': '',
      'user_id': '',
      'name': '',
      'picture': '',
      'email_verified': True
    }
    self.user = FirebaseUser(firebase_data)

    e = self.create_event()
    self.incident_id = e.save(db)

  def test_get(self):
    request = self.factory.get('/api/events/incident', {'id': self.incident_id})
    response = EventView.as_view()(request)
    self.assertEqual(response.status_code, 200)

  def test_post(self):
    settings.COVERAGE = True
    data = json.dumps({"eventData": '{"category":"health","description":"testing","local_assistance":false,"title":"test","public":{"view":true,"share":false},"anonymous":false,"location":{"coords":{"latitude":26.50987842895997,"longitude":80.23057773442383}}}'})
    request = self.factory.post(path='/api/events/incident', data=data, content_type='application/json', secure=False, HTTP_TOKEN=self.auth_token)
    request.user = self.user
    response = EventView.as_view()(request)
    self.assertEqual(response.status_code, 200)

  def tearDown(self):
    print('Cleaning up events')
    delete_collection(db.collection(Event.collection_name))
    delete_collection(db.collection(IncidentReport.collection_name))


class MultipleEventsViewTest(TestCase):
  def setUp(self):
    self.factory = RequestFactory()
    firebase_data = {
      'uid': '',
      'user_id': '',
      'name': '',
      'picture': '',
      'email_verified': True
    }
    self.user = FirebaseUser(firebase_data)

  def test_get_multiple_events(self):
    request = self.factory.get('/api/events/geteventsbylocation', {'lat': 26.9483, 'long': 80.2321, 'dist': 19.2, 'min': 0.2})
    response = MultipleEventsView.as_view()(request)
    self.assertEqual(response.status_code, 200)

  def tearDown(self):
    print('Cleaning up events')
    delete_collection(db.collection(Event.collection_name))