import axios from "axios";
import {Message} from "element-ui";
import ProgressBar from "@/utils/ProgressBar";

class MindTable {
    constructor(editor) {
        this.title = '智能表格';
        this.tag = 'button';
        this.editor = editor;
        this.progressBar = new ProgressBar();
    }

    // 下拉框的选项
    isActive() {
        return false;
    }

    getValue() {
        return '';
    }

    isDisabled() {
        return false;
    }

    // 点击菜单时触发的函数
    async exec(editor) {
        if (this.isDisabled(editor)) {
            return;
        }
        const text = editor.getText();
        const session_id = localStorage.getItem('session_id');
        const jsondata = {
            session_id: session_id,
            text: text
        };

        if (text) {
            this.progressBar.showProgressBar();
            try {
                const response = await axios.post('http://127.0.0.1:8000/generateTable/', jsondata, {
                    onUploadProgress: progressEvent => {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        this.progressBar.updateProgressBar(percentCompleted);
                    }
                });
                const data = response.data;
                if (data.status === 0) {
                    const polishedText = data.polishedText;
                    Message({
                        showClose: true,
                        message: '成功更新排版！',
                        type: 'success',
                    });
                    editor.setHtml(polishedText);
                } else if(data.code===-2) {
                    Message({
                        showClose: true,
                        message: '星辉不足,请及时充值!',
                        type: 'info',
                    });
                }else if(data.code===-1){
                    Message({
                        showClose: true,
                        message: '登录过期,请重新登录!',
                        type: 'info',
                    });
                }else{
                   Message({
                    showClose: true,
                    message: '处理失败，请稍后再试T_T',
                    type: 'error',
                });
                }
            } catch (error) {
                console.error('文件处理失败2:', error);
                Message({
                    showClose: true,
                    message: '处理失败，请稍后再试T_T',
                    type: 'error',
                });
            } finally {
                this.progressBar.hideProgressBar();
            }
        } else {
            Message({
                showClose: true,
                message: '未识别到有效文本!',
                type: 'error',
            });
        }
    }
}

export default MindTable;
