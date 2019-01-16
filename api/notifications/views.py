from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from api.firebase_auth.authentication import TokenAuthentication
from django.http import JsonResponse, HttpResponseBadRequest
from django.conf import settings
import json

db = settings.FIREBASE.database()

class FCMTokenView(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        return JsonResponse({'status': 'OK'}, safe=False)
    def post(self, request):
        user_id = str(request.user)
        try:
            print(json.loads(request.body.decode()))
            fcmtoken = json.loads(request.body.decode()).get('fcmtoken')
        except:
            return HttpResponseBadRequest("Bad Request")
        
        if not fcmtoken:
            return HttpResponseBadRequest("Bad Request: FCM token not provided")
        db.child('fcmkeys/' + user_id + '/key').push(fcmtoken)
        return JsonResponse({"status": "ok"}, safe=False)


