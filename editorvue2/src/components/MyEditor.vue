<template>
  <div class="backgroundDiv">
    <div class="toolbar-container">
      <!--导航栏-->
      <EditorTitle
          :fileContent="previousHtml"
          :fileId="textId"
          :fileName="title"
          :isSaving="saving"
          :isVIP="isVIP"
          :saveEditor="saveEditorByButton"
          :saveSuccess="saveSuccess"
          :showExitConfirm="showExitConfirm"
          :stars="stars"
          :userAvatar="userAvatar"
          :userName="userName"
      />
      <!--工具栏-->
      <Toolbar
          :defaultConfig="toolbarConfig"
          :editor="editor"
          :mode="mode"
      />
    </div>
    <!--编辑区-->
    <div class="editor-container">
      <LoadingOverlay v-if="isLoading"/> <!-- 加载动画覆盖在编辑器上层 -->

      <!--文件名-->
      <div class="title-container">
        <input v-model="title" placeholder="请输入文件名">
      </div>
      <!--编辑器-->
      <div id="w-e-textarea-1" class="editor-wrapper">
        <Editor
            v-model="html"
            :defaultConfig="editorConfig"
            :mode="mode"
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
  </div>
</template>

<script>
import {Editor, Toolbar} from '@wangeditor/editor-for-vue';
import registerMenu from "@/utils";
import {saveEditor} from "@/api/EditorManage";
import EditorTitle from "@/components/title.vue";
import {get_user_info} from "@/api/UserFile";
import {get_file} from "@/api/FileManage";
import LoadingOverlay from "@/components/Loading.vue";

