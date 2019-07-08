from django.conf import settings
from django.http import JsonResponse, HttpResponseBadRequest
from rest_framework.views import APIView

from api.firebase_auth.authentication import TokenAuthentication
from django.http import HttpResponse, JsonResponse, HttpResponseBadRequest
from django.conf import settings
import json
from .models import Classifier

DB = settings.FIRESTORE

def get_spam_report_data(uuid):
    classifier_dict = Classifier.get(uuid, DB)
    user_flag_count = 0
    toxic = {}
    if classifier_dict is not None:
        user_flag_count = classifier_dict.flag_count
        toxic = classifier_dict.toxic

    data = {
        'uuid': uuid,
        'count': user_flag_count,
        'toxic': toxic,
    }
    return data


class SpamReportView(APIView):
    """Spam Reporting API view
    """
    authentication_classes = (TokenAuthentication,)
    permission_classes = (FirebasePermissions,)

    def get(self, request):
        """Returns the spam classification type for a given uuid
        
        Arguments:
            request {[type]} -- [Should contain the uuid as a get parameter]
        """

        uuid = request.GET.get('uuid')
        if not uuid:
            return HttpResponseBadRequest("Bad request: uuid is not specified")

        return JsonResponse(get_spam_report_data(uuid))

    def post(self, request):
        """Let users to report a specific uuid
        """
        uuid = request.GET.get('uuid')
        if not uuid:
            return HttpResponseBadRequest("Bad request: uuid is not specified")
        
        classifier = Classifier.get(uuid, DB)

        user_id = str(request.user)

        count = 0
        # If uuid is present, fetch the previous count
        if classifier.flag_count:
            count = classifier.flag_count
        
        try:
            flagged = user_id in classifier.flag_users
        except:
            flagged = False

        if not flagged:
            classifier.update(count + 1, user_id, uuid, DB)
            count += 1
        return JsonResponse({ "count": count })
