from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from Login.verify_session import verify_session_uid
from DAO.TokenUse import TokenUse
import json

@csrf_exempt
def get_all_token_usage(req):
    try:
        user_id=verify_session_uid(req)
        if user_id is None:
            return JsonResponse({
                "code":-1
            })
        use_info=TokenUse.objects.filter(user_id=user_id).order_by('-consume_time')
        response=[]
        for i in use_info:
            response.append(i.get_dict())
        return JsonResponse({
            "usage_info":json.dumps(response),
            "code":0
        })
    except Exception as e:
        print(e)
        return JsonResponse({"code":1})

