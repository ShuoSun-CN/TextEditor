# chat/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from Login.verify_session import verify_only_session_uid
from urllib.parse import parse_qs
import threading
from DAO.Shared import Shared
from DAO.Text import Text
from DAO.UserInfo import UserInfo
from collections import defaultdict
class ChatConsumer(AsyncWebsocketConsumer):
    active_users = defaultdict(list)
    current_version = defaultdict(int)  # 新增版本号
    async def connect(self):
        query_string = self.scope['query_string'].decode()
        query_params = parse_qs(query_string)
        self.text_id = query_params.get('text_id', [None])[0]
        session_id = query_params.get('session_id', [None])[0]
        self.user_id = verify_only_session_uid(session_id)
        owner = Text.objects.filter(owner=self.user_id, file_id=self.text_id)
        shared = Shared.objects.filter(user_id=self.user_id, file_id=self.text_id)
        if not owner.exists() and not shared.exists():
            await self.close()
            return

        if self.user_id not in self.active_users.get(self.text_id, []):
            self.active_users[self.text_id].append(self.user_id)
        await self.channel_layer.group_add(self.text_id, self.channel_name)
        await self.accept()

        # 发送用户列表及当前版本号
        await self.channel_layer.group_send(self.text_id, {
            'type': 'user_list_update',
            'users': self.active_users[self.text_id],
            'version': self.current_version[self.text_id],  # 当前版本号
        })
    async def disconnect(self, close_code):
        # 从房间组的活跃用户列表中移除用户
        if self.user_id in self.active_users.get(self.text_id, []):
            self.active_users[self.text_id].remove(self.user_id)

        # 如果房间组没有活跃用户，则删除该组的条目
        if not self.active_users[self.text_id]:
            del self.active_users[self.text_id]

        # 离开房间组
        await self.channel_layer.group_discard(
            self.text_id,
            self.channel_name
        )
        print(self.user_id, "离开协作ID：", self.text_id)
        # 通知所有用户更新活跃用户列表
        await self.channel_layer.group_send(
            self.text_id,
            {
                'type': 'user_list_update',
                'users': self.active_users.get(self.text_id, []),
            }
        )

    # 接收来自 WebSocket 的消息
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['text']
        user_id = text_data_json['user_id']
        self.current_version[self.text_id] += 1  # 增加版本号

        print("websocket receive message: ", user_id, message,"版本号：",self.current_version)

        await self.channel_layer.group_send(self.text_id, {
            'type': 'update_text',
            'text': message,
            'version': self.current_version[self.text_id],  # 发送版本号
        })
    # 接收来自房间组的消息
    async def update_text(self, event):
        message = event['text']
        version = event['version']
        await self.send(text_data=json.dumps({
            'action': "update_text",
            'text': message,
            'version': version,  # 发送版本号
        }))

    async def user_list_update(self, event):
        users = event['users']
        users_info = []
        for i in users:
            user_info = UserInfo.objects.filter(user_id=i)[0]
            temp_info = {
                'avatar': user_info.user_avatar,
                'user_name': user_info.user_name,
            }
            users_info.append(temp_info)
        await self.send(text_data=json.dumps({
            'action': "update_users",
            'users': json.dumps(users_info),
            'version': event['version'],  # 发送版本号
        }))