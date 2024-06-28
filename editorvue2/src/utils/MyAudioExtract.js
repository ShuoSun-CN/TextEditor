
import ProgressBar from "@/utils/ProgressBar";
import {SlateTransforms} from "@wangeditor/editor";
import axios from "axios";

class MyAudioExtract {
    constructor(editor) {

        this.title = '语音信息提取';
        this.tag = 'button';
        this.iconSvg = '<svg t="1719573854287" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10920" width="200" height="200"><path d="M739.633 544.192c-105.137 0-190.368 84.576-190.368 188.904S634.495 922 739.633 922C844.768 922 930 837.424 930 733.096s-85.232-188.904-190.367-188.904z m0 343.462c-86.023 0-155.756-69.197-155.756-154.558 0-85.361 69.732-154.558 155.756-154.558 86.02 0 155.755 69.197 155.755 154.558 0 85.36-69.734 154.558-155.755 154.558zM416.302 787.442h124.076c-1.751-11.224-2.933-22.635-2.933-34.346H416.302c-9.558 0-17.306 7.689-17.306 17.173 0 9.484 7.748 17.173 17.306 17.173zM832.165 49H261.06C203.712 49 157.223 95.131 157.223 152.038v601.059H88v85.865C88 895.869 134.489 942 191.836 942h482.423c-15.588-9.732-29.895-21.233-42.595-34.346H191.836c-38.231 0-69.224-30.755-69.224-68.692v-51.52h65.836c4.081 0 3.388-7.955 3.388-34.345V152.038c0-37.938 30.994-68.692 69.225-68.692h553.796v457.382c12.022 3.856 23.572 8.722 34.613 14.437v-317.26H936v-85.866C936.001 95.131 889.511 49 832.165 49z m69.222 154.558h-51.918V90.655c27.677 11.305 51.918 34.548 51.918 61.384v51.519zM320.862 753.096h34.612c9.558 0 17.306 7.689 17.306 17.173 0 9.484-7.748 17.173-17.306 17.173h-34.612c-9.558 0-17.306-7.689-17.306-17.173 0-9.484 7.748-17.173 17.306-17.173z" fill="#000000" p-id="10921"></path><path d="M845.308603 856.000125l91.013851 116.492418-32.308441 25.24212-91.013851-116.492418 32.308441-25.24212Z" fill="#000000" p-id="10922"></path><path d="M875.606 699.356c1.635 5.275-1.315 10.878-6.59 12.513-5.275 1.636-10.877-1.314-12.513-6.59-5.415-17.463-8.098-23.433-16.718-36.49-3.043-4.61-1.773-10.812 2.836-13.855 4.61-3.043 10.812-1.773 13.855 2.836 9.743 14.758 13.188 22.425 19.13 41.586z m-43.474-68.858c4.181 3.608 4.645 9.923 1.036 14.104-3.609 4.18-9.924 4.644-14.104 1.035C797.785 627.27 770.7 617 742 617c-5.523 0-10-4.477-10-10s4.477-10 10-10c33.544 0 65.255 12.023 90.132 33.498z" fill="#000000" p-id="10923"></path><path d="M292.827 264h152.346c10.95 0 19.827 8.877 19.827 19.827 0 10.95-8.877 19.826-19.827 19.826H292.827c-10.95 0-19.827-8.876-19.827-19.826 0-10.95 8.877-19.827 19.827-19.827z m0 78.173h152.346c10.95 0 19.827 8.877 19.827 19.827 0 10.95-8.877 19.827-19.827 19.827H292.827C281.877 381.827 273 372.95 273 362c0-10.95 8.877-19.827 19.827-19.827z m0 78.174h152.346c10.95 0 19.827 8.876 19.827 19.826 0 10.95-8.877 19.827-19.827 19.827H292.827c-10.95 0-19.827-8.877-19.827-19.827 0-10.95 8.877-19.826 19.827-19.826z" fill="#000000" p-id="10924"></path><path d="M579.083 264.686L723 292.166C723 187.48 615.717 217.577 539.833 160v353.314s-7.85-13.085-52.333-13.085-78.5 23.554-78.5 65.428C409 590.52 435.167 618 487.5 618c92.892 0 91.583-66.737 91.583-117.771V264.686z" fill="#000000" p-id="10925"></path></svg>';
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
