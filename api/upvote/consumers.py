from asgiref.sync import async_to_sync
import json
from channels.generic.http import AsyncHttpConsumer

class LongPollConsumer(AsyncHttpConsumer):
  async def handle(self, body):
    self.room_name = self.scope['url_route']['kwargs']['uuid']
    self.room_group_name = 'upvote_%s' % self.room_name
    # await self.send_response(200, b"Hello", headers=[
    #     (b"Content-Type", b"application/json"),
    # ])
    async_to_sync(self.channel_layer.group_add)(
        self.room_group_name,
        self.channel_name
    )
    await self.send_headers(headers=[
        (b"Content-Type", b"application/json"),
    ])
    # Headers are only sent after the first body event.
    # Set "more_body" to tell the interface server to not
    # finish the response yet:
    await self.send_body(b"", more_body=True)

  async def upvote_message(self, event):
    # Send JSON and finish the response:
    async_to_sync(self.channel_layer.group_discard)(
        self.room_group_name,
        self.channel_name
    )
    await self.send_body(json.dumps(event).encode("utf-8"))