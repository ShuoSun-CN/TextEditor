//此处用于实现功能二，视频信息提取
import { SlateTransforms } from '@wangeditor/editor';
import axios from "axios";
import progressBar from "@/utils/ProgressBar";
import {Message} from "element-ui";

class MyVideoExtract {
    constructor(editor) {
        this.editor = editor;
        this.title = '视频信息检测';
        this.tag = 'button';
        this.iconSvg = '<svg t="1719573658104" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5362" width="200" height="200"><path d="M1024 910.9H0V49.8h1024v861.1zM29.9 878.4h964.2V82.2H29.9v796.2z" fill="#050101" p-id="5363"></path><path d="M1020.9 716.3H3.1v-472h1017.7v472zM33.1 683.9H991V276.8H33.1v407.1z" fill="#050101" p-id="5364"></path><path d="M111.4 75.4h29.9v174.7h-29.9zM273.5 75.4h29.9v174.7h-29.9zM462.1 75.4H492v174.7h-29.9zM650.8 75.4h29.9v174.7h-29.9zM839.5 75.4h29.9v174.7h-29.9zM111.4 709.5h29.9v174.7h-29.9zM273.5 709.5h29.9v174.7h-29.9zM462.1 709.5H492v174.7h-29.9zM650.8 709.5h29.9v174.7h-29.9zM839.5 709.5h29.9v174.7h-29.9zM471.9 599.2c-7.3 0-14.6-2.1-21.2-6.2-13.3-8.3-21.2-23.2-21.2-39.8V407.5c0-16.6 7.9-31.5 21.2-39.8 13.3-8.3 29.2-8.3 42.4 0l116.4 72.8c13.3 8.3 21.2 23.2 21.2 39.8 0 16.6-7.9 31.5-21.2 39.8L493.1 593c-6.6 4.1-13.9 6.2-21.2 6.2z m0-205.3c-2.9 0-5.2 1.1-6.3 1.9-1.9 1.2-6.3 4.7-6.3 11.7v145.6c0 7.1 4.4 10.6 6.3 11.7 1.9 1.2 6.9 3.5 12.5 0L594.5 492c5.6-3.5 6.3-9.4 6.3-11.8 0-2.3-0.6-8.2-6.3-11.7l-116.4-72.8c-2.2-1.3-4.3-1.8-6.2-1.8z" fill="#050101" p-id="5365"></path></svg>';
        this.progressBar = new progressBar();
        this.insertText = this.insertText.bind(this);
        this.showSideDrawer = this.showSideDrawer.bind(this);
        this.toggleSideDrawer = this.toggleSideDrawer.bind(this);

    }

    isActive() {
        return false;
    }

    getValue() {
        return '';
    }

    isDisabled() {
        return false;
    }

    async exec(editor) {
        this.editor  = editor;
        if (this.isDisabled(editor)) {
            return;
        }
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'video/*';
        input.onchange = async (event) => {
            const file = event.target.files[0];
            if (file) {
                this.progressBar.showProgressBar();
                const formData = new FormData();
                const session_id = localStorage.getItem('session_id');
                formData.append('session_id', session_id);
                formData.append('file', file);
                try {
                    const response = await axios.post('http://127.0.0.1:8000/video_detection/', formData, {
                        onUploadProgress: progressEvent => {
                            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                            this.progressBar.updateProgressBar(percentCompleted);
                        }
                    });
                    const data = response.data.data;

                    if (response.data.errno === 0) {
                        const result = data.result;//返回的视频信息
                        this
                        Message({
                            showClose: true,
                            message: '成功处理！',
                            type: 'success',
                        });
                        this.showResultPopup(result);
                    } else {
                        Message({
                            showClose: true,
                            message: '处理失败，请稍后再试T_T',
                            type: 'error',
                        });
                    }
                } catch (error) {
                     Message({
                        showClose: true,
                        message: '处理失败，请稍后再试T_T',
                        type: 'error',
                    });
                } finally {
                    this.progressBar.hideProgressBar();
                }
            }
        };
        input.click();
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
        header.innerText = "    视频信息提取结果";

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

export default MyVideoExtract;
