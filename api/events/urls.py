"""urls for django app
"""

from django.urls import path

from api.events.views import EventView, MultipleEventsView, UserIncidents

urlpatterns = [
    # Events around a given location
    path('geteventsbylocation', MultipleEventsView.as_view(),
         name='get events by a location & thresold'),
    # Event data using a the event uuid
    path('incident', EventView.as_view(), name='create new event'),
    path('user_incident_list', UserIncidents.as_view(), name='list of all incidents reported by user'),
]
