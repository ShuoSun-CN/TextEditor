<template>
  <div>
    <div class="editor-header">
      <button @click="saveEditor" class="editor-button">保存</button>
      <button @click="showExitConfirm" class="exit-button">退出</button>
    </div>
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

    <div v-if="showConfirm" class="confirm-overlay">
      <div class="confirm-box">
        <p>确定要退出编辑器吗？未保存的内容将丢失。</p>
        <button @click="exitEditor" class="confirm-button">确认</button>
        <button @click="hideExitConfirm" class="cancel-button">取消</button>
      </div>
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
      default: '<h1>标题</h1><p>请输入正文...</p><p><br></p>',
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
            '|', 'myMenuOCR','myMenuImage', 'myVideoImage','myMenuVideoExtract', 'myMenuAudioExtract', '|',
            'myMenuFormatting', '|', 'myMenuPolishing', '|'
          ]
        },
        excludeKeys: ['group-image','group-video'],
      },
      editorConfig: {
        MENU_CONF: {},
        placeholder: '请输入内容...',
        readOnly: false,
        hoverbarKeys: {
          'text': {
            menuKeys: ['insertLink', 'MyPolishing'],
          }
        },
      },
      mode: 'default',
      TiLength: 0,
      warnShow: false,
      changedMaxLen: this.changeMaxLen,
      maxChars: this.changeMaxLen ? 5000 : 1000,
      showConfirm: false,
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
      registerMenu(this.editor, this.toolbarConfig);
    },

    onChange(editor) {
      const text = editor.getText().replace(/<[^<>]+>/g, '').replace(/&nbsp;/gi, '');
      this.TiLength = text.length;
      this.warnShow = this.changedMaxLen ? this.TiLength > 5000 : this.TiLength > 1000;
      console.log(editor.getHtml());
    },
    async saveEditor() {
      // 获取编辑器内容
      const content = this.editor.getHtml();

      // 使用 DOMParser 解析 HTML 并提取标题
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');
      const titleElement = doc.querySelector('h1');
      const title = titleElement ? titleElement.textContent : '未命名文件';

      const session_id = localStorage.getItem('session_id');

      const data = {
        session_id: session_id,
        text_id: title,
        text_content: content,
      };

      try {
        const response = await axios.post('http://127.0.0.1:8000/save_text/', data, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log(response);
        if (response.data.code === 0) {
          console.log('文件保存成功');
        } else {
          console.error('文件保存失败');
        }
      } catch (error) {
        console.error('文件保存失败:', error);
      }
    },
    showExitConfirm() {
      this.showConfirm = true;
    },
    hideExitConfirm() {
      this.showConfirm = false;
    },
    exitEditor() {
      this.$router.push('/HomePage');//退出到文件主页
    }
  },
  beforeDestroy() {
    if (this.editor) {
      this.editor.destroy();
    }
  }
}
</script>

<style src="@wangeditor/editor/dist/css/style.css"></style>
<style>
.editor-header {
  display: flex;
  justify-content: flex-end;
  padding: 10px;
}
.editor-button {
  background-color: #06164d;
  color: white;
  border: none;
  padding: 10px 20px;
  margin-right: 10px;
  cursor: pointer;
}
.editor-button:hover {
  background-color: #0a2472;
}
.exit-button {
  background-color: #ff4d4f;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
}
.exit-button:hover {
  background-color: #ff7875;
}
.confirm-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.confirm-box {
  background: white;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
}
.confirm-button, .cancel-button {
  background-color: #06164d;
  color: white;
  border: none;
  padding: 10px 20px;
  margin: 10px;
  cursor: pointer;
}
.confirm-button:hover {
  background-color: #0a2472;
}
.cancel-button {
  background-color: #ff4d4f;
}
.cancel-button:hover {
  background-color: #ff7875;
}
</style>
