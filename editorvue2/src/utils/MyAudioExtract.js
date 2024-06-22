
import ProgressBar from "@/utils/ProgressBar";
import {SlateTransforms} from "@wangeditor/editor";
import axios from "axios";

class MyAudioExtract {
    constructor(editor) {

        this.title = '语音信息提取';
        this.tag = 'button';
        this.iconSvg = '<svg t="1717035053462" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6054" width="200" height="200"><path d="M572.3392 914.0864v-87.552a24.8448 24.8448 0 0 0-24.832-24.832h-71.0016a24.832 24.832 0 0 0-24.832 24.832v87.552a24.832 24.832 0 0 1-24.8448 24.832H218.112a24.8448 24.8448 0 0 0-24.832 24.832v35.4176A24.8448 24.8448 0 0 0 218.112 1024H805.888a24.832 24.832 0 0 0 24.832-24.832v-35.4176a24.832 24.832 0 0 0-24.832-24.832H597.1712a24.8192 24.8192 0 0 1-24.832-24.832z" p-id="6055"></path><path d="M512 866.0992A393.472 393.472 0 0 1 118.528 472.6272a41.6 41.6 0 0 1 83.2 0c0 171.0848 139.1872 310.272 310.272 310.272s310.272-139.1872 310.272-310.272a41.6 41.6 0 0 1 83.2 0 393.4464 393.4464 0 0 1-393.472 393.472zM757.12 361.5104V245.12C757.12 109.7472 647.3728 0 512 0S266.88 109.7472 266.88 245.12v116.3904a15.4368 15.4368 0 0 0 15.488 15.4368h459.3152a15.4368 15.4368 0 0 0 15.4368-15.4368z" p-id="6056"></path><path d="M266.88 419.2512m15.4368 0l459.3664 0q15.4368 0 15.4368 15.4368l0 13.888q0 15.4368-15.4368 15.4368l-459.3664 0q-15.4368 0-15.4368-15.4368l0-13.888q0-15.4368 15.4368-15.4368Z" p-id="6057"></path><path d="M284.0576 506.3168a15.4368 15.4368 0 0 0-15.36 17.2928C283.648 644.7488 386.8416 738.56 512 738.56c125.1584 0 228.416-93.8112 243.2768-214.9504a15.4368 15.4368 0 0 0-15.36-17.2928z" p-id="6058"></path></svg>';
        this.editor = editor;
        this.progressBar = new ProgressBar();
        this.insertText = this.insertText.bind(this);
        this.showPopup = this.showPopup.bind(this);
    }

    isActive() {
        return false;
    }

    getValue() {
        return '';
    }

    isDisabled() {
        return false;
    }

    async exec(editor) {
        this.editor  = editor;
        if (this.isDisabled(editor)) {
            return;
        }
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'audio/!*';
        input.onchange = async (event) => {
            const file = event.target.files[0];
            if (file) {
                this.progressBar.showProgressBar();
                const formData = new FormData();
                const session_id = localStorage.getItem('session_id');
                formData.append('session_id', session_id);
                formData.append('file', file);
                try {
                    const response = await axios.post('http://127.0.0.1:8000/audio_recognition/', formData, {
                        onUploadProgress: progressEvent => {
                            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                            this.progressBar.updateProgressBar(percentCompleted);
                        }
                    });
                    const data = response.data.data;

                    if (response.data.errno === 0 && data.aud_url) {
                        const url = data.aud_url;
                        const text_info = data.txt_info;
                        this.showPopup(url, text_info);
                    } else {
                        console.error('音频上传失败');
                    }
                } catch (error) {
                    console.error('音频上传失败:', error);
                } finally {
                    this.progressBar.hideProgressBar();
                }
            }
        };
        input.click();
    }

    showPopup(audioUrl, textInfo) {
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.backgroundColor = 'white';
        popup.style.border = '1px solid #ccc';
        popup.style.padding = '20px';
        popup.style.zIndex = '1000';
        popup.style.width = '400px';
        popup.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';

        const audio = document.createElement('audio');
        audio.controls = true;
        audio.src = audioUrl;

        const info = document.createElement('div');
        info.style.marginTop = '20px';
        info.textContent = textInfo;

        const insertButton = document.createElement('button');
        insertButton.textContent = '插入到光标处';
        insertButton.style.display = 'block';
        insertButton.style.margin = '20px auto 0 auto';
        insertButton.onclick = () => {
            this.insertText(textInfo);
            popup.remove();
        };

        popup.appendChild(audio);
        popup.appendChild(info);
        popup.appendChild(insertButton);

        document.body.appendChild(popup);
        let isDragging = false;
        let offsetX, offsetY;

        popup.onmousedown = (e) => {
            isDragging = true;
            offsetX = e.clientX - popup.getBoundingClientRect().left;
            offsetY = e.clientY - popup.getBoundingClientRect().top;
            document.onmousemove = (e) => {
                if (isDragging) {
                    popup.style.left = `${e.clientX - offsetX}px`;
                    popup.style.top = `${e.clientY - offsetY}px`;
                    popup.style.transform = 'none'; // Disable the initial transform
                }
            };
        };

        document.onmouseup = () => {
            isDragging = false;
            document.onmousemove = null;
    };

    }

    insertText(text) {
        //获取插入位置
        const { selection } = this.editor;
        //插入文本
        SlateTransforms.insertText(this.editor, text, { at: selection.focus });
        console.log('插入文本:', text);
    }
}

export default MyAudioExtract;
