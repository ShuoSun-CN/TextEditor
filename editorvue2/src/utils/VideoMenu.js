import axios from "axios";
import ProgressBar from "./ProgressBar";
import { Message } from "element-ui";
class VideoMenu {
    constructor(editor) {
        this.title = '上传视频';
        this.tag = 'button';
        this.iconSvg = '<svg t="1719500635481" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4312" width="200" height="200"><path d="M849.5 962l-675 0c-66.284 0-112.5-46.216-112.5-112.5l0-675c0-66.284 46.216-112.5 112.5-112.5l675 0c66.284 0 112.5 46.216 112.5 112.5l0 675c0 66.284-46.216 112.5-112.5 112.5zM99.5 212l0 75 150 0-72.858-182.135c-46.619 13.532-77.142 53.522-77.142 107.135zM249.5 99.5l75.001 187.5 112.481 0-74.982-187.5-112.5 0zM436.982 99.5l75.018 187.5 112.5 0-75-187.5-112.519 0zM624.5 99.5l75 187.5 112.5 0-75-187.5-112.5 0zM924.5 212c0-66.284-46.216-112.5-112.5-112.5l75.001 187.5 37.499 0 0-75zM924.5 324.5l-824.999 0 0 487.5c0 66.284 46.216 112.5 112.5 112.5l600 0c66.284 0 112.5-46.216 112.5-112.5l0-487.5zM362 437l337.5 187.5-337.5 187.5 0-374.999z" fill="#272636" p-id="4313"></path></svg>';
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
    input.accept = 'video/*';
    input.onchange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            this.progressBar.showProgressBar();
            const formData = new FormData();
            const session_id = localStorage.getItem('session_id');
            formData.append('session_id', session_id);
            formData.append('file', file);
            try {
                const response = await axios.post('http://127.0.0.1:8000/upload_video/', formData, {
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
                        type: 'video',
                        src: url,
                        width:900,
                        height:520,
                        children: [{ text: '' }]
                    });
                } else {
                    Message({
                            showClose: true,
                            message: '视频上传失败，请稍后再试T_T',
                            type: 'error',
                        });
                }
            } catch (error) {
                console.error('视频上传失败:', error);
                Message({
                            showClose: true,
                            message: '视频上传失败，请稍后再试T_T',
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

export default VideoMenu;
