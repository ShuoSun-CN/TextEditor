from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from Login.verify_session import verify_session_uid_f
import os
import time
import numpy as np
from Editor.utils.OBD.infer import OBDforPic
from Editor.utils.LLM.wenxin import RepByEB
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
def object_detection(request):
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

        #进行OBJ提取，提取的结果如下
        txt_result=OBDforPic('media/image/' + new_name)
        prompt="请你将以下英文单词翻译为中文，仍然使用空格作为分隔符,回答的格式如下: 回答:{￥{￥{翻译后的文本}￥}￥}  英文单词如下:"+txt_result
        # 统计尝试修饰次数
        try_times = 0
        # 设置尝试最大值
        try_max_times = 10
        while try_times < try_max_times:
            if try_times > try_max_times:
                break
            response = RepByEB(prompt)
            modified = response[0]
            cost_tokens = response[1]
            print("文心回答:", modified)
            try:
                ans = modified.split("{￥{￥{")[1].split('}￥}￥}')[0]
                break
            except:
                try_times += 1
                continue
        # 多次尝试失败
        if try_times > try_max_times:
            return JsonResponse({
                "errno": 2
            })
        return JsonResponse({
            "errno": 0,
            "data": {
                "origin_img_url":"http://127.0.0.1:8000/image/" +new_name,
                "result_img_url": "http://127.0.0.1:8000/obd_pic/" + new_name,
                "text_info":ans,
                "alt": "",
                "href": ""
            }
        })
    except Exception as e:
        print(e)
        return JsonResponse({
            "errno": 1,
            "message": "上传失败，请重试~"
        })

