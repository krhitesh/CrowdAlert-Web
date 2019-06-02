from google.cloud.firestore_v1beta1 import ArrayUnion, ArrayRemove

class Upvote(object):
    
    collection_name = 'upvotes'

    def __init__(self, count, upvoters):
        self.count = count
        self.upvoters = upvoters

    @staticmethod
    def get(incident_id, db):
      doc = db.collection(Upvote.collection_name).document(incident_id).get()
      return doc.to_dict()

    def save(self, incident_id, db):
        db.collection(Upvote.collection_name).document(incident_id).set(self.to_dict())
        return incident_id

    def update_add_upvote(self, uid, new_count, incident_id, db):
        self.upvoters.append(uid)
        self.count = new_count
        db.collection(Upvote.collection_name).document(incident_id).update({
          u"upvoters": ArrayUnion([uid]),
          u"count": self.count
        })

    def update_remove_upvote(self, uid, new_count, incident_id, db):
        self.upvoters.remove(uid)
        self.count = new_count
        db.collection(Upvote.collection_name).document(incident_id).update({
          u"upvoters": ArrayRemove([uid]),
          u"count": self.count
        })

    @staticmethod
    def from_dict(source_dict):
        upvote = Upvote(
            count=source_dict['count'],
            upvoters=source_dict['upvoters']
        )
        return upvote

    def to_dict(self):
        upvote = {}
        upvote['count'] = self.count
        upvote['upvoters'] = self.upvoters
        return upvote