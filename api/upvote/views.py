import time

from django.conf import settings
from django.http import JsonResponse, HttpResponseBadRequest
from rest_framework import permissions
from rest_framework.views import APIView

from api.firebase_auth.authentication import TokenAuthentication
from .models import Upvote

DB = settings.FIRESTORE
SLEEP_SECONDS = 20


class UpvoteView(APIView):
    """API view class for upvotes
    """
    authentication_classes = (TokenAuthentication,)
    permissions_classes = (permissions.IsAuthenticatedOrReadOnly)

    def get(self, request):
        """Returns the number of upvotes for a specific uuid &
        if the user is authenticated then whether the user has upvoted the uuid

        This method is called from the client when it wants to check if there are
        any new upvote's count of a given "uuid" upvote.

        The backend is checked every second for SLEEP_SECONDS. If there are no new
        upvotes in this interval, response is returned with current_count 
        and the client may initiate a new request.

        The result of this method, when upvote's count change are available
        is json similar to below:

        {
            'uuid': uuid,
            'count': count,
            'has_upvoted': has_upvoted,
        }
        """

        uuid = request.GET.get('uuid')
        current_count = request.GET.get('current_count')
        if not uuid:
            return HttpResponseBadRequest("BadRequest: uuid not specified")

        if not current_count:
            current_count = -1

        try:
            current_count = int(current_count)
        except:
            return HttpResponseBadRequest("BadRequest: current_count must be an integer")

        upvote = Upvote(-1, [])
        for _ in range(SLEEP_SECONDS):
            upvote = Upvote.get(uuid, DB, default=Upvote(0, []))
            has_upvoted = self.get_has_upvoted(upvote, request)
            if current_count == -1:
                # send the reponse of the initial request immediately
                return JsonResponse({
                    'uuid': uuid,
                    'count': upvote.count,
                    'has_upvoted': has_upvoted,
                })

            if upvote.count == current_count:
                time.sleep(1)
                continue

            # send the reponse as update is available
            return JsonResponse({
                'uuid': uuid,
                'count': upvote.count,
                'has_upvoted': has_upvoted,
            })

        return JsonResponse({
            'uuid': uuid,
            'count': current_count,
            'has_upvoted': has_upvoted,
        })

    def post(self, request):
        """Lets a user to upvote a specific uuid
        """

        uuid = request.GET.get('uuid')
        if not uuid:
            return HttpResponseBadRequest("BadRequest: uuid not specified")

        user_id = str(request.user)
        upvote = Upvote.get(uuid, DB)
        print(uuid)

        if upvote is None:
            upvote = Upvote(0, [])
            upvote.save(uuid, DB)

        has_upvoted = user_id in upvote.upvoters
        # If the user has not upvoted the event, update the user entry
        # Else decrease the count
        new_count = upvote.count
        if not has_upvoted:
            upvote.update_add_upvote(user_id, upvote.count + 1, uuid, DB)
            new_count += 1
        else:
            upvote.update_remove_upvote(user_id, upvote.count - 1, uuid, DB)
            new_count -= 1

        # Return the count and the uuid
        return JsonResponse({
            'uuid': uuid,
            'count': new_count,
            'has_upvoted': not has_upvoted,
        }, safe=False)

    def get_has_upvoted(self, upvote, request):
        return str(request.user) in upvote.upvoters and request.user.is_authenticated
