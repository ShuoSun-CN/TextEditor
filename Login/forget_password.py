from utils.email_verify import  verifyEmail
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
@csrf_exempt
def send_find_code(req):
    global email_code
    try:
        email_code=True
        email_address=req.POST.get("email")
        v_email=None
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
def verify_forget_password(request):
    try:
        password=request.POST.get("password")
        sno=request.POST.get("sno")
        email_code_get=request.POST.get("email_code")
        if email_code_get==email_code:
            #update passwords
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
