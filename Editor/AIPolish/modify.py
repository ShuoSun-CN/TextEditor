from Editor.utils.LLM.wenxin import RepByEB
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import time
import numpy as np
import os
@csrf_exempt
def modify(req):
    content=req.body
    return ({"code":0,"polishedText":""})