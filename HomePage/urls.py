
from django.urls import path
from HomePage import text_list,save_text,create_text

HomePageurls=[
    #获取文件列表
    path('get_text_list/',text_list.filelist),
    #保存文件
    path('save_text/',save_text),
    #创建文件
    path('create_text/',create_text)
]