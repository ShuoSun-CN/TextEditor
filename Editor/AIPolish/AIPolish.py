from Editor.utils.LLM.wenxin import RepByEB
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json




prompt_prex={
    "polish":"请你帮我修饰这个文本，",
    "translation":"请你帮我翻译这个文本，",
    "summary":"请你帮我为这个文本写一个摘要，",
    "modify":"请你帮我修改这个文本的病句，",
    "continue_write":"请你续写这个文本，"
}

@csrf_exempt
#通用生成模板
def generate_template(req,task):
    try:
        content=json.loads(req.body)
        text=content['text']
    except Exception as e:
        #网络错误
        print(e)
        return JsonResponse({
            "status":1,
        })
    task_prompt=prompt_prex[task]
    prompt='''
返回的格式如下: Ans:{{修饰后的文本}}
文本如下:
'''
    prompt=task_prompt+prompt+text
    ans=""
    print("用户需求如下： \n",prompt)
    #统计尝试修饰次数
    try_times=0
    #设置尝试最大值
    try_max_times=10
    while try_times<try_max_times:
        modified=RepByEB(prompt)
        print("文心回答:",modified)
        if modified[:6]=="Ans:{{" and modified[-2:]=="}}":
            ans=modified[6:-2]
            break
        try_times+=1
        if try_times>try_max_times:
            break
    #多次尝试失败
    if try_times>try_max_times:

        return JsonResponse({
            "status":2
        })
    #成功修饰
    else:
        return JsonResponse({
            "status":0,
            "polishedText":ans
        })
    return JsonResponse({"status":0,"polishedText":""})

@csrf_exempt
def polish(req):
    return generate_template(req,"polish")
@csrf_exempt
def translation(req):
    return generate_template(req,"translation")
@csrf_exempt
def summary(req):
    return generate_template(req,"summary")
@csrf_exempt
def modify(req):
    return generate_template(req,"modify")
@csrf_exempt
def continue_write(req):
    return generate_template(req,"continue_write")
