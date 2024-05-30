import{SlateTransforms} from "@wangeditor/editor";
import axios from 'axios';

class MyOCR {
    constructor(editor) {
        this.editor = editor;
        this.title = '智能OCR';
        this.tag = 'button';
        this.iconSvg = '<svg t="1717034765618" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3828" width="200" height="200"><path d="M755 842c-44.11 0-80-35.89-80-80s35.89-80 80-80 80 35.89 80 80-35.89 80-80 80z m0-96c-8.82 0-16 7.18-16 16s7.18 16 16 16 16-7.18 16-16-7.18-16-16-16z" p-id="3829"></path><path d="M802.17 960a31.98 31.98 0 0 1-17.51-5.22 31.976 31.976 0 0 1-14.19-22.43c-1.05-7.67-7.7-13.45-15.46-13.45s-14.41 5.78-15.46 13.45a31.994 31.994 0 0 1-40.43 26.43c-32.34-9.17-62.26-26.46-86.52-50.01a31.99 31.99 0 0 1 2.64-48.22c6.1-4.74 7.78-13.39 3.9-20.1-3.88-6.72-12.2-9.59-19.37-6.67a32.015 32.015 0 0 1-43.12-21.84c-4.09-16.27-6.16-33.08-6.16-49.94s2.07-33.66 6.16-49.94a32.015 32.015 0 0 1 43.12-21.84c7.16 2.92 15.49 0.05 19.37-6.67 3.88-6.72 2.2-15.36-3.9-20.1a32.024 32.024 0 0 1-12.31-23.51 31.97 31.97 0 0 1 9.67-24.71c24.26-23.54 54.18-40.83 86.52-50.01a31.983 31.983 0 0 1 26.24 4 31.976 31.976 0 0 1 14.19 22.43c1.05 7.67 7.7 13.45 15.46 13.45s14.41-5.78 15.46-13.45a31.994 31.994 0 0 1 40.43-26.43c32.34 9.17 62.26 26.46 86.52 50.01a31.99 31.99 0 0 1-2.64 48.22c-6.1 4.74-7.77 13.39-3.9 20.11 3.88 6.72 12.21 9.59 19.37 6.67a32.015 32.015 0 0 1 43.12 21.84c4.09 16.27 6.16 33.08 6.16 49.94s-2.07 33.66-6.16 49.94a32.015 32.015 0 0 1-43.12 21.84c-7.16-2.92-15.49-0.05-19.37 6.67-3.88 6.72-2.2 15.36 3.9 20.1a32.024 32.024 0 0 1 12.31 23.51 31.97 31.97 0 0 1-9.67 24.71c-24.26 23.54-54.18 40.83-86.52 50.01-2.87 0.81-5.81 1.21-8.73 1.21zM755 854.9c25.85 0 49.28 12.6 63.92 32.26 4.29-2.2 8.46-4.61 12.51-7.24-9.69-22.51-8.89-49.1 4.02-71.47 12.92-22.38 35.55-36.37 59.89-39.23a144.76 144.76 0 0 0 0-14.46c-24.34-2.86-46.96-16.84-59.89-39.23-12.92-22.37-13.72-48.96-4.02-71.47-4.04-2.63-8.22-5.05-12.51-7.24-14.64 19.66-38.07 32.26-63.92 32.26s-49.28-12.6-63.92-32.26c-4.29 2.2-8.46 4.61-12.51 7.24 9.7 22.51 8.89 49.1-4.03 71.47-12.92 22.38-35.55 36.37-59.89 39.23a144.76 144.76 0 0 0 0 14.46c24.34 2.86 46.96 16.84 59.89 39.23 12.92 22.37 13.72 48.96 4.03 71.47 4.04 2.63 8.22 5.05 12.51 7.24 14.64-19.65 38.07-32.26 63.92-32.26zM96 416c-17.67 0-32-14.33-32-32V116c0-28.67 23.33-52 52-52h268c17.67 0 32 14.33 32 32s-14.33 32-32 32H128v256c0 17.67-14.33 32-32 32zM384 960H116c-28.67 0-52-23.33-52-52V640c0-17.67 14.33-32 32-32s32 14.33 32 32v256h256c17.67 0 32 14.33 32 32s-14.33 32-32 32zM928 416c-17.67 0-32-14.33-32-32V128H640c-17.67 0-32-14.33-32-32s14.33-32 32-32h268c28.67 0 52 23.33 52 52v268c0 17.67-14.33 32-32 32z m-20-288h0.01-0.01z" p-id="3830"></path><path d="M314.89 546.04c-64.86-3.11-99.22-39.06-103.13-107.81 4.69-67.97 39.06-104.68 103.13-110.16 63.28 5.47 97.65 42.19 103.13 110.16-4.69 68.76-39.08 104.7-103.13 107.81z m0-38.67c35.93-1.56 55.08-24.61 57.42-69.14-3.13-43.74-22.27-66.8-57.42-69.14-35.94 2.34-54.69 25.4-56.25 69.14 1.56 44.53 20.31 67.58 56.25 69.14zM442.39 438.23c4.69-67.97 39.06-104.68 103.13-110.16 41.4 2.34 62.88 13.29 64.45 32.81-0.79 13.29-6.65 19.92-17.58 19.92-3.92 0-8.99-0.77-15.23-2.34-7.03-3.9-17.58-6.24-31.64-7.03-35.94 2.34-54.69 25.01-56.25 67.97 2.34 42.19 21.09 64.07 56.25 65.63 10.14 0.79 21.09-1.94 32.81-8.2 6.24-3.11 11.32-4.69 15.23-4.69 10.93 0.79 17.58 7.82 19.92 21.09-1.57 21.09-24.22 32.03-67.97 32.81-64.85-3.11-99.22-39.05-103.12-107.81zM649.58 523.78V355.03c-0.79-14.83 6.63-22.65 22.27-23.44h52.73c49.22 0.79 74.21 23.44 75 67.97-1.57 31.26-19.92 50.01-55.08 56.25l50.39 55.08c3.9 3.92 5.86 8.2 5.86 12.89-1.57 14.06-8.99 21.09-22.27 21.09-8.61 0-14.47-1.94-17.58-5.86l-66.8-80.86v65.63c-0.79 14.06-8.2 21.09-22.27 21.09-14.84 0-22.25-7.03-22.25-21.09z m44.53-151.17v52.73h30.47c17.96 0 27.34-8.59 28.13-25.78-0.79-17.18-10.16-26.17-28.13-26.95h-30.47z" p-id="3831"></path></svg>';
        this.showModal = true;
        this.modalWidth = 300;
        this.modelHeight = 300;
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
        try {
            const file = await this.uploadFile();
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.post('https://api.example.com/ocr', formData);
            const extractedText = response.data.extractedText;

            if (extractedText) {
                const { selection } = editor;
                if (selection) {
                    SlateTransforms.insertText(editor, extractedText, { at: selection.focus });
                }
            }
        } catch (error) {
            console.error('Error extracting text:', error);
        }
    }


    getModalPositionNode() {
        return null;
    }

    getModalContentElem(editor) {
        const $content = document.createElement('div');
        const $input = document.createElement('input');
        $input.type = 'file';
        $input.accept = 'image/*';
        const $button = document.createElement('button');
        $button.textContent = '上传';

        $content.appendChild($input);
        $content.appendChild($button);

        $button.addEventListener('click', async () => {
            await this.exec(editor);
        });

        return $content;
    }

    uploadFile() {
        return new Promise((resolve, reject) => {
            const $input = document.createElement('input');
            $input.type = 'file';
            $input.accept = 'image/*';
            $input.onchange = () => {
                const file = $input.files[0];
                if (file) {
                    resolve(file);
                } else {
                    reject(new Error('No file selected.'));
                }
            };
            $input.click();
        });
    }
}

export default MyOCR;
