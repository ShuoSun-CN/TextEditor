from Login.utils.email_verify import  verifyEmail
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from DAO.UserAccount import UserAccount
import json
import hashlib
@csrf_exempt
def send_find_code(request):
    global email_code
    try:
        email_code=True
        content = request.body
        print("forget body: ", content)
        content = json.loads(content.decode('UTF-8'))['user_id']
        email_address = content['email']
        print(email_address)
        user_id=content['user_id']
        v_email=UserAccount.objects.filter(user_id=user_id)[0].email
        #邮箱与申请时的邮箱一致
        print(v_email)
        if email_address==v_email:
            email_code = verifyEmail(email_address)
            print(email_code)
            # 发送验证码失败
            if not email_code:
                return JsonResponse({
                    "code":1
                })
            #邮箱发送验证码成功
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
        content = request.body
        print("forget body:",content)
        content = json.loads(content.decode('UTF-8'))
        user_id = content['user_id']
        password = content['password']
        # 进行 md5码加密
        md = hashlib.md5(password.encode())  # 创建md5对象
        password = md.hexdigest()
        email_code_get = content['emailCode']
        #邮箱验证码正确
        if email_code_get==email_code:
            #update passwords
            UserAccount.objects.filter(user_id=user_id).update(password=password)
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
