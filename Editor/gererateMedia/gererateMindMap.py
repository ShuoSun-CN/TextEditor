
import requests

API_URL = "https://r7q0q9ecq0fbsdh0.aistudio-hub.baidu.com/chat/completions"
headers = {
    # 请前往 https://aistudio.baidu.com/index/accessToken 查看 访问令牌
    "Authorization": "5d53463e8ca09c09c7b88e66bcf267848d1ffea0",
    "Content-Type": "application/json"
}

from Editor.utils.LLM.wenxin import RepByEB
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from Editor.utils.InformationTranscription.usedbknowledge import get_knowledge
import json
from Login.verify_session import verify_session_uid
from DAO.UserInfo import UserInfo
def query(payload):
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.json()
@csrf_exempt
def generateMMap(req):
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
        prompt=text+"  就该内容生成思维导图。回答时，你必须只回答思维导图，不允许存在其他的解释或者代码格式等。"
        prompt2 = {
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        }
        response = query(prompt2)
        modified = response['result']
        cost_tokens = response['usage']['total_tokens']
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
