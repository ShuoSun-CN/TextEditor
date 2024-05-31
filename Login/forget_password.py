from Login.utils.email_verify import  verifyEmail
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from DAO.UserAccount import UserAccount
import json
@csrf_exempt
def send_find_code(request):
    global email_code
    try:
        email_code = True
        content = request.body
        print("forget body: ", content)
        # 将整个JSON对象解析为一个字典
        content = json.loads(content.decode('UTF-8'))
        # 分别获取'user_id'和'email'
        user_id = content['user_id']
        email_address = content['email']
        print(email_address)
        print(user_id)
        v_email = UserAccount.objects.filter(user_id=user_id)[0].email
        #邮箱与申请时的邮箱一致
        print(v_email)
        if email_address == v_email:
            email_code = verifyEmail(email_address)
            print(email_code)
            # 发送验证码失败
            if not email_code:
                return JsonResponse({
                    "code": 1
                })
            #邮箱发送验证码成功
            else:
                return JsonResponse({
                    "code": 0
                })
        #邮箱与申请时的邮箱不一致
        else:
            return JsonResponse({
                "code": 2
            })
    except Exception as e:
        print(e)
        return JsonResponse({
            "code": 3
        })
@csrf_exempt
def verify_forget_password(request):
    try:
        content = request.body
        content = json.loads(content.decode('UTF-8'))
        user_id = content['user_id']
        password = content['password']
        email_code_get = content['email_code']
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
