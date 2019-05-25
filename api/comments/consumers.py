from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
import json
import uuid
from urllib import parse
from api.comments.views import get_comments_root_func

class CommentsConsumer(WebsocketConsumer):
  def connect(self):
    self.room_name = self.scope['url_route']['kwargs']['thread_id']
    self.room_group_name = 'comments_%s' % self.room_name

    # Join room group
    async_to_sync(self.channel_layer.group_add)(
        self.room_group_name,
        self.channel_name
    )

    self.accept()
    # Send comments data to the client
    # based on thread_id
    # comments = get_comments_root_func(self.room_name)
    # self.send(text_data=json.dumps({
    #   'actionType': 'COMMENTS_FETCH_THREAD_SUCCESS',
    #   'data': comments
    # }))

  def disconnect(self, close_code):
    # Leave room group
    async_to_sync(self.channel_layer.group_discard)(
        self.room_group_name,
        self.channel_name
    )

  def receive(self, text_data):
    pass

  # Receive message from room group
  def comments_message(self, event):
    data = event['message']

    # Send message to WebSocket
    self.send(text_data=json.dumps(data))