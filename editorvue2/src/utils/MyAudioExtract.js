//此处用于实现功能二：语音信息提取
import { SlateTransforms } from '@wangeditor/editor';

class MyAudioExtract {
    constructor(editor) {
        this.editor = editor;
        this.title = '语音信息提取';
        this.tag = 'button';
        this.iconSvg = '<svg t="1717035053462" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6054" width="200" height="200"><path d="M572.3392 914.0864v-87.552a24.8448 24.8448 0 0 0-24.832-24.832h-71.0016a24.832 24.832 0 0 0-24.832 24.832v87.552a24.832 24.832 0 0 1-24.8448 24.832H218.112a24.8448 24.8448 0 0 0-24.832 24.832v35.4176A24.8448 24.8448 0 0 0 218.112 1024H805.888a24.832 24.832 0 0 0 24.832-24.832v-35.4176a24.832 24.832 0 0 0-24.832-24.832H597.1712a24.8192 24.8192 0 0 1-24.832-24.832z" p-id="6055"></path><path d="M512 866.0992A393.472 393.472 0 0 1 118.528 472.6272a41.6 41.6 0 0 1 83.2 0c0 171.0848 139.1872 310.272 310.272 310.272s310.272-139.1872 310.272-310.272a41.6 41.6 0 0 1 83.2 0 393.4464 393.4464 0 0 1-393.472 393.472zM757.12 361.5104V245.12C757.12 109.7472 647.3728 0 512 0S266.88 109.7472 266.88 245.12v116.3904a15.4368 15.4368 0 0 0 15.488 15.4368h459.3152a15.4368 15.4368 0 0 0 15.4368-15.4368z" p-id="6056"></path><path d="M266.88 419.2512m15.4368 0l459.3664 0q15.4368 0 15.4368 15.4368l0 13.888q0 15.4368-15.4368 15.4368l-459.3664 0q-15.4368 0-15.4368-15.4368l0-13.888q0-15.4368 15.4368-15.4368Z" p-id="6057"></path><path d="M284.0576 506.3168a15.4368 15.4368 0 0 0-15.36 17.2928C283.648 644.7488 386.8416 738.56 512 738.56c125.1584 0 228.416-93.8112 243.2768-214.9504a15.4368 15.4368 0 0 0-15.36-17.2928z" p-id="6058"></path></svg>';
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
                    const data = await response.data;
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

export default MyAudioExtract;
