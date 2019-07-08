import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer


class CommentsConsumer(WebsocketConsumer):
    """
    Change this consumer to AsyncWebsocketConsumer

    """

    def connect(self):
        """
        Adds current channel to the room group of the name 'comments_{room_name}' where
        room name is the thread_id. Finally it accepts the websocket connection

        """
        self.room_name = self.scope['url_route']['kwargs']['thread_id']
        self.room_group_name = 'comments_%s' % self.room_name

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        """
        Disconnects the client of the current channel. Also removes current channel
        from the room group of the name 'comments_{room_name}' where
        room name is the thread_id.

        """
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    def receive(self, text_data=None, bytes_data=None):
        pass

    def comments_message(self, event):
        """
        Handler function to send data from server to client in an open
        websocket connection.

        For example, inside an async function from anywhere in the app:
        await channel_layer.send({
          'type': 'comments_message',
          'message': 'your data'
        })

        """
        data = event['message']

        # Finally shovel data to the client
        self.send(text_data=json.dumps(data))
