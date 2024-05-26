
from django.http import HttpResponse,JsonResponse
from django.views.decorators.csrf import csrf_exempt
from Login.utils.email_verify import verifyEmail
from DAO.UserAccount import UserAccount
email_code=""
@csrf_exempt
def verify_register(request):
    try:
        user_id = request.POST.get("user_id")
        password = request.POST.get("password")
        email = request.POST.get('email')
        email_code_get = request.POST.get("email_code")
        #邮箱验证码正确
        if email_code_get == email_code:
            new_user=UserAccount(user_id=user_id,password=password,email=email,priority=0)
            new_user.save()
            return JsonResponse({
                "code": 0
            })
        #邮箱验证码错误
        else:
            return JsonResponse({
                "code": 2
            })
    except Exception as e:
        print(e)
        #其他错误
        return JsonResponse({
            "code": 1
        })
def send_register_code(req):
    global email_code
    email_code=True
    email_address=req.POST.get("email")
    email_code=verifyEmail(email_address)
    #发送验证码成功
    if not email_code:
        return JsonResponse({
            "code":1
        })
    #发送验证码失败
    else:
        return JsonResponse({
            "code":0
        })