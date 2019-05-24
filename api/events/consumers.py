from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
import json
from urllib import parse
from .views import multiple_events_view_root_func

class EventsConsumer(WebsocketConsumer):
  def connect(self):
    qs = self.scope['query_string']
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
    
    self.room_name = qs
    self.room_group_name = 'geteventsbylocation_'
    # Join room group
    async_to_sync(self.channel_layer.group_add)(
        self.room_group_name,
        self.channel_name
    )

    data = async_to_sync(multiple_events_view_root_func)(lat, lng, dist, cluster_threshold)
    self.accept()
    self.send(text_data=json.dumps(data))

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
    text_data_json = json.loads(text_data)
    message = text_data_json['message']

    # Send message to room group
    async_to_sync(self.channel_layer.group_send)(
        self.room_group_name,
        {
            'type': 'chat_message',
            'message': message
        }
    )

  # Receive message from room group
  def chat_message(self, event):
    message = event['message']

    # Send message to WebSocket
    self.send(text_data=json.dumps({
        'message': message
    }))
