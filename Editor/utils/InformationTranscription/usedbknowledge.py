import json

import bert_score
kn_result=None
file_path='transcription/trans.json'
with open(file_path) as ff:
    content=json.load(ff)

cand1 = [_['main'] for _ in content]
cond2 = [ _['info'] for _ in content ]
print(cand1)
ref = ["通过model_type来指定需要的模型，会自动从huggingface下载，支持的模型有"]
P, R, F1 = bert_score.score(cand1, ref,verbose=True,
                            model_type='bert-large-uncased')  # tensor([0.8176]) tensor([0.8176]) tensor([0.8176])
print(P,R,F1)
