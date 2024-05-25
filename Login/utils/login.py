
import psycopg2
from django.http import HttpResponse,JsonResponse
from django.views.decorators.csrf import csrf_exempt
from login.utils.email_verify import verifyEmail
from Dao.UserAccount import UserAccount
from Dao.UserInfo import UserInfo
from django.db.models import Max

@csrf_exempt
def verify_login(request):
    user_id = request.POST.get("user_id")
    password_get = request.POST.get("password")
    try:
        password_true=UserAccount.objects.filter(user_id=user_id)[0].user_password
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

@csrf_exempt
def getUserInfo(req):
    try:
        user_id=req.COOKIES['user_verify']
        user_name=UserInfo.objects.filter(user_id=user_id)[0].user_name
        print(user_name)
        return JsonResponse({
            "code":0,
            "sname":user_name
        })
    except Exception as e:
        print(e)
        response=JsonResponse(
            {
                'code':1
            }
        )
        response.delete_cookie('user_verify')
        return  response
email_code=""

@csrf_exempt
def send_register_code(req):
    global email_code
    email_code=True
    email_address=req.POST.get("email")
    email_code=verifyEmail(email_address)
    if not email_code:
        return JsonResponse({
            "code":1
        })
    else:
        return JsonResponse({
            "code":0
        })
@csrf_exempt
def send_find_code(req):
    global email_code
    try:
        email_code=True
        email_address=req.POST.get("email")
        sno=req.POST.get("sno")
        v_email=UserAccount.objects.filter(sno=sno)[0].email
        print(v_email)
        if email_address==v_email:
            email_code = verifyEmail(email_address)
            print(email_code)
            if not email_code:
                return JsonResponse({
                    "code":1
                })
            else:

                return JsonResponse({
                    "code":0
                })
        else:
            return JsonResponse({
                "code":2
            })
    except Exception as e:
        print(e)



@csrf_exempt
def verify_register(request):
    try:
        user_id=request.POST.get("user_id")
        password=request.POST.get("password")
        sno=request.POST.get("sno")
        email_code_get=request.POST.get("email_code")
        email=request.POST.get('email')
        if email_code_get==email_code:
            new_user=UserAccount(user_id=user_id,user_password=password,sno=sno,email=email,priority=0)
            new_user.save()
            new_id= UserInfo.objects.all().aggregate(Max('id'))
            print(new_id)
            new_id=new_id['id__max']

            new_user_info=UserInfo(id=new_id+1,user_id=user_id,user_name=sno);
            new_user_info.save()
            return JsonResponse({
                "code":0
            })
        else:
            return JsonResponse({
                "code":2
            })


    except Exception as e:
        print(e)
        return JsonResponse({
            "code":1
        })

@csrf_exempt
def verify_forget_password(request):
    try:
        password=request.POST.get("password")
        sno=request.POST.get("sno")
        email_code_get=request.POST.get("email_code")
        if email_code_get==email_code:
            UserAccount.objects.filter(sno=sno).update(user_password=password)
            return JsonResponse({
                "code":0
            })
        else:
            return JsonResponse({
                "code":2
            })
    except Exception as e:
        print(e)
        return JsonResponse({
            "code":1
        })
