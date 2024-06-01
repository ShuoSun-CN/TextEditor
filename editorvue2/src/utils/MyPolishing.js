import axios from 'axios';
import {SlateEditor, SlateElement, SlateTransforms} from "@wangeditor/editor";

class MyPolishing {
    constructor(editor) {
        this.title = '智能润色';
        this.tag = 'select';
        this.iconSvg = '<svg t="1717035182678" class="icon" viewBox="0 0 1064 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8131" width="200" height="200"><path d="M837.088395 1024l-81.287901-146.267654L609.53284 796.444444l146.267654-81.287901L837.088395 568.888889l81.287901 146.267654 146.267655 81.287901-146.267655 81.287902-81.287901 146.267654z m-56.888889-227.555556l32.489877 16.244939 16.244938 32.553086 16.244938-32.553086 32.553087-16.244939-32.553087-16.244938-16.244938-32.489876-16.244938 32.489876-32.489877 16.244938z m-414.46716 81.287902l-130.022716-235.70963L0 512l235.70963-130.022716 130.022716-235.70963 130.022716 235.70963 227.555555 130.022716-235.709629 130.022716-121.868642 235.70963zM170.666667 512L292.598519 577.106173l64.979753 121.868642L422.621235 577.106173 552.643951 512 430.712099 446.957037 365.732346 325.088395 300.689383 446.893827 170.666667 512.06321z m617.623703-154.421728l-64.979753-113.777778-113.777777-64.979753 113.777777-65.042963L788.22716 0 853.333333 113.777778l113.777778 65.042963-113.777778 64.979753-65.042963 113.777778z" p-id="8132"></path></svg>';
        this.editor = editor;
    }

    // 下拉框的选项
    getOptions() {
        return [
            {value: 'summary', text: '生成摘要'},
            {value: 'polish', text: '智能润色'},
            {value: 'continuation', text: '智能续写'},
            {value: 'rewriteSentence', text: '病句改写'},
            {value: 'translate', text: '实时翻译'},
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
        const {selection} = this.editor;
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
                    processedText = await this.getProcessedText(textToProcess,url);
                } else if (value === 'polish') {
                    console.log("执行了智能润色功能");
                    // console.log("获取需要润色的原文："+textToProcess);
                    const url = 'http://127.0.0.1:8000/polishText/';
                    processedText = await this.getProcessedText(textToProcess,url);
                    // console.log("润色后的文本二："+processedText);
                } else if (value === 'rewriteSentence') {
                    console.log("执行修改病句功能");
                    const url ='http://127.0.0.1:8000/modifyText/';
                    processedText = await this.getProcessedText(textToProcess,url);
                } else if (value === 'continuation') {
                    console.log("执行了续写功能");
                    const url ='http://127.0.0.1:8000/continue_writeText/';
                    processedText = await this.getProcessedText(textToProcess,url);
                } else if (value === 'translate') {
                    console.log("执行了翻译功能");
                    const url = 'http://127.0.0.1:8000/translateText/'
                    processedText = await this.getProcessedText(textToProcess,url);
                }

                if (processedText) {
                    SlateTransforms.insertText(this.editor, processedText, {at: selection.focus});
                }
            }
        }
    }

    async getProcessedText(text,url){
        try {
            const response = await axios.post(url, {text});
            const data = response.data;
            //0：成功 1:网络错误,2:是失败
            if (data.status=== 0) {
                const data = response.data;
                if (data.polishedText) {
                    return data.polishedText;
                }
                return '处理失败';
            } else if (data.status === 1) {
                return `网络错误`;
            } else if (data.status === 2) {
                return `内容违规，请修改后重试`;
            }
        } catch (error) {
            console.error('请求错误:', error);
            return '请求过程中发生错误';
        }


    }


}

export default MyPolishing;
