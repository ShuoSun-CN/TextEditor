//智能表格
import axios from 'axios';
import {SlateEditor, SlateElement} from "@wangeditor/editor";
import {Message} from "element-ui";
import ProgressBar from "@/utils/ProgressBar";

class MindTable {
    constructor(editor) {
        this.title = '智能表格';
        this.tag = 'button';
        this.editor = editor;
        this.progressBar = new ProgressBar();
    }
    // 菜单是否需要激活
    isActive() {
        return false;
    }

    // 获取菜单执行时的 value
    getValue() {
        return '';
    }

    // 菜单是否需要禁用
    isDisabled() {
        return false;
    }

    async exec(editor) {
        this.editor = editor;
        const {selection} = this.editor;
        if (selection) {
            const [match] = SlateEditor.nodes(this.editor, {
                match: n => SlateElement.isElement(n),
            });
            //选中需要处理的文段
            if (match) {
                const textToProcess = SlateEditor.string(this.editor, selection);
                const session_id = localStorage.getItem('session_id');
                const jsondata = {session_id, text: textToProcess};
                const url = 'http://127.0.0.1:8000/generateTable/';
                this.progressBar.showProgressBar();
                try {
                    const response = await axios.post(url, jsondata, {
                        onUploadProgress: progressEvent => {
                            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                            this.progressBar.updateProgressBar(percentCompleted);
                        }
                    });
                    const data = response.data;
                    if (data.code === 0 && data.polishedText) {
                        let html = this.editor.getHtml();
                        html = html + data.polishedText;
                        this.editor.setHtml(html);
                        Message({
                            showClose: true,
                            message: '成功获取表格！',
                            type: 'success',
                        });
                    }else if(data.code===-2) {
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
                    console.error('请求错误:', error);
                    Message({
                        showClose: true,
                        message: '处理失败，请稍后再试T_T',
                        type: 'error',
                    });
                } finally {
                    this.progressBar.hideProgressBar();
                }
            }
        } else {
            Message({
                showClose: true,
                message: '请选中需要处理的文字！',
                type: 'error',
            });
        }
    }
}

export default MindTable;
