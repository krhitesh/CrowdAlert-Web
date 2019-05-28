import time
import json
import os
from django.conf import settings
from django.test import TestCase
from firebase_admin.firestore import GeoPoint
from .models import Event, IncidentReport
from google.cloud.firestore_v1beta1 import ArrayUnion, ArrayRemove

db = settings.FIRESTORE

class EventTestCase(TestCase):  
  def test_incident_reports(self):
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
    db.collection(u'incidents_reports__tests').document(ir.user_uuid).update({u'reports': ArrayUnion([db.collection(Event.collection_name).document('incident_id_7')])})

    doc = db.collection(u'incidents_reports__tests').document(user_uuid).get()
    fetched_ir = IncidentReport.from_dict(user_uuid, doc.to_dict())
    self.assertDictEqual(ir.to_dict(), fetched_ir.to_dict())

  def test_event(self):
    event = Event(
      category=u"category",
      datetime=time.time()*1000,
      description=u"description",
      local_assistance=True,
      location={
        u'coords': GeoPoint(0.0, 0.0),
        u'geohash': 'abcdefghijkl'
      },
      public={
        'share': True,
        'view': True
      },
      reportedBy={
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

    doc_ref = db.collection(u'incidents__tests').document()
    doc_ref.set(event.to_dict())

    doc = db.collection(u'incidents__tests').document(doc_ref.id).get()
    fetched_event = Event.from_dict(doc.to_dict())
    self.assertDictEqual(event.to_dict(), fetched_event.to_dict())