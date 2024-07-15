//此处用于实现功能二，视频信息提取
import { SlateTransforms } from '@wangeditor/editor';
import axios from "axios";
import progressBar from "@/utils/ProgressBar";
import {Message} from "element-ui";

class ObjectionDetect {
    constructor(editor) {
        this.editor = editor;
        this.title = '目标检测';
        this.tag = 'button';
        this.iconSvg = '<svg t="1721015593802" class="icon" viewBox="0 0 1078 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4296" width="200" height="200"><path d="M943.578537 24.97561h-31.469269v43.457561h31.469269c21.479024 0 40.96 19.480976 40.96 40.96v43.457561h43.457561v-43.457561c0-45.955122-38.462439-84.417561-84.417561-84.417561zM74.427317 920.600976v-43.457561H30.969756v43.457561c0 45.955122 38.462439 84.417561 84.417561 84.417561h31.469268v-43.457561h-31.469268c-21.978537 0-40.96-18.981463-40.96-40.96zM74.427317 109.393171c0-21.479024 19.480976-40.96 40.96-40.96h31.469268V24.97561h-31.469268C69.432195 24.97561 30.969756 63.438049 30.969756 109.393171v43.457561h43.457561v-43.457561zM197.307317 863.157073c-6.993171 0-14.485854-6.993171-14.485854-14.485853V181.322927c0-6.993171 6.993171-14.485854 14.485854-14.485854H864.156098c7.492683 0 14.485854 6.993171 14.485853 14.485854v334.673171h43.457561v-334.673171c0-31.469268-26.474146-57.943415-57.943414-57.943415H197.307317c-31.469268 0-57.943415 26.474146-57.943415 57.943415v669.346341c0 31.469268 26.474146 57.943415 57.943415 57.943415h334.673171v-45.955122h-334.673171z" fill="#283592" p-id="4297"></path><path d="M989.533659 769.24878c0-110.891707-88.913171-199.804878-199.804879-199.804878-26.474146 0-51.949268 4.995122-74.926829 14.485854l-131.871219-110.891707-305.701464 272.234146 28.971708 31.469268 276.729756-245.76 91.410731 75.426342c-50.950244 35.964878-84.417561 95.406829-84.417561 163.340488 0 110.891707 88.913171 199.804878 199.804878 199.804878 47.453659 0 90.91122-16.483902 124.878049-43.957073l75.426342 75.426341 30.470244-30.470244-75.426342-75.426341c27.972683-34.965854 44.456585-78.423415 44.456586-125.877074z m-199.804879 153.849757c-86.915122 0-156.347317-69.931707-156.347317-156.347317v-0.499513c0-86.41561 70.43122-155.847805 156.347317-155.847805 86.915122 0 156.347317 69.931707 156.347318 156.347318s-69.931707 156.347317-156.347318 156.347317z" fill="#283592" p-id="4298"></path><path d="M661.853659 769.24878h43.457561v-0.499512c0-47.453659 38.961951-86.41561 86.915121-85.916097V639.37561h-0.999024c-71.929756 0-129.373659 58.442927-129.373658 129.87317zM281.225366 374.134634c0 43.457561 35.964878 79.422439 79.422439 79.422439S440.070244 419.590244 440.070244 374.134634c0-43.457561-35.964878-79.422439-79.422439-79.422439-42.958049 0-79.422439 35.964878-79.422439 79.422439z m115.886829 0c0 19.480976-16.983415 35.964878-35.964878 35.964878-18.981463 0-35.964878-16.983415-35.964878-35.964878 0-18.981463 16.983415-35.964878 35.964878-35.964878 18.981463 0 35.964878 16.983415 35.964878 35.964878zM491.020488 306.700488h219.285853v43.457561H491.020488zM491.020488 383.625366h127.37561v43.457561H491.020488z" fill="#283592" p-id="4299"></path></svg>'
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
        input.accept = 'image/*';
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
                        Message({
                            showClose: true,
                            message: '成功处理！',
                            type: 'success',
                        });

                        this.showSideDrawer(origin_img_url,result_img_url, text_info);
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

    showSideDrawer(originUrl, resultUrl, textInfo) {
        const sideDrawer = document.createElement('div');
        sideDrawer.id = 'sideDrawer';
        sideDrawer.classList.add('side-drawer');

        sideDrawer.style.position = 'fixed';
        sideDrawer.style.top = '0';
        sideDrawer.style.right = '-400px';
        sideDrawer.style.width = '550px';
        sideDrawer.style.height = '95%';
        sideDrawer.style.backgroundColor = 'white';
        sideDrawer.style.boxShadow = '2px 0 5px rgba(105, 145, 199,0.5)';
        sideDrawer.style.transition = 'right 0.3s ease';
        sideDrawer.style.zIndex = '1000';
        sideDrawer.style.padding = '20px';
        sideDrawer.style.overflowY = 'auto';
        sideDrawer.style.borderLeft = '1px solid #ddd';

        // Title
        const title = document.createElement('div');
        title.textContent = this.title;
        /*        title.style.fontFamily = 'cursive';*/
        title.style.color = '#6991c7';
        title.style.fontSize = '24px';
        title.style.textAlign = 'center'; // Center align title
        title.style.marginBottom = '20px';
        sideDrawer.insertBefore(title, sideDrawer.firstChild);

        // Close Button
        const closeButton = document.createElement('button');
        closeButton.textContent = '取消';
        closeButton.innerHTML = '<svg t="1719585155992" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7955" data-spm-anchor-id="a313x.search_index.0.i27.51913a81X37f1O" width="32" height="32"><path d="M455.6 908.1c18.5 2.6 37.2 3.9 56.1 3.9 220.8 0 400.5-179.7 400.5-400.5S732.5 111 511.7 111c-19.1 0-37.8 1.3-56.2 3.9-159.8 60.8-273.4 215.4-273.4 396.5 0.1 181.4 113.7 336 273.5 396.7z" fill="#91B4FF" p-id="7956"></path><path d="M377.3 670.5c-6 0-12.1-2.3-16.7-6.9-9.2-9.2-9.2-24.2 0-33.4l270.7-270.7c9.2-9.2 24.2-9.2 33.4 0s9.2 24.2 0 33.4L394 663.6c-4.6 4.6-10.7 6.9-16.7 6.9z" fill="#3778FF" p-id="7957"></path><path d="M646.3 670.5c-6 0-12.1-2.3-16.7-6.9L358.9 393c-9.2-9.2-9.2-24.2 0-33.4s24.2-9.2 33.4 0L663 630.2c9.2 9.2 9.2 24.2 0 33.4-4.6 4.6-10.7 6.9-16.7 6.9z" fill="#3778FF" p-id="7958"></path><path d="M184.8 805.3c-6.8 0-13.5-2.9-18.2-8.6-13.6-16.4-26.1-34-37.2-52.2-6.8-11.1-3.3-25.7 7.9-32.5 11.1-6.8 25.7-3.3 32.5 7.9 9.9 16.3 21.1 32 33.3 46.7 8.3 10 6.9 24.9-3.1 33.3-4.6 3.6-9.9 5.4-15.2 5.4z" fill="#3778FF" p-id="7959"></path><path d="M511.4 959.3c-93.1 0-182.3-28.3-258-81.8-10.7-7.5-13.2-22.3-5.7-32.9 7.5-10.7 22.3-13.2 32.9-5.7 67.7 47.8 147.5 73.1 230.8 73.1 220.8 0 400.5-179.7 400.5-400.5S732.2 111 511.4 111 111 290.8 111 511.6c0 38.3 5.4 76.2 16.1 112.6 3.7 12.5-3.5 25.6-16.1 29.3-12.6 3.7-25.7-3.5-29.3-16-11.9-40.7-17.9-83.1-17.9-125.9 0-246.9 200.8-447.7 447.7-447.7s447.7 200.8 447.7 447.7c-0.1 246.9-200.9 447.7-447.8 447.7z" fill="#3778FF" p-id="7960"></path></svg>';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '17px';
        closeButton.style.right = '10px';
        closeButton.style.background = 'transparent';
        closeButton.style.border = 'none';
        closeButton.style.fontSize = '20px';
        closeButton.style.cursor = 'pointer';
        closeButton.onclick = () => {
            sideDrawer.remove();
            this.removeToggleButton();
        };
        sideDrawer.appendChild(closeButton);

        // Result Image Container
        const resultImgContainer = document.createElement('div');
        resultImgContainer.style.textAlign = 'center';

        const resultImgLabel = document.createElement('div');
        resultImgLabel.textContent = '图片处理结果';
        resultImgLabel.style.width = '100%';
        resultImgLabel.style.color = 'white';
        resultImgLabel.style.height = '30px';
        resultImgLabel.style.display = 'flex';
        resultImgLabel.style.alignItems = 'center';
        resultImgLabel.style.justifyContent = 'center';
        resultImgLabel.style.textAlign = 'center';
        resultImgLabel.style.backgroundColor = '#6991c7';
        resultImgLabel.style.fontWeight = 'bold';
        resultImgLabel.style.marginBottom = '10px';
        resultImgContainer.appendChild(resultImgLabel);


        const resultImg = document.createElement('img');
        resultImg.style.maxWidth = '100%';
        resultImg.src = resultUrl;
        resultImgContainer.appendChild(resultImg);

        // Text Container
        const textContainer = document.createElement('div');
        textContainer.style.marginTop = '20px';

        const textLabel = document.createElement('div');
        textLabel.textContent = '识别的文本';
        textLabel.style.backgroundColor = '#6991c7';
        textLabel.style.color = 'white';
        textLabel.style.height = '30px';
        textLabel.style.display = 'flex';  // Enable flexbox layout
        textLabel.style.alignItems = 'center';  // Center vertically
        textLabel.style.justifyContent = 'center';  // Center horizontally
        textLabel.style.fontWeight = 'bold';
        textLabel.style.textAlign = 'center';  // Center text within the div
        textLabel.style.marginBottom = '10px'; // Adjust margin for better spacing
        textContainer.appendChild(textLabel);


        const info = document.createElement('div');
        info.style.whiteSpace = 'pre-wrap';
        info.style.border = '1px solid #ccc';
        info.style.padding = '10px';
        info.style.borderRadius = '4px';
        info.style.backgroundColor = '#f9f9f9';
        info.textContent = textInfo;
        textContainer.appendChild(info);

        // Insert Original Image Button
        const insertOriginalButton = document.createElement('button');
        insertOriginalButton.textContent = '插入原图';
        insertOriginalButton.style.display = 'inline-block'; // Ensure inline-block for side-by-side alignment
        insertOriginalButton.style.margin = '10px 10px 10px 180px'; // Adjust margin for spacing
        insertOriginalButton.style.padding = '10px 20px';
        insertOriginalButton.style.color = 'white';
        insertOriginalButton.style.fontWeight = 'bold';
        insertOriginalButton.style.backgroundColor = '#6991c7';
        insertOriginalButton.style.border = 'none';
        insertOriginalButton.style.borderRadius = '4px';
        insertOriginalButton.style.cursor = 'pointer';
        insertOriginalButton.style.fontSize = '16px';
        insertOriginalButton.style.transition = 'background-color 0.3s';

        insertOriginalButton.onmouseover = () => {
            insertOriginalButton.style.backgroundColor = '#bbd5f5';
        };

        insertOriginalButton.onmouseout = () => {
            insertOriginalButton.style.backgroundColor = '#6991c7';
        };

        insertOriginalButton.onclick = () => {
            this.insertOriginalImage(originUrl);
        };

// Insert Text Button
        const insertButton = document.createElement('button');
        insertButton.textContent = '插入文本';
        insertButton.style.display = 'inline-block'; // Ensure inline-block for side-by-side alignment
        insertButton.style.margin = '0 10px 0 0'; // Adjust margin for spacing
        insertButton.style.padding = '10px 20px';
        insertButton.style.color = 'white';
        insertButton.style.fontWeight = 'bold';
        insertButton.style.backgroundColor = '#6991c7';
        insertButton.style.border = 'none';
        insertButton.style.borderRadius = '4px';
        insertButton.style.cursor = 'pointer';
        insertButton.style.fontSize = '16px';
        insertButton.style.transition = 'background-color 0.3s';

        insertButton.onmouseover = () => {
            insertButton.style.backgroundColor = '#bbd5f5';
        };

        insertButton.onmouseout = () => {
            insertButton.style.backgroundColor = '#6991c7';
        };

        insertButton.onclick = () => {
            this.insertText(textInfo);
            /*sideDrawer.remove();
            this.removeToggleButton();*/
        };

        sideDrawer.appendChild(resultImgContainer);
        sideDrawer.appendChild(textContainer);
        sideDrawer.appendChild(insertOriginalButton);
        sideDrawer.appendChild(insertButton);

        document.body.appendChild(sideDrawer);

        requestAnimationFrame(() => {
            sideDrawer.style.right = '0';
        });

        // Toggle Button
        this.createToggleButton();
    }

    toggleSideDrawer() {
        const sideDrawer = document.getElementById('sideDrawer');
        if (sideDrawer) {
            const currentRight = parseInt(sideDrawer.style.right) || 0;
            sideDrawer.style.right = currentRight === 0 ? '-550px' : '0';
        }
    }

    createToggleButton() {
        const toggleButton = document.createElement('button');
        toggleButton.id = 'toggleButton';
        toggleButton.innerHTML = '<svg t="1719585613552" class="icon" viewBox="0 0 1420 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14253" width="36" height="36"><path d="M896.761299 506.867871L1402.708996 0.91817H1094.542712L588.593011 506.867871l515.147438 515.149443h308.168288L896.761299 506.867871zM818.568508 0.928194h-308.168289L4.452523 506.87589l515.147438 515.149443h308.168288L312.620811 506.87589 818.568508 0.928194z" p-id="14254" fill="#6991c7"></path></svg>';
        /*   toggleButton.textContent = '侧拉按钮';*/
        toggleButton.style.position = 'fixed';
        toggleButton.style.right = '0';
        toggleButton.style.top = '50%';
        toggleButton.style.width = '36px';
        toggleButton.style.background = 'transparent';
        toggleButton.style.border = 'none';
        toggleButton.style.transform = 'translateY(-50%)';
        toggleButton.style.zIndex = '1001';
        toggleButton.style.cursor = 'pointer';
        toggleButton.onclick = this.toggleSideDrawer;
        document.body.appendChild(toggleButton);
    }

    removeToggleButton() {
        const toggleButton = document.getElementById('toggleButton');
        if (toggleButton) {
            toggleButton.remove();
        }
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


    insertOriginalImage(originUrl) {
        Message({
            showClose: true,
            message: '插入成功！',
            type: 'success',
        });
        this.editor.insertNode({
            type: 'image',
            src: originUrl,
            children: [{text: ''}]
        });
    }
}

export default ObjectionDetect;
