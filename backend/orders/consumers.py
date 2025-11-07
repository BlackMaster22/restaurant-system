import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Order

class OrderConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add(
            "orders",
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            "orders",
            self.channel_name
        )

    async def order_created(self, event):
        await self.send(text_data=json.dumps({
            'type': 'order_created',
            'order': event['order']
        }))

    async def order_updated(self, event):
        await self.send(text_data=json.dumps({
            'type': 'order_updated',
            'order': event['order']
        }))