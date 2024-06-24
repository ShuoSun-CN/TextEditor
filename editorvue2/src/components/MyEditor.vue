<template>
  <div class="backgroundDiv">
    <EditorTitle :saveEditor="saveEditor" :showExitConfirm="showExitConfirm"/>
    <div class="editor-container" style="border: 1px solid">
      <Toolbar
        :editor="editor"
        :defaultConfig="toolbarConfig"
        :mode="mode"
      />
      <Editor
        class="editor"
        v-model="html"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="onCreated"
        @onChange="onChange"
      />
      <div class="right-controls">
        <span class="wordNumber">{{ TiLength }}/{{ maxChars }}</span>
      </div>
    </div>
    <div class="editor-footer">

    </div>
    <div v-if="warnShow" class="warnText">
      {{ changedMaxLen ? '编辑内容不能超过5000个字!' : '编辑内容不能超过1000个字!' }}
    </div>

    <div v-if="showConfirm" class="confirm-overlay">
      <div class="confirm-box">
        <p>确定要退出编辑器吗？未保存的内容将丢失。</p>
        <button @click="exitEditor" class="confirm-button">确认,返回主页</button>
        <button @click="hideExitConfirm" class="cancel-button">取消</button>
      </div>
    </div>
  </div>
</template>

<script>
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import registerMenu from "@/utils";
import axios from "axios";
import {get_file} from "@/api/FileManage";
import EditorTitle from "@/components/title.vue";

export default {
  name: 'TextEditor',
  components: { EditorTitle, Editor, Toolbar },
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
      html: this.contents,
      toolbarConfig: {
        insertKeys: {
          keys: [

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
            menuKeys: ['insertLink', 'MyPolishing','MyPainter'],
          }
        },
      },
      mode: 'default',
      TiLength: 0,
      warnShow: false,
      changedMaxLen: this.changeMaxLen,
      maxChars: this.changeMaxLen ? 5000 : 1000,
      showConfirm: false,
      textId:'',
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
            console.log("response.text_content:",response.text_content)
            this.html = response.text_content ||'<h1>标题</h1><p>请输入正文...</p><p><br></p>';
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
      console.log(editor.getHtml());
    },
    async saveEditor() {
      // 获取编辑器内容
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
<style lang="scss" scoped>

html {
  scroll-behavior: smooth;
}

.backgroundDiv {
  background: #ffffff;
}

.editor-footer {
  display: flex;
  justify-content: space-between;
  padding: 10px;
}

.left-controls {

  align-items: center;
  margin: 5px;
  text-align: center;
}

.left-controls button {

  margin: 0 5px;
}


.right-controls {
  margin-top:5px;
  text-align: right;
}


.editor-button {
  background-color: #06164d;
  color: white;
  border: none;
  padding: 10px 20px;
  margin-left: 10px;
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

.editor-container {
  width: 80%; /* 控制编辑器容器的宽度 */
  margin: 0 auto; /* 使编辑器居中 */
  padding: 20px 20px 5px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.editor {
  height: 500px;
  overflow-y: hidden;
  border: 1px solid #06164d;
  border-radius: 8px;
  background-color: #ffffff;
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
