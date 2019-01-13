from rest_framework.views import APIView
from rest_framework import permissions
from api.firebase_auth.authentication import TokenAuthentication
from django.http import HttpResponse, JsonResponse, HttpResponseBadRequest
from django.conf import settings
import json

db = settings.FIREBASE.database()

class UpvoteView(APIView):
    """API view class for upvotes
    """
    authentication_classes = (TokenAuthentication,)
    permissions_classes = (permissions.IsAuthenticatedOrReadOnly)

    def get(self, request):
        """Returns the number of upvotes for a specific uuid &
        if the user is authenticated then whether the user has upvoted the uuid
        """
        
        uuid = request.GET.get('uuid')
        if not uuid:
            return HttpResponseBadRequest("BadRequest: uuid not specified")
        
        path = 'upvotes/' + uuid

        count = db.child(path + '/count').get().val()
        has_upvoted = False
        
        if request.user.is_authenticated:
            user_id = str(request.user)
            user_upvote_path = path + '/upvoters/' + user_id + '/has_upvoted'

            has_upvoted = db.child(user_upvote_path).get().val()

        return JsonResponse({
            'uuid': uuid,
            'count': count,
            'has_upvoted': has_upvoted,
        })
        
    def post(self, request):
        """Lets a user to upvote a specific uuid
        """

        uuid = request.GET.get('uuid')
        if not uuid:
            return HttpResponseBadRequest("BadRequest: uuid not specified")
        
        user_id = str(request.user)
        # Check if upvote uuid exists on the database & get the upvotes
        path = 'upvotes/' + uuid
        user_upvote_path = path + '/upvoters/' + user_id
        # Get the uuid data
        count = db.child(path + '/count').get().val()
        # Make sure to initialize count
        if not count:
            count = 0
        has_upvoted = db.child(user_upvote_path + '/has_upvoted').get().val()
        # If the user has not upvoted the event, update the user entry
        # Else decrease the count
        new_count = count
        if not has_upvoted:
            db.child(user_upvote_path).update({
                'has_upvoted': True,
            })
            db.child(path).update({
                'count': count + 1,
            })
            new_count += 1
        else:
            db.child(user_upvote_path).update({
                'has_upvoted': False,
            })
            db.child(path).update({
                'count': count - 1,
            })
            new_count -= 1
        # Return the count and the uuid
        return JsonResponse({
            'uuid': uuid,
            'count': new_count,
            'has_upvoted': not has_upvoted,
        }, safe=False)


