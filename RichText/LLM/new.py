from wenxin import RepByEB,history
while(1):
    a=input()
    if a=='q':
        print(history)
        break;
    print(RepByEB(a,history))