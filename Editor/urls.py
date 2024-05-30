from django.contrib import admin
from django.urls import path
from Editor.upload_media import upload_audio,upload_img,upload_video
from RichText.settings import MEDIA_ROOT
from django.conf.urls.static import static
Editorurls = [
    # 注册 验证
    path('upload_img/', upload_img.upload_img),
    path('upload_video/',upload_video.upload_video),
    path('upload_audio/',upload_audio.upload_audio)
]\
             +static('/image/',document_root=MEDIA_ROOT+'/image/')\
             +static('/video/',document_root=MEDIA_ROOT+'/video/')\
             +static('/audio/',document_root=MEDIA_ROOT+'/audio/')


