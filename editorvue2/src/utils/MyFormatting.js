import { SlateTransforms } from '@wangeditor/editor';
import ProgressBar from "@/utils/ProgressBar";
import axios from "axios";

class MyFormatting {
    constructor(vueInstace) {
        this.title = '智能格式排版';
        this.tag = 'button';
        this.vueInstance = vueInstace;
        this.progressBar = new ProgressBar();
        this.insertText = this.insertText.bind(this);
        this.showPopup = this.showPopup.bind(this);
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
        //const text = this.vueInstance.getHtml();
        const text = "<p>111</p>"
        if (text) {
                this.progressBar.showProgressBar();

                try {
                    const response = await axios.post('http://127.0.0.1:8000/typesetting/', {text}, {
                        onUploadProgress: progressEvent => {
                            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                            this.progressBar.updateProgressBar(percentCompleted);
                        }
                    });
                    const data = response.data;
                    if (data.status === 0) {
                        const polishedText = data.polishedText;
                        this.showPopup(polishedText);
                    } else {
                        const polishedText = "文件处理失败";
                        this.showPopup(polishedText);
                        console.log('文件处理失败1');
                    }
                } catch (error) {
                    const polishedText = "文件处理失败";
                    this.showPopup(polishedText);
                    console.error('文件处理失败2:', error);
                } finally {
                    this.progressBar.hideProgressBar();
                }
            }
    }
    showPopup(textInfo) {
    const popup = document.createElement('div');
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.backgroundColor = 'white';
    popup.style.border = '1px solid #ccc';
    popup.style.padding = '20px';
    popup.style.zIndex = '1000';
    popup.style.width = '700px';
    popup.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    popup.style.borderRadius = '8px';
    popup.style.overflow = 'hidden';

    const closeButton = document.createElement('button');
    closeButton.textContent = 'X';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.background = 'transparent';
    closeButton.style.border = 'none';
    closeButton.style.fontSize = '20px';
    closeButton.style.cursor = 'pointer';
    closeButton.onclick = () => popup.remove();
    popup.appendChild(closeButton);

    const container = document.createElement('div');
    container.style.display = 'grid';
    container.style.gridTemplateColumns = '1fr 2fr';
    container.style.gap = '20px';



    const textContainer = document.createElement('div');
    textContainer.style.marginTop = '20px';

    const textLabel = document.createElement('div');
    textLabel.textContent = '识别后的文本';
    textContainer.appendChild(textLabel);

    const info = document.createElement('div');
    info.style.marginTop = '10px';
    info.style.whiteSpace = 'pre-wrap';
    info.style.border = '1px solid #ccc';
    info.style.padding = '10px';
    info.style.borderRadius = '4px';
    info.textContent = textInfo;
    textContainer.appendChild(info);

    const insertButton = document.createElement('button');
    insertButton.textContent = '插入到光标处';
    insertButton.style.display = 'block';
    insertButton.style.margin = '20px auto 0 auto';
    insertButton.style.padding = '10px 20px';
    insertButton.style.backgroundColor = '#007BFF';
    insertButton.style.color = 'white';
    insertButton.style.border = 'none';
    insertButton.style.borderRadius = '4px';
    insertButton.style.cursor = 'pointer';
    insertButton.style.fontSize = '16px';
    insertButton.style.transition = 'background-color 0.3s';

    insertButton.onmouseover = () => {
        insertButton.style.backgroundColor = '#0056b3';
    };

    insertButton.onmouseout = () => {
        insertButton.style.backgroundColor = '#007BFF';
    };

    insertButton.onclick = () => {
        this.insertText(textInfo);
        popup.remove();
    };

    popup.appendChild(container);
    popup.appendChild(textContainer);
    popup.appendChild(insertButton);

    document.body.appendChild(popup);

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

    insertText(text) {
        const { selection } = this.vueInstance;
        SlateTransforms.insertText(this.vueInstance, text, { at: selection.focus });
        console.log('插入文本:', text);
    }

}

export default MyFormatting;
