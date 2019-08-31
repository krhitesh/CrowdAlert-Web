import json
import time

from django.conf import settings
from django.test import TestCase, RequestFactory
from firebase_admin.firestore import GeoPoint

from api.events.models import Event, IncidentReport
from api.events.views import EventView, MultipleEventsView
from api.firebase_auth.users import FirebaseUser
from api.utils.firebase_utils import get_anonymous_user_token, delete_anonymous_user, delete_collection, \
    get_authenticated_user_token
from api.utils.geohash_util import encode

db = settings.FIRESTORE


class EventViewTest(TestCase):
    def create_event(self):
        """
        Returns an instance of Event model
        :return:
        """
        center_location = self.test_data["events"]["centerLocation"]
        coords = [center_location["lat"], center_location["long"]]
        event_data = json.loads(self.test_data["events"]["eventData"])
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

    def setUp(self):
        self.token = get_anonymous_user_token()
        self.auth_token = get_authenticated_user_token()
        self.factory = RequestFactory()
        with open('api/test_data/test_data.json') as f:
            self.test_data = json.load(f)
            self.user = FirebaseUser(self.test_data["users"]["firebase_data"])
            e = self.create_event()
            self.incident_id = e.save(db)

    def test_get(self):
        request = self.factory.get('/api/events/incident', {'id': self.incident_id})
        response = EventView.as_view()(request)
        self.assertEqual(response.status_code, 200)

    def test_post(self):
        settings.COVERAGE = True
        data = json.dumps({"eventData": self.test_data["events"]["eventData"]})
        request = self.factory.post(path='/api/events/incident', data=data, content_type='application/json',
                                    secure=False, HTTP_TOKEN=self.auth_token)
        request.user = self.user
        response = EventView.as_view()(request)
        self.assertEqual(response.status_code, 200)

    def tearDown(self):
        print('Cleaning up events')
        delete_collection(db.collection(Event.collection_name))
        delete_collection(db.collection(IncidentReport.collection_name))
        delete_anonymous_user(self.token)


class MultipleEventsViewTest(TestCase):
    def setUp(self):
        self.token = get_anonymous_user_token()
        self.factory = RequestFactory()
        with open('api/test_data/test_data.json') as f:
            self.test_data = json.load(f)
            self.user = FirebaseUser(self.test_data["users"]["firebase_data"])

    def test_get_multiple_events(self):
        request = self.factory.get('/api/events/geteventsbylocation', self.test_data["events"]["centerLocation"])
        response = MultipleEventsView.as_view()(request)
        self.assertEqual(response.status_code, 200)

    def tearDown(self):
        print('Cleaning up events')
        delete_collection(db.collection(Event.collection_name))
        delete_anonymous_user(self.token)
