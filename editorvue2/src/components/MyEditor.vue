<template>
  <div class="backgroundDiv">
    <div class="toolbar-container">
      <EditorTitle :saveEditor="saveEditorByButton" :showExitConfirm="showExitConfirm"/>
      <Toolbar
          :defaultConfig="toolbarConfig"
          :editor="editor"
          :mode="mode"
      />
    </div>
    <div class="editor-container">
      <div class="title-container">
        <input v-model="title" placeholder="请输入标题">
      </div>
      <div id="w-e-textarea-1" class="editor-wrapper">
        <Editor
            v-model="html"
            :defaultConfig="editorConfig"
            :mode="mode"
            @onChange="onChange"
            @onCreated="onCreated"
        />
        <LoadingOverlay v-if="isLoading"/> <!-- 加载动画覆盖在编辑器上层 -->
      </div>
    </div>
    <div class="right-controls">
      <span class="wordNumber">{{ TiLength }}/{{ maxChars }}</span>
    </div>
    <div v-if="warnShow" class="warnText">
      {{ changedMaxLen ? '编辑内容不能超过5000个字!' : '编辑内容不能超过1000个字!' }}
    </div>
  </div>
</template>

<script>
import {Editor, Toolbar} from '@wangeditor/editor-for-vue';
import registerMenu from "@/utils";
import {get_file} from "@/api/FileManage";
import {saveEditor} from "@/api/EditorManage";
import EditorTitle from "@/components/title.vue";
import LoadingOverlay from "@/components/LoadingOverlay.vue"; // 引入加载动画组件

export default {
  name: 'TextEditor',
  components: {EditorTitle, Editor, Toolbar, LoadingOverlay},
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
      title: '', // 添加标题变量
      toolbarConfig: {
        insertKeys: {
          keys: ['ImageMenu', 'VideoMenu', 'AudioMenu', '|', 'MyOCR', 'MyVideoExtract', 'MyAudioExtract', '|', 'MyPolishing', 'MyFormatting', 'MyPainter']
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
      textId: '',
      isLoading: true // 添加 isLoading 状态
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
    //创建编辑器时获取文件内容并渲染到编辑器上
    onCreated(editor) {
      this.editor = Object.seal(editor);
      registerMenu(this.editor, this.toolbarConfig);

      const sessionId = localStorage.getItem('session_id');
      this.textId = this.$route.query.file_id;
      get_file(sessionId, this.textId)
          .then(response => {
            if (response.code === 0) {
              this.html = response.text_content;
              this.title = response.file_name;
            } else {
              console.error(response.error);
            }
            this.isLoading = false; // 内容加载完成后隐藏加载动画
          })
          .catch(error => {
            console.error('获取失败:', error);
            this.isLoading = false;
          });
      editor.setHtml(this.html);
    },

    onChange(editor) {
      const text = editor.getText().replace(/<[^<>]+>/g, '').replace(/&nbsp;/gi, '');
      this.TiLength = text.length;
      this.warnShow = this.changedMaxLen ? this.TiLength > 5000 : this.TiLength > 1000;
      this.saveEditor(); // 文本内容发生改变时保存文件
    },

    async saveEditor() {
      //获取内容后才触发保存，避免文件加载尚未成功时，文件内容被空白覆盖
      if (!this.editor) {
        console.log('编辑器实例尚未创建.');
        return;
      }
      const text = this.editor.getText();
      if (text === "") {
        console.log('文本为空');
        return;
      }
      const content = this.editor.getHtml();
      const session_id = localStorage.getItem('session_id');
      saveEditor(session_id, this.textId, content, this.title)
          .then(response => {
            if (response.code === 0) {
              console.log('文件保存成功');
            } else {
              console.error('文件保存失败');
            }
          })
          .catch(error => {
            console.error('获取失败', error);
          })
    },
    async saveEditorByButton() {
      //获取内容后才触发保存，避免文件加载尚未成功时，文件内容被空白覆盖
      if (!this.editor) {
        console.log('编辑器实例尚未创建.');
        return;
      }
      const content = this.editor.getHtml();
      const session_id = localStorage.getItem('session_id');
      saveEditor(session_id, this.textId, content, this.title)
          .then(response => {
            if (response.code === 0) {
              this.$message({
                showClose: true,
                message: '文件已成功保存！',
                type: 'success',
              })
            } else {
              this.$message({
                showClose: true,
                message: '文件保存失败，请稍后再试T_T',
                type: 'error',
              })
            }
          })
          .catch(error => {
            console.error('获取失败', error);
            this.$message({
              showClose: true,
              message: '文件保存失败，请稍后再试T_T',
              type: 'error',
            })
          })
    },

    showExitConfirm() {
      this.$confirm('确定要退出编辑器吗？未保存的内容将丢失。', '是否退出', {
        distinguishCancelAndClose: true,
        confirmButtonText: '退出',
        cancelButtonText: '取消'
      })
          .then(() => {
            this.$router.push('/HomePage');
            this.$message({
              type: 'success',
              message: '成功退出',
            })
          })
          .catch(action => {
            this.$message({
              type: 'info',
              message: action === 'cancel'
                  ? '取消退出'
                  : '取消退出'
            })
          });
    },
  },
  mounted() {

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
html, body {
  background-color: #f9f9f9;
  height: 100%;
  margin: 0;
  padding: 0;
  font-family: 'Arial', sans-serif;
  color: #333;
  overflow-y: auto;
}

/* 确保 loading-overlay 覆盖在 editor-wrapper 上 */
.editor-wrapper {
  position: relative;
}

.backgroundDiv {
  background: #ffffff;
  margin: 0 auto;
  display: block;
  height: 100vh;
  overflow: auto;
}

.toolbar-container {
  position: fixed;
  top: 0;
  width: 100%;
  background-color: #ffffff;
  z-index: 10;
  border: 2px solid #e1e0e0;
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
  overflow-y: auto;
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
  margin-right: 21%;
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
