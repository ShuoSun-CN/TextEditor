from django.contrib import admin
from django.urls import path
from Login import register,views,login,forget_password
RAurl = [
    # 注册 验证
    path('verify_register/', register.verify_register),
    #注册 邮箱验证码 发送
    path('send_rm_code/',register.send_register_code),
    #登录 验证
    path('verify_login/',login.verify_login),
    #忘记密码 验证
    path('verify_forget_password/',forget_password.verify_forget_password),
    #忘记密码发送邮箱验证码
    path('send_fm_code/',forget_password.send_find_code)
]

LoginUrls=RAurl