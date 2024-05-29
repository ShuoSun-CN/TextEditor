from django.http import JsonResponse

from django.views.decorators.csrf import csrf_exempt
import time
import numpy as np

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
def upload_video(request):
    try:
        if request.method == 'POST' and request.FILES['wangeditor-uploaded-image']:
            uploaded_file = request.FILES['wangeditor-uploaded-video']
            file_type=uploaded_file.name.split('.')[-1]
            new_name=getNewName('VIDEO')+'.'+file_type
            with open('media/video/'+new_name,'wb') as ff:
                for chunk in uploaded_file.chunks():
                    ff.write(chunk)
        return JsonResponse({
            "errno":0,
            "data":{
                "url":"http://127.0.0.1:8000/video/"+new_name,
                "poster":""
            }
        })
    except Exception as e:
        print(e)
        return JsonResponse({
            "errno":1,
            "message":"上传失败，请重试~"
        })

