""" Viw module for user app
"""
import json

from django.conf import settings
from django.http import JsonResponse, HttpResponseBadRequest
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from firebase_admin import auth
from firebase_admin.firestore import GeoPoint

from api.firebase_auth.authentication import TokenAuthentication
from api.users.models import User

DB = settings.FIRESTORE

DB = settings.FIRESTORE

class UserView(APIView):
    """ User View Class
    """
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        """
        Returns user and user metadata
        """
        key = request.GET.get('key')
        if key is None:
            return HttpResponseBadRequest("Bad request")

        uid = str(request.user)
        if key == 'providers':
            user = auth.get_user(uid=uid)
            provider_data = {}
            for provider in user.provider_data:
                provider_data[provider.provider_id] = {
                    'email': provider.email
                }
            return JsonResponse(provider_data, safe=False)
        elif key == 'home_location':
            home_location = {}
            user = User.get(uid, DB)
            if user.home_location != {}:
                home_location = {
                    u"lat": user.home_location["coords"].latitude,
                    u"lng": user.home_location["coords"].longitude,
                    u"text": user.home_location["text"]
                }
            return JsonResponse(home_location, safe=False)

        return HttpResponseBadRequest("Bad request")

    def post(self, request):
        """ Updates the user data
        """
        try:
            user_data = json.loads(json.loads(request.body.decode()).get('userData'))
        except Exception:
            return HttpResponseBadRequest("Bad request")

        if user_data == '':
            return HttpResponseBadRequest("Bad request")
        uid = str(request.user)
        if user_data.get('displayName', False):
            DB.document('users/' + uid).set({u"displayName": user_data.get('displayName', ' ')})

        return JsonResponse({"status": "ok"}, safe=False)

    def delete(self, request):
        """
        Deletes a user given its uid
        """
        uid = str(request.user)
        try:
            auth.delete_user(uid=uid)
        except:
            return HttpResponseBadRequest("Bad request")

        return JsonResponse({"status": "ok"}, safe=False)

