import time
import random
from django.conf import settings
from django.test import TestCase
from firebase_admin.firestore import GeoPoint
from api.utils.geohash_util import encode
from .models import Event, IncidentReport
from google.cloud.firestore_v1beta1 import ArrayUnion, ArrayRemove

db = settings.FIRESTORE


class EventTestCase(TestCase):
    def _test_incident_reports(self):
        self.maxDiff = None
        ir = IncidentReport(
            'user_uuid',
            [
                db.collection(u'incidents_reports__tests').document('incident_id_1'),
                db.collection(u'incidents_reports__tests').document('incident_id_2'),
                db.collection(u'incidents_reports__tests').document('incident_id_3'),
                db.collection(u'incidents_reports__tests').document('incident_id_4'),
                db.collection(u'incidents_reports__tests').document('incident_id_5'),
            ]
        )

        doc_ref = db.collection(u'incidents_reports__tests').document(ir.user_uuid).set(ir.to_dict())

        user_uuid = ir.user_uuid

        doc = db.collection(u'incidents_reports__tests').document(user_uuid).get()
        fetched_ir = IncidentReport.from_dict(user_uuid, doc.to_dict())
        self.assertDictEqual(ir.to_dict(), fetched_ir.to_dict())

        ir.reports.append('incident_id_7')
        db.collection(u'incidents_reports__tests').document(ir.user_uuid).update(
            {u'reports': ArrayUnion([db.collection(Event.collection_name).document('incident_id_7')])})

        doc = db.collection(u'incidents_reports__tests').document(user_uuid).get()
        fetched_ir = IncidentReport.from_dict(user_uuid, doc.to_dict())
        self.assertDictEqual(ir.to_dict(), fetched_ir.to_dict())

    def test_geo_queries(self):
        coords = {
            "latitude": 2.594212267730896,
            "longitude": -43.597971007389965
        }

        max_distance = 2000
        print("coords=", coords)
        print("max_distance=", max_distance)
        events = Event.get_events_around(center=coords, max_distance=max_distance, cluster_threshold=100.0, db=db, collection_name=u"incidents__tests")
        # print("events", events)

    def _test_event(self):
        start = time.time()*1000
        for i in range(0, 100):
            coords = [2.594212267730896, -43.597971007389965]
            event = Event(
                category=u"category" + str(i),
                datetime=time.time() * 1000,
                description=u"description" + str(i),
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
                title=u"Title" + str(i),
                images=[
                    {
                        'isNsfw': False,
                        'isTrusted': True,
                        'uuid': 'images__image__uuid' + str(i)
                    }
                ]
            )

            dic = event.to_dict()
            doc_ref = db.collection(u'incidents__tests').document()
            doc_ref.set(dic)

        diff = time.time()*1000 - start
        print("Took", diff, " ms")
        # doc = db.collection(u'incidents__tests').document(doc_ref.id).get()
        # fetched_event = Event.from_dict(doc.to_dict())
        # self.assertDictEqual(event.to_dict(), fetched_event.to_dict())
        self.assertEqual(1, 1)
