import json

from django.conf import settings
from django.http import JsonResponse, HttpResponseBadRequest
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from api.firebase_auth.authentication import TokenAuthentication

db = settings.FIRESTORE


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
        except (ValueError, KeyError):
            return HttpResponseBadRequest("Bad Request")

        if not fcmtoken:
            return HttpResponseBadRequest("Bad Request: FCM token not provided")
        db.document('fcmkeys/' + user_id).set({u"key": fcmtoken})
        return JsonResponse({"status": "ok"}, safe=False)
