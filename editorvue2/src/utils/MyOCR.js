//此处用于实现功能二，OCR信息提取
import {  SlateTransforms } from '@wangeditor/editor';

class MyOCRModalMenu {
    constructor(editor) {
        this.editor = editor;
        this.title = '智能OCR';
        this.tag = 'button';
        this.showModal = true;
        this.modalWidth = 300;
    }
    //下面这几个是官方文档中提供的函数，后期调整编辑器的细节可能会用到
    isActive() {
        return false;
    }
    getValue() {
        return '';
    }
    isDisabled() {
        return false;
    }
    exec() {
    }
    getModalPositionNode() {
        return null; // modal 依据选区定位
    }
    getModalContentElem(editor) {
        const $content = document.createElement('div');
        const $input = document.createElement('input');
        $input.type = 'file';
        $input.accept = 'image/*';
        const $button = document.createElement('button');
        $button.textContent = '上传并提取文字';

        $content.appendChild($input);
        $content.appendChild($button);

        $button.addEventListener('click', async () => {
            const file = $input.files[0];
            if (file) {
                const formData = new FormData();
                formData.append('file', file);

                try {
                    const response = await fetch('https://api.example.com/ocr', {
                        method: 'POST',
                        body: formData,
                    });
                    const data = await response.json();
                    const extractedText = data.extractedText;

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
        });

        return $content;
    }
}

export default MyOCRModalMenu;
