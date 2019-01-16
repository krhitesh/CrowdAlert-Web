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

db = settings.FIREBASE.database()

class CommentView(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticatedOrReadOnly,)

    def get(self, request):
        thread = request.GET.get('thread', False)
        if not thread:
            return HttpResponseBadRequest('No thread specified')

        thread_data = db.child('comments').child(thread).get().val()
        if not thread_data or not thread_data.get('comments', False):
            return JsonResponse({'comments': {}, 'userData': {}}, safe=False)
        user_data = {}
        for user in thread_data['participants']:
            tmp_user = db.child('users').child(user).get().val()
            user_data[user] = dict(tmp_user)
        response = {}
        response['userData'] = user_data
        response['comments'] = thread_data['comments']
        for comment_uuid in thread_data['comments'].keys():
            spam_report_data = get_spam_report_data(comment_uuid)
            response['comments'][comment_uuid]['spam'] = spam_report_data
        return JsonResponse(response, safe=False)

    def post(self, request):
        try:
            commentData = json.loads(json.loads(request.body.decode()).get('commentData'))
            thread = commentData['thread']
            text = commentData['text']
        except:
            return HttpResponseBadRequest('Bad Request')

        uid = str(request.user)
        val = db.child('comments').child(thread).child('comments').push({
            'text': text,
            'user': uid,
            'timestamp': time.time()*1000,
        })
        db.child('comments').child(thread).child('participants').update({
            uid: True
        })
        classify_text(text, val['name'])
        
        user_name = request.user.name
        user_picture = request.user.user_picture
        
        notify_comment(sender_uid=uid, datetime=time.time()*1000, 
            event_id=thread, user_text=text,
            user_name=user_name, user_picture=user_picture)
        
        return JsonResponse({'id': val['name']}, safe=False)