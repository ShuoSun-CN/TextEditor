from wenxin import RepByEB,history
import hashlib
password_get="ss"
md = hashlib.md5(password_get.encode())  # 创建md5对象
password_get = md.hexdigest()
print(password_get)
while(1):
    a=input()
    print(RepByEB(a,history))