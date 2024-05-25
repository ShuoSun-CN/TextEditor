from django.contrib import admin
from django.urls import path
import register,views,login,forget_password
RAurl = [
    # 注册 验证
    path('verify_register/', register.verify_register),
    #注册 邮箱验证码 发送
    path('send_rm_code/',register.send_register_code),
    #登录 验证
    path('verify_login/',login.verify_login),
    #忘记密码 验证
    path('verify_forget_password',forget_password.verify_forget_password),
    #忘记密码发送邮箱验证码
    path('send_fm_code/',forget_password.send_find_code)
]

RTurl=[
    #进入注册页面
    path('register/',views.register),
    #进入登录界面
    path('login/',views.login),
    #进入忘记密码界面
    path('forget_password/',views.forget_password)
]

LoginUrls=RTurl+RAurl