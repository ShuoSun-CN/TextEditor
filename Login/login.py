import psycopg2
from django.http import HttpResponse,JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Max

def verify_login(request):
    user_id = request.POST.get("user_id")
    password_get = request.POST.get("password")
    try:
        password_true=0
    except:
        return JsonResponse(
            {"code":1}
        )
    if password_true==password_get:
        response=JsonResponse({"code":0
        })
        response.set_cookie('user_verify',user_id,60*60*24*10)
        return response
    else:
        return JsonResponse(
            {"code":1}
        )
