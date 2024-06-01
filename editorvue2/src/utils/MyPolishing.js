import axios from 'axios';
import { SlateEditor, SlateElement, SlateTransforms } from "@wangeditor/editor";

class MyPolishing {
    constructor(editor) {
        this.title = 'AI润色';
        this.tag = 'select';
        this.iconSvg = '<svg t="1717035182678" class="icon" viewBox="0 0 1064 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8131" width="200" height="200"><path d="M837.088395 1024l-81.287901-146.267654L609.53284 796.444444l146.267654-81.287901L837.088395 568.888889l81.287901 146.267654 146.267655 81.287901-146.267655 81.287902-81.287901 146.267654z m-56.888889-227.555556l32.489877 16.244939 16.244938 32.553086 16.244938-32.553086 32.553087-16.244939-32.553087-16.244938-16.244938-32.489876-16.244938 32.489876-32.489877 16.244938z m-414.46716 81.287902l-130.022716-235.70963L0 512l235.70963-130.022716 130.022716-235.70963 130.022716 235.70963 227.555555 130.022716-235.709629 130.022716-121.868642 235.70963zM170.666667 512L292.598519 577.106173l64.979753 121.868642L422.621235 577.106173 552.643951 512 430.712099 446.957037 365.732346 325.088395 300.689383 446.893827 170.666667 512.06321z m617.623703-154.421728l-64.979753-113.777778-113.777777-64.979753 113.777777-65.042963L788.22716 0 853.333333 113.777778l113.777778 65.042963-113.777778 64.979753-65.042963 113.777778z" p-id="8132"></path></svg>';
        this.editor = editor;

        // 绑定方法
        this.showProgressBar = this.showProgressBar.bind(this);
        this.hideProgressBar = this.hideProgressBar.bind(this);
        this.showResultPopup = this.showResultPopup.bind(this);
        this.insertText = this.insertText.bind(this);
        this.getProcessedText = this.getProcessedText.bind(this);
    }

    // 下拉框的选项
    getOptions() {
        return [
            { value: 'polish', text: '智能修饰' },
            { value: 'summary', text: '生成摘要' },
            { value: 'continuation', text: '智能续写' },
            { value: 'rewriteSentence', text: '病句改写' },
            { value: 'translate', text: '实时翻译' },
        ];
    }

    // 菜单是否需要激活
    isActive() {
        return false;
    }

    // 获取菜单执行时的 value
    getValue() {
        return 'polish';
    }

    // 菜单是否需要禁用
    isDisabled() {
        return false;
    }

    async exec(editor, value) {
        this.editor = editor;
        const { selection } = this.editor;
        if (selection) {
            const [match] = SlateEditor.nodes(this.editor, {
                match: n => SlateElement.isElement(n),
            });

            if (match) {
                const textToProcess = SlateEditor.string(this.editor, selection);
                let processedText;

                if (value === 'summary') {
                    console.log("执行了摘要撰写功能");
                    const url = 'http://127.0.0.1:8000/summaryText/';
                    processedText = await this.getProcessedText(textToProcess, url);
                } else if (value === 'polish') {
                    console.log("执行了智能润色功能");
                    const url = 'http://127.0.0.1:8000/polishText/';
                    processedText = await this.getProcessedText(textToProcess, url);
                } else if (value === 'rewriteSentence') {
                    console.log("执行修改病句功能");
                    const url = 'http://127.0.0.1:8000/modifyText/';
                    processedText = await this.getProcessedText(textToProcess, url);
                } else if (value === 'continuation') {
                    console.log("执行了续写功能");
                    const url = 'http://127.0.0.1:8000/continue_writeText/';
                    processedText = await this.getProcessedText(textToProcess, url);
                } else if (value === 'translate') {
                    console.log("执行了翻译功能");
                    const url = 'http://127.0.0.1:8000/translateText/';
                    processedText = await this.getProcessedText(textToProcess, url);
                }

                if (processedText) {
                    return processedText;
                //    SlateTransforms.insertText(this.editor, processedText, { at: selection.focus });
                }
            }
        }
    }

    async getProcessedText(text, url) {
        // 显示进度条
        this.showProgressBar();

        try {
            const response = await axios.post(url, { text });
            const data = response.data;

            // 接收到数据就隐藏进度条
            this.hideProgressBar();

            // 处理返回的数据
            if (data.status === 0) {
                if (data.polishedText) {
                    // 显示返回的文本并生成弹窗
                    this.showResultPopup(data.polishedText);
                    return data.polishedText;
                }
                return '处理失败';
            } else if (data.status === 1) {
                return '网络错误';
            } else if (data.status === 2) {
                return '内容违规，请修改后重试';
            }
        } catch (error) {
            console.error('请求错误:', error);
            // 隐藏进度条
            this.hideProgressBar();
            return '请求过程中发生错误';
        }
    }

    showProgressBar() {

        const progressBar = document.createElement('div');
        progressBar.id = 'progressBar';
        progressBar.style.width = '0%';
        progressBar.style.height = '4px';
        progressBar.style.backgroundColor = 'blue';
        document.body.appendChild(progressBar);

        // 模拟进度条加载过程
        let width = 0;
        const interval = setInterval(() => {
            if (width >= 100) {
                clearInterval(interval);
            } else {
                width += 10;
                progressBar.style.width = width + '%';
            }
        }, 100);
    }

    hideProgressBar() {
        // 隐藏并移除进度条
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            progressBar.remove();
        }
    }

    showResultPopup(text) {
        // 创建弹窗
        const popup = document.createElement('div');
        popup.id = 'resultPopup';
        popup.style.position = 'fixed';
        popup.style.left = '50%';
        popup.style.top = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.padding = '20px';
        popup.style.backgroundColor = 'white';
        popup.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
        popup.style.zIndex = 1000;


        // 创建文本区域
        const textArea = document.createElement('textarea');
        textArea.style.width = '300px';
        textArea.style.height = '150px';
        textArea.value = text;

        // 创建插入按钮
        const insertButton = document.createElement('button');
        insertButton.innerText = '插入';
        insertButton.onclick = () => {
            this.insertText(text);
            popup.remove();
        };

        // 将文本区域和按钮添加到弹窗
        popup.appendChild(textArea);
        popup.appendChild(insertButton);

        // 将弹窗添加到文档
        document.body.appendChild(popup);
    }

    insertText(text) {
        //获取插入位置
        const { selection } = this.editor;
        //插入文本
        SlateTransforms.insertText(this.editor, text, { at: selection.focus });
        console.log('插入文本:', text);
    }
}

export default MyPolishing;
