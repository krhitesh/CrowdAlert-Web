from django.urls import path
from api.notifications.views import FCMTokenView

urlpatterns = [
    path('register', FCMTokenView.as_view(), name='Register FCM Token')
]