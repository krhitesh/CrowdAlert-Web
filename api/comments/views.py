from django.conf import settings
from django.http import HttpResponse, JsonResponse, HttpResponseBadRequest
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticatedOrReadOnly
import json
import time
from api.notifications.dispatch import notify_comment
from api.firebase_auth.authentication import TokenAuthentication
from api.spam.classifier import classify_text
from api.spam.views import get_spam_report_data
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from .models import Comment, CommentData
from api.users.models import User

db = settings.FIREBASE.database()
DB = settings.FIRESTORE

def get_comments_from_thread(thread):
    """
    Returns comments thread from Firestore
    along with the users' information
    """
    comment = Comment.get(thread, DB)
    if comment.participants == []:
        return {"comments": {}, "userData": {}}
    user_data = {}
    
    for user in comment.participants:
        tmp_user = User.get(user, DB)
        print(user)
        user_data[user] = tmp_user.to_dict()

    response = {}
    response['userData'] = user_data
    response['comments'] = Comment.get_comment_data(thread, DB)
    for comment_uuid in response['comments'].keys():
        spam_report_data = get_spam_report_data(comment_uuid)
        response['comments'][comment_uuid]['spam'] = spam_report_data
    return response

# Using Firebase Realtime database
# def get_comments_from_thread(thread):
#     """
#     This function should be encapsulated inside a Comment model

#     """
#     thread_data = db.child('comments').child(thread).get().val()
#     if not thread_data or not thread_data.get('comments', False):
#         return {'comments': {}, 'userData': {}}
#     user_data = {}

#     for user in thread_data['participants']:
#         tmp_user = db.child('users').child(user).get().val()
#         print(user)
#         user_data[user] = dict(tmp_user)
#     response = {}
#     response['userData'] = user_data
#     response['comments'] = thread_data['comments']
#     for comment_uuid in thread_data['comments'].keys():
#         spam_report_data = get_spam_report_data(comment_uuid)
#         response['comments'][comment_uuid]['spam'] = spam_report_data

#     return response

class CommentView(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticatedOrReadOnly,)

    def get(self, request):
        thread = request.GET.get('thread', False)
        if not thread:
            return HttpResponseBadRequest('No thread specified')

        response = get_comments_from_thread(thread)
        return JsonResponse(response, safe=False)

    def post(self, request):
        try:
            commentData = json.loads(json.loads(request.body.decode()).get('commentData'))
            thread_id = commentData['thread']
            text = commentData['text']
        except:
            return HttpResponseBadRequest('Bad Request')

        comment_data = CommentData(text, timestamp=time.time()*1000, user=str(request.user))
        comment_data.save(thread_id, DB)
        comment_data.classify_text(thread_id)
        # val = db.child('comments').child(thread).child('comments').push(comment)
        # print('val', val)
        comment = Comment()
        comment.update_add_participant(comment_data.user, thread_id, DB)
        # db.child('comments').child(thread).child('participants').update({
        #     uid: True
        # })
        # classify_text(text, thread_id)
        # print('user', thread_id)
        # print('user', request.user)
        user_name = request.user.name
        user_picture = request.user.user_picture
        
        notify_comment(sender_uid=comment_data.user, datetime=comment_data.timestamp, 
            event_id=thread_id, user_text=text,
            user_name=user_name, user_picture=user_picture)

        channel_layer = get_channel_layer()
        comments_data = {
            "type": 'comments_message',
            "message": {
                "actionType": 'WS_NEW_COMMENT_RECEIVED',
                "data": {
                    "comments": {},
                    "userData": {}
                }
            }
        }
        comments_data['message']['data']['comments'][thread_id] = {
            "text": text,
            "spam": {
                "uuid": thread_id,
                "count": 0,
                "toxic": 'null',
            },
            "user": comment_data.user,
            "timestamp": comment_data.user
        }
        comments_data['message']['data']['userData'][comment_data.user] = {
            "photoURL": user_picture,
            "displayName": user_name
        }
        room_name = 'comments_%s' % thread_id
        print('room_name', room_name)
        # Try removing async_to_sync
        async_to_sync(channel_layer.group_send)(
            room_name,
            comments_data
        )
        
        return JsonResponse({"id": thread_id}, safe=False)