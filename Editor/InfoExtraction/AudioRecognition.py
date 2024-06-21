from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from Login.verify_session import verify_session_uid_f
import time
import numpy as np
import os
import paddle
from Editor.utils.AudioRecgnition.AudRec import asr_executor
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
def audio_recognition(request):
    user_id = verify_session_uid_f(request)
    if user_id is None:
        return JsonResponse({
            "errno": -1
        })
    if os.path.exists('media') is not True:
        os.mkdir('media')
    if os.path.exists('media/audio') is not True:
        os.mkdir('media/audio')
    try:
        if request.method == 'POST' and request.FILES['file']:
            uploaded_file = request.FILES['file']
            file_type=uploaded_file.name.split('.')[-1]
            new_name=getNewName('AUD')+'.'+file_type
            with open('media/audio/'+new_name,'wb') as ff:
                for chunk in uploaded_file.chunks():
                    ff.write(chunk)

        #进行语音识别
        result_txt = asr_executor(
            model='conformer_talcs',
            lang='zh_en',
            codeswitch=True,
            sample_rate=16000,
            config=None,
            ckpt_path=None,
            audio_file='media/audio/'+new_name,
            force_yes=False,
            device=paddle.get_device())

        #result_txt="语音识别成功"


        return JsonResponse({
            "errno":0,
            "data":{
                "aud_url":"http://127.0.0.1:8000/audio/"+new_name,
                "txt_info":result_txt
            }
        })
    except Exception as e:
        print(e)
        return JsonResponse({
            "errno":1,
            "message":"上传失败，请重试~"
        })

