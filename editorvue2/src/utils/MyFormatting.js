import { SlateTransforms, SlateEditor, SlateElement } from '@wangeditor/editor';
class MyFormatting {
    constructor() {
        this.title = '智能格式排版';
        this.tag = 'select';
        this.editor = null;
    }

    // 下拉框的选项
    getOptions() {
        return [
            { value: 'autoFormat', text: '自动排版' },
            { value: 'template1', text: '排版1' },
            { value: 'template2', text: '排版2' },
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
        if (value === 'autoFormat') {
            console.log("执行自动排版");
            await this.autoFormat();
        } else if (value === 'template1') {
            console.log("使用排版模板1");
            this.applyTemplate1();
        } else if (value === 'template2') {
            console.log("使用排版模板2");
            this.applyTemplate2();
        }
    }

    async autoFormat() {
        if(this.editor){
            const editor = this.editor;

        const nodes = SlateEditor.nodes(editor, {
            at: [],
            match: n => SlateElement.isElement(n),
            universal: true,
        });

        for (const [node, path] of nodes) {
            const isTitle = node.type === 'heading'; // 假设标题节点类型为 'heading'
            if (isTitle) {
                SlateTransforms.setNodes(
                    editor,
                    { style: { fontFamily: '黑体', fontSize: '22px' } },
                    { at: path }
                );
            } else {
                SlateTransforms.setNodes(
                    editor,
                    { style: { fontFamily: '宋体', fontSize: '12px' } },
                    { at: path }
                );
            }

            if (node.children) {
                node.children.forEach((child, index) => {
                    if (child.type === 'image') {
                        const { width, height } = child;
                        const ratio = width / height;
                        const setW = 600;
                        const setH = setW / ratio; // 等比计算

                        SlateTransforms.setNodes(
                            editor,
                            { width: setW, height: setH, style: { display: 'block', margin: '0 auto' } },
                            { at: path.concat(index) } // 定位到子节点
                        );
                    }
                });
            }
        }

        }


    }

    applyTemplate1() {
        const editor = this.editor;

        const nodes = SlateEditor.nodes(editor, {
            at: [],
            match: n => SlateElement.isElement(n),
            universal: true,
        });

        // 在此处定义排版模板1的样式并应用到每个节点
        for (const [node, path] of nodes) {
            const isTitle = node.type === 'heading'; // 假设标题节点类型为 'heading'
            if (isTitle) {
                SlateTransforms.setNodes(
                    editor,
                    { style: { fontFamily: '楷体', fontSize: '18px' } }, // 示例样式
                    { at: path }
                );
            } else {
                SlateTransforms.setNodes(
                    editor,
                    { style: { fontFamily: '楷体', fontSize: '14px' } }, // 示例样式
                    { at: path }
                );
            }
        }
    }

    applyTemplate2() {
        const editor = this.editor;

        const nodes = SlateEditor.nodes(editor, {
            at: [],
            match: n => SlateElement.isElement(n),
            universal: true,
        });

        // 在此处定义排版模板2的样式并应用到每个节点
        for (const [node, path] of nodes) {
            const isTitle = node.type === 'heading'; // 假设标题节点类型为 'heading'
            if (isTitle) {
                SlateTransforms.setNodes(
                    editor,
                    { style: { fontFamily: 'Arial', fontSize: '20px' } }, // 示例样式
                    { at: path }
                );
            } else {
                SlateTransforms.setNodes(
                    editor,
                    { style: { fontFamily: 'Arial', fontSize: '16px' } }, // 示例样式
                    { at: path }
                );
            }
        }
    }
}

export default MyFormatting;
