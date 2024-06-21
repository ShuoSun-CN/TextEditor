from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from Login.verify_session import verify_session_uid_f
import os
import time
import numpy as np
import traceback
from Editor.utils.OCR.predict_det import OCRforPic
@csrf_exempt
def getNewName(file_type):
    # 前面是file_type+年月日时分秒
    new_name = time.strftime(file_type + '-%Y%m%d%H%M%S', time.localtime())
    # 最后是5个随机数字
    # Python中的numpy库中的random.randint(a, b, n)表示随机生成n个大于等于a，小于b的整数
    ranlist = np.random.randint(0, 10, 5)
    for i in ranlist:
        new_name += str(i)
    # 返回字符串
    return new_name

@csrf_exempt
def ocr(request):
    user_id = verify_session_uid_f(request)
    if user_id is None:
        return JsonResponse({
            "errno": -1
        })
    if os.path.exists('media') is not True:
        os.mkdir('media')
    if os.path.exists('media/image') is not True:
        os.mkdir('media/image')
    try:
        if request.method == 'POST' and request.FILES['file']:
            uploaded_file = request.FILES['file']
            file_type = uploaded_file.name.split('.')[-1]
            new_name = getNewName('IMG') + '.' + file_type
            with open('media/image/' + new_name, 'wb') as ff:
                for chunk in uploaded_file.chunks():
                    ff.write(chunk)

        #进行OCR提取，提取的结果如下
        # img_result="1.jpg"
        # txt_result="提取成功，提取的信息为。。。"
        img_result,txt_result=OCRforPic('media/image/' + new_name)
        return JsonResponse({
            "errno": 0,
            "data": {
                "origin_img_url":"http://127.0.0.1:8000/image/" +new_name,
                "result_img_url": "http://127.0.0.1:8000/image/" + img_result,
                "text_info":txt_result,
                "alt": "",
                "href": ""
            }
        })
    except Exception as e:
        traceback.print_exc()
        return JsonResponse({
            "errno": 1,
            "message": "上传失败，请重试~"
        })

