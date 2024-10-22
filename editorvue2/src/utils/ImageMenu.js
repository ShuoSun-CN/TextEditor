//上传图片
import axios from "axios";
import ProgressBar from "./ProgressBar";
import { Message } from "element-ui"; // 确保从 element-ui 引入 Message

class ImageMenu {
    constructor(editor) {
        this.title = '上传图片'; // 鼠标悬浮显示
        this.tag = 'button';
        this.iconSvg = '<svg t="1719460023387" class="icon" viewBox="0 0 1192 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4548" width="256" height="256"><path d="M1096.089 0H95.929A95.929 95.929 0 0 0 0 95.929v832.142a95.929 95.929 0 0 0 95.929 93.658h1000.16a95.929 95.929 0 0 0 95.929-93.658V95.929A95.929 95.929 0 0 0 1096.088 0zM938.856 517.676a47.68 47.68 0 0 0-56.763 0L674.91 657.313 380.31 290.058a47.68 47.68 0 0 0-70.385 0L95.929 507.459V95.929h1000.16v487.024z" fill="#5E5C5C" p-id="4549"></path><path d="M843.494 194.129a134.528 134.528 0 1 0 134.528 134.527A134.528 134.528 0 0 0 843.494 194.13z m0 170.288a38.599 38.599 0 1 1 38.6-38.599 38.599 38.599 0 0 1-38.6 40.87z" fill="#5E5C5C" p-id="4550"></path></svg>';
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
        input.accept = 'image/*'; // 改为接受图片
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
                    const data = response.data.data;

                    if (data.url) {
                        const url = data.url;
                        Message({
                            showClose: true,
                            message: '成功上传！',
                            type: 'success',
                        });
                        editor.insertNode({
                            type: 'image',
                            src: url,
                            children: [{text: ''}]
                        });
                    } else {
                        Message({
                            showClose: true,
                            message: '图片上传失败，请稍后再试T_T',
                            type: 'error',
                        });
                    }
                } catch (error) {
                    console.error('图片上传失败:', error);
                    Message({
                        showClose: true,
                        message: '图片上传失败，请稍后再试T_T',
                        type: 'error',
                    });
                } finally {
                    this.progressBar.hideProgressBar();
                }
            }
        };
        input.click();
    }
}

export default ImageMenu;
