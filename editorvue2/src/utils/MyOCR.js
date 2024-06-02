import axios from 'axios';

class MyOCR {
    constructor(editor) {
        this.editor = editor;
        this.title = '智能OCR';
        this.tag = 'button';
        this.showModal = true;
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

    async exec() {
        try {
            const file = await this.uploadFile();
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.post('http://127.0.0.1:8000/ocr/', formData);
            const data = response.data;
            const result_img_url = data.result_img_url;
            const text_info = data.text_info;

            // Display OCR result in a popup
            const popup = this.createPopup(result_img_url, text_info);
            document.body.appendChild(popup);
        } catch (error) {
            console.error('OCR异常', error);
        }
    }

    createPopup(ocrImage, ocrText) {
        const popup = document.createElement('div');
        popup.classList.add('ocr-popup');

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '关闭';
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(popup);
        });

        const imageElem = document.createElement('img');
        imageElem.src = ocrImage;
        imageElem.style.width = '200px';

        const textElem = document.createElement('div');
        textElem.textContent = ocrText;

        popup.appendChild(closeBtn);
        popup.appendChild(imageElem);
        popup.appendChild(textElem);

        return popup;
    }

    uploadFile() {
        return new Promise((resolve, reject) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = () => {
                const file = input.files[0];
                if (file) {
                    resolve(file);
                } else {
                    reject(new Error('未选择文件.'));
                }
            };
            input.click();
        });
    }
}

export default MyOCR;