export default {
  name: 'TextEditor',
  components: {LoadingOverlay, EditorTitle, Editor, Toolbar},
  props: {
    changeMaxLen: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      editor: null,

      ws: null, // WebSocket实例
      toolbarConfig: {
        toolbarKeys: [
          "headerSelect", "blockquote", "|",
          "bold", "underline", "italic", {
            "key": "group-more-style",
            "title": "更多",
            "iconSvg": "<svg viewBox=\"0 0 1024 1024\"><path d=\"M204.8 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z\"></path><path d=\"M505.6 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z\"></path><path d=\"M806.4 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z\"></path></svg>",
            "menuKeys": [
              "through",
              "code",
              "sup",
              "sub",
              "clearStyle"
            ]
          }, "color", "bgColor", "|",
          "ImageMenu", "VideoMenu", "AudioMenu", "|",
          "MyOCR", "MyVideoExtract", "MyAudioExtract", "objectionDetect", "|",
          "MyPolishing", "MyFormatting", "MyPainter", "|",
          "MindMap", "MindTable", "datavision", "|",
          "fontSize", "fontFamily", "lineHeight", "|",
          "bulletedList", "numberedList", "todo", {
            "key": "group-justify",
            "title": "对齐",
            "iconSvg": "<svg viewBox=\"0 0 1024 1024\"><path d=\"M768 793.6v102.4H51.2v-102.4h716.8z m204.8-230.4v102.4H51.2v-102.4h921.6z m-204.8-230.4v102.4H51.2v-102.4h716.8zM972.8 102.4v102.4H51.2V102.4h921.6z\"></path></svg>",
            "menuKeys": [
              "justifyLeft",
              "justifyRight",
              "justifyCenter",
              "justifyJustify"
            ]
          }, {
            "key": "group-indent",
            "title": "缩进",
            "iconSvg": "<svg viewBox=\"0 0 1024 1024\"><path d=\"M0 64h1024v128H0z m384 192h640v128H384z m0 192h640v128H384z m0 192h640v128H384zM0 832h1024v128H0z m0-128V320l256 192z\"></path></svg>",
            "menuKeys": [
              "indent",
              "delIndent"
            ]
          }, "|",
          "emotion", "insertLink", "insertTable", "codeBlock", "divider", "|",
          "undo", "redo"
        ],
      },
      editorConfig: {
        MENU_CONF: {},
        placeholder: '请输入内容...',
        readOnly: false,
        hoverbarKeys: {
          'text': {
            menuKeys: ['MyPolishing', 'MyPainter', '|', 'bold', 'underline', 'italic', 'color', 'bgColor'],
          }
        },
      },
      previousHtml: '', // 跟踪历史内容
      mode: 'default',

      //字符统计
      TiLength: 0,
      warnShow: false,
      changedMaxLen: this.changeMaxLen,
      maxChars: this.changeMaxLen ? 5000 : 1000,

      textId: '',//文本号
      title: '',//文件标题
      html: '',//编辑器内容
      fileContent:'',//文本内容
      writePriority: 1,//写作权限

      isLoading: true, // 控制加载动画
      saving: false,   // 控制保存动画
      saveSuccess: false, // 控制保存成功提示

      userAvatar: '',
      userName: '',
      isVIP: false,
      stars: 0,
    }
  },
  watch: {
    changeMaxLen: {
      handler(newV) {
        this.changedMaxLen = newV;
        this.maxChars = newV ? 5000 : 1000;
      },
      immediate: true,
    },
    title: {
      handler(newTitle) {
        this.title = newTitle;
        this.saveEditor();
      },
      immediate: true,
    },

  },
  methods: {
    async onCreated(editor) {
      //获取文件信息
      const session_id = localStorage.getItem('session_id');
      this.textId = this.$route.query.file_id;
      this.isLoading = true;
      await get_file(session_id, this.textId)
          .then(response => {
            if (response.code === 0) {
              this.title = response.file_name;
              this.fileContent = response.text_content;
              this.writePriority = response.write_priority;
              this.previousHtml = this.html;
            } else {
              this.$message({
                showClose: true,
                message: '文件载入失败！',
                type: 'error',
              })
            }
            this.isLoading = false;
          })
          .catch(error => {
            console.error('Failed to fetch:', error);
            this.$message({
              showClose: true,
              message: '载入失败！刷新网页重新加载',
              type: 'error',
            })
            this.isLoading = false;
          });
      console.log(this.writePriority);

      //注册
      this.editor = Object.seal(editor);
      registerMenu(this.editor, this.toolbarConfig);
      console.log(this.fileContent);
      this.editor.dangerouslyInsertHtml(this.fileContent);

      if (this.writePriority === 0) {
        this.editor.disable();
        this.$message({
                  showClose: true,
                  message: '您的操作权限为：只读',
                  type: 'info',
        })
      }

      //websocket连接
      this.setupWebSocket(editor);
      //获取用户头像等信息
      await this.fetchUserInfo();
    },

    onChange() {
      const editor = this.editor;
      if (editor == null) return
      try {
        const currentHtml = editor.getHtml();
        //很多东西会触发onChange(),确保内容发送改变
        if (currentHtml !== this.previousHtml) {
          this.saveEditor();
          this.previousHtml = currentHtml;
          this.sendToWebSocket(currentHtml);
        }
        //内容变化时统计字符数量
        const text = editor.getText().replace(/<[^<>]+>/g, '').replace(/&nbsp;/gi, '');
        this.TiLength = text.length;
        this.warnShow = this.changedMaxLen ? this.TiLength > 5000 : this.TiLength > 1000;
      } catch (error) {
        console.log(error);
      }
    },
    async fetchUserInfo() {
      try {
        const session_id = localStorage.getItem('session_id');
        const response = await get_user_info({session_id});
        if (response.code === -1) {
          this.$message.error('登录过期，请重新登录');
          this.$router.push('/UserLogin');
        } else if (response.code === 1) {
          this.$message.error('系统故障');
        } else {
          this.userName = response.user_name;
          this.userAvatar = "http://127.0.0.1:8000/avatar/" + response.user_avator;
          this.isVIP = response.vip === 1; // 检查用户是否是VIP
          this.stars = response.stars;
        }
      } catch (error) {
        console.error('获取用户信息失败:', error);
      }
    },

    setupWebSocket() {
      const editor = this.editor
      const sessionId = localStorage.getItem('session_id');
      this.ws = new WebSocket(`ws://127.0.0.1:8000/ws/update_text/?session_id=${sessionId}&text_id=${this.textId}`);
      this.ws.onopen = () => {
        console.log('WebSocket连接成功');
      };

      this.ws.onmessage = (event) => {
        try {
          console.log("触发onMessage函数");
          const data = JSON.parse(event.data);
          if (data.text && data.text !== editor.getHtml()) {
            editor.clear();
            editor.dangerouslyInsertHtml(data.text);
            this.previousHtml = data.text;
          }
        } catch (error) {
          console.log(error);
        }

      };

      this.ws.onclose = () => {
        console.log('WebSocket连接关闭.');
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    },

    sendToWebSocket(content) {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({text: content}));
      }
    },

    async saveEditor() {
      //自动保存
      //实例尚未创建时不保存；
      if (!this.editor) {
        console.log('编辑器实例尚未创建.');
        return;
      }
      //加载未完成时，若编辑器空白则不保存，避免文本内容被空白覆盖
      const text = this.editor.getText();
      if (text === "") {
        return;
      }

      this.saving = true;
      this.saveSuccess = false;

      const content = this.editor.getHtml();
      const session_id = localStorage.getItem('session_id');
      try {
        const response = await saveEditor(session_id, this.textId, content, this.title);
        if (response.code === 0) {
          //console.log('文件自动保存成功');
          this.saveSuccess = true;
        } else {
          console.error('文件自动保存失败');
        }
      } catch (error) {
        console.error('自动保存失败，发生错误:', error);
      } finally {
        this.saving = false;
        setTimeout(() => this.saveSuccess = false, 2000);
      }
    },

    async saveEditorByButton() {
      if (!this.editor) {
        console.log('编辑器实例尚未创建.');
        return;
      }
      //手动保存可以在空白情况下保存
      const content = this.editor.getHtml();
      const session_id = localStorage.getItem('session_id');

      try {
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
              console.error('Failed to save:', error);
              this.$message({
                showClose: true,
                message: '文件保存失败，请稍后再试T_T',
                type: 'error',
              })
            });

      } catch (error) {
        console.log(error);
        this.$message({
          showClose: true,
          message: '文件保存失败，请稍后再试T_T',
          type: 'error',
        })
      }


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

  beforeDestroy() {
    const editor = this.editor;
    if (editor) {
      editor.destroy();
    }
    if (this.ws) {
      this.ws.close();
    }
  },
};
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

.w-e-insert-video {
  width: 80%;
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
  background-color: #6991c7;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.editor-button:hover {
  background-color: #6991c7;
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
  background-color: #6991c7;
  color: white;
}

.confirm-button:hover {
  background-color: #6991c7;
}

.cancel-button {
  background-color: #ff4d4f;
  color: white;
}

.cancel-button:hover {
  background-color: #ff7875;
}
</style>