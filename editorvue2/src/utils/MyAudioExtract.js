import ProgressBar from "@/utils/ProgressBar";
import { SlateTransforms } from "@wangeditor/editor";
import axios from "axios";
import {Message} from "element-ui";

class MyAudioExtract {
    constructor(editor) {
        this.title = '提取语音信息';
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
        this.editor = editor;
        if (this.isDisabled(editor)) {
            return;
        }
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'audio/*';
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
                        Message({
                            showClose: true,
                            message: '成功处理！',
                            type: 'success',
                        });
                        this.showPopup(url, text_info);
                    } else {
                        Message({
                            showClose: true,
                            message: '处理失败，请稍后再试T_T',
                            type: 'error',
                        });
                    }
                } catch (error) {
                    console.error('音频上传失败:', error);
                    Message({
                        showClose: true,
                        message: '处理失败，请稍后再试T_T',
                        type: 'error',
                    });
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
        popup.style.padding = '10px 30px 10px 30px';
        popup.style.zIndex = '1000';
        popup.style.width = '400px';
        popup.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        popup.style.borderRadius = '10px';
        popup.style.display = 'flex';
        popup.style.flexDirection = 'column';
        popup.style.alignItems = 'center';

        const header = document.createElement('div');
        header.style.width = '100%';
        header.style.fontSize = '24px';
        header.style.color = '#6991c7';
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.innerText = '提取语音信息';


        const closeButton = document.createElement('button');
        closeButton.textContent = '取消';
        closeButton.style.right = '0px';
        closeButton.innerHTML = '<svg t="1719585155992" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7955" data-spm-anchor-id="a313x.search_index.0.i27.51913a81X37f1O" width="32" height="32"><path d="M455.6 908.1c18.5 2.6 37.2 3.9 56.1 3.9 220.8 0 400.5-179.7 400.5-400.5S732.5 111 511.7 111c-19.1 0-37.8 1.3-56.2 3.9-159.8 60.8-273.4 215.4-273.4 396.5 0.1 181.4 113.7 336 273.5 396.7z" fill="#91B4FF" p-id="7956"></path><path d="M377.3 670.5c-6 0-12.1-2.3-16.7-6.9-9.2-9.2-9.2-24.2 0-33.4l270.7-270.7c9.2-9.2 24.2-9.2 33.4 0s9.2 24.2 0 33.4L394 663.6c-4.6 4.6-10.7 6.9-16.7 6.9z" fill="#3778FF" p-id="7957"></path><path d="M646.3 670.5c-6 0-12.1-2.3-16.7-6.9L358.9 393c-9.2-9.2-9.2-24.2 0-33.4s24.2-9.2 33.4 0L663 630.2c9.2 9.2 9.2 24.2 0 33.4-4.6 4.6-10.7 6.9-16.7 6.9z" fill="#3778FF" p-id="7958"></path><path d="M184.8 805.3c-6.8 0-13.5-2.9-18.2-8.6-13.6-16.4-26.1-34-37.2-52.2-6.8-11.1-3.3-25.7 7.9-32.5 11.1-6.8 25.7-3.3 32.5 7.9 9.9 16.3 21.1 32 33.3 46.7 8.3 10 6.9 24.9-3.1 33.3-4.6 3.6-9.9 5.4-15.2 5.4z" fill="#3778FF" p-id="7959"></path><path d="M511.4 959.3c-93.1 0-182.3-28.3-258-81.8-10.7-7.5-13.2-22.3-5.7-32.9 7.5-10.7 22.3-13.2 32.9-5.7 67.7 47.8 147.5 73.1 230.8 73.1 220.8 0 400.5-179.7 400.5-400.5S732.2 111 511.4 111 111 290.8 111 511.6c0 38.3 5.4 76.2 16.1 112.6 3.7 12.5-3.5 25.6-16.1 29.3-12.6 3.7-25.7-3.5-29.3-16-11.9-40.7-17.9-83.1-17.9-125.9 0-246.9 200.8-447.7 447.7-447.7s447.7 200.8 447.7 447.7c-0.1 246.9-200.9 447.7-447.8 447.7z" fill="#3778FF" p-id="7960"></path></svg>';
        closeButton.style.background = 'transparent';
        closeButton.style.border = 'none';
        closeButton.style.cursor = 'pointer';
        closeButton.onclick = () => popup.remove();

        header.appendChild(closeButton);

        const audioContainer = document.createElement('div');
        audioContainer.style.width = '100%';
        audioContainer.style.justifyContent = 'center';
        audioContainer.style.marginTop = '10px';

        const audioLabel = document.createElement('div');
        audioLabel.textContent = '原音频';
        audioLabel.style.width = '100%';
        audioLabel.style.color = 'white';
        audioLabel.style.textAlign = 'center';
        audioLabel.style.backgroundColor = '#6991c7';
        audioLabel.style.fontWeight = 'bold';
        audioLabel.style.padding = '5px 0';
        audioContainer.appendChild(audioLabel);

        const audio = document.createElement('audio');
        audio.controls = true;
        audio.style.marginTop ='10px';
        audio.src = audioUrl;
        audio.style.width = '100%';

        const infoContainer = document.createElement('div');
        infoContainer.style.marginTop = '20px';
        infoContainer.style.width = '100%';
        infoContainer.style.justifyContent = 'center';

        const infoLabel = document.createElement('div');
        infoLabel.textContent = '识别的文本';
        infoLabel.style.width = '100%';
        infoLabel.style.color = 'white';
        infoLabel.style.textAlign = 'center';
        infoLabel.style.backgroundColor = '#6991c7';
        infoLabel.style.fontWeight = 'bold';
        infoLabel.style.padding = '5px 0';
        infoLabel.style.marginBottom = '10px';
        infoContainer.appendChild(infoLabel);

        const info = document.createElement('div');
        info.textContent = textInfo;
        info.style.marginTop ='10px';
        info.style.whiteSpace = 'pre-wrap';
        info.style.border = '1px solid #ccc';
        info.style.padding = '10px';
        info.style.borderRadius = '4px';
        info.style.backgroundColor = '#f9f9f9';

        const buttonContainer = document.createElement('div');
        buttonContainer.style.marginTop = '20px';
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'space-around';
        buttonContainer.style.width = '100%';

        const insertAudioButton = document.createElement('button');
        insertAudioButton.textContent = '插入音频';
        insertAudioButton.style.display = 'inline-block';
        insertAudioButton.style.padding = '10px 20px';
        insertAudioButton.style.color = 'white';
        insertAudioButton.style.backgroundColor = '#6991c7';
        insertAudioButton.style.border = 'none';
        insertAudioButton.style.borderRadius = '4px';
        insertAudioButton.style.cursor = 'pointer';
        insertAudioButton.style.transition = 'background-color 0.3s';
        insertAudioButton.onclick = () => {
            this.insertAudio(audioUrl);
        };

        const insertTextButton = document.createElement('button');
        insertTextButton.textContent = '插入文本';
        insertTextButton.style.display = 'inline-block';
        insertTextButton.style.padding = '10px 20px';
        insertTextButton.style.color = 'white';
        insertTextButton.style.backgroundColor = '#6991c7';
        insertTextButton.style.border = 'none';
        insertTextButton.style.borderRadius = '4px';
        insertTextButton.style.cursor = 'pointer';
        insertTextButton.style.transition = 'background-color 0.3s';
        insertTextButton.onclick = () => {
            this.insertText(textInfo);
        };

        buttonContainer.appendChild(insertAudioButton);
        buttonContainer.appendChild(insertTextButton);

        popup.appendChild(header);
        audioContainer.appendChild(audio);
        popup.appendChild(audioContainer);
        infoContainer.appendChild(info);
        popup.appendChild(infoContainer);
        popup.appendChild(buttonContainer);

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
                    popup.style.transform = 'none';
                }
            };
        };

        document.onmouseup = () => {
            isDragging = false;
            document.onmousemove = null;
        };
    }

    insertText(text) {
        const {selection} = this.editor;
        if (!selection || !selection.focus) {
            console.error('Selection is invalid or missing focus:', selection);
            Message({
                showClose: true,
                message: '请选择有效的文本插入位置!',
                type: 'error',
            });
            return;
        }
        Message({
            showClose: true,
            message: '插入成功！',
            type: 'success',
        });
        SlateTransforms.insertText(this.editor, text, {at: selection.focus});

    }

    insertAudio(url) {
        Message({
            showClose: true,
            message: '插入成功！',
            type: 'success',
        });
        this.editor.insertNode({
            type:'video',
            src:url,
            width:900,
            height:50,
            children: [{text: ''}]
        })
    }
}

export default MyAudioExtract;
