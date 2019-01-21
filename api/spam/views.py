from rest_framework.views import APIView
from api.firebase_auth.permissions import FirebasePermissions
from api.firebase_auth.authentication import TokenAuthentication
from django.http import HttpResponse, JsonResponse, HttpResponseBadRequest
from django.conf import settings
import json

db = settings.FIREBASE.database()

def get_spam_report_data(uuid):
    path = 'classifier/' + uuid
    toxic = db.child(path + '/toxic').get().val()
    user_flag_count = db.child(path + '/flags/count').get().val()

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
        
        path = 'classifier/' + uuid + '/flags'
        user_flags = db.child(path).get().val()

        user_id = str(request.user)
        
        count = 0
        # If uuid is present, fetch the previous count
        if user_flags:
            count = user_flags.get('count', 0)
        
        try:
            flagged = user_flags.get('users').get(user_id, False)
        except:
            flagged = False
        
        if not flagged:
            db.child(path + '/users/' + user_id).update({
                'has_reported': True
            })
            db.child(path).update({
                'count': count + 1,
            })
            count += 1
        return JsonResponse({"count": count })











        



