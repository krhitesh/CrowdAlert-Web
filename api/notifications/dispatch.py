import json
import os
import uuid
from threading import Thread

import requests
from django.conf import settings

from api.comments.models import Comment

db = settings.FIRESTORE
fcmkey = os.environ['DJANGO_FIREBASE_FCM_SENDER_TOKEN']


def asyncfunc(function):
    def decorated_function(*args, **kwargs):
        t = Thread(target=function, args=args, kwargs=kwargs)
        # Make sure thread doesn't quit until everything is finished
        t.daemon = False
        t.start()

    return decorated_function


@asyncfunc
def notify(fcmkeys, body):
    url = "https://fcm.googleapis.com/fcm/send"
    headers = {
        'Authorization': 'key=' + fcmkey,
        'Content-Type': 'application/json'
    }
    for token in fcmkeys:
        body['to'] = token
        requests.post(url, headers=headers, data=json.dumps(body))

    return


def notify_all(sender_uid, body, user_ids=False):
    token_docs = db.collection('fcmkeys').get()
    user_tokens = {}
    for doc in token_docs:
        user_tokens[doc.id] = doc.to_dict()['key']

    if not user_ids:
        user_ids = user_tokens.keys()
    # Make sure we are not notifying the user
    try:
        user_tokens.pop(sender_uid)
    except:
        pass

    keylist = []

    for user in user_ids:
        try:
            user_keys = user_tokens[user]['key']
            for key in user_keys.items():
                keylist.append(key[1])
        except:
            pass
    notify(keylist, body)
    return keylist


@asyncfunc
def notify_incident(sender_uid, datetime, event_id, event_type, lat, lng, \
                    user_text, user_name, user_picture):
    body = {
        "notification": {
            "title": event_type.title() + ' incident nearby',
            "body": user_name + ' reported a ' + event_type + ' incident nearby & wants your help',
            "click_action": "https://crowdalert.herokuapp.com/view/" + event_id,
            "link": "/view/" + event_id,
            "uuid": str(uuid.uuid4()),
            "lat": lat,
            "long": lng,
            "category": event_type,
            "datetime": datetime,
            "user_text": user_text,
            "type": "incident",
            "user_name": user_name,
            "user_picture": user_picture,
        }
    }

    notify_all(sender_uid, body)

    return


@asyncfunc
def notify_comment(sender_uid, datetime, event_id, user_text, \
                   user_name, user_picture):
    user_ids = Comment.get(event_id, db).participants

    body = {
        "notification": {
            "title": user_name + " commented on an incident",
            "body": user_text,
            "click_action": "https://crowdalert.herokuapp.com/view/" + event_id,
            "link": "/view/" + event_id,
            "uuid": str(uuid.uuid4()),
            "thread_id": event_id,
            "type": "comment",
            "user_text": user_text,
            "datetime": datetime,
            "user_name": user_name,
            "user_picture": user_picture,
        }
    }

    notify_all(sender_uid, body, user_ids)

    return
