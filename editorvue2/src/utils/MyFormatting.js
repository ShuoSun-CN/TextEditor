import axios from "axios";

class MyFormatting {
    constructor(editor) {
        this.title = '智能格式排版';
        this.tag = 'button';
        this.editor = editor;
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
        const text = editor.getHtml();
        console.log(text);
        //const text = "<p>111</p>"
        if (text) {
                try {
                    const response = await axios.post('http://127.0.0.1:8000/typesetting/', {text}, {
                    });
                    const data = response.data;
                    if (data.status === 0) {
                        const polishedText = data.polishedText;
                        console.log(polishedText);
                    } else {
                        console.log('文件处理失败1');
                    }
                } catch (error) {
                    console.error('文件处理失败2:', error);
                }
            }
    }
}

export default MyFormatting;
