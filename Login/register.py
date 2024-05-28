
from django.http import HttpResponse,JsonResponse
from django.views.decorators.csrf import csrf_exempt
from Login.utils.email_verify import verifyEmail
from DAO.UserAccount import UserAccount
import json
import hashlib
email_code=""
@csrf_exempt
def verify_register(request):
    try:
        content = request.body
        print("register body: ",content)
        content = json.loads(content.decode('UTF-8'))
        user_id = content['user_id']
        password = content['password']
        email = content['email']
        email_code_get = content['email_code']
        #邮箱验证码正确

        # 进行 md5码加密
        md = hashlib.md5(password.encode())  # 创建md5对象
        password = md.hexdigest()

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
@csrf_exempt
def send_register_code(request):
    global email_code
    email_code=True
    content = request.body
    content = json.loads(content.decode('UTF-8'))
    email_address = content['email']
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