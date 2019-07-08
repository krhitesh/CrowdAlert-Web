from google.cloud.firestore_v1beta1 import ArrayUnion, ArrayRemove


class Upvote(object):
    collection_name = 'upvotes'

    def __init__(self, count, upvoters):
        self.count = count
        self.upvoters = upvoters

    @staticmethod
    def get(uuid, db, default=None):
        doc = db.collection(Upvote.collection_name).document(uuid).get()
        if doc.exists:
            return Upvote.from_dict(doc.to_dict())
        else:
            return default

    def save(self, uuid, db):
        db.collection(Upvote.collection_name).document(uuid).set(self.to_dict())
        return uuid

    def update_add_upvote(self, uid, new_count, uuid, db):
        self.upvoters.append(uid)
        self.count = new_count
        db.collection(Upvote.collection_name).document(uuid).update({
            u"upvoters": ArrayUnion([uid]),
            u"count": self.count
        })

    def update_remove_upvote(self, uid, new_count, uuid, db):
        self.upvoters.remove(uid)
        self.count = new_count
        db.collection(Upvote.collection_name).document(uuid).update({
            u"upvoters": ArrayRemove([uid]),
            u"count": self.count
        })

    @staticmethod
    def from_dict(source_dict):
        if source_dict is None:
            return Upvote(count=0, upvoters=[])
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
