from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
import json
import uuid
from urllib import parse
from .views import multiple_events_view_root_func

class EventsConsumer(WebsocketConsumer):
  def connect(self):
    qs = self.scope['query_string']
    self.room_name = str(uuid.uuid4())
    self.room_group_name = 'geteventsbylocation_'
    if self._is_authenticated():
      # Closed with an error code 1
      self.disconnect(1)

    req_params = parse.parse_qs(qs)
    lat = 0.00
    lng = 0.00
    dist = 0.00
    cluster_threshold = 0.00
    try:
      lat = float(req_params.get(b'lat')[0])
      lng = float(req_params.get(b'lng')[0])
      dist = float(req_params.get(b'dist')[0])
      cluster_threshold = float(req_params.get(b'min')[0])
    except:
      print('Failed to obtain required query parameters')
    
    # Join room group
    async_to_sync(self.channel_layer.group_add)(
        self.room_group_name,
        self.channel_name
    )

    data = async_to_sync(multiple_events_view_root_func)(lat, lng, dist, cluster_threshold)
    self.accept()
    self.send(text_data=json.dumps({
      'data': data,
      'actionType': 'FEED_FETCH_EVENTS_BY_LOCATION_FINISHED'
    }))

  def disconnect(self, close_code):
    # Leave room group
    async_to_sync(self.channel_layer.group_discard)(
        self.room_group_name,
        self.channel_name
    )

  def receive(self, text_data):
    # This is the ws endpoint to add new incidents to the database
    # When a signed in user adds a new incident, add that event to the
    # database and check among all channels if this newly added event
    # is in the proximity of that channel. If it is, then shovel that
    # event to that channel.

    # The data received by this method is of the type:
    # {
    #   'lat': latitude,
    #   'lng': longitude,
    #   'dist': threshold,
    #   'min': cluster_threshold,
    # }
    text_data_json = json.loads(text_data)
    lat = float(text_data_json['lat'])
    lng = float(text_data_json['lng'])
    dist = float(text_data_json['dist'])
    cluster_threshold = float(text_data_json['min'])

    data = async_to_sync(multiple_events_view_root_func)(lat, lng, dist, cluster_threshold)
    # Send message to room group
    async_to_sync(self.channel_layer.group_send)(
        self.room_group_name,
        {
            'type': 'chat_message',
            'message': {
              'data': data,
              'actionType': 'FEED_FETCH_EVENTS_BY_LOCATION_FINISHED'
            }
        }
    )

  # Receive message from room group
  def chat_message(self, event):
    data = event['message']

    # Send message to WebSocket
    self.send(text_data=json.dumps(data))

  def _is_authenticated(self):
    # Accept all connections
    # Auth protection is applied at client side
    me = self.scope['user']
    if me == 'AnonymousUser':
      return True
    return False
