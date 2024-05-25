
from django.http import HttpResponse,JsonResponse
from django.views.decorators.csrf import csrf_exempt
from Login.utils.email_verify import verifyEmail
email_code=""
@csrf_exempt
def verify_register(request):
    try:
        user_id = request.POST.get("user_id")
        password = request.POST.get("password")
        email = request.POST.get('email')
        email_code_get = request.POST.get("email_code")
        if email_code_get == email_code:
            return JsonResponse({
                "code": 0
            })
        else:
            return JsonResponse({
                "code": 2
            })
    except Exception as e:
        print(e)
        return JsonResponse({
            "code": 1
        })
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