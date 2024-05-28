from paddlespeech.cli.asr.infer import ASRExecutor
audio = "zh.wav"
asr = ASRExecutor()
result = asr(audio_file=audio, model='conformer_online_wenetspeech')
print(result)