from paddlespeech.cli.asr.infer import ASRExecutor
import paddle
audio = "zh.wav"
asr = ASRExecutor()
from paddlespeech.cli.asr import ASRExecutor

asr_executor = ASRExecutor()
text = asr_executor(
    model='conformer_talcs',
    lang='zh_en',
    codeswitch=True,
    sample_rate=16000,
    config=None,
    ckpt_path=None,
    audio_file='./en.wav',
    force_yes=False,
    device=paddle.get_device())
print('ASR Result: \n{}'.format(text))
