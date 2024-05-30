<template>
  <div style="border:1px solid #ccc;height: calc(100% - 30px)">
    <toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        :mode="mode"
    ></toolbar>
    <editor
        style="height: calc(100% - 81px);overflow-y: hidden"
        v-model="editorValue"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="handleCreated"></editor>
  </div>
</template>

<script>
import '@wangeditor/editor/dist/css/style.css'
import { Toolbar, Editor } from "@wangeditor/editor-for-vue";
import registerMenu from "@/utils/index"; // 根据你的路径调整

export default {
  components: {
    Toolbar,
    Editor
  },
  data() {
    return {
      mode: 'default',
      editorRef: null,
      editorValue: '',
      toolbarConfig: {
        excludeKeys: [
          "group-image", // 图片上传：本地上传+网络图片
          "group-video", // 视频上传：本地上传+网络视频
          "fullScreen"  // 全屏
        ]
      },
      editorConfig: {
        placeholder: '请输入内容...'
      }
    };
  },
  mounted() {
    this.editorValue = '';  // 这里可以设置编辑器内容。但是无法设置富文本信息。需要用setHtml
  },
  beforeDestroy() {
    // 当离开后，销毁编辑器实例
    const editor = this.editorRef;
    if (editor) {
      editor.destroy();
    }
  },
  methods: {
    handleCreated(editor) {
      this.editorRef = editor; // 记录编辑器实例
      registerMenu(this.editorRef, this.toolbarConfig); // 注册自定义菜单
      this.initMediaMenuEvent(); // 注册自定义菜单点击事件
    },
    initMediaMenuEvent() {
      const editor = this.editorRef;
      editor.on('AudioMenuClick', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'audio/*'; // 只允许选择音频文件

        input.onchange = (event) => {
          const file = event.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
              const url = reader.result;
              editor.insertNode({
                type: 'video',
                src: url,
                width:80,
                height:80,
                children: [{
                  text: ''
                }]
              });
            };
          }
        };
        input.click();
      });
      editor.on('ImageMenuClick', () => {
        // 创建一个 input 元素用于选择文件
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*'; // 只允许选择图片文件
        input.onchange = (event) => {
          const file = event.target.files[0];
          if (file) {
            // 使用 FileReader 读取文件并转换为 Data URL
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
              const url = reader.result;
              // 将图片插入到编辑器中
              editor.insertNode({
                type: 'image',
                src: url,
                children: [{
                  text: ''
                }]
              });
            };
          }
        };
        // 触发点击 input 的事件，打开文件选择对话框
        input.click();
      });
      editor.on('VideoMenuClick', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'video/*'; // 只允许选择视频文件

        input.onchange = (event) => {
          const file = event.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
              const url = reader.result;
              editor.insertNode({
                type: 'video',
                src: url,
                children: [{
                  text: ''
                }]
              });
            };
          }
        };
        input.click();
      });
    }
  }
};
</script>

<style scoped lang="scss">
</style>
