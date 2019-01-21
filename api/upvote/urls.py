from django.urls import path
from api.upvote.views import UpvoteView

urlpatterns = [
    path('upvote', UpvoteView.as_view(), name='Upvote uuid')
]