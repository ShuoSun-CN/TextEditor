# chat/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from Login.verify_session import verify_only_session_uid
from urllib.parse import parse_qs
import threading
class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        query_string = self.scope['query_string'].decode()
        query_params = parse_qs(query_string)

        # 获取特定参数
        session_id = query_params.get('session_id', [None])[0]

        user_id=verify_only_session_uid(session_id)
        if user_id is None:
            await self.close()
        else:
            self.user_id=user_id
        # 加入房间组
        await self.channel_layer.group_add(
            self.user_id,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # 离开房间组
        await self.channel_layer.group_discard(
            self.user_id,
            self.channel_name
        )

    # 接收来自 WebSocket 的消息
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['text']

        # 发送消息到房间组
        await self.channel_layer.group_send(
            self.user_id,
            {
                'type': 'update_text',
                'text': message
            }
        )

    # 接收来自房间组的消息
    async def update_text(self, event):
        message = event['text']

        # 发送消息到 WebSocket
        await self.send(text_data=json.dumps({
            'text': message
        }))
