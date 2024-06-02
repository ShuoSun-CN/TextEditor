<template>
  <div>
    <input type="file" @change="handleFileUpload">
    <button @click="submitFile">提交</button>
    <div v-if="isLoading">正在上传...</div>
    <div v-if="result">
      <img :src="result.origin_img_url" alt="原始图片">
      <img :src="result.result_img_url" alt="提取结果">
      <p>{{ result.text_info }}</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      file: null,
      isLoading: false,
      result: null
    };
  },
  methods: {
    handleFileUpload(event) {
      this.file = event.target.files[0];
    },
    async submitFile() {
      this.isLoading = true;
      try {
        const formData = new FormData();
        formData.append("file", this.file);

        const response = await axios.post("http://127.0.0.1:8000/ocr/", formData);

        if (response.status !== 200) {
          throw new Error("上传失败，请重试~");
        }
        const data = await response.json();
        if (data.errno !== 0) {
          throw new Error(data.message || "上传失败，请重试~");
        }

        this.result = data.data;
      } catch (error) {
        console.error(error);
        // 处理上传失败的情况，例如弹出提示框
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>
