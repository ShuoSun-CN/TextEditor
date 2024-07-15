import axios from 'axios';
import {SlateEditor, SlateElement, SlateTransforms} from "@wangeditor/editor";
import {Message} from "element-ui";
import ProgressBar from "@/utils/ProgressBar";

class MindMap {
    constructor(editor) {
        this.title = '智能表格';
        this.tag = 'button';
        this.editor = editor;
        this.progressBar = new ProgressBar();
        this.showResultPopup = this.showResultPopup.bind(this);
        this.insertText = this.insertText.bind(this);
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

            if (match) {
                const textToProcess = SlateEditor.string(this.editor, selection);
                const session_id = localStorage.getItem('session_id');
                const jsondata = {session_id, text: textToProcess};
                const url = 'http://127.0.0.1:8000/generateMMP/';
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
                        Message({
                            showClose: true,
                            message: '成功处理！',
                            type: 'success',
                        });
                        this.showResultPopup(data.polishedText);
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

    showResultPopup(text) {
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.backgroundColor = 'white';
        popup.style.border = '1px solid #ccc';
        popup.style.padding = '0px 0px 10px 0px';
        popup.style.zIndex = '1000';
        popup.style.width = '400px';
        popup.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        popup.style.display = 'flex';
        popup.style.flexDirection = 'column';
        popup.style.alignItems = 'center';

        const header = document.createElement('div');
        header.style.width = '100%';
        header.style.height = '50px';
        header.style.fontSize = '20px';
        header.style.color = 'white';
        header.style.backgroundColor = '#6991c7';
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.justifyContent = 'center';
        header.style.textAlign = 'center';
        header.innerText = "    "+"处理结果";

        const closeButton = document.createElement('button');
        closeButton.textContent = '取消';
        closeButton.style.position = 'absolute';
        closeButton.style.right = '10px';
        closeButton.innerHTML = '<svg t="1719585155992" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7955" data-spm-anchor-id="a313x.search_index.0.i27.51913a81X37f1O" width="32" height="32"><path d="M455.6 908.1c18.5 2.6 37.2 3.9 56.1 3.9 220.8 0 400.5-179.7 400.5-400.5S732.5 111 511.7 111c-19.1 0-37.8 1.3-56.2 3.9-159.8 60.8-273.4 215.4-273.4 396.5 0.1 181.4 113.7 336 273.5 396.7z" fill="#91B4FF" p-id="7956"></path><path d="M377.3 670.5c-6 0-12.1-2.3-16.7-6.9-9.2-9.2-9.2-24.2 0-33.4l270.7-270.7c9.2-9.2 24.2-9.2 33.4 0s9.2 24.2 0 33.4L394 663.6c-4.6 4.6-10.7 6.9-16.7 6.9z" fill="#3778FF" p-id="7957"></path><path d="M646.3 670.5c-6 0-12.1-2.3-16.7-6.9L358.9 393c-9.2-9.2-9.2-24.2 0-33.4s24.2-9.2 33.4 0L663 630.2c9.2 9.2 9.2 24.2 0 33.4-4.6 4.6-10.7 6.9-16.7 6.9z" fill="#3778FF" p-id="7958"></path><path d="M184.8 805.3c-6.8 0-13.5-2.9-18.2-8.6-13.6-16.4-26.1-34-37.2-52.2-6.8-11.1-3.3-25.7 7.9-32.5 11.1-6.8 25.7-3.3 32.5 7.9 9.9 16.3 21.1 32 33.3 46.7 8.3 10 6.9 24.9-3.1 33.3-4.6 3.6-9.9 5.4-15.2 5.4z" fill="#3778FF" p-id="7959"></path><path d="M511.4 959.3c-93.1 0-182.3-28.3-258-81.8-10.7-7.5-13.2-22.3-5.7-32.9 7.5-10.7 22.3-13.2 32.9-5.7 67.7 47.8 147.5 73.1 230.8 73.1 220.8 0 400.5-179.7 400.5-400.5S732.2 111 511.4 111 111 290.8 111 511.6c0 38.3 5.4 76.2 16.1 112.6 3.7 12.5-3.5 25.6-16.1 29.3-12.6 3.7-25.7-3.5-29.3-16-11.9-40.7-17.9-83.1-17.9-125.9 0-246.9 200.8-447.7 447.7-447.7s447.7 200.8 447.7 447.7c-0.1 246.9-200.9 447.7-447.8 447.7z" fill="#3778FF" p-id="7960"></path></svg>';
        closeButton.style.background = 'transparent';
        closeButton.style.border = 'none';
        closeButton.style.cursor = 'pointer';
        closeButton.onclick = () => popup.remove();
        header.appendChild(closeButton);

        const textArea = document.createElement('div');
        textArea.style.width = '90%';
        textArea.style.minHeightheight = '150px';
        textArea.style.margin = '10px 10px 10px 10px';
        textArea.style.display = 'block';
        textArea.style.border = '1px solid #ccc';
        textArea.style.borderRadius = '5px';
        textArea.style.padding = '10px';
        textArea.style.fontSize = '14px';
        textArea.textContent = text;

        const insertTextButton = document.createElement('button');
        insertTextButton.textContent = '插入文本';
        insertTextButton.style.display = 'inline-block';
        insertTextButton.style.padding = '10px 20px';
        insertTextButton.style.color = 'white';
        insertTextButton.style.backgroundColor = '#6991c7';
        insertTextButton.style.border = 'none';
        insertTextButton.style.borderRadius = '4px';
        insertTextButton.style.cursor = 'pointer';
        insertTextButton.style.transition = 'background-color 0.3s';
        insertTextButton.onclick = () => {
            this.insertText(text);
        };

        popup.appendChild(header);
        popup.appendChild(textArea);
        popup.appendChild(insertTextButton);
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
                    popup.style.transform = 'none';
                }
            };
        };
        document.onmouseup = () => {
            isDragging = false;
            document.onmousemove = null;
        };
    }
    insertText(text) {
        const {selection} = this.editor;
        if (!selection || !selection.focus) {
            console.error('Selection is invalid or missing focus:', selection);
            Message({
                showClose: true,
                message: '请选择有效的文本插入位置!',
                type: 'error',
            });
            return;
        }

        SlateTransforms.insertText(this.editor, text, {at: selection.focus});
        Message({
            showClose: true,
            message: '插入成功！',
            type: 'success',
        });
    }
}

export default MindMap;
