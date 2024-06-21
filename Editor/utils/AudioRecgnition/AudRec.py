
import paddle
from paddlespeech.cli.asr import ASRExecutor

asr_executor = ASRExecutor()
text = asr_executor(
    model='conformer_talcs',
    lang='zh_en',
    codeswitch=True,
    sample_rate=16000,
    config=None,
    ckpt_path=None,
    audio_file='./zh.wav',
    force_yes=False,
    device=paddle.get_device())

