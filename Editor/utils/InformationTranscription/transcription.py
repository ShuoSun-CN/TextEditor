from Editor.utils.LLM.wenxin import RepByEB
import json
import os
prompt_prefix='''
现有提取的信息如下，请你告诉我这些信息是否是有价值的专业知识且值得保存的知识，注意仅限于专业知识，如科学，金融等。如果有请你将其整合成为有用的知识，并用一句话表达该知识的关键信息，如果无请回答无。
你需要严格按照以下格式回答,不需要做解释。
回答格式如下：
是否有价值:{￥{￥{有或者无}￥}￥}，整合的知识:{￥{￥{整合后的知识}￥}￥}，关键信息:{￥{￥{关键信息}￥}￥}
提取的信息如下：
'''
def transcript(info):
    prompt=prompt_prefix+info
    #尝试次数
    try_times=0
    #设置尝试最大值
    try_max_times=10
    while try_times<try_max_times:
        modified=RepByEB(prompt)
        try:
            content=modified.split('{￥{￥{')
            #提取是否有价值
            value=content[1].split('}￥}￥}')[0]
            print("文心回答:",modified)
            print("是否有价值:",value)
            if value=="有" or value=="无":
                if value == "有":
                    info=content[2].split('}￥}￥}')[0]
                    main_info=content[3].split('}￥}￥}')[0]
                    print("整合信息:",info)
                    print("关键信息:",main_info)

                    # 定义路径
                    file_path = 'transcription/trans.json'
                    dir_path = os.path.dirname(file_path)
                    if not os.path.exists(dir_path):
                        # 如果目录不存在，则创建目录
                        os.makedirs(dir_path)
                    # 如果文件存在，则读取文件内容
                    if os.path.exists(file_path):
                        with open(file_path) as ff:
                            ff_content = ff.read()
                        ff_content=json.loads(ff_content)
                    else:
                        ff_content=[]
                    ff_content.append({"main":main_info,"info":info})
                    with open(file_path,'w') as ff:
                        json.dump(ff_content,ff)
                break

        except Exception as e:
            try_times+=1
            print(e)
            continue
