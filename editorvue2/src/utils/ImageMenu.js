import axios from "axios";
import ProgressBar from "./ProgressBar";
class ImageMenu {
    constructor(editor) {
        this.title = '插入图片'; // 鼠标悬浮显示
        this.tag = 'button';
        this.iconSvg = '<svg viewBox="0 0 1024 1024"><path d="M959.877 128l0.123 0.123v767.775l-0.123 0.122H64.102l-0.122-0.122V128.123l0.122-0.123h895.775zM960 64H64C28.795 64 0 92.795 0 128v768c0 35.205 28.795 64 64 64h896c35.205 0 64-28.795 64-64V128c0-35.205-28.795-64-64-64zM832 288.01c0 53.023-42.988 96.01-96.01 96.01s-96.01-42.987-96.01-96.01S682.967 192 735.99 192 832 234.988 832 288.01zM896 832H128V704l224.01-384 256 320h64l224.01-192z"></path></svg>'; // 菜单图标
        this.editor = editor;
        this.progressBar = new ProgressBar();
    }

    isActive() { // 保持默认
        return false;
    }

    getValue() { // 保持默认
        return '';
    }

    isDisabled() { // 保持默认
        return false;
    }

    async exec(editor) {
        if (this.isDisabled(editor)) {
            return;
        }

        const input = document.createElement('input');
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
                    const response = await axios.post('http://127.0.0.1:8000/upload_img/', formData, {
                        onUploadProgress: progressEvent => {
                            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                            this.progressBar.updateProgressBar(percentCompleted);
                        }
                    });
                    const data = response.data;

                    if (data.url) {
                        const url = data.url;
                        editor.insertNode({
                            type: 'image',
                            src: url,
                            children: [{ text: '' }]
                        });

                        console.log('图片上传成功');
                    } else {
                        console.error('图片上传失败');
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
}

export default ImageMenu;
