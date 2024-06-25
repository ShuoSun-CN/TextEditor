from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from Login.verify_session import verify_session_uid, verify_session_uid_f
from DAO.UserInfo import UserInfo
from DAO.UserAccount import UserAccount
import json
import time
import numpy as np
from datetime import datetime
import os
@csrf_exempt
def get_user_info(req):
    try:
        user_id=verify_session_uid(req)
        if user_id is None:
            return JsonResponse({
                "code":-1
            })
        user_info=UserInfo.objects.filter(user_id=user_id)[0]
        return JsonResponse({
            "user_name":user_info.user_name,
            "user_avator":user_info.user_avatar,
            "vip":user_info.vip, # 0 ： 无vip   1：有vip
            "balance":user_info.balance,
            "vip_expired_time":user_info.vip_expired_time,
            "code":0
        })
    except Exception as e:
        print(e)
        return JsonResponse({"code":1})


@csrf_exempt
def update_other_info(req):
    try:
        user_id=verify_session_uid(req)
        if user_id is None:
            return JsonResponse({
                "code":-1
            })
        content=req.body
        content=json.loads(content.decode('utf-8'))
        user_name=content['user_name']
        UserInfo.objects.filter(user_id=user_id).update(user_name=user_name)
        return JsonResponse({
            "code":0
        })
    except Exception as e:
        print(e)
        return JsonResponse({"code":1})


def getNewName(file_type):
    # 前面是file_type+年月日时分秒
    new_name = time.strftime(file_type+'-%Y%m%d%H%M%S', time.localtime())
    # 最后是5个随机数字
    # Python中的numpy库中的random.randint(a, b, n)表示随机生成n个大于等于a，小于b的整数
    ranlist = np.random.randint(0, 10, 5)
    for i in ranlist:
        new_name += str(i)
    # 返回字符串
    return new_name
@csrf_exempt
def update_avatar(request):
    user_id = verify_session_uid_f(request)
    if user_id is None:
        return JsonResponse({
            "errno": -1
        })
    if os.path.exists('media') is not True:
        os.mkdir('media')
    if os.path.exists('media/avatar') is not True:
        os.mkdir('media/avatar')
    try:
        if request.method == 'POST' and request.FILES['file']:
            uploaded_file = request.FILES['file']
            file_type=uploaded_file.name.split('.')[-1]
            new_name=getNewName('IMG')+'.'+file_type
            with open('media/avatar/'+new_name,'wb') as ff:
                for chunk in uploaded_file.chunks():
                    ff.write(chunk)
            UserInfo.objects.filter(user_id=user_id).update(user_avatar=new_name)
        return JsonResponse({
            "code":0,
            "url":new_name,

        })
    except Exception as e:
        print(e)
        return JsonResponse({
            "code":-1,
        })
@csrf_exempt
def update_password(req):
    try:
        user_id = verify_session_uid_f(req)
        if user_id is None:
            return JsonResponse({
                "errno": -1
            })
        content = req.body
        content = json.loads(content.decode('utf-8'))
        password = content['password']
        UserAccount.objects.filter(user_id=user_id).update(password=password)
        return JsonResponse({
            "code":0
        })
    except Exception as e:
        print(e)
        return JsonResponse({
            "code":1
        })
