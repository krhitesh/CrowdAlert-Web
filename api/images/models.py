""" Django specific ORM models for Images. We don't need one currently
But we can replace the firestore mechanism with a custom model
"""
from api.events.models import Event

class Image(object):
    field_name = 'images'

    def __init__(self, is_nsfw, is_trusted, uuid):
        self.is_nsfw = is_nsfw
        self.is_trusted = is_trusted
        self.uuid = uuid

    def save(self, incident_id, db):
        db.collection(Event.collection_name + '/' + incident_id + '/' + Image.collection_name).document(self.uuid).set(self.to_dict())
        return self.uuid


    @staticmethod
    def from_dict(source_dict):
        image = Image(source_dict['isNsfw'], source_dict['isTrusted'], source_dict['uuid'])
        return image

    def to_dict(self):
        image_dict = {
            "isNsfw": self.is_nsfw,
            "isTrusted": self.is_trusted,
            "uuid": self.uuid,
        }
        return image_dict