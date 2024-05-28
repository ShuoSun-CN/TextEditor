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
          style="height: 500px ; overflow-y: hidden;"
          v-model="html"
          :defaultConfig="editorConfig"
          :mode="mode"
          @onCreated="onCreated"
          @onChange="onChange"
      />
    </div>
    <!--右下角：已撰写的字符数量-->
    <span class="wordNumber" v-if="changedMaxLen">{{ TiLength }}/5000</span>
    <span class="wordNumber" v-else>{{ TiLength }}/1000</span>
    <!--输出一些编辑限制信息,比如:限制字符数量-->
    <div>
      用于输出一些提示信息
      <p v-if="warnShow" class="warnText">
        {{ changedMaxLen ? '编辑内容不能超过5000个字!' : '编辑内容不能超过1000个字!' }}
      </p>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import {Boot} from "@wangeditor/editor";
import MyPolishing from "@/utils/MyPolishing";
import MyFormatting from "@/utils/MyFormatting";
import MyOCRModalMenu from "@/utils/MyOCR";
import MyVideoExtractModalMenu from "@/utils/MyVideoExtract";
import MyAudioExtractModalMenu from "@/utils/MyAudioExtract";
export default Vue.extend({
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
      html: '<p>hello</p>',
      toolbarConfig: {},
      editorConfig: {
        MENU_CONF: {
          //配置上传图片
          uploadImage:{
            fileName:"file",
            maxFileSize: 1 * 1024 * 1024,
            maxNumberOfFiles:10,
            allowedFileTypes:[],
            server:"http://127.0.0.1:8000/upload_img/",
            timeout: 5*1000,
          },
          uploadVideo: {
            fileName: "file",
            server: "http://localhost:8000/upload_img",
            maxFileSize: 100*1024*1024,
          }
        },
        placeholder: '请输入内容...',
        readOnly: false,
      },
      mode: 'default', // or 'simple'
      TiLength: 0,
      warnShow: false,
      changedMaxLen: false,
    }
  },
  watch: {
    contents: {
      //监听文本内容变化
      handler(newV) {
        if (this.editor) {
          this.editor.setHtml(newV);
        }
      },
    },
    changeMaxLen: {
      handler(newV) {
        this.changedMaxLen = newV === true;
      },
      immediate: true,
    },
  },
  //创建菜单组件
  created() {
    this.myMenuPolishing = {
      key: 'myMenuPolishing',
      factory: () => new MyPolishing(this.editor),
    };
    this.myMenuFormatting = {
      key:'myMenuFormatting',
      factory: ()=>new MyFormatting(this.editor),
    }
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
      if(this.editor.getAllMenuKeys().indexOf('myMenuFormatting')===-1){
        Boot.registerMenu(this.myMenuFormatting);
      }
      if (this.editor.getAllMenuKeys().indexOf('myMenuPolishing') === -1) {
        Boot.registerMenu(this.myMenuPolishing);
      }
      if (this.editor.getAllMenuKeys().indexOf('myMenuOCR') === -1) {
        Boot.registerMenu(this.myMenuOCR);
      }
      if (this.editor.getAllMenuKeys().indexOf('myMenuVideoExtract') === -1) {
        Boot.registerMenu(this.myMenuVideoExtract);
      }
      if (this.editor.getAllMenuKeys().indexOf('myMenuAudioExtract') === -1) {
        Boot.registerMenu(this.myMenuAudioExtract);
      }
      // 添加菜单功能
      if (!this.toolbarConfig.insertKeys) {
        this.toolbarConfig.insertKeys = {
          keys: ['|', 'myMenuOCR', 'myMenuVideoExtract', 'myMenuAudioExtract','|','myMenuFormatting','|','myMenuPolishing', '|']
        };
      }

      console.log("所有菜单功能");
      console.log(editor.getAllMenuKeys());
      console.log("悬浮菜单功能");
      console.log(editor.getConfig().hoverbarKeys);

      // 删除某些功能
      this.toolbarConfig.excludeKeys = [

      ];
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
  mounted() {
  },
  beforeDestroy() {
    const editor = this.editor
    if (editor == null) return
    editor.destroy() // 组件销毁时，及时销毁编辑器
  }
})
</script>

<style src="@wangeditor/editor/dist/css/style.css"></style>
