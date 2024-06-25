from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from Login.verify_session import verify_session_uid
from DAO.Text import Text
from DAO.Shared import Shared
from datetime import datetime


@csrf_exempt
def get_file(req):
    try:
        user_id = verify_session_uid(req)
        if user_id is None:
            return JsonResponse({
                "code": -1
            })
        content = req.body
        content = json.loads(content.decode('UTF-8'))
        text_id = content['text_id']
        text_db = Text.objects.filter(file_id=text_id)
        if not text_db.exists():
            return JsonResponse({
                "code": 2,
                "message": "文件不存在，非法的文件访问！"
            })
        txt_access = 0
        if text_db[0].owner == user_id:
            txt_access = 1
        else:
            text_shared = Shared.objects.filter(file_id=text_id)
            for ts in text_shared:
                if ts.user_id == user_id:
                    now_time_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                    expired_time = ts.expired_time.strftime("%Y-%m-%d %H:%M:%S")
                    if expired_time > now_time_str:
                        txt_access = 1
                        break
                    else:
                        return JsonResponse({
                            "code": 3,
                            "message": "您对该文件的访问权限已经过期，如需继续访问请联系文件作者！"
                        })
        if txt_access == 0:
            return JsonResponse({
                "code": 4,
                "message": "没有权利访问该文件！"
            })
        with open('txt/' + text_id + '.txt', 'r') as ff:
            result = ff.read()
        return JsonResponse({
            "code": 0,
            "text_content": result
        })
    except Exception as e:
        print(e)
        return JsonResponse({
            "code": 1
        })
