<!--用来测试功能的页面-->
<template>
  <div style="border: 1px solid #ccc;">
    <Editor
        style="height: 500px; overflow-y: hidden;"
        v-model="html"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="onCreated"
    />
  </div>
</template>
<script>
import "@wangeditor/editor/dist/css/style.css"; // 引入 css
import Vue from 'vue'
import { Editor } from '@wangeditor/editor-for-vue'

export default Vue.extend({
  components: { Editor },
  data() {
    return {
      editor: null,
      html: '<p>hello</p>',
      editorConfig: {
        placeholder: "请输入内容...",
        MENU_CONF: {
          // 配置上传图片
          uploadImage: {
            fieldName: "file",
            server: "http://localhost:9090/api/forum/upload",
          },
          uploadVideo: {
            fieldName: "file",
            server: "http://localhost:9090/api/forum/upload/video",
            //上传大小100m
            maxFileSize: 100 * 1024 * 1024,
          },
        },
      },
      mode: 'default', // or 'simple'
    }
  },
  methods: {
    onCreated(editor) {
      this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
    },
  },
  mounted() {
    // 模拟 ajax 请求，异步渲染编辑器
    setTimeout(() => {
      this.html = '<p>模拟 Ajax 异步设置内容 HTML</p>'
    }, 1500)
  },
  beforeDestroy() {
    const editor = this.editor
    if (editor == null) return
    editor.destroy() // 组件销毁时，及时销毁编辑器
  }
})
</script>