from google.cloud.firestore_v1beta1 import ArrayUnion, ArrayRemove

class Classifier(object):
  collection_name = 'classifiers'

  def __init__(self, flag_count, flag_users):
    self.flag_count = flag_count
    self.flag_users = flag_users

  def save(self, incident_id, db):
    db.collection(Classifier.collection_name).document(incident_id).set(self.to_dict())
    return incident_id

  def update(self, new_flag_count, flag_user, incident_id, db):
    self.flag_users.append(flag_user)
    self.flag_count = new_flag_count
    db.collection(Classifier.collection_name).document(incident_id).update({
      u"flag_users": ArrayRemove([flag_user]),
      u"flag_count": new_flag_count
    })

  @staticmethod
  def get(incident_id, db):
    doc = db.collection(Classifier.collection_name).document(incident_id).get()
    return doc.to_dict()

  @staticmethod
  def from_dict(source_dict):
    classifier = Classifier(source_dict['flag_users'], source_dict['flag_users'])
    return classifier

  def to_dict(self):
    classifier_dict = {
      'flag_users': self.flag_users,
      'flag_count': self.flag_count
    }

    return classifier_dict