
from django.urls import path
from HomePage.text_pro import text_list,save_text,create_text,get_text,delete_text,rename_text
from HomePage.user_pro import user_info
from RichText.settings import MEDIA_ROOT,TEXT_ROOT
from django.conf.urls.static import static
HomePageurls=[
    #获取文件列表
    path('get_text_list/',text_list.filelist),
    #获取最近文件列表
    path('get_recent_text_list/',text_list.get_recent_file_list),
    #保存文件
    path('save_text/',save_text.save_file),
    # 获取文件内容
    path('get_text/', get_text.get_file),
    #创建文件
    path('create_text/',create_text.create_file),
    #重命名文件
    path('rename_text/',rename_text.rename_text),
    #删除自己文件的本体
    path('delete_own_text/',delete_text.delete_own_file),
    #删除自己文件的本体列表
    path('delete_own_text_list/',delete_text.delete_own_file_list),
    #获取用户信息
    path('get_user_info/',user_info.get_user_info),
    #上传新头像
    path('update_avatar/',user_info.update_avatar),
    #修改除头像外的其他信息
    path('update_other_user_info/',user_info.update_other_info),
    #修改密码
    path('update_password/',user_info.update_password),

]\
+ static('/avatar/', document_root=MEDIA_ROOT + '/avatar/') \
             + static('/txt/', document_root=TEXT_ROOT + '/')