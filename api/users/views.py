""" Viw module for user app
"""
import json

from django.conf import settings
from django.http import JsonResponse, HttpResponseBadRequest
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from api.firebase_auth.authentication import TokenAuthentication
from api.users.models import User

DB = settings.FIRESTORE

DB = settings.FIRESTORE

DB = settings.FIRESTORE


class UserView(APIView):
    """ User View Class
    """
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        """ Not implemented yet
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

    def patch(self, request):
        """
        Updates user's email, password or home location given a uid
        """
        keys = request.GET.get('keys')
        if keys is None:
            return HttpResponseBadRequest("Bad request")
        fields = keys.split(',')
        try:
            update_fields = json.loads(request.body.decode())
            if len(update_fields) == 0:
                raise Exception("No fields to patch")
        except:
            return HttpResponseBadRequest("Bad request")
            
        uid = str(request.user)
        for field in fields:
            try:
                if field == 'email':
                    email = update_fields["email"]
                    if request.user.email != email:
                        auth.update_user(uid=uid, email=email)
                    else:
                        return HttpResponseBadRequest("Email already exists")
                elif field == 'password':
                    password = update_fields["password"]
                    auth.update_user(uid=uid, password=password)
                elif field == 'home_location':
                    home_location = json.loads(update_fields["home_location"])
                    home_location["coords"] = GeoPoint(home_location["lat"], home_location["lng"])
                    del home_location["lat"]
                    del home_location["lng"]
                    DB.document('users/' + uid).update({u"home_location": home_location})
                elif field == 'displayName':
                    displayName = update_fields["displayName"]
                    print(displayName)
                    if request.user.name != displayName:
                        auth.update_user(uid=uid, display_name=displayName)
                        DB.document('users/' + uid).update({u"displayName": displayName})
                    else:
                        return HttpResponseBadRequest("Email already exists")
                elif field == 'photoURL':
                    photoURL = update_fields["photoURL"]
                    if request.user.user_picture != photoURL:
                        auth.update_user(uid=uid, photo_url=photoURL)
                        DB.document('users/' + uid).update({u"photoURL": photoURL})
                    else:
                        return HttpResponseBadRequest("Email already exists")
            except:
                return HttpResponseBadRequest("Bad request")

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

