<template>
  <div>
    <div style="border: 1px solid #06164d;">
      <Toolbar
        style="border-bottom: 1px solid rgba(102,117,169,0.75)"
        :editor="editor"
        :defaultConfig="toolbarConfig"
        :mode="mode"
      />
      <Editor
        style="height: 500px; overflow-y: hidden;"
        v-model="html"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="onCreated"
        @onChange="onChange"
      />
    </div>
    <span class="wordNumber">{{ TiLength }}/{{ maxChars }}</span>
    <div>
      <p v-if="warnShow" class="warnText">
        {{ changedMaxLen ? '编辑内容不能超过5000个字!' : '编辑内容不能超过1000个字!' }}
      </p>
    </div>
  </div>
</template>

<script>
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import registerMenu from "@/utils";
import axios from "axios";

export default {
  name: 'TextEditor',
  components: { Editor, Toolbar },
  props: {
    contents: {
      type: String,
      default: '',
    },
    changeMaxLen: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      editor: null,
      html: this.contents || '<p>hello</p>',
      toolbarConfig: {
        insertKeys: {
          keys: [
            '|', 'myMenuOCR', 'myMenuVideoExtract', 'myMenuAudioExtract', '|',
            'myMenuFormatting', '|', 'myMenuPolishing', '|'
          ]
        },
        excludeKeys: []
      },
      editorConfig: {
        MENU_CONF: {
          uploadImage: {
            fileName: "file",
            maxFileSize: 1 * 1024 * 1024,
            maxNumberOfFiles: 10,
            allowedFileTypes: [],
            server: "http://127.0.0.1:8000/upload_img/",
            timeout: 5 * 1000,
          },
          uploadVideo: {
            fileName: "file",
            server: "http://localhost:8000/upload_video/",
            maxFileSize: 100 * 1024 * 1024,
          }
        },
        placeholder: '请输入内容...',
        readOnly: false,
        hoverbarKeys:{

        },
      },
      mode: 'default', // or 'simple'
      TiLength: 0,
      warnShow: false,
      changedMaxLen: this.changeMaxLen,
      maxChars: this.changeMaxLen ? 5000 : 1000,
    }
  },
  watch: {
    contents: {
      handler(newV) {
        if (this.editor) {
          this.editor.setHtml(newV);
        }
      },
      immediate: true,
    },
    changeMaxLen: {
      handler(newV) {
        this.changedMaxLen = newV;
        this.maxChars = newV ? 5000 : 1000;
      },
      immediate: true,
    },
  },
  methods: {
    onCreated(editor) {
      this.editor = Object.seal(editor);
      editor.setHtml(this.contents);
      editor.getConfig().MENU_CONF['color'] = {
        colors: ['#000', '#333', '#666'],
      };
      editor.getConfig().MENU_CONF['fontFamily'] = {
        fontFamilyList: ['微软雅黑'],
      };
      console.log("原有菜单功能");
      console.log(editor.getAllMenuKeys());
      // 注册自定义菜单功能
      registerMenu(this.editor, this.toolbarConfig);
      console.log("所有菜单功能");
      console.log(editor.getAllMenuKeys());

      this.initMediaMenuEvent();
    },
    initMediaMenuEvent() {
      const editor = this.editor;
      editor.on('AudioMenuClick', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'audio/*'; // 只允许选择音频文件

        input.onchange = async (event) => {
          const file = event.target.files[0];
          if (file) {
            const formData = new FormData();
            formData.append('file', file);

            try {
              const response = await axios.post('http://127.0.0.1:8000/upload_audio/', formData);
              const data = response.data;

              if (data.url) {
                const url = data.url;
                editor.insertNode({
                  type: 'video',
                  src: url,
                  children: [{ text: '' }]
                });

                this.$message.success('音频上传成功');
              } else {
                this.$message.error('音频上传失败');
              }
            } catch (error) {
              console.error('音频上传失败:', error);
              this.$message.error('音频上传失败，请重试');
            }
          }
        };
        input.click();
      });
    },
    onChange(editor) {
      const html = editor.getHtml();
      const text = editor.getText().replace(/<[^<>]+>/g, '').replace(/&nbsp;/gi, '');
      console.log("html："+html);
      console.log("纯文本："+text);

      this.TiLength = text.length;
      this.warnShow = this.changedMaxLen ? this.TiLength > 5000 : this.TiLength > 1000;
    },
  },
  beforeDestroy() {
    if (this.editor) {
      this.editor.destroy();
    }
  }
}
</script>

<style src="@wangeditor/editor/dist/css/style.css"></style>
