from django.contrib import admin
from django.urls import path
from Editor.upload_media import upload_img
Editorurls = [
    # 注册 验证
    path('upload_img/', upload_img.upload_img),

]


