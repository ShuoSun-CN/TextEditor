from django.http import JsonResponse
from  Login.verify_session import verify_session_uid_f
from django.views.decorators.csrf import csrf_exempt
import time
import numpy as np
import os
from Editor.utils.VD.VideoDetection import predict
def getNewName(file_type):
    # 前面是file_type+年月日时分秒
    new_name = time.strftime(file_type+'-%Y%m%d%H%M%S', time.localtime())
    # 最后是5个随机数字
    # Python中的numpy库中的random.randint(a, b, n)表示随机生成n个大于等于a，小于b的整数
    ranlist = np.random.randint(0, 10, 5)
    for i in ranlist:
        new_name += str(i)
    # 返回字符串
    return new_name
@csrf_exempt
def video_detection(request):
    user_id = verify_session_uid_f(request)
    if user_id is None:
        return JsonResponse({
            "errno": -1
        })
    if os.path.exists('media') is not True:
        os.mkdir('media')
    if os.path.exists('media/video') is not True:
        os.mkdir('media/video')
    try:
        if request.method == 'POST' and request.FILES['file']:
            uploaded_file = request.FILES['file']
            file_type=uploaded_file.name.split('.')[-1]
            new_name=getNewName('VID')+'.'+file_type
            with open('media/video/'+new_name,'wb') as ff:
                for chunk in uploaded_file.chunks():
                    ff.write(chunk)
        results=predict('media/video/'+new_name)[0]['topk_class']
        return JsonResponse({
            "errno":0,
            "data":{
                "results":results,
                "poster":""
            }
        })
    except Exception as e:
        print(e)
        return JsonResponse({
            "errno":1,
            "message":"上传失败，请重试~"
        })

