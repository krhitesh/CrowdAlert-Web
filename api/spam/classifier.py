from django.conf import settings
from threading import Thread
import os
import requests
import json

db = settings.FIREBASE.database()

def asyncfunc(function):
    def decorated_function(*args, **kwargs):
        t = Thread(target=function, args=args, kwargs=kwargs)
        # Make sure thread doesn't quit until everything is finished
        t.daemon = False
        t.start()
    return decorated_function

@asyncfunc
def classify_text(text, uuid):
    url = db.child('apipaths/toxic_classifier').get().val()
    r = requests.post(url, data={'text': text})    
    response = json.loads(r.text)
    toxic_data = response['output'][0]
    db.child('classifier/' + uuid).update({'toxic': toxic_data})
    return