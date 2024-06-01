from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from DAO.Text import Text
import json

@csrf_exempt
def filelist(req):
    try:
        user_id="ss"
        texts=Text.objects.filter(owner=user_id)
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
