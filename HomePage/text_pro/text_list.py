from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from Login.verify_session import verify_session_uid
from DAO.Text import Text
import json

@csrf_exempt
def filelist(req):
    try:
        user_id=verify_session_uid(req)
        if user_id is None:
            return JsonResponse({
                "code":-1
            })
        texts=Text.objects.filter(owner=user_id).order_by('-update_time')
        re_texts=json.dumps([ _.get_dict() for _ in texts])
        result={
            "code":0,
            "text_list":re_texts
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

@csrf_exempt
def get_recent_file_list(req):
    try:
        user_id=verify_session_uid(req)
        if user_id is None:
            return JsonResponse({
                "code":-1
            })
        texts=Text.objects.filter(owner=user_id).order_by('-update_time')
        re_texts=json.dumps([ _.get_dict() for _ in texts])
        result={
            "code":0,
            "text_list":re_texts
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