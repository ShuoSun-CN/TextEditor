from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from Login.verify_session import verify_session_uid, verify_session_uid_f
from DAO.UserInfo import UserInfo
from DAO.Text import Text
from DAO.Shared import Shared
import json
from django.db.models import F
@csrf_exempt
def get_user_list_by_id(req):
    try:
        user_id=verify_session_uid(req)
        if user_id is None:
            return JsonResponse({
                "code":-1
            })
        content = req.body
        content = json.loads(content.decode('UTF-8'))
        search_id = content['user_id']
        user_info=UserInfo.objects.filter(user_id=search_id)
        if user_info.exists():
            user_info=user_info[0]
            return JsonResponse({
                "user_id":search_id,
                "user_name":user_info.user_name,
                "user_avator":user_info.user_avatar,
                "code":0
            })
        else:
            return JsonResponse({
                "code":2,
                "message":"没有搜索到该用户!"
            })
    except Exception as e:
        print(e)
        return JsonResponse({"code":1})

@csrf_exempt
def set_priority(req):
    user_id = verify_session_uid(req)
    if user_id is None:
        return JsonResponse({
            "code": -1
        })

    try:
        content = req.body
        content = json.loads(content.decode('UTF-8'))
        file_id = content['file_id']
        shared_id=content['search_id']
        shared_priority=content['priority']
        expired_time=content['expired_time']
        text=Text.objects.filter(file_id=file_id,owner=user_id)
        if text.exists():
            shared=Shared.objects.filter(file_id=file_id,user_id=shared_id)
            if shared.exists():
                shared.update(priority=shared_priority,expired_time=expired_time)
            else:
                shared=Shared(owner=user_id,file_id=file_id,user_id=shared_id,priority=shared_priority,expired_time=expired_time)
                shared.save()
            return JsonResponse({
                "code":0,
            })
        else:
            return JsonResponse({
                "code":2,
                "message":"非法的文件分享！"
            })
    except Exception as e:
        print(e)
        return JsonResponse({
            "code":1,
            "message":"系统故障！"
        })

@csrf_exempt
def get_shared_list_by_id(req):
    user_id = verify_session_uid(req)
    if user_id is None:
        return JsonResponse({
            "code": -1
        })

    try:
        content = req.body
        content = json.loads(content.decode('UTF-8'))
        file_id = content['file_id']
        text=Text.objects.filter(file_id=file_id,owner=user_id)
        if text.exists():
            shared_info=Shared.objects.filter(file_id=file_id,owner=user_id)
            for shared in shared_info:
                user_info=None
    except Exception as e:
        print(e)
        return JsonResponse({
            "code":1,
            "message":"系统故障！"
        })
