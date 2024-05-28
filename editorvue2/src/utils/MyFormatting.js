import { SlateTransforms, SlateEditor, SlateElement } from '@wangeditor/editor';


class MyFormatting {
    constructor(editor) {
        this.title = '智能格式排版';
        this.tag = 'select';
        this.width = 80;
        this.editor = editor;
    }

    // 下拉框的选项
    getOptions() {
        return [
            {value: 'autoFormat', text: '自动排版'},
            {value: 'template1', text: '排版模板1'},
            {value: 'template2', text: '排版模板2'},
        ];
    }
    // 菜单是否需要激活
    isActive() {
        return false;
    }

    // 获取菜单执行时的 value
    getValue() {
        return 'autoFormat';
    }

    // 菜单是否需要禁用
    isDisabled() {
        return false;
    }

    // 点击菜单时触发的函数
    async exec(value) {
        const editor = this.editor;
        const {selection} = editor;
        if (selection) {
            const [match] = SlateEditor.nodes(editor, {
                match: n => SlateElement.isElement(n),
            });

            if (match) {
                const textToFormat = SlateEditor.string(editor, selection);
                let formattedText;

                if (value === 'autoFormat') {
                    console.log("执行自动排版");
                    formattedText = await this.autoFormat(textToFormat);
                } else if (value === 'template1') {
                    console.log("使用排版模板1");
                    formattedText = this.applyTemplate1(textToFormat);
                } else if (value === 'template2') {
                    console.log("使用排版模板2");
                    formattedText = this.applyTemplate2(textToFormat);
                }

                if (formattedText) {
                    SlateTransforms.insertText(editor, formattedText, { at: selection.focus });
                }
            }
        }
    }

    async autoFormat(text) {
        return text.toUpperCase(); // 将文本转换为大写作为示例
    }

    applyTemplate1(text) {
        // 应用排版模板1
        return text + ' Template 1';
    }

    applyTemplate2(text) {
        return text + ' Template 2';
    }
}

export default MyFormatting;
