from Editor.utils.LLM.wenxin import RepByEB
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from Editor.utils.InformationTranscription.usedbknowledge import get_knowledge
import json
from Login.verify_session import verify_session_uid
from DAO.UserInfo import UserInfo


prompt_prex={
    "typesetting":"请你通过修改标签等方式帮我调整这段HTML代码的排版，不要改变标签内的内容，使其调整后更加美观",
    "polish":"请你帮我修饰这个文本，",
    "translation":"请你帮我用英文翻译这个文本，",
    "summary":"请你帮我为这个文本写一个摘要，",
    "modify":"请你帮我修改这个文本的病句，",
    "continue_write":"请你续写这个文本，"
}


prompt_format={
    "typesetting":'''
回答的格式如下: 回答:{￥{￥{重新排版后的HTML代码}￥}￥}
HTML代码如下:
''',
    "polish":'''
回答的格式如下: 回答:{￥{￥{修饰后的文本}￥}￥}
文本如下:
''',
    "translation":'''
回答的格式如下: 回答:{￥{￥{翻译后的文本}￥}￥}
文本如下:
''',
    "summary":'''
回答的格式如下: 回答:{￥{￥{文本的摘要}￥}￥}
文本如下:
''',
    "modify":'''
回答的格式如下: 回答:{￥{￥{修改后的文本}￥}￥}
文本如下:
''',
    "continue_write":'''
回答的格式如下: 回答:{￥{￥{文本续写内容}￥}￥}
文本如下:
'''
}
def get_html(content):
    state=0
    for id in range(len(content)):
        if content[id]=='<' and state==0:
            state=1
            id1=id
        if content[id]=='>':
            id2=id
    return content[id1:id2+1]
@csrf_exempt
#通用生成模板
def generate_template(req,task):
    try:
        user_id=verify_session_uid(req)
        if user_id is None:
            return JsonResponse({
                "code":-1
            })
        user=UserInfo.objects.filter(user_id=user_id)
        if user[0].stars==0:
            return JsonResponse({
                "code":-2,
                "message":"星辉不足，请及时充值！"
            })
        content=json.loads(req.body)
        text=content['text']
        #知识辅助
        task_prompt=prompt_prex[task]
        if task=="polish" or task=="summary":
            kn=get_knowledge(text)
            if kn is not None:
                task_prompt=task_prompt+"从数据库检索到的相关的知识为："+kn
                task_prompt=task_prompt+"\n如果这和文本内容相关你可以使用其作为辅助，如果不相干请忽略。"



        prompt=prompt_format[task]
        prompt=task_prompt+"请你严格按照以下的回答格式进行回答，回答中的{￥{￥{等分隔符不能省略，不需要进行解释等其他动作"+prompt+text
        ans=""
        print("用户需求如下： \n",prompt)
        #统计尝试修饰次数
        try_times=0
        #设置尝试最大值
        try_max_times=10
        while try_times<try_max_times:
            if try_times>try_max_times:
                break
            response=RepByEB(prompt)
            modified=response[0]
            cost_tokens=response[1]
            print("文心回答:",modified)
            try:
                ans=modified.split("{￥{￥{")[1].split('}￥}￥}')[0]
                break
            except:
                try_times += 1
                continue
        if task=="typesetting":
            ans=get_html(ans)
        #多次尝试失败
        if try_times>try_max_times:

            return JsonResponse({
                "code":2
            })
        #成功修饰
        else:
            user.update(stars=max(user[0].stars-cost_tokens,0))
            return JsonResponse({
                "code":0,
                "polishedText":ans
            })
        return JsonResponse({"status":0,"polishedText":""})
    except Exception as e:
        #网络错误
        print(e)
        return JsonResponse({
            "code":1,
        })


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
@csrf_exempt
def typesetting(req):
    return  generate_template(req,"typesetting")
