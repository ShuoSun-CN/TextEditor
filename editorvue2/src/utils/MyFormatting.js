import axios from 'axios';
import {SlateEditor, SlateElement, SlateTransforms} from "@wangeditor/editor";

class MyFormatting {
    constructor(editor) {
        this.title = '自动排版';
        this.tag = 'select';
        his.editor = editor;

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
            {value: 'autoFomatting', text: '自动排版'},
            {value: 'template1', text: '模板1'},
        ];
    }

    // 菜单是否需要激活
    isActive() {
        return false;
    }

    // 获取菜单执行时的 value
    getValue() {
        return 'autoFomatting';
    }

    // 菜单是否需要禁用
    isDisabled() {
        return false;
    }

    async exec(editor) {
        this.editor = editor;
        const html = this.editor.getHtml();
        console.log(html);
        const url = 'http://127.0.0.1:8000/typese/';
        let processedText='';
        processedText = await this.formatSetting(html, url);

        this.editor.setHtml(processedText);
}

async formatSetting(text, url)
{
    // 显示进度条
    this.showProgressBar();

    try {
        const response = await axios.post(url, {text});
        const data = response.data;

        // 接收到数据就隐藏进度条
        this.hideProgressBar();

        // 处理返回的数据
        if (data.status === 0) {
            if (data.text) {
                // 显示返回的文本并生成弹窗
                this.showResultPopup(data.text);
                return data.text;
            }
            return '处理失败';
        } else if (data.status === 1) {
            return '网络错误';
        } else if (data.status === 2) {
            return '内容违规，请修改后重试';
        }
    } catch (error) {
        console.error('请求错误:', error);
        this.hideProgressBar();
        return '请求过程中发生错误';
    }
}

showProgressBar()
{

    const progressBar = document.createElement('div');
    progressBar.id = 'progressBar';
    progressBar.style.width = '0%';
    progressBar.style.height = '4px';
    progressBar.style.backgroundColor = 'blue';
    progressBar.style.position = 'fixed';
    progressBar.style.top = '0';
    progressBar.style.left = '0';
    progressBar.style.zIndex = '1000';
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

hideProgressBar()
{
    // 隐藏并移除进度条
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        progressBar.remove();
    }
}

showResultPopup(text)
{
    // 创建弹窗
    const popup = document.createElement('div');
    popup.id = 'resultPopup';
    popup.style.position = 'absolute';
    popup.style.left = '50%';
    popup.style.top = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.width = '450px'; // Width for aspect ratio 1.5:1
    popup.style.height = '300px'; // Height for aspect ratio 1.5:1
    popup.style.padding = '20px';
    popup.style.backgroundColor = '#4a90e2'; // Background color inspired by the uploaded image
    popup.style.borderRadius = '10px'; // Rounded corners
    popup.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    popup.style.zIndex = 1000;
    popup.style.color = 'white'; // Text color
    popup.style.textAlign = 'center'; // Center text
    popup.style.boxSizing = 'border-box'; // Include padding in height
    popup.style.cursor = 'move'; // Cursor indicating draggable

    // 创建关闭按钮
    const closeButton = document.createElement('span');
    closeButton.innerHTML = '&times;';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.fontSize = '20px';
    closeButton.onclick = () => {
        popup.remove();
    };

    // 创建标题
    const title = document.createElement('h2');
    title.innerText = '结果';
    title.style.marginTop = '0';
    title.style.color = '#ffffff'; // Title text color

    // 创建文本区域
    const textArea = document.createElement('textarea');
    textArea.style.width = '90%'; // Adjusted width for centering
    textArea.style.height = '150px';
    textArea.style.margin = '10px auto'; // Center margin
    textArea.style.display = 'block'; // Block display for centering
    textArea.style.border = '1px solid #ccc';
    textArea.style.borderRadius = '5px';
    textArea.style.padding = '10px';
    textArea.style.fontSize = '14px';
    textArea.value = text;

    // 创建插入按钮
    const insertButton = document.createElement('button');
    insertButton.innerText = '插入';
    insertButton.style.padding = '10px 20px';
    insertButton.style.backgroundColor = '#ffffff'; // Button background color
    insertButton.style.border = 'none';
    insertButton.style.borderRadius = '5px';
    insertButton.style.cursor = 'pointer';
    insertButton.style.fontSize = '16px';
    insertButton.style.color = '#4a90e2'; // Button text color
    insertButton.style.margin = '10px auto'; // Center margin
    insertButton.style.display = 'block'; // Block display for centering
    insertButton.onmouseover = () => {
        insertButton.style.backgroundColor = '#e6e6e6'; // Hover effect
    };
    insertButton.onmouseout = () => {
        insertButton.style.backgroundColor = '#ffffff';
    };
    insertButton.onclick = () => {
        this.insertText(text);
        popup.remove();
    };

    // 将关闭按钮、标题、文本区域和按钮添加到弹窗
    popup.appendChild(closeButton);
    popup.appendChild(title);
    popup.appendChild(textArea);
    popup.appendChild(insertButton);

    // 将弹窗添加到文档
    document.body.appendChild(popup);

    // 使弹窗可拖动
    let isDragging = false;
    let offsetX, offsetY;

    popup.onmousedown = (e) => {
        isDragging = true;
        offsetX = e.clientX - popup.getBoundingClientRect().left;
        offsetY = e.clientY - popup.getBoundingClientRect().top;
        document.onmousemove = (e) => {
            if (isDragging) {
                popup.style.left = `${e.clientX - offsetX}px`;
                popup.style.top = `${e.clientY - offsetY}px`;
                popup.style.transform = 'none'; // Disable the initial transform
            }
        };
    };

    document.onmouseup = () => {
        isDragging = false;
        document.onmousemove = null;
    };
}
insertText(text)
{
    //获取插入位置
    const {selection} = this.editor;
    //插入文本
    SlateTransforms.insertText(this.editor, text, {at: selection.focus});
    console.log('插入文本:', text);
}
}

export default MyFormatting;
