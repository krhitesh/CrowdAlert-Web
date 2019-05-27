from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
import json
from .views import get_multiple_events

class EventsConsumer(WebsocketConsumer):
  def connect(self):
    """
    Adds current channel to the room group of the name 'geteventsbylocation_'.
    Finally it accepts the websocket connection.

    """
    self.room_group_name = 'geteventsbylocation_'

    # Join room group
    async_to_sync(self.channel_layer.group_add)(
        self.room_group_name,
        self.channel_name
    )

    self.accept()

  def disconnect(self, close_code):
    """
    Disconnects the client of the current channel. Also removes current channel
    from the room group of the name 'geteventsbylocation_'

    """
    async_to_sync(self.channel_layer.group_discard)(
        self.room_group_name,
        self.channel_name
    )

  def receive(self, text_data):
    """
    This is the websocket endpoint to get incidents from the database
    when map configuration changes on the client.
    
    The args received by this function has the schema:
    {
      'lat': latitude,
      'lng': longitude,
      'dist': threshold,
      'min': cluster_threshold,
    }

    """
    text_data_json = json.loads(text_data)
    lat = float(text_data_json['lat'])
    lng = float(text_data_json['lng'])
    zoom = float(text_data_json['zoom'])
    dist = float(text_data_json['dist'])
    cluster_threshold = float(text_data_json['min'])

    data = get_multiple_events(lat, lng, dist, cluster_threshold)
    # Send message to room group
    async_to_sync(self.channel_layer.group_send)(
        self.room_group_name,
        {
            'type': 'chat_message',
            'message': {
              'data': data,
              'actionPayload': {
                'lat': lat,
                'lng': lng,
                'zoom': zoom,
              },
              'actionType': 'FEED_FETCH_EVENTS_BY_LOCATION_FINISHED'
            }
        }
    )

  def events_message(self, event):
    """
    Handler function to send data from server to client in an open
    websocket connection.

    For example, inside an async function from anywhere in the app:
    await channel_layer.send({
      'type': 'events_message',
      'message': 'your data'
    })

    """
    data = event['message']

    # Send message to WebSocket
    self.send(text_data=json.dumps(data))
