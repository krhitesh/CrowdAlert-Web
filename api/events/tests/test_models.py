""" Django Tests for Events app
"""
import time
import uuid

from django.conf import settings
from django.test import TestCase
from firebase_admin.firestore import GeoPoint

from api.events.models import Event, IncidentReport
from api.utils.firebase_utils import  delete_collection
from api.utils.geohash_util import encode

db = settings.FIRESTORE

Event.collection_name = 'test__' + Event.collection_name
IncidentReport.collection_name = 'test__' + IncidentReport.collection_name


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


class EventTest(TestCase):

    def test_create_event(self):
        e = create_event()
        self.assertTrue(isinstance(e, Event))

    def test_geo_queries(self):
        coords = {
            "latitude": 2.594212267730896,
            "longitude": -43.597971007389965
        }
        max_distance = 2000
        events = Event.get_events_around(center=coords, max_distance=max_distance, cluster_threshold=100.0, db=db,
                                         collection_name=Event.collection_name)
        self.assertTrue(isinstance(events, list))

    def test_get(self):
        e = create_event()
        key = e.save(db)
        _e = Event.get(key, db)
        self.assertEqual(e.to_dict(), _e.to_dict())

    def test_get_none(self):
        _e = Event.get('dne', db)
        self.assertEqual(_e, None)

    def test_to_response_dict(self):
        e = create_event()
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
    if reports is None:
        reports = []
    return IncidentReport(user_uuid=user_uuid, reports=reports)


class IncidentReportTest(TestCase):

    def test_create_ir(self):
        ir = create_ir()
        self.assertTrue(isinstance(ir, IncidentReport))

    def test_create_ir_w_reports(self):
        ir = create_ir(reports=['r1', 'r2'])
        self.assertTrue(isinstance(ir, IncidentReport))
        _reports = list(map(lambda doc: doc.id, ir.reports))

        self.assertEqual(_reports, ['r1', 'r2'])

    def test_save(self):
        ir = create_ir()
        ir.save(db)
        _ir = db.collection(IncidentReport.collection_name).document(ir.user_uuid).get()
        self.assertEqual(ir.to_dict(), _ir.to_dict())

    def test_add_report(self):
        user_uuid = str(uuid.uuid4())
        ir = create_ir(user_uuid=user_uuid, reports=[])
        ir.save(db)
        ir.add_report('incident id', db)

        _ir = db.collection(IncidentReport.collection_name).document(user_uuid).get()
        self.assertEqual(_ir.to_dict()['reports'][0].id, ir.reports[0].id)

    def test_remove_report(self):
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
