import{SlateTransforms} from "@wangeditor/editor";
import axios from 'axios';

class MyOCRModalMenu {
    constructor(editor) {
        this.editor = editor;
        this.title = '智能OCR';
        this.tag = 'button';
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

export default MyOCRModalMenu;
