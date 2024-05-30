//此处用于实现功能二：语音信息提取
import { SlateTransforms } from '@wangeditor/editor';

class MyAudioExtractModalMenu {
    constructor(editor) {
        this.editor = editor;
        this.title = '语音信息提取';
        this.tag = 'button';
        this.svgIcon = '';
        this.showModal = true;
        this.modalWidth = 300;
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

    exec() {
        // Modal menu ，这个函数不用写，空着即可
    }

    getModalPositionNode() {
        return null; // modal 依据选区定位
    }

    getModalContentElem(editor) {
        const $content = document.createElement('div');
        const $input = document.createElement('input');
        $input.type = 'file';
        $input.accept = 'audio/*';
        const $button = document.createElement('button');
        $button.textContent = '上传并提取语音信息';

        $content.appendChild($input);
        $content.appendChild($button);

        $button.addEventListener('click', async () => {
            const file = $input.files[0];
            if (file) {
                const formData = new FormData();
                formData.append('file', file);

                try {
                    const response = await fetch('', {
                        method: 'POST',
                        body: formData,
                    });
                    const data = await response.json();
                    const extractedInfo = data.extractedInfo;

                    if (extractedInfo) {
                        const { selection } = editor;
                        if (selection) {
                            //如果有提取到的信息，就将它作为数据结点插入到编辑器中
                            SlateTransforms.insertText(editor, extractedInfo, { at: selection.focus });
                        }
                    }
                } catch (error) {
                    console.error('错误:', error);
                }
            }
        });

        return $content;
    }
}

export default MyAudioExtractModalMenu;
