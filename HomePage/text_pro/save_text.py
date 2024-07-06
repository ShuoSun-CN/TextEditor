from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from DAO.Text import Text
from DAO.Shared import Shared
import json
import time
import numpy as np
from  DAO.Session import Session
from datetime import datetime
from Login.verify_session import verify_session_uid
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
def save_file(req):
    try:
        uid=verify_session_uid(req)
        if uid is None:
            return JsonResponse({
                "code":-1
            })
        content = req.body
        content = json.loads(content.decode('UTF-8'))
        # 保存文档的文件名和文件内容
        text_id = content['text_id']
        text_content = content['text_content']
        text_name=content['file_name']
        #print(file_content)
        update_time=datetime.now()
        text=Text.objects.filter(file_id=text_id)
        #从两个数据库中查找是否存在用户可以进行储存
        exits=False
        #检查文件是否存在
        if text.exists():
            #如果是本人操作就直接通过
            if text[0].owner==uid:
                text.update(update_time=update_time,file_name=text_name)
                exits=True
            #如果不是本人操作需要进行分享权利的验证
            else:
                users=Shared.objects.filter(file_id=text_id)
                if users.exists():
                    for user in users:
                        #首先验证是否分享给了这个ID，其次验证是否有写入权利
                        if user.user_id==uid and user.priority==1:
                            text.update(update_time=update_time, file_name=text_name)
                            exits=True
                            break
        else:
            return JsonResponse({
                "code": 3,
                "message":"文件不存在,或已被删除"
            })
        #存在写入权利才可以进行写入
        if exits:
            with open('txt/' + text_id+'.txt', 'w') as ff:
                ff.write(text_content)
            return JsonResponse({
            "code":0
        })
        else:
            return JsonResponse({"code":2,"message":"没有权利进行保存"})
    except Exception as e:
        print(e)
        return JsonResponse(
            {
                "code":1
            }
        )
