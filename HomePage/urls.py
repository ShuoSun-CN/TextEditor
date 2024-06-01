
from django.urls import path
from HomePage import filelist

HomePageurls=[
    #获取文件列表
    path('get_text_list/',filelist.filelist)
]