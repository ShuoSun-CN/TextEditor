//此处用于实现功能二，视频信息提取
import { SlateTransforms } from '@wangeditor/editor';
import axios from "axios";
import progressBar from "@/utils/ProgressBar";

class MyVideoExtract {
    constructor(editor) {
        this.editor = editor;
        this.title = '视频信息提取';
        this.tag = 'button';
        this.iconSvg = '<svg t="1719573658104" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5362" width="200" height="200"><path d="M1024 910.9H0V49.8h1024v861.1zM29.9 878.4h964.2V82.2H29.9v796.2z" fill="#050101" p-id="5363"></path><path d="M1020.9 716.3H3.1v-472h1017.7v472zM33.1 683.9H991V276.8H33.1v407.1z" fill="#050101" p-id="5364"></path><path d="M111.4 75.4h29.9v174.7h-29.9zM273.5 75.4h29.9v174.7h-29.9zM462.1 75.4H492v174.7h-29.9zM650.8 75.4h29.9v174.7h-29.9zM839.5 75.4h29.9v174.7h-29.9zM111.4 709.5h29.9v174.7h-29.9zM273.5 709.5h29.9v174.7h-29.9zM462.1 709.5H492v174.7h-29.9zM650.8 709.5h29.9v174.7h-29.9zM839.5 709.5h29.9v174.7h-29.9zM471.9 599.2c-7.3 0-14.6-2.1-21.2-6.2-13.3-8.3-21.2-23.2-21.2-39.8V407.5c0-16.6 7.9-31.5 21.2-39.8 13.3-8.3 29.2-8.3 42.4 0l116.4 72.8c13.3 8.3 21.2 23.2 21.2 39.8 0 16.6-7.9 31.5-21.2 39.8L493.1 593c-6.6 4.1-13.9 6.2-21.2 6.2z m0-205.3c-2.9 0-5.2 1.1-6.3 1.9-1.9 1.2-6.3 4.7-6.3 11.7v145.6c0 7.1 4.4 10.6 6.3 11.7 1.9 1.2 6.9 3.5 12.5 0L594.5 492c5.6-3.5 6.3-9.4 6.3-11.8 0-2.3-0.6-8.2-6.3-11.7l-116.4-72.8c-2.2-1.3-4.3-1.8-6.2-1.8z" fill="#050101" p-id="5365"></path></svg>';
        this.progressBar = new progressBar();
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
        input.accept = 'video/!*';
        input.onchange = async (event) => {
            const file = event.target.files[0];
            if (file) {
                this.progressBar.showProgressBar();
                const formData = new FormData();
                const session_id = localStorage.getItem('session_id');
                formData.append('session_id', session_id);
                formData.append('file', file);
                try {
                    const response = await axios.post('http://127.0.0.1:8000/object_detection/', formData, {
                        onUploadProgress: progressEvent => {
                            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                            this.progressBar.updateProgressBar(percentCompleted);
                        }
                    });
                    const data = response.data.data;

                    if (response.data.errno === 0) {
                        const origin_img_url = data.orgin_img_url;
                        const result_img_url = data.result_img_url;
                        const text_info = data.text_info;
                        this.showPopup(origin_img_url,result_img_url, text_info);
                    } else {
                        console.error('上传失败');
                    }
                } catch (error) {
                    console.error('上传失败:', error);
                } finally {
                    this.progressBar.hideProgressBar();
                }
            }
        };
        input.click();
    }

    showPopup(originUrl, resultUrl, textInfo) {
    const popup = document.createElement('div');
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.backgroundColor = 'white';
    popup.style.border = '1px solid #ccc';
    popup.style.padding = '20px';
    popup.style.zIndex = '1000';
    popup.style.width = '700px';
    popup.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    popup.style.borderRadius = '8px';
    popup.style.overflow = 'hidden';

    const closeButton = document.createElement('button');
    closeButton.textContent = 'X';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.background = 'transparent';
    closeButton.style.border = 'none';
    closeButton.style.fontSize = '20px';
    closeButton.style.cursor = 'pointer';
    closeButton.onclick = () => popup.remove();
    popup.appendChild(closeButton);

    const container = document.createElement('div');
    container.style.display = 'grid';
    container.style.gridTemplateColumns = '1fr 2fr';
    container.style.gap = '20px';

    const originImgContainer = document.createElement('div');
    originImgContainer.style.textAlign = 'center';

    const originImgLabel = document.createElement('div');
    originImgLabel.textContent = '原图片';
    originImgContainer.appendChild(originImgLabel);

    const originImg = document.createElement('img');
    originImg.style.maxWidth = '100%';
    originImg.src = originUrl;
    originImgContainer.appendChild(originImg);

    const resultImgContainer = document.createElement('div');
    resultImgContainer.style.textAlign = 'center';

    const resultImgLabel = document.createElement('div');
    resultImgLabel.textContent = '识别后的图片';
    resultImgContainer.appendChild(resultImgLabel);

    const resultImg = document.createElement('img');
    resultImg.style.maxWidth = '100%';
    resultImg.src = resultUrl;
    resultImgContainer.appendChild(resultImg);

    container.appendChild(originImgContainer);
    container.appendChild(resultImgContainer);

    const textContainer = document.createElement('div');
    textContainer.style.marginTop = '20px';

    const textLabel = document.createElement('div');
    textLabel.textContent = '识别后的文本';
    textContainer.appendChild(textLabel);

    const info = document.createElement('div');
    info.style.marginTop = '10px';
    info.style.whiteSpace = 'pre-wrap';
    info.style.border = '1px solid #ccc';
    info.style.padding = '10px';
    info.style.borderRadius = '4px';
    info.textContent = textInfo;
    textContainer.appendChild(info);

    const insertButton = document.createElement('button');
    insertButton.textContent = '插入到光标处';
    insertButton.style.display = 'block';
    insertButton.style.margin = '20px auto 0 auto';
    insertButton.style.padding = '10px 20px';
    insertButton.style.backgroundColor = '#007BFF';
    insertButton.style.color = 'white';
    insertButton.style.border = 'none';
    insertButton.style.borderRadius = '4px';
    insertButton.style.cursor = 'pointer';
    insertButton.style.fontSize = '16px';
    insertButton.style.transition = 'background-color 0.3s';

    insertButton.onmouseover = () => {
        insertButton.style.backgroundColor = '#0056b3';
    };

    insertButton.onmouseout = () => {
        insertButton.style.backgroundColor = '#007BFF';
    };

    insertButton.onclick = () => {
        this.insertText(textInfo);
        popup.remove();
    };

    popup.appendChild(container);
    popup.appendChild(textContainer);
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
        const { selection } = this.editor;
        SlateTransforms.insertText(this.editor, text, { at: selection.focus });
        console.log('插入文本:', text);
    }
}

export default MyVideoExtract;
