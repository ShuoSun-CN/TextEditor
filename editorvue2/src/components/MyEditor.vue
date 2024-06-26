<template>
  <div class="backgroundDiv">
    <div class="toolbar-container">
      <EditorTitle :saveEditor="saveEditor" :showExitConfirm="showExitConfirm"/>
      <Toolbar
          :defaultConfig="toolbarConfig"
          :editor="editor"
          :mode="mode"
      />
      <hr class="divider">
    </div>
    <div class="editor-container">
      <div class="title-container">
        <input placeholder="请输入标题">
      </div>
      <div class="editor-wrapper">
        <Editor
            v-model="html"
            :defaultConfig="editorConfig"
            :mode="mode"
            class="editor"
            @onChange="onChange"
            @onCreated="onCreated"
        />
      </div>
    </div>
    <div class="right-controls">
          <span class="wordNumber">{{ TiLength }}/{{ maxChars }}</span>
    </div>
    <div v-if="warnShow" class="warnText">
      {{ changedMaxLen ? '编辑内容不能超过5000个字!' : '编辑内容不能超过1000个字!' }}
    </div>

    <div v-if="showConfirm" class="confirm-overlay">
      <div class="confirm-box">
        <p>确定要退出编辑器吗？未保存的内容将丢失。</p>
        <button class="confirm-button" @click="exitEditor">确认,返回主页</button>
        <button class="cancel-button" @click="hideExitConfirm">取消</button>
      </div>
    </div>
  </div>
</template>

<script>
import {Editor, Toolbar} from '@wangeditor/editor-for-vue'
import registerMenu from "@/utils";
import axios from "axios";
import {get_file} from "@/api/FileManage";
import EditorTitle from "@/components/title.vue";

export default {
  name: 'TextEditor',
  components: {EditorTitle, Editor, Toolbar},
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
      html: this.contents,
      toolbarConfig: {
        insertKeys: {
          keys: []
        },
        excludeKeys: ['group-image', 'group-video'],
      },
      editorConfig: {
        MENU_CONF: {},
        placeholder: '请输入内容...',
        readOnly: false,
        hoverbarKeys: {
          'text': {
            menuKeys: ['insertLink', 'MyPolishing', 'MyPainter'],
          }
        },
      },
      mode: 'default',
      TiLength: 0,
      warnShow: false,
      changedMaxLen: this.changeMaxLen,
      maxChars: this.changeMaxLen ? 5000 : 1000,
      showConfirm: false,
      textId: '',
      saveInterval: null,
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
      registerMenu(this.editor, this.toolbarConfig);

      const sessionId = localStorage.getItem('session_id');
      this.textId = this.$route.query.file_id;
      get_file(sessionId, this.textId)
          .then(response => {
            if (response.code === 0) {
              this.html = response.text_content;
            } else {
              console.error(response.error);
            }
          })
          .catch(error => {
            console.error('Error fetching file:', error);
          });
      editor.setHtml(this.html);
    },

    onChange(editor) {
      const text = editor.getText().replace(/<[^<>]+>/g, '').replace(/&nbsp;/gi, '');
      this.TiLength = text.length;
      this.warnShow = this.changedMaxLen ? this.TiLength > 5000 : this.TiLength > 1000;
    },
    async saveEditor() {
      const text = this.editor.getText();
      if(text===""){
        console.log('文本为空');
        return;
      }
      const content = this.editor.getHtml();
      const session_id = localStorage.getItem('session_id');

      const data = {
        session_id: session_id,
        text_id: this.textId,
        text_content: content,
      };

      try {
        const response = await axios.post('http://127.0.0.1:8000/save_text/', data, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.data.code === 0) {
         // console.log('文件保存成功');
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
      this.$router.push('/HomePage');
    }
  },
  mounted() {
    this.saveInterval = setInterval(this.saveEditor, 5000);
  },
  beforeDestroy() {
    if (this.editor) {
      this.editor.destroy();
    }
    if (this.saveInterval) {
      clearInterval(this.saveInterval);
    }
  }
}
</script>


<style src="@wangeditor/editor/dist/css/style.css"></style>
<style lang="scss" scoped>
html, body {
  background-color: #f9f9f9;
  height: 100%;
  margin: 0;
  padding: 0;
  font-family: 'Arial', sans-serif;
  color: #333;
  overflow-y: auto;
}

.backgroundDiv {
  background: #ffffff;
  margin: 0 auto;
  display: block;
  height: 100vh;
  overflow: auto;
}

.toolbar-container{
  position: fixed;
  top: 0;
  width: 100%;
  background-color: #ffffff;
  z-index: 10;
}

.divider {
  width: 100%;
  border: none;
  border-top: 2px solid #e1e0e0;
  margin: 10px 0;
}

.editor-container {
  width: 60%;
  margin: 160px auto 0;
}

.editor-wrapper {
  margin-top: 10px;
  height: calc(100vh - 120px);
  background-color: #ffffff;
  overflow-y: hidden;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 10px #cdcdcd;
}

.title-container {
  background: #ffffff;
  border-bottom: 1px solid #e8e8e8;
  width: 100%;
  height: 40px;
  text-align: center;
}

.title-container input {
  font-size: 24px;
  border: none;
  outline: none;
  width: 100%;
  padding: 5px;
  box-sizing: border-box;
  color: #333;
}

.editor-footer {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-top: 1px solid #e8e8e8;
  margin-top: 10px;
}

.left-controls button {
  margin: 0 5px;
}

.right-controls {
  margin-bottom: 5px;
  margin-right:21%;
  text-align: right;
}

.editor-button {
  background-color: #1e90ff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.editor-button:hover {
  background-color: #1c86ee;
}

.exit-button {
  background-color: #ff4d4f;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.exit-button:hover {
  background-color: #ff7875;
}

.wordNumber {
  color: #333;
}

.warnText {
  color: red;
  text-align: center;
  margin-top: 10px;
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
  border: none;
  padding: 10px 20px;
  margin: 10px;
  cursor: pointer;
  border-radius: 5px;
}

.confirm-button {
  background-color: #1e90ff;
  color: white;
}

.confirm-button:hover {
  background-color: #1c86ee;
}

.cancel-button {
  background-color: #ff4d4f;
  color: white;
}

.cancel-button:hover {
  background-color: #ff7875;
}
</style>
