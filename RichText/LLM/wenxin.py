import erniebot
erniebot.api_type = 'aistudio'
erniebot.access_token = '78915178d271f128773469e4d074aec0eccdb8ad'
history=[]
def RepByEB(content,history=None,model='ernie-3.5'):
    #使用历史
    if history is not None:
       message=history+[{
         'role': 'user',
         'content': content
        }]
    #不使用历史记录
    else:
       message =[{
      'role': 'user',
      'content': content
     }]
    response = erniebot.ChatCompletion.create(
     model=model,
     messages=message)
    #保存新的历史
    if history is not None:
        history.append({'role': 'user',
          'content': content})
        history.append(
         {
          'role': 'assistant',
          'content':response.get_result()
         }
        )
    return response.get_result()
while(1):
    a=input()
    if a=='q':
        break;
    print(RepByEB(a,history))