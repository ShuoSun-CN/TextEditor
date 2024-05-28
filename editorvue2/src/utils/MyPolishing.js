import { SlateTransforms, SlateEditor, SlateElement } from '@wangeditor/editor';

class MyPolishing {
    constructor(editor) {
        this.title = '智能润色';
        this.tag = 'select';
        this.width = 80;
        this.editor = editor;
    }
    // 下拉框的选项
    getOptions() {
        return [
            { value: 'polish', text: '智能润色' },
            { value: 'summary', text: '生成摘要' },
            { value: 'rewriteSentence', text: '病句改写' },
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

    // 点击菜单时触发的函数
    async exec(value) {
        const editor = this.editor;
        const { selection } = editor;
        if (selection) {
            const [match] = SlateEditor.nodes(editor, {
                match: n => SlateElement.isElement(n),
            });

            if (match) {
                const textToProcess = SlateEditor.string(editor, selection);
                let processedText;

                if (value === 'polish') {
                    console.log("执行了智能润色");
                    processedText = await this.polishText(textToProcess);
                } else if (value === 'summary') {
                    console.log("执行了摘要撰写功能");
                    processedText = await this.generateSummary(textToProcess);
                } else if (value === 'rewriteSentence') {
                    console.log("执行修改病句功能");
                    processedText = await this.rewriteSentence(textToProcess);
                }

                if (processedText) {
                    SlateTransforms.insertText(editor, processedText, { at: selection.focus });
                }
            }
        }
    }

    async polishText(text) {
        // 使用一个假设的润色 API
        const response = await fetch(' ', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text }),
        });
        const data = await response.json();
        return data.polishedText;
    }

    async generateSummary(text) {
        // 使用一个假设的摘要生成 API
        const response = await fetch(' ', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text }),
        });
        const data = await response.json();
        return data.summaryText;
    }

    async rewriteSentence(text) {
        // 使用一个假设的病句改写 API
        const response = await fetch(' ', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text }),
        });
        const data = await response.json();
        return data.rewrittenText;
    }
}

export default MyPolishing;
