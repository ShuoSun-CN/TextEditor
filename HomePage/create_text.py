from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from Login.verify_session import verify_session_uid
from DAO.Text import Text
import json
import time
import numpy as np

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
        user_id=verify_session_uid(req)
        if user_id is None:
            return JsonResponse({
                "code":-1
            })
        file_name=getNewName("TXT")
        text=Text(file_id=file_name,file_name="新建在线文档",owner=user_id,shared_write=0)
        text.save()
        with open('txt/'+file_name,'w') as ff:
            ff.write()
        result={
            "code":0,
            "file_id":file_name,
            "file_name":"新建在线文档",
            "owner":user_id,
            "shared_write":0,
        }
        print(result)
        return JsonResponse(result)
    except Exception as e:
        print(e)
        return JsonResponse(
            {
                "code":1
            }
        )
