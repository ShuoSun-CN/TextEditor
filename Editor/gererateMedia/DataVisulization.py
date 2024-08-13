from Editor.utils.LLM.wenxin import RepByEB
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from Editor.utils.InformationTranscription.usedbknowledge import get_knowledge
import json
from Login.verify_session import verify_session_uid
from DAO.UserInfo import UserInfo
from Editor.gererateMedia.DV_template import get_option_by_task

def data_fetch(content):
    content=content.split(']')
    labels=content[0].split('[')[1]
    values=content[1].split('[')[1]
    label_list=eval(labels)
    value_list=eval(values)
    assert len(label_list)==len(value_list),"数据标签和数据数值列表长度不一致"
    return [label_list,value_list]



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
        task=content['data_type']
        prompt="有数据如下:"+text+"  请你将数据格式化，便于我用格式化后的数据进行数据可视化。回答格式如下：标签:[数据标签列表],数值:[数据数值列表] 请你严格按照回答格式回答，禁止回答其他无关紧要的信息。"

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
                ans=data_fetch(modified)
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
                "polishedText":get_option_by_task(ans,task)
            })
    except Exception as e:
        #网络错误
        print(e)
        return JsonResponse({
            "code":1,
        })