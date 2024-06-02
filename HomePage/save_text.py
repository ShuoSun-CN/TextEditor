from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from Login.verify_session import verify_session_uid
from DAO.Text import Text
import json
import time
import numpy as np
from  DAO.Session import Session
import datetime
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
def create_file(req):
    try:
        content = req.body
        content = json.loads(content.decode('UTF-8'))
        session_id = content['session_id']
        session = Session.objects.filter(session_id=session_id)
        # 检查 session 是否存在
        if session.exists():
            content = req.body
            content = json.loads(content.decode('UTF-8'))
            # 保存文档的文件名和文件内容
            file_name = content['text_id']
            file_content = content['text_content']
            update_time=datetime.datetime.now()
            Text.objects.filter(file_id=file_name).update(update_time=update_time)
            with open('txt/' + file_name, 'w') as ff:
                ff.write(file_content)
            expired_time=session[0].expired_time
            expired_time_str=expired_time.strtime("%Y-%m-%d %H:%M:%S")
            now_time_str=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            # 检查 session 是否过期
            if expired_time_str > now_time_str:
                return JsonResponse({
                    "code":-1
                })
            else:
                return JsonResponse({
                    "code":0
                })
        return JsonResponse({
            "code": -1
        })
    except Exception as e:
        print(e)
        return JsonResponse(
            {
                "code":1
            }
        )
