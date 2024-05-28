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
import Vue from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { Boot } from "@wangeditor/editor";
import MyPolishing from "@/utils/MyPolishing";
import MyFormatting from "@/utils/MyFormatting";
import MyOCRModalMenu from "@/utils/MyOCR";
import MyVideoExtractModalMenu from "@/utils/MyVideoExtract";
import MyAudioExtractModalMenu from "@/utils/MyAudioExtract";

export default Vue.extend({
  name: 'TextEditor',
  components: {Editor, Toolbar},
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
      html: '<p>hello</p>',
      toolbarConfig: {
        insertKeys: {
          keys: ['|', 'myMenuOCR', 'myMenuVideoExtract', 'myMenuAudioExtract', '|', 'myMenuFormatting', '|', 'myMenuPolishing', '|']
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
            server: "http://localhost:8000/upload_img",
            maxFileSize: 100 * 1024 * 1024,
          }
        },
        placeholder: '请输入内容...',
        readOnly: false,
      },
      mode: 'default', // or 'simple'
      TiLength: 0,
      warnShow: false,
      changedMaxLen: false,
      maxChars: 0,
    }
  },
  watch: {
    contents: {
      handler(newV) {
        if (this.editor) {
          this.editor.setHtml(newV);
        }
      },
    },
    changeMaxLen: {
      handler(newV) {
        this.changedMaxLen = newV;
        this.maxChars = newV ? 5000 : 1000;
      },
      immediate: true,
    },
  },
  created() {
    this.myMenuPolishing = {
      key: 'myMenuPolishing',
      factory: () => new MyPolishing(this.editor),
    };
    this.myMenuFormatting = {
      key: 'myMenuFormatting',
      factory: () => new MyFormatting(this.editor),
    };
    this.myMenuOCR = {
      key: 'myMenuOCR',
      factory: () => new MyOCRModalMenu(this.editor),
    };
    this.myMenuVideoExtract = {
      key: 'myMenuVideoExtract',
      factory: () => new MyVideoExtractModalMenu(this.editor),
    };
    this.myMenuAudioExtract = {
      key: 'myMenuAudioExtract',
      factory: () => new MyAudioExtractModalMenu(this.editor),
    };
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
      const customMenus = [this.myMenuFormatting, this.myMenuPolishing, this.myMenuOCR, this.myMenuVideoExtract, this.myMenuAudioExtract];
      customMenus.forEach(menu => {
        if (!this.editor.getAllMenuKeys().includes(menu.key)) {
          Boot.registerMenu(menu);
        }
      });

      console.log("所有菜单功能");
      console.log(editor.getAllMenuKeys());
      console.log("悬浮菜单功能");
      console.log(editor.getConfig().hoverbarKeys);
    },
    onChange(editor) {
      const text = editor.getText();
      const html = editor.getHtml();
      const reg = /<[^<>]+>/g;
      let value = html.replace(reg, '');
      value = value.replace(/&nbsp;/gi, '');
      this.TiLength = value.length;
      this.warnShow = this.changedMaxLen ? this.TiLength > 5000 : this.TiLength > 1000;
      this.$emit('getContents', html, text);
    },
  },
  beforeDestroy() {
    const editor = this.editor;
    if (editor) {
      editor.destroy();
    }
  }
})
</script>

<style src="@wangeditor/editor/dist/css/style.css"></style>
