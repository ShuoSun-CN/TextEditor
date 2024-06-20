import axios from "axios";
import ProgressBar from "./ProgressBar";
class VideoMenu {
    constructor(editor) {
        this.title = '插入视频';
        this.tag = 'button';
        this.iconSvg = '<svg viewBox="0 0 1024 1024"><path d="M981.184 160.096C837.568 139.456 678.848 128 512 128S186.432 139.456 42.816 160.096C15.296 267.808 0 386.848 0 512s15.264 244.16 42.816 351.904C186.464 884.544 345.152 896 512 896s325.568-11.456 469.184-32.096C1008.704 756.192 1024 637.152 1024 512s-15.264-244.16-42.816-351.904zM384 704V320l320 192-320 192z"></path></svg>';
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
                    console.log(data);
                    console.log(data.url);

                    if (data.url) {
                        const url = data.url;
                        editor.insertNode({
                            type: 'video',
                            src: url,
                            children: [{ text: '' }]
                        });

                        console.log('视频上传成功');
                    } else {
                        console.error('视频上传失败,无法解析url');
                    }
                } catch (error) {
                    console.error('视频上传失败:', error);
                } finally {
                    this.progressBar.hideProgressBar();
                }
            }
        };
        input.click();
    }
}

export default VideoMenu;
