
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from Login.verify_session import verify_session_uid
from DAO.UserInfo import UserInfo
import requests

API_URL = "https://50p1t3ubf1mft4od.aistudio-hub.baidu.com/chat/completions"
headers = {
    # 请前往 https://aistudio.baidu.com/index/accessToken 查看 访问令牌
    "Authorization": "5d53463e8ca09c09c7b88e66bcf267848d1ffea0",
    "Content-Type": "application/json"
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
def query(payload):
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.json()

@csrf_exempt
def generateTable(req):
    try:
        user_id = verify_session_uid(req)
        if user_id is None:
            return JsonResponse({
                "code": -1
            })
        user = UserInfo.objects.filter(user_id=user_id)
        if user[0].stars == 0:
            return JsonResponse({
                "code": -2,
                "message": "星辉不足，请及时充值！"
            })
        content = json.loads(req.body)
        text = content['text']
        prompt=text+"    就该内容生成HTML表格。"
        prompt2={
    "messages": [
        {
            "role": "user",
            "content": prompt
        }
    ]
}
        response = query(prompt2)
        print(response)
        modified = response['result']
        modified =get_html(modified)
        cost_tokens = response['usage']['total_tokens']
        print("文心回答:", modified)
        user.update(stars=max(user[0].stars - cost_tokens, 0))
        return JsonResponse({
                "code": 0,
                "polishedText": modified
            })
    except Exception as e:
        # 网络错误
        print(e)
        return JsonResponse({
            "code": 1,
        })
