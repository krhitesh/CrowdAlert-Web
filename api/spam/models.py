from google.cloud.firestore_v1beta1 import ArrayUnion, ArrayRemove

class Classifier(object):
  collection_name = 'classifiers'

  def __init__(self, flag_count, flag_users, toxic={}):
    self.flag_count = flag_count
    self.flag_users = flag_users
    self.toxic = toxic

  def save(self, uuid, db):
    db.collection(Classifier.collection_name).document(uuid).set(self.to_dict())
    return uuid

  def update(self, new_flag_count, flag_user, uuid, db):
    self.flag_users.append(flag_user)
    self.flag_count = new_flag_count
    db.collection(Classifier.collection_name).document(uuid).update({
      u"flag_users": ArrayRemove([flag_user]),
      u"flag_count": new_flag_count
    })

  @staticmethod
  def get(uuid, db):
    doc = db.collection(Classifier.collection_name).document(uuid).get()
    if doc.exists:
      return Classifier.from_dict(doc.to_dict())
    else:
      return None

  @staticmethod
  def from_dict(source_dict):
    classifier = Classifier(source_dict['flag_users'], source_dict['flag_users'], source_dict['toxic'])
    return classifier

  def to_dict(self):
    classifier_dict = {
      'flag_users': self.flag_users,
      'flag_count': self.flag_count,
      'toxic': self.toxic
    }

    return classifier_dict
    