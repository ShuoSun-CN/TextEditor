<template>
  <div class="backgroundDiv">
    <div
        v-if="writePriority === 0"
        class="read-only-overlay1"
        @click="handleReadOnlyClick"
    ></div>
    <!--导航栏-->
    <div class="navigator">
      <EditorTitle
          :fileContent="previousHtml"
          :fileId="textId"
          :fileName="title"
          :isSaving="saving"
          :saveEditor="saveEditorByButton"
          :saveSuccess="saveSuccess"
          :showExitConfirm="showExitConfirm"
          :stars="stars"
          :userName="userName"
      />
    </div>
    <!--工具栏-->
    <div :class="{ 'disable-clicks': writePriority === 0 }" class="toolbar-container">
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
      <div id="w-e-textarea-1" :class="{ 'disable-clicks': writePriority === 0 }" class="editor-wrapper">
        <Editor
            v-model="html"
            :defaultConfig="editorConfig"
            :mode="mode"
            @onChange="onChange"
            @onCreated="onCreated"
        />
      </div>

    </div>

    <!-- 在线用户显示组件 -->
    <div class="online-users">
      <div id="users-list">
        <div
            v-for="user in onlineUsers"
            :key="user.user_name"
            class="user-item"
            @mouseleave="hideUsername(user)"
            @mouseover="showUsername(user)"
        >
          <el-tooltip :content="user.user_name" placement="bottom">
            <img :src="`http://127.0.0.1:8000/avatar/${user.avatar}`" alt="在线用户" class="user-avatar1"/>
          </el-tooltip>
        </div>
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
import axios from "axios";
import LoadingOverlay from "@/components/LoadingOverlay.vue";


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
      currentVersion:-1,//更新版本控制

      onlineUsers: [], // 保存在线用户信息
      isExpanded: false, // 控制展示板的展开和收起状态

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
        autoFocus: true,//自动聚焦
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
          const data = JSON.parse(event.data);
          console.log("接收到消息", data);
          if (data.action === "update_users") {
            this.onlineUsers = JSON.parse(data.users); // 假设 data.users 是 JSON 字符串格式
          } else if (data.text && data.text !== editor.getHtml()) {

              // 忽略过时的消息
          if (data.version && data.version <= this.currentVersion) return;

            if (/<table[^>]*>.*<\/table>/i.test(data.text)) {
              // 触发特殊处理方法
              console.log("检测到 <table> 标签，进行特殊处理");
              data.text = this.handleTableContent(data.text);
              if (data.text === editor.getHtml()) return
            }

            this.isOnChangeEnabled = false;  // 禁用 onChange 处理
            if (editor.isDisabled()) editor.enable()
            if (!editor.isFocused()) editor.focus()
            editor.clear();
            this.html = '<p><br></p>'
            console.log(this.userName, " ", editor.getHtml());
            if (!editor.isFocused()) editor.focus()
            editor.dangerouslyInsertHtml(data.text); // 插入新的内容

            this.previousHtml = data.text;
            this.currentVersion = data.version; // 更新版本号
            this.isOnChangeEnabled = true;  // 恢复 onChange 处理
          }
        } catch (error) {
          console.log("WebSocket消息处理错误:", error);
        }
      };

      this.ws.onclose = (event) => {
        console.log('WebSocket连接关闭.', event);
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket发生错误:', error);
      };
      this.handleTableContent = (htmlContent) => {
        // 检查是否包含 <table> 标签
        if (/<table[^>]*>.*<\/table>/i.test(htmlContent)) {
          // 如果有 <table> 标签，删除最后的 <p><br></p> 标签（如果存在）
          htmlContent = htmlContent.replace(/(<p><br><\/p>)(?!.*<p><br><\/p>)/i, '');
        }
        return htmlContent;
      };

    },

    sendToWebSocket(content) {
      if (content === '<p><br></p>') return;
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({user_id: this.userName, text: content}));
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
    toggleExpand() {
      this.isExpanded = !this.isExpanded;
    },
    showUsername(user) {
      // 直接设置对应用户的 showName 属性为 true
      this.$set(user, 'showName', true);
    },
    hideUsername() {
      this.onlineUsers.forEach(user => {
        this.$set(user, 'showName', false);
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

.online-users {
  padding: 10px;
  position: absolute;
  overflow: hidden; /* 确保导航栏内部元素不会溢出 */
  top: 6px;
  width: 200px;
  height: 48px;
  left: 69.5%;
  box-sizing: border-box; /* 确保 padding 不会影响宽高 */
}

#users-list {
  display: flex;
  flex-wrap: nowrap; /* 禁止换行，使其横向滚动 */
  overflow-x: auto; /* 启用横向滚动 */
  overflow-y: hidden; /* 取消竖向滚动条 */
  width: 100%;
  scrollbar-width: thin; /* Firefox: 设置滚动条宽度为窄 */
  scrollbar-color: transparent; /* 设置滚动条颜色为透明 */
}

.user-item {
  flex: 0 0 auto;
  width: auto; /* 或者设置一个更大的固定宽度 */
  margin-right: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}


.username {
  position: absolute; /* 使用户名相对于 .user-item 定位 */
  bottom: 20px; /* 将用户名位置调整到头像下方 10px (头像高度 32px + 10px) */
  left: 50%;
  transform: translateX(-50%);
  background-color: black;
  text-align: center;
  padding: 5px 10px; /* 增加水平填充以确保内容在框内舒适显示 */
  font-weight: bold;
  color: white;
  z-index: 10000; /* 确保用户名显示在其他内容之上 */
  font-size: 12px;
  border-radius: 4px; /* 增加圆角以使其更美观 */
  white-space: nowrap; /* 防止文本换行 */
  max-width: none; /* 取消最大宽度限制 */
  box-sizing: border-box; /* 确保 padding 不会影响宽度 */
  display: none; /* 默认隐藏，只有在悬停时显示 */
}

.user-avatar1 {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid rgba(172, 203, 238, 1);
}

</style>