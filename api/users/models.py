""" Django models for users app
"""

class User(object):
  collection_name = 'users'

  def __init__(self, display_name, photo_url):
    self.display_name = display_name
    self.photo_url = photo_url

  def save(self, uid, db):
    db.collection(self.collection_name).document(uid).set(self.to_dict())
    return uid

  def update(self, display_name, uid, db):
    self.display_name =display_name
    db.collection(self.collection_name).document(uid).update({u"displayName", display_name})

  @staticmethod
  def from_dict(source_dict):
    user = User(source_dict['displayName'], source_dict['photoURL'])
    return user

  def to_dict(self):
    user_dict = {
      'displayName': self.display_name,
      'photoURL': self.photo_url
    }

    return user_dict