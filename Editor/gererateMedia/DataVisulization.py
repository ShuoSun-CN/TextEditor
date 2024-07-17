from Editor.utils.LLM.wenxin import RepByEB
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from Editor.utils.InformationTranscription.usedbknowledge import get_knowledge
import json
from Login.verify_session import verify_session_uid
from DAO.UserInfo import UserInfo



def get_html(content):
    state=0
    for id in range(len(content)):
        if content[id]=='{' and state==0:
            state=1
            id1=id
        if content[id]=='}':
            id2=id
    return content[id1:id2+1]

@csrf_exempt
#通用生成模板
def DataVisualization(req):
    data_type = {"bar": "柱状图", "line": "折线图", "pie": "饼状图"}
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
        type=data_type[content['data_type']]
        prompt="有数据如下:"+text+"  请你帮我生成echarts"+type+"，你只需要输出option代码部分回答格式如下：option={option配置}，将配置信息以json格式返回。请你严格按照回答格式回答，禁止回答其他无关紧要的信息。"

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
                ans=get_html(modified)
                break
            except:
                try_times += 1
                continue
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
    except Exception as e:
        #网络错误
        print(e)
        return JsonResponse({
            "code":1,
        })