""" Django Tests for Events app
"""
import time
import uuid
import json

from django.conf import settings
from django.test import TestCase
from firebase_admin.firestore import GeoPoint

from api.events.models import Event, IncidentReport
from api.utils.firebase_utils import  delete_collection
from api.utils.geohash_util import encode

db = settings.FIRESTORE

Event.collection_name = 'test__' + Event.collection_name
IncidentReport.collection_name = 'test__' + IncidentReport.collection_name


class EventTest(TestCase):
    """
    Test events app Event data model
    """
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

    def setUp(self):
        with open('api/test_data/test_data.json') as f:
            self.test_data = json.load(f)

    def test_create_event(self):
        """
        Checks the integrity of newly created Event instance
        :return:
        """
        e = self.create_event()
        self.assertTrue(isinstance(e, Event))

    def test_geo_queries(self):
        """
        Tests the nearby geo spatial query
        :return:
        """
        coords = {
            "latitude": self.test_data["events"]["centerLocation"]["lat"],
            "longitude": self.test_data["events"]["centerLocation"]["long"]
        }
        max_distance = 2000
        events = Event.get_events_around(center=coords, max_distance=max_distance, cluster_threshold=100.0, db=db,
                                         collection_name=Event.collection_name)
        self.assertTrue(isinstance(events, list))

    def test_get(self):
        """
        Creates, saves a test Event data. Then fetches it from DB and asserts
        that both should be key-value pairwise exactly the same
        :return:
        """
        e = self.create_event()
        key = e.save(db)
        _e = Event.get(key, db)
        self.assertEqual(e.to_dict(), _e.to_dict())

    def test_get_none(self):
        """
        Tests boundary condition when a Event does not exists in the DB
        :return:
        """
        _e = Event.get('dne', db)
        self.assertEqual(_e, None)

    def test_to_response_dict(self):
        """
        Tests dictionary type equality of Event objects
        :return:
        """
        e = self.create_event()
        rd = e.to_response_dict()
        d = e.to_dict()
        d['location']['coords'] = {
            'latitude': d['location']['coords'].latitude,
            'longitude': d['location']['coords'].longitude
        }
        self.assertEqual(rd, d)

    def tearDown(self):
        print('Cleaning up events')
        delete_collection(db.collection(Event.collection_name))


def create_ir(user_uuid='uuid', reports=None):
    """
    Returns an instance of IncidentReport class
    :param user_uuid: user uid
    :param reports: list of incident ids
    :return:
    """
    if reports is None:
        reports = []
    return IncidentReport(user_uuid=user_uuid, reports=reports)


class IncidentReportTest(TestCase):

    def test_create_ir(self):
        """
        Tests creation of an instance of IncidentReport
        :return:
        """
        ir = create_ir()
        self.assertTrue(isinstance(ir, IncidentReport))

    def test_create_ir_w_reports(self):
        """
        Tests creation of an instance of IR with reports
        :return:
        """
        ir = create_ir(reports=['r1', 'r2'])
        self.assertTrue(isinstance(ir, IncidentReport))
        _reports = list(map(lambda doc: doc.id, ir.reports))

        self.assertEqual(_reports, ['r1', 'r2'])

    def test_save(self):
        """
        Saves the test IR in the database and checks if the process is
        successful by comparing the dictionaries
        :return:
        """
        ir = create_ir()
        ir.save(db)
        _ir = db.collection(IncidentReport.collection_name).document(ir.user_uuid).get()
        self.assertEqual(ir.to_dict(), _ir.to_dict())

    def test_add_report(self):
        """
        Tests adding new incident report to the list
        :return:
        """
        user_uuid = str(uuid.uuid4())
        ir = create_ir(user_uuid=user_uuid, reports=[])
        ir.save(db)
        ir.add_report('incident id', db)

        _ir = db.collection(IncidentReport.collection_name).document(user_uuid).get()
        self.assertEqual(_ir.to_dict()['reports'][0].id, ir.reports[0].id)

    def test_remove_report(self):
        """
        Tests removing an existing incident report in the list
        :return:
        """
        user_uuid = str(uuid.uuid4())
        ir = create_ir(user_uuid=user_uuid, reports=[])
        ir.save(db)
        ir.add_report('incident id', db)
        ir.remove_report('incident id', db)

        _ir = db.collection(IncidentReport.collection_name).document(user_uuid).get()
        self.assertEqual(_ir.to_dict()['reports'], ir.reports)

    def tearDown(self):
        print('Cleaning up incident reports')
        delete_collection(db.collection(IncidentReport.collection_name))
