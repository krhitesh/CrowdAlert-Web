from rest_framework.views import APIView
from api.firebase_auth.permissions import FirebasePermissions
from api.firebase_auth.authentication import TokenAuthentication
from django.http import HttpResponse, JsonResponse, HttpResponseBadRequest
from django.conf import settings
import json
from .models import Classifier

db = settings.FIREBASE.database()
DB = settings.FIRESTORE

def get_spam_report_data(uuid):
    path = 'classifier/' + uuid
    """
    TODO: Unknown structure of toxic node in realtime database
    """
    toxic = db.child(path + '/toxic').get().val()
    user_flag_count = DB.collection('classifiers').document(uuid).get().to_dict()['flag_count']

    if not user_flag_count:
        user_flag_count = 0

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
    permission_classes = (FirebasePermissions, )

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
        
        # path = 'classifier/' + uuid + '/flags'
        # user_flags = db.child(path).get().val()
        classifier = Classifier.from_dict(Classifier.get(uuid, DB))

        user_id = str(request.user)
        
        count = 0
        # If uuid is present, fetch the previous count
        if classifier.flag_count:
            count = classifier.flag_count
        
        try:
            # flagged = user_flags.get('users').get(user_id, False)
            flagged = user_id in classifier.flag_users
        except:
            flagged = False
        
        if not flagged:
            classifier.update(count + 1, user_id, uuid, DB)
            count += 1
        return JsonResponse({ "count": count })











        



