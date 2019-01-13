from django.urls import path
from api.spam.views import SpamReportView

urlpatterns = [
    path('report', SpamReportView.as_view(), name='Report Spam')
]
