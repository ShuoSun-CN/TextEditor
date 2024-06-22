import ProgressBar from "@/utils/ProgressBar";
import {SlateTransforms} from "@wangeditor/editor";
import axios from "axios";

class MyOCR {
    constructor(editor) {
        this.editor = editor;
        this.title = '智能OCR';
        this.tag = 'button';
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

    async exec(editor){
        this.editor = editor;
        if(this.isDisabled(editor)){
            return;
        }
        const input  = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async (event) => {
            const file = event.target.files[0];
            if (file) {
                this.progressBar.showProgressBar();
                const formData = new FormData();
                const session_id = localStorage.getItem('session_id');
                formData.append('session_id', session_id);
                formData.append('file', file);
                try {
                    const response = await axios.post('http://127.0.0.1:8000/ocr/', formData, {
                        onUploadProgress: progressEvent => {
                            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                            this.progressBar.updateProgressBar(percentCompleted);
                        }
                    });
                    const data = response.data.data;
                    if (response.data.errno === 0) {
                        const origin_url = data.origin_img_url;
                        const result_url = data.result_img_url;
                        const text_info = data.text_info;
                        this.showPopup(origin_url, result_url, text_info);
                    } else {
                        console.log('图片上传失败');
                    }
                } catch (error) {
                    console.error('图片上传失败:', error);
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

export default MyOCR;
