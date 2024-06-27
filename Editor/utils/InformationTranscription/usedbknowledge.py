import json
import random
import bert_score
import torch
def get_knowledge(cand1):
    #设置最大采样时间避免超时
    max_sample=10
    #F1阈值
    F1_thread=0.8
    file_path='transcription/trans.json'
    with open(file_path) as ff:
        content=json.load(ff)
    #设置采样极限大小
    if len(content)>max_sample:
        #超过大小就进行随机取样
        content=random.sample(content,max_sample)
        print(content)

    ref = [_['main'] for _ in content]+[ _['info'] for _ in content ]
    P,R,F1 = bert_score.score([cand1]*len(content)*2,ref,verbose=True,
                                model_type='bert-large-uncased')
    #取出F1 最大值
    id=torch.argmax(F1)
    F1_best=F1[id.item()].item()
    print("最佳匹配F1 score:",F1_best)
    if F1_best>=F1_thread:
        return ref[id]
    return None


