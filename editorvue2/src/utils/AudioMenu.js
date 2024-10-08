//上传音频
import axios from "axios";
import ProgressBar from "./ProgressBar";
import {Message} from "element-ui";

class AudioMenu {
    constructor(editor) {
        this.title = '上传音频';
        this.tag = 'button';
        this.iconSvg = '<svg t="1719500778743" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5307" width="256" height="256"><path d="M847.644444 1024H150.755556c-48.355556-5.688889-88.177778-42.666667-93.866667-93.866667V93.866667C62.577778 45.511111 102.4 5.688889 150.755556 0h512l278.755555 278.755556v651.377777c-5.688889 51.2-45.511111 88.177778-93.866667 93.866667z m0-745.244444h-139.377777c-25.6-2.844444-42.666667-22.755556-45.511111-45.511112V93.866667H196.266667c-25.6-2.844444-45.511111 17.066667-45.511111 42.666666v748.088889c5.688889 22.755556 22.755556 42.666667 45.511111 45.511111h605.866666c25.6-2.844444 45.511111-22.755556 45.511111-45.511111V278.755556z m-207.644444 560.355555c-65.422222 0-116.622222-51.2-116.622222-116.622222s51.2-116.622222 116.622222-116.622222c25.6 0 51.2 8.533333 71.111111 22.755555v-71.111111h-278.755555V739.555556c-11.377778 62.577778-71.111111 108.088889-136.533334 99.555555-62.577778-11.377778-108.088889-71.111111-96.711111-133.688889 11.377778-62.577778 71.111111-108.088889 133.688889-96.711111 19.911111 2.844444 36.977778 11.377778 51.2 22.755556v-162.133334c0-110.933333 25.6-139.377778 93.866667-139.377777h221.866666c19.911111 0 56.888889 8.533333 56.888889 45.511111v366.933333c-11.377778 51.2-62.577778 96.711111-116.622222 96.711111zM312.888889 651.377778c-39.822222 0-71.111111 31.288889-71.111111 71.111111s31.288889 71.111111 71.111111 71.111111 71.111111-31.288889 71.111111-71.111111-31.288889-71.111111-71.111111-71.111111z m395.377778-278.755556h-233.244445c-54.044444 0-45.511111 93.866667-45.511111 93.866667h278.755556v-93.866667z m-68.266667 278.755556c-39.822222 0-71.111111 31.288889-71.111111 71.111111s31.288889 71.111111 71.111111 71.111111 71.111111-31.288889 71.111111-71.111111c-2.844444-39.822222-34.133333-71.111111-71.111111-71.111111z" fill="#1296db" p-id="5308"></path></svg>';
        this.editor = editor;
        this.progressBar = new ProgressBar();
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
        if (this.isDisabled(editor)) {
            return;
        }

        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'audio/*';
        input.onchange = async (event) => {
            const file = event.target.files[0];
            if (file) {
                this.progressBar.showProgressBar();
                const formData = new FormData();
                const session_id = localStorage.getItem('session_id');
                formData.append('session_id', session_id);
                formData.append('file', file);
                try {
                    const response = await axios.post('http://127.0.0.1:8000/upload_audio/', formData, {
                        onUploadProgress: progressEvent => {
                            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                            this.progressBar.updateProgressBar(percentCompleted);
                        }
                    });
                    const data = response.data;

                    if (data.url) {
                        const url = data.url;
                        Message({
                            showClose: true,
                            message: '成功上传！',
                            type: 'success',
                        });
                        editor.insertNode({
                            type: 'video',
                            src: url,
                            width:900,
                            height:50,
                            children: [{ text: '' }]
                        });
                    } else {
                        Message({
                            showClose: true,
                            message: '音频上传失败，请稍后再试T_T',
                            type: 'error',
                        });
                    }
                } catch (error) {
                    console.error('音频上传失败:', error);
                    Message({
                            showClose: true,
                            message: '音频上传失败，请稍后再试T_T',
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

export default AudioMenu;
