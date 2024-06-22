from django.contrib import admin
from django.urls import path
from Editor.upload_media import upload_audio,upload_img,upload_video
from RichText.settings import MEDIA_ROOT
from django.conf.urls.static import static
from Editor.AIPolish.AIPolish import polish,translation,modify,summary,continue_write
from Editor.InfoExtraction import AudioRecognition,OCR,ObjectDection
Editorurls = [
    # 上传媒体文件
    path('upload_img/', upload_img.upload_img),
    path('upload_video/',upload_video.upload_video),
    path('upload_audio/',upload_audio.upload_audio),
    # 智能润色
    path('polishText/',polish),
    path('translateText/',translation),
    path('summaryText/',summary),
    path('modifyText/',modify),
    path('continue_writeText/',continue_write),
    #多媒体信息提取
    path('ocr/',OCR.ocr),
    path('audio_recognition/',AudioRecognition.audio_recognition),
    path('object_detection/',ObjectDection.object_detection)

]\
             +static('/image/',document_root=MEDIA_ROOT+'/image/')\
             +static('/video/',document_root=MEDIA_ROOT+'/video/')\
             +static('/audio/',document_root=MEDIA_ROOT+'/audio/') \
            +static('/ocr_pic/',document_root=MEDIA_ROOT+'/OCRresults_pic/')



