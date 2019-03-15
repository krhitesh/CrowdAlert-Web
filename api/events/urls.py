"""urls for django app
"""

from django.urls import path
from api.events.views import EventView, MultipleEventsView

urlpatterns = [
    # Events around a given location
    path('geteventsbylocation', MultipleEventsView.as_view(),
         name='get events by a location & threshold'),
    # Event data using an event uuid
    path('incident', EventView.as_view(), name='create new event'),
]
