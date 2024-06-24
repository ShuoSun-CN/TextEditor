//此处用于实现功能二，视频信息提取
import { SlateTransforms } from '@wangeditor/editor';
import axios from "axios";
import progressBar from "@/utils/ProgressBar";

class MyVideoExtract {
    constructor(editor) {
        this.editor = editor;
        this.title = '视频信息提取';
        this.tag = 'button';
        this.iconSvg ='<svg t="1717034814250" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4864" width="200" height="200"><path d="M21.333329 405.333462l981.333129 0 0 597.333209-981.333129 0 0-597.333209Z" fill="#9FDBAD" p-id="4865"></path><path d="M959.9998 426.666791a21.333329 21.333329 0 0 1 21.333329 21.333329v511.999893a21.333329 21.333329 0 0 1-21.333329 21.333329H63.999987a21.333329 21.333329 0 0 1-21.333329-21.333329V448.00012a21.333329 21.333329 0 0 1 21.333329-21.333329h895.999813m0-42.666658H63.999987a63.999987 63.999987 0 0 0-63.999987 63.999987v511.999893a63.999987 63.999987 0 0 0 63.999987 63.999987h895.999813a63.999987 63.999987 0 0 0 63.999987-63.999987V448.00012a63.999987 63.999987 0 0 0-63.999987-63.999987z" fill="#5C2D51" p-id="4866"></path><path d="M66.986653 407.040129a15.999997 15.999997 0 0 1-15.359997-11.946665L21.333329 281.600155a15.999997 15.999997 0 0 1 11.519997-19.626663L951.679802 21.333542h4.053332a15.999997 15.999997 0 0 1 15.359997 11.946664l29.653327 113.49331a15.999997 15.999997 0 0 1-11.519997 19.626663L71.039985 406.613462z" fill="#FFFFFF" p-id="4867"></path><path d="M951.893135 43.946871l27.093328 103.253312L70.826652 384.000133l-26.879994-102.613312L951.893135 43.946871M955.733134 0.000213a37.333326 37.333326 0 0 0-9.386664 1.28L27.946661 241.493496a37.333326 37.333326 0 0 0-26.666661 45.439991l29.653327 113.49331A37.333326 37.333326 0 0 0 76.373317 426.666791L994.986459 186.880174a37.333326 37.333326 0 0 0 26.666661-45.653323L991.999793 27.946874A37.333326 37.333326 0 0 0 955.733134 0.000213z" fill="#5C2D51" p-id="4868"></path><path d="M177.493296 224.426833l78.933317-20.693329 9.173332 151.893302-78.933317 20.693329-9.173332-151.893302z" fill="#F05071" p-id="4869"></path><path d="M236.799951 230.826832l6.399998 108.586644-36.906659 9.599998-6.399998-108.586644 36.906659-9.599998m39.466658-54.399989L155.306634 208.213503l11.519998 195.413293 120.959975-31.573327-11.519998-195.413292z" fill="#5C2D51" p-id="4870"></path><path d="M369.919923 174.080177l78.933317-20.693329 8.959998 152.106635-78.933317 20.479996-8.959998-151.893302z" fill="#F05071" p-id="4871"></path><path d="M429.013244 180.693509l6.399999 108.586644-36.693326 9.386665-6.399999-108.586644 36.906659-9.599998M469.333236 126.29352L347.519928 157.866847l11.519997 195.413293 120.959975-31.573327-10.666664-195.413293z" fill="#5C2D51" p-id="4872"></path><path d="M562.133216 123.733521l78.933317-20.693329 9.173332 152.106635-79.146651 20.693329-8.959998-152.106635z" fill="#F05071" p-id="4873"></path><path d="M621.439871 130.346853l6.399998 108.586644-36.906659 9.599998-6.399998-108.586644 36.906659-9.599998M661.333196 75.946864L539.946554 106.666858l11.519998 195.413292 120.959975-31.573326L661.333196 75.946864z" fill="#5C2D51" p-id="4874"></path><path d="M754.559843 73.386865l78.719983-20.479996 9.173332 151.893302-78.933317 20.693329-8.959998-152.106635z" fill="#F05071" p-id="4875"></path><path d="M813.653164 80.000197l6.399998 108.586644-36.906658 9.599998-6.399999-108.586644 36.906659-9.599998M853.333156 25.600208l-121.173309 31.573327 11.519998 195.413292 120.959975-31.573326L853.333156 25.600208z" fill="#5C2D51" p-id="4876"></path><path d="M429.013244 842.026705a42.666658 42.666658 0 0 1-42.666658-42.666658v-189.866627a42.666658 42.666658 0 0 1 42.666658-42.666658 42.666658 42.666658 0 0 1 21.333329 5.759999l165.973299 94.933313a42.666658 42.666658 0 0 1 0 74.666651l-165.973299 94.079981a42.666658 42.666658 0 0 1-21.333329 5.759999z" fill="#FDCA89" p-id="4877"></path><path d="M429.013244 587.306758a21.333329 21.333329 0 0 1 10.666664 2.986666l165.973299 94.933313a21.333329 21.333329 0 0 1 0 37.759992l-165.973299 94.933314a21.333329 21.333329 0 0 1-10.666664 2.986666 21.333329 21.333329 0 0 1-21.333329-21.333329v-189.866627a21.333329 21.333329 0 0 1 21.333329-21.333329m0-42.666658a63.999987 63.999987 0 0 0-63.999987 63.999987v189.866627a63.999987 63.999987 0 0 0 96.426647 55.893322l165.973299-94.933314a63.999987 63.999987 0 0 0 0-111.786643l-165.973299-94.933314a63.999987 63.999987 0 0 0-31.78666-8.533331z" fill="#5C2D51" p-id="4878"></path></svg>';
        this.progressBar = new progressBar();
        this.insertText = this.insertText.bind(this);
        this.showPopup = this.showPopup.bind(this);
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
        input.accept = 'video/!*';
        input.onchange = async (event) => {
            const file = event.target.files[0];
            if (file) {
                this.progressBar.showProgressBar();
                const formData = new FormData();
                const session_id = localStorage.getItem('session_id');
                formData.append('session_id', session_id);
                formData.append('file', file);
                try {
                    const response = await axios.post('http://127.0.0.1:8000/object_detection/', formData, {
                        onUploadProgress: progressEvent => {
                            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                            this.progressBar.updateProgressBar(percentCompleted);
                        }
                    });
                    const data = response.data.data;

                    if (response.data.errno === 0) {
                        const origin_img_url = data.orgin_img_url;
                        const result_img_url = data.result_img_url;
                        const text_info = data.text_info;
                        this.showPopup(origin_img_url,result_img_url, text_info);
                    } else {
                        console.error('上传失败');
                    }
                } catch (error) {
                    console.error('上传失败:', error);
                } finally {
                    this.progressBar.hideProgressBar();
                }
            }
        };
        input.click();
    }

    showPopup(originUrl, resultUrl, textInfo) {
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

    const originImgContainer = document.createElement('div');
    originImgContainer.style.textAlign = 'center';

    const originImgLabel = document.createElement('div');
    originImgLabel.textContent = '原图片';
    originImgContainer.appendChild(originImgLabel);

    const originImg = document.createElement('img');
    originImg.style.maxWidth = '100%';
    originImg.src = originUrl;
    originImgContainer.appendChild(originImg);

    const resultImgContainer = document.createElement('div');
    resultImgContainer.style.textAlign = 'center';

    const resultImgLabel = document.createElement('div');
    resultImgLabel.textContent = '识别后的图片';
    resultImgContainer.appendChild(resultImgLabel);

    const resultImg = document.createElement('img');
    resultImg.style.maxWidth = '100%';
    resultImg.src = resultUrl;
    resultImgContainer.appendChild(resultImg);

    container.appendChild(originImgContainer);
    container.appendChild(resultImgContainer);

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
        const { selection } = this.editor;
        SlateTransforms.insertText(this.editor, text, { at: selection.focus });
        console.log('插入文本:', text);
    }
}

export default MyVideoExtract;
