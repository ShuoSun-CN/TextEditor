import os

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from Login.verify_session import verify_session_uid
from DAO.Text import Text
from DAO.Shared import Shared
from datetime import datetime
@csrf_exempt
def rename_text(req):
    try:
        user_id = verify_session_uid(req)
        if user_id is None:
            return JsonResponse({
                "code": -1
            })
        content = req.body
        content = json.loads(content.decode('UTF-8'))
        text_id = content['text_id']
        text_name=content['text_name']
        text_db = Text.objects.filter(file_id=text_id)
        if not text_db.exists():
            return JsonResponse({
                "code": 2,
                "message": "文件不存在，非法的文件访问！"
            })
        if text_db[0].owner == user_id:
            text_db.update(file_name=text_name)
            return JsonResponse({
                "code":0,
            })
        else:
            return JsonResponse({
                "code":3,
                "message":"当前用户无权重命名该文件！"
            })

    except Exception as e:
        print(e)
        return JsonResponse({
            "code": 1
        })