import json
import time

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.conf import settings
from django.http import JsonResponse, HttpResponseBadRequest
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.views import APIView

from api.firebase_auth.authentication import TokenAuthentication
from api.notifications.dispatch import notify_comment
from api.spam.views import get_spam_report_data
from api.users.models import User
from .models import Comment, CommentData

db = settings.FIREBASE.database()
DB = settings.FIRESTORE


def get_comments_from_thread(thread):
    """
    Returns comments thread from Firestore
    along with the users' information
    """
    comment = Comment.get(thread, DB)
    if len(comment.participants) == 0:
        return {"comments": {}, "userData": {}}

    user_data = {}
    for user in comment.participants:
        tmp_user = User.get(user, DB)
        if 'coords' in tmp_user.home_location.keys():
            tmp_user.home_location['coords'] = {
                u"lat": tmp_user.home_location["coords"].latitude,
                u"lng": tmp_user.home_location["coords"].longitude,
                u"text": tmp_user.home_location["text"]
            }
        print(user)
        user_data[user] = tmp_user.to_dict()

    response = {'userData': user_data, 'comments': Comment.get_comment_data(thread, DB)}
    for comment_uuid in response['comments'].keys():
        spam_report_data = get_spam_report_data(comment_uuid)
        response['comments'][comment_uuid]['spam'] = spam_report_data

    return response


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
        print('posting')
        try:
            comment_data = json.loads(json.loads(request.body.decode()).get('commentData'))
            print(comment_data)
            thread_id = comment_data['thread']
            text = comment_data['text']
        except (KeyError, ValueError):
            return HttpResponseBadRequest('Bad Request')

        comment_data = CommentData(text, timestamp=time.time() * 1000, user=str(request.user))
        key = comment_data.save(thread_id, DB)
        if not settings.COVERAGE:
            comment_data.classify_text(thread_id)

        comment = Comment()
        comment.update_add_participant(comment_data.user, thread_id, DB)

        user_name = str(request.user.name)
        user_picture = request.user.user_picture
        print('settings.COVERAGE', settings.COVERAGE)
        if not settings.COVERAGE:
            notify_comment(sender_uid=comment_data.user, datetime=comment_data.timestamp,
                       event_id=thread_id, user_text=text,
                       user_name=user_name, user_picture=user_picture)

            channel_layer = get_channel_layer()
            comments_data = {
                "type": "comments_message",
                "message": {
                    'actionType': 'WS_NEW_COMMENT_RECEIVED',
                    'data': {
                        'comments': {},
                        'userData': {}
                    }
                }
            }
            comments_data['message']['data']['comments'][key] = {
                'text': text,
                'spam': {
                    'uuid': key,
                    'count': 0,
                    'toxic': 'null',
                },
                'user': comment_data.user,
                'timestamp': comment_data.timestamp
            }
            comments_data['message']['data']['userData'][comment_data.user] = {
                'photoURL': user_picture,
                'displayName': user_name
            }
            room_name = 'comments_%s' % thread_id
            print('room_name', room_name)

            async_to_sync(channel_layer.group_send)(
                room_name,
                comments_data
            )

        return JsonResponse({"id": key}, safe=False)
