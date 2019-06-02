""" Django models for users app
"""

class User(object):
  collection_name = 'users'

  def __init__(self, uid, display_name, photo_url):
    self.uid = uid
    self.display_name = display_name
    self.photo_url = photo_url

  def save(self, db):
    db.collection(User.collection_name).document(self.uid).set(self.to_dict())
    return self.uid

  def update(self, display_name, db):
    self.display_name =display_name
    db.collection(User.collection_name).document(self.uid).update({u"displayName", display_name})

  @staticmethod
  def from_dict(uid, source_dict):
    user = User(uid, source_dict['displayName'], source_dict['photoURL'])
    return user

  def to_dict(self):
    user_dict = {
      'displayName': self.display_name,
      'photoURL': self.photo_url
    }

    return user_dict