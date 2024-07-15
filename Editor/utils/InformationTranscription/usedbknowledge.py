import json
import random
import bert_score
import torch
from nltk.translate.bleu_score import sentence_bleu
import jieba
import nltk
nltk.download('punkt')
def tokenize_mixed_sentence(sentence):
    # 使用jieba对中文部分进行分词
    words = jieba.cut(sentence)
    # 使用nltk对结果进一步处理，确保中英文单词分开
    tokens = []
    for word in words:
        if word.isascii():  # 如果是英文单词或标点符号
            tokens.extend(nltk.word_tokenize(word))
        else:  # 如果是中文
            tokens.append(word)
    return tokens

def get_knowledge(cand1):
    #设置最大采样时间避免超时
    max_sample=10
    #F1阈值
    F1_thread=0.8

    bleu_threshold=0.8

    file_path='transcription/trans.json'
    with open(file_path) as ff:
        content=json.load(ff)
        content2=content
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
    else:
        cand1tokens=tokenize_mixed_sentence(cand1)
        for c in content2:
            c1=tokenize_mixed_sentence(c['main'])
            c2=tokenize_mixed_sentence(c['info'])
            if sentence_bleu([cand1tokens],c1,(0.7,0.2,0.1,0))>=bleu_threshold or sentence_bleu([cand1tokens],c2,(0.7,0.2,0.1,0)):
                return c['info']
    return None

