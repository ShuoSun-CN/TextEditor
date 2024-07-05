from django.urls import path
from . import CEditing

websocket_urlpatterns = [
    path('ws/update_text/', CEditing.ChatConsumer.as_asgi()),
]
