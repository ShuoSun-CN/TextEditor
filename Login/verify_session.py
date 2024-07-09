import psycopg2
from django.http import HttpResponse,JsonResponse
from django.views.decorators.csrf import csrf_exempt
from DAO.UserAccount import UserAccount
from DAO.Session import Session
import json
import hashlib
from datetime import datetime
import traceback
from Login.utils.get_session_id import get_session_id
@csrf_exempt
def verify_session_re(request):
    try:
        content = request.body
        content = json.loads(content.decode('UTF-8'))
        session_id=content['session_id']
        session=Session.objects.filter(session_id=session_id)
        #检查 session 是否存在
        if session.exists():
            expired_time=session[0].expired_time
            expired_time_str=expired_time.strftime("%Y-%m-%d %H:%M:%S")
            now_time_str=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            #检查 session 是否过期
            if expired_time_str>now_time_str:
                new_expired_time=datetime.now().timestamp()+60*60
                new_expired_time=datetime.fromtimestamp(new_expired_time)
                session.update(expired_time=new_expired_time)
                return JsonResponse({
                    "code":0
                })
    except Exception as e:
        traceback.print_exc()
    #其他情况都返回 -1
    return JsonResponse({
        "code":-1
    })

@csrf_exempt
def verify_session_uid(request):
    try:
        content = request.body
        content = json.loads(content.decode('UTF-8'))
        session_id=content['session_id']
        session=Session.objects.filter(session_id=session_id)
        #检查 session 是否存在
        if session.exists():
            expired_time=session[0].expired_time
            expired_time_str=expired_time.strftime("%Y-%m-%d %H:%M:%S")
            now_time_str=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            #检查 session 是否过期
            if expired_time_str>now_time_str:
                new_expired_time=datetime.now().timestamp()+60*60
                new_expired_time=datetime.fromtimestamp(new_expired_time)
                session.update(expired_time=new_expired_time)
                return session[0].user_id
    except Exception as e:
        traceback.print_exc()

    return None

def verify_session_uid_f(request):
    try:
        session_id = request.POST.get('session_id')
        print(session_id)
        session=Session.objects.filter(session_id=session_id)
        #检查 session 是否存在
        if session.exists():
            expired_time=session[0].expired_time
            expired_time_str=expired_time.strftime("%Y-%m-%d %H:%M:%S")
            now_time_str=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            #检查 session 是否过期
            if expired_time_str>now_time_str:
                new_expired_time=datetime.now().timestamp()+60*60
                new_expired_time=datetime.fromtimestamp(new_expired_time)
                session.update(expired_time=new_expired_time)
                return session[0].user_id
    except Exception as e:
        traceback.print_exc()

    return None

def verify_only_session_uid(session_id):
    try:
        session = Session.objects.filter(session_id=session_id)
        # 检查 session 是否存在
        if session.exists():
            expired_time = session[0].expired_time
            expired_time_str = expired_time.strftime("%Y-%m-%d %H:%M:%S")
            now_time_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            # 检查 session 是否过期
            if expired_time_str > now_time_str:
                new_expired_time = datetime.now().timestamp() + 60 * 60
                new_expired_time = datetime.fromtimestamp(new_expired_time)
                session.update(expired_time=new_expired_time)
                return session[0].user_id
    except Exception as e:
        traceback.print_exc()

    return None