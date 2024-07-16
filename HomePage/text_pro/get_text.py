from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from Login.verify_session import verify_session_uid
from DAO.Text import Text
from DAO.Shared import Shared
from datetime import datetime
from DAO.RecentFile import RecentFile

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
        write_priority=1

        if not text_db.exists():
            return JsonResponse({
                "code": 2,
                "message": "文件不存在，非法的文件访问！"
            })
        txt_access = 0
        text_name=text_db[0].file_name
        if text_db[0].owner == user_id:
            txt_access = 1
        else:
            text_shared = Shared.objects.filter(file_id=text_id)
            for ts in text_shared:
                if ts.user_id == user_id:
                    if ts.priority==0:
                        write_priority=0
                    txt_access = 1
                    break
        if txt_access == 0:
            return JsonResponse({
                "code": 4,
                "message": "没有权利访问该文件！"
            })
        recent_file=RecentFile.objects.filter(file_id=text_id,user_id=user_id)
        if recent_file.exists():
            recent_file.update(recent_time=datetime.now())
        else:
            recent_file1=RecentFile(file_id=text_id,user_id=user_id,recent_time=datetime.now())
            recent_file1.save()
        with open('txt/' + text_id + '.txt', 'rb') as ff:
            result = ff.read()
        result=result.decode('utf-8',errors='ignore')
        return JsonResponse({
            "code": 0,
            "text_content": result,
            "file_name":text_name,
            "write_priority":write_priority
        })
    except Exception as e:
        print(e)
        return JsonResponse({
            "code": 1
        })
