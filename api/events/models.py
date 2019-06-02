"""User reported events model
"""
from django.conf import settings
from google.cloud.firestore_v1beta1 import ArrayUnion, ArrayRemove

class Event(object):
    """Django model for user reports
    """
    collection_name = 'incidents'

    def __init__(self, category, datetime, description, local_assistance,
                location, public, reported_by, title,
                images):
        self.category = category
        self.datetime = datetime
        self.description = description
        self.local_assistance = local_assistance
        self.location = location
        self.public = public
        self.reported_by = reported_by
        self.title = title
        self.images = images

    @staticmethod
    def get(incident_id, db):
        doc = db.collection(Event.collection_name).document(incident_id).get()
        if doc.exists:
            return Event.from_dict(doc.to_dict())
        else:
            return None

    def save(self, db):
        doc_ref = db.collection(self.collection_name).document()
        doc_ref.set(self.to_dict())
        return doc_ref.id

    @staticmethod
    def from_dict(source_dict):
        event = Event(
            category=source_dict['category'],
            datetime=source_dict['datetime'],
            description=source_dict['description'],
            local_assistance=source_dict['local_assistance'],
            location=source_dict['location'],
            public=source_dict['public'],
            reported_by=source_dict['reportedBy'],
            title=source_dict['title'],
            images=source_dict['images']
        )
        return event

    def to_dict(self):
        event = {}
        event['category'] = self.category
        event['datetime'] = self.datetime
        event['description'] = self.description
        event['local_assistance'] = self.local_assistance
        event['location'] = self.location
        event['public'] = self.public
        event['reportedBy'] = self.reported_by
        event['title'] = self.title
        event['images'] = self.images
        return event

    def __repr__(self):
        return(
            u'Event(category={}, datetime={}, description={}, local_assistance={}, location={}, public={}, reportedBy={}, title={}, images={})'
            .format(self.category, self.datetime, self.description, self.local_assistance,
                    self.location, self.public, self.reported_by,
                    self.title, self.images))

       
class IncidentReport(object):
    
    collection_name = 'incident_reports'

    def __init__(self, user_uuid, reports):
        db = settings.FIRESTORE
        self.user_uuid = user_uuid
        self.reports = []
        for report in reports:
            self.reports.append(db.collection(Event.collection_name).document(report))

    def save(self, db):
        db.collection(self.collection_name).document(self.user_uuid).set(self.to_dict())

    def add_report(self, incident_id, db):
        self.reports.append(incident_id)
        db.collection(self.collection_name).document(self.user_uuid).update({u'reports': ArrayUnion([db.collection(Event.collection_name).document(incident_id)])})
        return self.user_uuid

    def remove_report(self, incident_id, db):
        self.reports.remove(incident_id)
        db.collection(self.collection_name).document(self.user_uuid).update({u'reports': ArrayRemove([db.collection(Event.collection_name).document(incident_id)])})
        return self.user_uuid

    @staticmethod
    def from_dict(user_uuid, source_dict):
        incident_report = IncidentReport(
            user_uuid=user_uuid,
            reports=source_dict['reports']
        )
        return incident_report

    def to_dict(self):
        incident_report = {}
        incident_report['reports'] = self.reports
        return incident_report


