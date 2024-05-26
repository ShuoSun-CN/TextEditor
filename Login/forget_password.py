from Login.utils.email_verify import  verifyEmail
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from DAO.UserAccount import UserAccount
@csrf_exempt
def send_find_code(req):
    global email_code
    try:
        email_code=True
        email_address=req.POST.get("email")
        v_email=None
        #邮箱与申请时的邮箱一致
        if email_address==v_email:
            email_code = verifyEmail(email_address)
            print(email_code)
            #邮箱发送验证码成功
            if not email_code:
                return JsonResponse({
                    "code":1
                })
            #发送验证码失败
            else:
                return JsonResponse({
                    "code":0
                })
        #邮箱与申请时的邮箱不一致
        else:
            return JsonResponse({
                "code":2
            })
    except Exception as e:
        print(e)
        return JsonResponse({
            "code":3
        })
@csrf_exempt
def verify_forget_password(request):
    try:
        password=request.POST.get("password")
        user_id=request.POST.get("user_id")
        email_code_get=request.POST.get("email_code")
        #邮箱验证码正确
        if email_code_get==email_code:
            #update passwords
            UserAccount.objects.filter(user_id=user_id).update(user_password=password)
            return JsonResponse({
                "code":0
            })
        #邮箱验证码错误
        else:
            return JsonResponse({
                "code":2
            })
    #其他类型错误
    except Exception as e:
        print(e)
        return JsonResponse({
            "code":1
        })
