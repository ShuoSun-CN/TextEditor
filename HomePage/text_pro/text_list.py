from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from Login.verify_session import verify_session_uid
from DAO.Text import Text
import json
from DAO.Shared import Shared
from DAO.RecentFile import RecentFile
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
        recents=RecentFile.objects.filter(user_id=user_id).order_by('-recent_time')
        file_list = []
        for recent in recents:
            text=Text.objects.filter(file_id=recent.file_id)[0]
            file_list.append(text.get_dict())
        re_texts=json.dumps(file_list[:10])
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
def get_shared_text_list(req):
    try:
        user_id = verify_session_uid(req)
        if user_id is None:
            return JsonResponse({
                "code": -1
            })
        shareds = Shared.objects.filter(user_id=user_id)
        file_list = []
        for shared in shareds:
            text=Text.objects.filter(file_id=shared.file_id)[0]
            file_list.append(text.get_dict())
        re_texts = json.dumps(file_list)
        result = {
            "code": 0,
            "text_list": re_texts
        }
        print(result)
        return JsonResponse(result)
    except Exception as e:
        print(e)
        return JsonResponse(
            {
                "code": 1
            }
        )