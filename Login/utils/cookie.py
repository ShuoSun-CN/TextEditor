import psycopg2
from django.http import HttpResponse,JsonResponse
from django.views.decorators.csrf import csrf_exempt
from login.utils.email_verify import verifyEmail
from Dao.UserAccount import UserAccount
from Dao.UserInfo import UserInfo
from django.db.models import Max

@csrf_exempt
def setCookie(request):
    try:
        key = request.POST.get("key")
        cookie=request.POST.get("cookie")
        response= JsonResponse({
            "code":0
        })
        response.set_cookie(key,cookie,6)
        return response
    except Exception as e:
        print(e)




@csrf_exempt
def getCookie(request):
    try:
        key = request.POST.get("key")
        cookie=request.COOKIE[key]
        response= JsonResponse({
            "cookie":cookie
        });
        return response
    except Exception as e:
        print(e)
