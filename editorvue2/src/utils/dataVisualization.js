import axios from 'axios';
import { SlateEditor } from "@wangeditor/editor";
import { Message } from "element-ui";
import ProgressBar from "@/utils/ProgressBar";
import * as echarts from 'echarts';

class dataVisual {
    constructor(editor) {
        this.title = '数据可视化';
        this.tag = 'select';
        this.editor = editor;
        this.progressBar = new ProgressBar();
        this.chartInstance = null; // to store ECharts instance
    }

    getOptions() {
        return [
            { value: "bar", text: '柱状图' },
            { value: "line", text: '折线图' },
            { value: "pie", text: '饼状图' },
        ];
    }

    isActive() {
        return false; // Implement logic as needed
    }

    getValue() {
        return "bar"; // Implement logic as needed
    }

    isDisabled() {
        return false; // Implement logic as needed
    }

    async exec(editor, value) {
        this.editor = editor;
        const { selection } = this.editor;

        if (!selection) {
            Message({
                showClose: true,
                message: '请选中需要处理的文字！',
                type: 'error',
            });
            return;
        }

        const textToProcess = SlateEditor.string(this.editor, selection);
        const session_id = localStorage.getItem('session_id');
        const jsondata = { session_id, text: textToProcess, data_type: value };
        const url = 'http://127.0.0.1:8000/dataV/';

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
                const option = JSON.parse(data.polishedText);
                console.log(option);

                if (this.chartInstance) {
                    this.chartInstance.setOption(option);
                } else {
                    var chartDom = document.getElementById('chart-container');
                    this.chartInstance = echarts.init(chartDom);
                    this.chartInstance.setOption(option);
                }

                Message({
                    showClose: true,
                    message: '成功处理！',
                    type: 'success',
                });

            } else if (data.code === -2) {
                Message({
                    showClose: true,
                    message: '星辉不足,请及时充值!',
                    type: 'info',
                });
            } else if (data.code === -1) {
                Message({
                    showClose: true,
                    message: '登录过期,请重新登录!',
                    type: 'info',
                });
            } else {
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
}

export default dataVisual;
