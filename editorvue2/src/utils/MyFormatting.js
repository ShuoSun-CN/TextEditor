// AI排版
import axios from "axios";
import { Message } from "element-ui";
import ProgressBar from "@/utils/ProgressBar";

class MyFormatting {
    constructor(editor) {
        this.title = 'AI排版';
        this.tag = 'select';
        this.editor = editor;
        this.progressBar = new ProgressBar();
    }

    getOptions() {
        return [
            { value: 'format', text: 'AI排版', styleForRenderMenuList: { 'font-size': '13px', 'font-weight': 'bold' } },
            { value: 'jinpaiban', text: '自动分段(清除格式)' },
            { value: 'sonti', text: '大创文书(宋体、小四)' },
            { value: 'fangsong', text: '公文写作(仿宋、三号)' },
            { value: 'times', text: '英文写作(Times New Roman)' },

        ];
    }

    isActive() {
        return false;
    }

    getValue() {
        return 'format';
    }

    isDisabled() {
        return false;
    }

    async exec(editor, value) {
        if (this.isDisabled(editor)) {
            return;
        }
        if(value==='format'){
            Message({
                            showClose: true,
                            message: '请选中具体格式！',
                            type: 'info',
                        });
            return;
        }

        const text = editor.getHtml();
        const session_id = localStorage.getItem('session_id');
        const jsondata = {
            session_id: session_id,
            text: text
        };

        if (text) {
            this.progressBar.showProgressBar();
            try {
                const response = await axios.post('http://127.0.0.1:8000/typesetting/', jsondata, {
                    onUploadProgress: progressEvent => {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        this.progressBar.updateProgressBar(percentCompleted);
                    }
                });
                const data = response.data;
                if (data.code === 0) {
                    let polishedText = data.polishedText;
                    // let polishedText = text;

                    const parser = new DOMParser();
                    const doc = parser.parseFromString(polishedText, 'text/html');
                    const paragraphs = doc.querySelectorAll('p');

                    paragraphs.forEach(p => {
                        // 增加首行缩进
                        p.style.textIndent = '2em';

                        // 修改文本样式为宋体12px
                        if (value === 'sonti') {
                            const span = document.createElement('span');
                            span.style.fontSize = '16px';
                            span.style.fontFamily = '宋体';
                            span.innerHTML = p.innerHTML;
                            p.innerHTML = '';
                            p.appendChild(span);
                        }else if (value === 'fangsong') {

                            const span = document.createElement('span');
                            span.style.fontSize = '22px';
                            span.style.fontFamily = '仿宋';
                            span.innerHTML = p.innerHTML;
                            p.innerHTML = '';
                            p.appendChild(span);
                        }else if (value === 'times') {

                            const span = document.createElement('span');
                            span.style.fontSize = '12px';
                            span.style.fontFamily = 'Times New Roman';
                            span.innerHTML = p.innerHTML;
                            p.innerHTML = '';
                            p.appendChild(span);
                        }
                    });

                    polishedText = doc.body.innerHTML;

                    Message({
                        showClose: true,
                        message: '成功更新排版！',
                        type: 'success',
                    });

                    editor.setHtml(polishedText);
                } else if (data.code === -2) {
                    Message({
                        showClose: true,
                        message: '星辉不足,请及时充值!',
                        type: 'info',
                    });
                } else if (data.code === -1) {
                    Message({
                        showClose: true,
                        message: '登录过期,请重新登录!',
                        type: 'info',
                    });
                } else {
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

export default MyFormatting;
