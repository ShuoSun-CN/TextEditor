import psycopg2
from django.http import HttpResponse,JsonResponse
from django.views.decorators.csrf import csrf_exempt
from DAO.UserAccount import UserAccount
from DAO.Session import Session
import json
import hashlib
from datetime import datetime
from Login.utils.get_session_id import get_session_id
@csrf_exempt
def verify_login(request):
    content=request.body
    content=json.loads(content.decode('UTF-8'))
    print("login",request.body)
    user_id = content['user_id']
    password_get = content['password']
    #进行 md5码加密
    md = hashlib.md5(password_get.encode())  # 创建md5对象
    password_get = md.hexdigest()
    try:
        password_true=UserAccount.objects.filter(user_id=user_id)[0].password
    #其他类型错误
    except:
        return JsonResponse(
            {"code":2}
        )
    #密码正确
    if password_true==password_get:
        #获取sesstion_id
        session_id=get_session_id(user_id)
        #查找是否 session_id 是否存在
        sess_ex = Session.objects.filter(user_id=user_id).exists()
        #如不存在则创建一个
        time_now = datetime.fromtimestamp(datetime.now().timestamp()+60*60)
        expired_time=datetime(year=time_now.year,month=time_now.month,day=time_now.day,hour=time_now.hour,minute=time_now.minute,second=time_now.second)
        if not sess_ex:
            session=Session(user_id=user_id,session_id=session_id,expired_time=expired_time)
            session.save()
        #如存在则更新
        else:
            Session.objects.filter(user_id=user_id).update(session_id=session_id,expired_time=expired_time)
        response=JsonResponse({"code":0,
                               "session_id":session_id
        })
        return response

    #密码错误
    else:
        return JsonResponse(
            {"code":1}
        )
