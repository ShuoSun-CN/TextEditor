import random
import time
import numpy as np
import hashlib
def getNewName():
    # 前面是file_type+年月日时分秒
    t=time.time()
    new_name = str(int(round(t * 1000000)))
    # 最后是5个随机数字
    # Python中的numpy库中的random.randint(a, b, n)表示随机生成n个大于等于a，小于b的整数
    ranlist = np.random.randint(0, 10, 10)
    for i in ranlist:
        new_name += str(i)
    # 返回字符串
    return new_name
def get_session_id(user_id):
    ans=user_id+getNewName()
    ans=list(ans)
    random.shuffle(ans)
    ans=''.join(ans)
    md = hashlib.md5(ans.encode())  # 创建md5对象
    ans = md.hexdigest()
    return ans