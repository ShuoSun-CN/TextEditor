from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from Login.verify_session import verify_session_uid_f
import time
import numpy as np
import os
import paddle
from Editor.utils.AudioRecgnition.AudRec import asr_executor
from pydub import AudioSegment
import librosa
import soundfile as sf
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
import wave
#判断是否为16位

def is_16bit_16000hz_wav(file_path):
    with wave.open(file_path, 'rb') as wav_file:
        sample_width = wav_file.getsampwidth()
        sample_rate = wav_file.getframerate()
        num_channels = wav_file.getnchannels()
        return sample_width == 2 and sample_rate == 16000 and num_channels == 1
#重新采样为16位
def resample_audio(input_file, output_file, target_sr=16000, target_channels=1):
    # 加载音频文件
    y, sr = librosa.load(input_file, sr=None, mono=False)

    # 如果音频不是单声道，将其转换为单声道
    if target_channels == 1 and y.ndim > 1:
        y = librosa.to_mono(y)

    # 重新采样音频
    y_resampled = librosa.resample(y, orig_sr=sr, target_sr=target_sr)

    # 保存重新采样后的音频文件
    sf.write(output_file, y_resampled, target_sr, 'PCM_16')
def transform2wavecode(new_name,new_name_prefix,file_type):
    try:
        audio = AudioSegment.from_file('media/audio/' + new_name, format=file_type)
        audio.export("media/audio/" + new_name_prefix + '.wav', format='wav')
        return True
    except:
        return False
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
            new_name_prefix=getNewName('AUD')
            new_name=new_name_prefix+'.'+file_type
            with open('media/audio/'+new_name,'wb') as ff:
                for chunk in uploaded_file.chunks():
                    ff.write(chunk)
            #如果不是wav文件进行类型转换
            if not transform2wavecode(new_name,new_name_prefix,file_type):
                return JsonResponse({
                    "code":2,
                    "message":"非法的音频文件格式！"
                })
        #若不是16位则进行重采样
        if not is_16bit_16000hz_wav('media/audio/'+new_name_prefix+'.wav'):
            resample_audio('media/audio/'+new_name_prefix+'.wav','media/audio/'+new_name_prefix+'.wav')
        #进行语音识别
        result_txt = asr_executor(
            model='conformer_talcs',
            lang='zh_en',
            codeswitch=True,
            sample_rate=16000,
            config=None,
            ckpt_path=None,
            audio_file='media/audio/'+new_name_prefix+'.wav',
            force_yes=False,
            device=paddle.get_device())
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

