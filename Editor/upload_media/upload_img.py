from django.http import JsonResponse

from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def upload_img(req):
    try:
        file = req.FILES['specialty_image']
        return JsonResponse({
            "error":0,
            "data":{
                "url":"http://127.0.0.1:8000/image/1.jpg",
                "alt":"",
                "href":""
            }

        })
    except Exception as e:
        print(e)
        return JsonResponse({
            "error":1,
            "message":"上传失败，请重试~"
        })

