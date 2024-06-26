import bert_score

cand = ["I have an apple."]
ref = ["I have a pen."]
P, R, F1 = bert_score.score(cand, ref,verbose=True,
                            model_type='bert-large-uncased')  # tensor([0.8176]) tensor([0.8176]) tensor([0.8176])
print(P,R,F1)
