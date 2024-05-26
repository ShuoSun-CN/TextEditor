import psycopg2
from django.http import HttpResponse,JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Max
from DAO.UserAccount import UserAccount
def verify_login(request):
    user_id = request.POST.get("user_id")
    password_get = request.POST.get("password")
    try:
        password_true=UserAccount.objects.filter(user_id=user_id)[0].password
    #其他类型错误
    except:
        return JsonResponse(
            {"code":1}
        )
    #密码正确
    if password_true==password_get:
        response=JsonResponse({"code":0
        })
        response.set_cookie('user_verify',user_id,60*60*24*10)
        return response
    #密码错误
    else:
        return JsonResponse(
            {"code":1}
        )
