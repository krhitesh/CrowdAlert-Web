"""User reported events model
"""
from api.utils.geohash_util import geohash_queries
from django.conf import settings
from google.cloud.firestore_v1beta1 import ArrayUnion, ArrayRemove

from api.location.gps import distance


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
    def patch(incident_id, data, DB):
        DB.collection(Event.collection_name).document(incident_id).update(data)

    @staticmethod
    def get_events_around(center, max_distance, cluster_threshold, db, collection_name='incidents'):
        events_around = []
        result_count = 0
        match_count = 0
        queries = Event.__get_queries_for_events_around(db.collection(collection_name), center, max_distance)
        # print("queries", queries)
        for query in queries:
            docs = query.get()
            for doc in docs:
                result_count += 1
                event_dict = doc.to_dict()
                # print("event_dict", event_dict)
                dist = distance(center['latitude'], center['longitude'], event_dict['location']['coords'].latitude,
                                event_dict['location']['coords'].longitude)
                if dist < max_distance:
                    match_count += 1
                    temp = {'key': doc.id, 'lat': event_dict['location']['coords'].latitude,
                            'long': event_dict['location']['coords'].longitude, 'category': event_dict['category'],
                            'title': event_dict['title'], 'datetime': event_dict['datetime']}
                    events_around.append(temp)

        print("result_count", result_count)
        print("match_count", match_count)
        print("diff (result_count - match_count)", result_count - match_count)
        return Event.__cluster_events(events_around, cluster_threshold)

    @staticmethod
    def __get_queries_for_events_around(ref, center, max_distance):
        geohashes_to_query = geohash_queries([center['latitude'], center['longitude']], radius=max_distance * 1000)
        print("geohashes_to_query", geohashes_to_query)
        return list(map(
            lambda location: ref.where(u"location.geohash", u">=", location[0]).where(u"location.geohash", u"<=",
                                                                                      location[1]),
            geohashes_to_query))

    @staticmethod
    def __cluster_events(data, cluster_threshold=None):
        if cluster_threshold:
            # clustered incidents data
            clustered_data = []
            # Consider each node as root for now
            for root in data:
                # If is clustered flag is not present
                if not root.get('isClustered', False):
                    # Loop though the points
                    for child in data:
                        # Base case
                        if child['key'] == root['key']:
                            continue
                        # If node is not clustered
                        if not child.get('isClustered', False):
                            # Calculate the distance
                            temp_distance = distance(root['lat'], root['long'],
                                                     child['lat'], child['long'])
                            # If two points are too close on map cluster them
                            if temp_distance < cluster_threshold:
                                # Update root
                                root['isClustered'] = True
                                root['lat'] = (root['lat'] + child['lat']) / 2
                                root['long'] = (root['long'] + child['long']) / 2
                                # Mark child
                                child['isClustered'] = True
                    clustered_data.append(root)
            return clustered_data
        return data

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
        print(source_dict)
        event = Event(
            category=source_dict['category'],
            datetime=source_dict['datetime'],
            description=source_dict['description'],
            local_assistance=source_dict['local_assistance'],
            location={
                'coords': source_dict['location']['coords'],
                'geohash': source_dict['location']['geohash']
            },
            public=source_dict['public'],
            reported_by=source_dict['reportedBy'],
            title=source_dict['title'],
            images=source_dict['images']
        )
        return event

    def to_dict(self):
        event = {'category': self.category, 'datetime': self.datetime, 'description': self.description,
                 'local_assistance': self.local_assistance, 'location': {'coords': self.location['coords'],
                                                                         'geohash': self.location['geohash']},
                 'public': self.public, 'reportedBy': self.reported_by, 'title': self.title, 'images': self.images}
        return event

    def to_response_dict(self):
        event = {'category': self.category, 'datetime': self.datetime, 'description': self.description,
                 'local_assistance': self.local_assistance,
                 'location': {'coords': {'latitude': self.location['coords'].latitude,
                                         'longitude': self.location['coords'].longitude},
                              'geohash': self.location['geohash']},
                 'public': self.public, 'reportedBy': self.reported_by, 'title': self.title, 'images': self.images}
        return event

    def __repr__(self):
        return (
            u'Event(category={}, datetime={}, description={}, local_assistance={}, location={}, public={}, '
            u'reportedBy={}, title={}, images={})'.format(self.category, self.datetime, self.description,
                                                          self.local_assistance,
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
        self.reports.append(db.collection(Event.collection_name).document(incident_id))
        db.collection(self.collection_name).document(self.user_uuid).update(
            {u'reports': ArrayUnion([db.collection(Event.collection_name).document(incident_id)])})
        return self.user_uuid

    def remove_report(self, incident_id, db):
        for report in self.reports:
            if report.id == incident_id:
                self.reports.remove(report)
        db.collection(self.collection_name).document(self.user_uuid).update(
            {u'reports': ArrayRemove([db.collection(Event.collection_name).document(incident_id)])})
        return self.user_uuid

    @staticmethod
    def from_dict(user_uuid, source_dict):
        incident_report = IncidentReport(
            user_uuid=user_uuid,
            reports=source_dict['reports']
        )
        return incident_report

    def to_dict(self):
        incident_report = {'reports': self.reports}
        return incident_report
