<template>
  <div class="backgroundDiv">
     <div
        v-if="writePriority === 0"
        class="read-only-overlay1"
        @click="handleReadOnlyClick"
      ></div>
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
        <el-divider></el-divider>
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
         <div
        v-if="writePriority === 0"
        class="read-only-overlay"
        @click="handleReadOnlyClick"
      ></div>
      </div>
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
import axios from "axios";


export default {
  name: 'TextEditor',
  components: {LoadingOverlay, EditorTitle, Editor, Toolbar},
  data() {
    return {
      editor: null,

      ws: null, // WebSocket实例
      reconnectInterval: 5000, // 重新连接的时间间隔
      reconnectAttempts: 0,
      maxReconnectAttempts: 10, // 最大重连次数

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
        scroll: false,
        autoFocus :true,//自动聚焦
        hoverbarKeys: {
          'text': {
            menuKeys: ['MyPolishing', 'MyPainter', '|', 'bold', 'underline', 'italic', 'color', 'bgColor'],
          }
        },
      },
      previousHtml: '', // 跟踪历史内容
      mode: 'default',

      textId: '',//文本号
      title: '',//文件标题
      html: '',//编辑器内容
      fileContent: '',//文本内容
      writePriority: 1,//写作权限

      isLoading: true, // 控制加载动画
      saving: false,   // 控制保存动画
      saveSuccess: false, // 控制保存成功提示
      isOnChangeEnabled: true, // 用于控制 onChange 是否启用

      userAvatar: '',
      userName: '',
      isVIP: false,
      stars: 0,

      cancelTokenSource: null, // Axios 请求取消令牌
    }
  },
  watch: {
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
      console.log("执行onCreated");
      this.textId = this.$route.query.file_id;
      this.isLoading = true;

       // 创建取消令牌
      this.cancelTokenSource = axios.CancelToken.source();
      try {
        const session_id = localStorage.getItem('session_id');
        const response = await get_file(session_id, this.textId, {
          cancelToken: this.cancelTokenSource.token,
        });

        if (response.code === 0) {
          this.title = response.file_name;
          this.html = response.text_content;
          this.writePriority = response.write_priority;
          this.previousHtml = this.html;
        } else {
          this.$message.error('文件载入失败！');
        }
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('请求被取消:', error.message);
        } else {
          this.$message.error('载入失败！刷新网页重新加载');
        }
      } finally {
        this.isLoading = false;
      }

      this.editor = Object.seal(editor);
      registerMenu(this.editor, this.toolbarConfig);

      if (this.writePriority === 0) {
        this.$message.info('您的操作权限为：只读');
      }
      await this.fetchUserInfo();
      //websocket连接
      this.setupWebSocket();
      //获取用户头像等信息

    },

  onChange(editor) {
      if (!this.isOnChangeEnabled || !editor) return;
      try {
        const currentHtml = editor.getHtml();
        if (currentHtml !== this.previousHtml) {
          this.previousHtml = currentHtml;
          this.saveEditor();
          this.sendToWebSocket(currentHtml);
        }
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
      const editor = this.editor;
      if (editor == null) {
        return;
      }
      const sessionId = localStorage.getItem('session_id');
      this.ws = new WebSocket(`ws://127.0.0.1:8000/ws/update_text/?session_id=${sessionId}&text_id=${this.textId}`);

      this.ws.onopen = () => {
        console.log('WebSocket连接成功');
        this.reconnectAttempts = 0; // 重置重连计数器
      };

      this.ws.onmessage = (event) => {
        try {
          console.log("触发onMessage函数");
          const data = JSON.parse(event.data);
          if (editor == null) {
            console.log("onMessage1:编辑器实例未创建");
            return;
          }

          if (data.text && data.text !== editor.getHtml()) {
            this.isOnChangeEnabled = false;  // 禁用 onChange 处理
            if (editor.isDisabled()) editor.enable()
            editor.clear();
            if(!editor.isFocused()){editor.focus();}
            editor.dangerouslyInsertHtml(data.text); // 插入新的内容
            this.previousHtml = data.text;
            this.isOnChangeEnabled = true;  // 恢复 onChange 处理
            console.log("恢复onChange处理");

          }
        } catch (error) {
          console.log("WebSocket消息处理错误:", error);
        }
      };

      this.ws.onclose = (event) => {
        console.log('WebSocket连接关闭.', event);
        this.reconnectWebSocket();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket发生错误:', error);
        this.reconnectWebSocket();
      };
    },

       reconnectWebSocket() {
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        const delay = this.reconnectInterval * (this.reconnectAttempts + 1);
        setTimeout(() => {
          console.log(`尝试重新连接 (${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`);
          this.reconnectAttempts++;
          this.setupWebSocket();
        }, delay);
      } else {
        console.log('达到最大重连次数，停止重连.');
      }
    },

    sendToWebSocket(content) {
      if (content === '<p><br></p>') return;
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ user_id: this.userName, text: content }));
      } else {
        console.log("WebSocket未连接，无法发送消息");
      }
    },

    //自动保存
    async saveEditor() {
      //编辑器实例尚未创建时不保存；
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
     handleReadOnlyClick() {
      this.$message({
        showClose: true,
        message: '没有操作权限',
        type: 'warning',
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
@import "../assets/css/MyEditor.css";
/* 透明覆盖层的样式 */
.read-only-overlay {
  position: absolute;
  top: 0; /* 调整此值使覆盖层在导航栏下方 */
  left: 0;
  width: 100%;
  height: 100%; /* 减去导航栏的高度 */
  background: rgba(255, 255, 255, 0);
  z-index: 9999; /* 确保覆盖在所有内容之上 */
  pointer-events: auto; /* 允许鼠标事件，以便触发点击事件 */
   overflow-y: auto; /* 启用垂直滚动条 */
}
.read-only-overlay1 {
  position: absolute;
  top: 60px; /* 调整此值使覆盖层在导航栏下方 */
  border-bottom:200px ;
  left: 10px;
  width: 100%;
  height: 100%; /* 减去导航栏的高度 */
  background: rgba(255, 255, 255, 0);
  z-index: 9999; /* 确保覆盖在所有内容之上 */
  pointer-events: auto; /* 允许鼠标事件，以便触发点击事件 */
  overflow-y: auto; /* 启用垂直滚动条 */
}
</style>