from asgiref.sync import async_to_sync
import json
from channels.generic.http import AsyncHttpConsumer
from .views import store_channel, delete_channel

class LongPollConsumer(AsyncHttpConsumer):
  async def handle(self, body):
    self.room_name = self.scope['url_route']['kwargs']['uuid']
    self.room_group_name = 'upvote_'
    # await self.send_response(200, b"Hello", headers=[
    #     (b"Content-Type", b"application/json"),
    # ])
    store_channel(self.room_name, self.channel_name)
    await self.send_headers(status=200, headers=[
        (b"Content-Type", b"application/json"),
    ])
    print('consumer room_name', self.room_group_name)
    # await self.channel_layer.group_add(
    #     self.room_group_name,
    #     self.channel_name
    # )

    # Headers are only sent after the first body event.
    # Set "more_body" to tell the interface server to not
    # finish the response yet:
    await self.send_body(body=b"Response", more_body=True)

  async def upvote_message(self, event):
    await delete_channel(self.room_name)
    print(event['message'])
    # Send JSON and finish the response:
    # async_to_sync(self.channel_layer.group_discard)(
    #     self.room_group_name,
    #     self.channel_name
    # )
    await self.send_body(body=json.dumps(event).encode("utf-8"))