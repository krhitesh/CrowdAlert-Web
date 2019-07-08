import json
from threading import Thread

import requests
from django.conf import settings

from .models import Classifier

db = settings.FIREBASE.database()
DB = settings.FIRESTORE


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
    try:
        r = requests.post(url, data={'text': text})
        response = json.loads(r.text)
        toxic_data = response['output'][0]
        DB.collection(Classifier.collection_name).document(uuid).update({
            "toxic": toxic_data
        })
    except (ValueError, KeyError):
        pass

    return
