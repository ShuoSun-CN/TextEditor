import axios from 'axios';
import {SlateTransforms} from "@wangeditor/editor";

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

            const response = await axios.post('http://127.0.0.1:8000/upload_img/', formData);
            const data = response.data;
            const url =  data.url;

            if (url) {
                const { selection } = this.editor;
                if (selection) {
                    SlateTransforms.insertText(this.editor, url, { at: selection.focus });
                }
            }
        } catch (error) {
            console.error('OCR异常', error);
        }
    }

    getModalPositionNode() {
        return null;
    }

    getModalContentElem(editor) {
        const container = document.createElement('div');
        const inputId = `input-${Math.random().toString(16).slice(-8)}`;
        const buttonId = `button-${Math.random().toString(16).slice(-8)}`;

        const inputContainer = document.createElement('label');
        inputContainer.className = "babel-container";
        inputContainer.innerHTML = `
            <span>Text</span>
            <input type="text" id="${inputId}" value="hello world">
        `;

        const buttonContainer = document.createElement('div');
        buttonContainer.className = "button-container";
        buttonContainer.innerHTML = `
            <button id="${buttonId}">insert text</button>
        `;

        container.appendChild(inputContainer);
        container.appendChild(buttonContainer);

        container.addEventListener('click', (e) => {
            e.preventDefault();

            const text = document.getElementById(inputId).value;
            if (!text) return;

            editor.restoreSelection(); // 恢复选区
            editor.insertText(text);
            editor.insertText(' ');
        });

        setTimeout(() => {
            document.getElementById(inputId).focus();
        });

        return container;
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
                    reject(new Error('No file selected.'));
                }
            };
            input.click();
        });
    }
}

export default MyOCR;
