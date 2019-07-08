from firebase_admin import firestore
from google.cloud.firestore_v1beta1 import ArrayUnion

from api.spam.classifier import classify_text


class Comment(object):
    collection_name = 'comments'
    subcollection_name = 'comments_data'

    def __init__(self, participants=None):
        if participants is None:
            participants = []
        self.participants = participants

    @staticmethod
    def get_comment_data(thread_id, db):
        comments_ref = db.collection(Comment.collection_name).document(thread_id).collection(Comment.subcollection_name)
        query = comments_ref.order_by(u"timestamp", direction=firestore.Query.DESCENDING)
        comment_data_docs = query.get()
        thread_data = {}
        for comment_data_doc in comment_data_docs:
            thread_data[comment_data_doc.id] = comment_data_doc.to_dict()

        return thread_data

    @staticmethod
    def get(thread_id, db):
        doc = db.collection(Comment.collection_name).document(thread_id).get()
        if doc.exists:
            return Comment.from_dict(doc.to_dict())
        else:
            return Comment.from_dict({u"participants": []})

    def save(self, incident_id, db):
        db.collection(Comment.collection_name).document(incident_id).set(self.to_dict())
        return incident_id

    def update_add_participant(self, new_participant_uuid, incident_id, db):
        self.participants.append(new_participant_uuid)
        db.collection(Comment.collection_name).document(incident_id).update({
            u"participants": ArrayUnion([new_participant_uuid]),
        })

    @staticmethod
    def from_dict(source_dict):
        comment = Comment(participants=source_dict['participants'])
        return comment

    def to_dict(self):
        return {
            'participants': self.participants
        }


class CommentData(object):
    collection_name = 'comments_data'

    def __init__(self, text, timestamp, user):
        self.text = text
        self.timestamp = timestamp
        self.user = user

    def save(self, incident_id, db):
        doc_ref = db.collection(Comment.collection_name).document(incident_id).collection(
            self.collection_name).document()
        doc_ref.set(self.to_dict())
        return doc_ref.id

    def classify_text(self, thread_id):
        classify_text(self.text, thread_id)

    @staticmethod
    def from_dict(source_dict):
        comment_data = CommentData(
            text=source_dict['text'],
            timestamp=source_dict['timestamp'],
            user=source_dict['user']
        )
        return comment_data

    def to_dict(self):
        comment_data = {'text': self.text, 'timestamp': self.timestamp, 'user': self.user}
        return comment_data
