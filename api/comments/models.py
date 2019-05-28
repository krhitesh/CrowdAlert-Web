from django.conf import settings
from google.cloud.firestore_v1beta1 import ArrayUnion, ArrayRemove


class Comment(object):
    collection_name = 'comments'
    subcollection_name = 'comments_data'

    def __init__(self, participants):
        self.participants = participants

    def save(self, incident_id, db):
        db.collection(Comment.collection_name).document(incident_id).set(self.to_dict())
        return incident_id

    @staticmethod
    def from_dict(source_dict):
        comment = Comment(participants=source_dict['participants'])
        return comment

    def to_dict():
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
        doc_ref = db.collection(Comment.collection_name).document(incident_id).collection(self.collection_name).document()
        doc_ref.set(self.to_dict())
        return doc_ref.id

    @staticmethod
    def from_dict(source_dict):
        comment_data = CommentData(
            text=source_dict['text'],
            timestamp=source_dict['timestamp'],
            user=source_dict['user']
        )
        return comment_data

    def to_dict(self):
        comment_data = {}
        comment_data['text'] = self.text
        comment_data['timestamp'] = self.timestamp
        comment_data['user'] = self.user
        return comment_data