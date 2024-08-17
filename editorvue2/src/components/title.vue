<template>
  <div>
    <div class="logo-and-title">
      <a class="back-link" href="/HomePage">&lt; &lt; 返回主页</a>
      <SavingOverlay :isSaving="isSaving" :saveSuccess="saveSuccess"/>
      <div class="title-buttons">
        <button class="editor-button" @click="openShareCollaboration">共享协作</button>
        <button class="editor-button" @click="saveEditor">保存</button>
        <button class="editor-button" @click="exportAs('docx')">导出</button>
        <button class="exit-button" @click="showExitConfirm">退出</button>
      </div>
      <div
          class="onlineUser"
          @mouseleave="showInfo=false"
          @mouseover="showInfo=true">
        <svg t="1723743222597" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="16127" width="32" height="32"><path d="M625.493333 555.306667A255.744 255.744 0 0 0 512 768c0 79.829333 36.522667 151.125333 93.824 198.058667C385.877333 1009.322667 42.666667 958.634667 42.666667 839.68c0-175.061333 166.4-352 371.541333-352 78.506667 0 151.296 25.856 211.285333 67.626667z m-13.354666-312.021334c0 110.72-89.6 200.576-200.149334 200.576a200.448 200.448 0 0 1-200.234666-200.576A200.490667 200.490667 0 0 1 411.861333 42.666667a200.448 200.448 0 0 1 200.277334 200.618666z m16 411.093334a32 32 0 0 1 64 0v248.874666a32 32 0 1 1-64 0v-248.874666z m125.653333-100.394667a32 32 0 0 1 64 0v349.269333a32 32 0 0 1-64 0v-349.269333zM879.36 704a32 32 0 0 1 64 0v199.253333a32 32 0 1 1-64 0V704z" fill="#accbee" p-id="16128"></path></svg>
        <div v-if="showInfo" class="online-uer">
          在线用户
        </div>
      </div>
      <!-- 在线用户显示组件 -->
      <div class="online-users">
        <div id="users-list" :class="{ expanded: isExpanded }">
          <!-- 显示的用户头像 -->
          <div
              v-for="user in visibleUsers"
              :key="user.user_name"
              class="user-item"
              @mouseleave="hideUsername(user)"
              @mouseover="showUsername(user)"
          >
            <img :src="`http://127.0.0.1:8000/avatar/${user.avatar}`" alt="在线用户" class="user-avatar1"/>
            <div v-show="user.showName" class="username">{{ user.user_name }}</div>
          </div>
          <!-- 展开按钮 -->
          <div v-if="onlineUsers.length > 4" class="expand-button" @click="toggleExpand">
            {{ isExpanded ? '' : '...' }}
          </div>
        </div>
        <!-- 收起按钮 -->
        <button v-if="isExpanded" class="collapse-button" @click="toggleExpand">
          收起
        </button>
      </div>
      <!--用户信息-->
      <div class="user-info">
          <svg class="icon" height="32" p-id="11641" t="1723739832341" version="1.1"
               viewBox="0 0 1024 1024" width="32" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M476.612 39.856a41.468 41.468 0 0 1 70.776 0l139.708 228.812a3.612 3.612 0 0 0 2.22 1.612l260.784 62.164a41.46 41.46 0 0 1 21.872 67.308l-174.44 203.58a3.54 3.54 0 0 0-0.848 2.608l21.464 267.232a41.468 41.468 0 0 1-57.256 41.6l-247.52-102.992a3.588 3.588 0 0 0-2.744 0l-247.52 102.992a41.464 41.464 0 0 1-57.256-41.6l21.464-267.232a3.552 3.552 0 0 0-0.848-2.608l-174.44-203.58a41.464 41.464 0 0 1 21.872-67.308L334.684 270.28a3.612 3.612 0 0 0 2.22-1.612l139.708-228.812z"
                fill="#FFD677" p-id="11642"></path>
            <path
                d="M223.18 910.304l-0.372-0.268a41.468 41.468 0 0 1-16.956-36.864l21.464-267.232a3.552 3.552 0 0 0-0.848-2.608l-174.44-203.58a41.464 41.464 0 0 1-7.948-39.788l0.004-0.008 468.384 152.196-289.288 398.152z"
                fill="#FFBA53" p-id="11643"></path>
            <path
                d="M44.468 358.824a41.46 41.46 0 0 1 29.432-26.38L334.684 270.28a3.612 3.612 0 0 0 2.22-1.612l139.708-228.812A41.464 41.464 0 0 1 511.712 20v491.6L44.468 358.824z"
                fill="#FFF9EB" p-id="11644"></path>
            <path
                d="M44.888 357.708a41.452 41.452 0 0 1 29.012-25.264L334.684 270.28a3.612 3.612 0 0 0 2.22-1.612l139.708-228.812a41.468 41.468 0 0 1 38.668-19.728l-56.536 344.3a66.82 66.82 0 0 1-77.992 54.892L44.888 357.708z"
                fill="#FFE899" p-id="11645"></path>
            <path
                d="M800.64 910.428l-289.108-398.276 468.212-152.716 0.176 0.528a41.464 41.464 0 0 1-7.948 39.788l-174.44 203.58a3.54 3.54 0 0 0-0.848 2.608l21.464 267.232a41.468 41.468 0 0 1-17.508 37.256z"
                fill="#FFB955" p-id="11646"></path>
            <path
                d="M979.316 358.236l-467.784 153.916V20.004L512 20c14.448 0 27.856 7.524 35.388 19.856l139.708 228.812a3.612 3.612 0 0 0 2.22 1.612l260.784 62.164a41.46 41.46 0 0 1 29.216 25.792z"
                fill="#FFD677" p-id="11647"></path>
            <path
                d="M223.2 910.316l289.268-398.164 288.724 397.884a41.464 41.464 0 0 1-40.3 4.736l-247.52-102.992a3.588 3.588 0 0 0-2.744 0l-247.52 102.992a41.456 41.456 0 0 1-39.908-4.456z"
                fill="#FF9956" p-id="11648"></path>
          </svg>
        <div
            class="star-text"
            @mouseleave="showUser = false"
            @mouseover="showUser = true"
        >
           {{ formattedStars }}
        </div>
        <div v-if="showUser" class="custom-popover">
           用户名: {{ userName }}
          <el-divider></el-divider>
          星辉值: {{ stars }}
        </div>
      </div>

    </div>
    <hr class="divider"/>
    <ShareCollaboration ref="shareCollab"/>
  </div>
</template>

<script>
import ShareCollaboration from '@/components/SharedCollaboration.vue'; // 调整路径到实际位置
import SavingOverlay from '@/components/SavingOverlay.vue'; // 引入 SavingOverlay
import htmlDocx from 'html-docx-js/dist/html-docx';
import FileSaver from 'file-saver';

export default {
  name: 'EditorTitle',
  components: {
    ShareCollaboration,
    SavingOverlay,
  },
  props: {
    saveEditor: Function,
    showExitConfirm: Function,
    fileId: String,
    isSaving: Boolean,
    saveSuccess: Boolean,
    stars: Number,
    userAvatar: String,
    isVIP: Boolean,
    userName: String,
    fileName: String,
    fileContent: String,
    OnlineUsers: {},
  },
  data() {
    return {
      showPopover: false,
      showUser: false,
      showInfo: false,
      isExpanded: false, // 控制展示板的展开和收起状态
      onlineUsers: [
        { avatar: "user1.png", user_name: "Alice", showName: false },
        { avatar: "user2.png", user_name: "Bob", showName: false },
        { avatar: "user3.png", user_name: "Charlie", showName: false },
        { avatar: "user4.png", user_name: "David", showName: false },
        { avatar: "user5.png", user_name: "Eve", showName: false },
          { avatar: "user5.png", user_name: "Eve", showName: false },
          { avatar: "user5.png", user_name: "Eve", showName: false },
          { avatar: "user5.png", user_name: "Eve", showName: false },
          { avatar: "user1.png", user_name: "Alice", showName: false },
        { avatar: "user2.png", user_name: "Bob", showName: false },
        { avatar: "user3.png", user_name: "Charlie", showName: false },
        { avatar: "user4.png", user_name: "David", showName: false },
        { avatar: "user5.png", user_name: "Eve", showName: false },
          { avatar: "user5.png", user_name: "Eve", showName: false },
          { avatar: "user5.png", user_name: "Eve", showName: false },
          { avatar: "user5.png", user_name: "Eve", showName: false },
          { avatar: "user1.png", user_name: "Alice", showName: false },
        { avatar: "user2.png", user_name: "Bob", showName: false },
        { avatar: "user3.png", user_name: "Charlie", showName: false },
        { avatar: "user4.png", user_name: "David", showName: false },
        { avatar: "user5.png", user_name: "Eve", showName: false },
          { avatar: "user5.png", user_name: "Eve", showName: false },
          { avatar: "user5.png", user_name: "Eve", showName: false },
          { avatar: "user5.png", user_name: "Eve", showName: false },
      ],
    };
  },
  computed: {
    visibleUsers() {
      return this.isExpanded ? this.onlineUsers : this.onlineUsers.slice(0, 4);
    },
    formattedStars() {
      if (this.stars >= 10000) {
        return ' '+(this.stars / 10000).toFixed(1) + '万';
      }
      return this.stars.toString();
    }
  },
  methods: {
    openShareCollaboration() {
      this.$refs.shareCollab.openDialog(this.fileId); // 打开共享协作弹窗
    },
    handleVIPClick() {
      // 处理 VIP 点击事件
      alert('充值功能待开发');
    },
    exportToDocx(htmlContent, fileName = 'exported-document.docx') {
      // 构建包含 HTML 内容的完整 HTML 文档字符串，带有优化的 CSS 样式
      const fullHtmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
          }
           img {
                display: block;
                max-width: 50%;
                margin-left: auto;
                margin-right: auto;
                /* 为兼容性设置最大宽度 */
                width: 50%;
                height: auto;
              }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          th, td {
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
    </html>
  `;

      // 使用 html-docx-js 将 HTML 转换为 Word 文档的 Blob 对象
      const converted = htmlDocx.asBlob(fullHtmlContent);

      // 使用 file-saver 保存 Blob 对象为 Word 文档文件
      FileSaver.saveAs(converted, fileName);
    },
    exportAs(type) {
      if (type === 'docx') {
        this.exportToDocx(this.fileContent, this.fileName);
      }
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
};
</script>

<style scoped>
/* 样式部分 */
.logo-and-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  position: relative;
  margin-top: 5px;
}

.title-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 22%;
  margin-top: 10px;
}
/*编辑按钮*/
.editor-button,
.exit-button {
  font-size: 18px;
  font-weight: bold;
  font-family: '宋体';
  background-color: white;
  color: #accbee;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  margin: 0 5px;
  cursor: pointer;
}
/*选中编辑按钮*/
.editor-button:hover,
.exit-button:hover {
  background-color: #accbee;
  color: black;
}
/*返回链接*/
.back-link {
  margin-top: 10px;
  margin-left: 5px;
  color: #accbee;
  text-decoration: none;
  font-size: 18px;
  width: 230px;
  font-weight: bold;
  font-family: '宋体';
}
/*选中返回链接*/
.back-link:hover {
  text-decoration: underline;
  color: #0c3483;
}

/*星辉*/
.user-info {
  display: flex;
  align-items: center;
  position: relative;
  margin-left: auto;
  margin-right: 100px;
}
/* 星辉文字样式 */
.star-text {
  color: #ffb955;
  font-weight: bold;
  font-family: '宋体';
  font-size: 18px;
  cursor: pointer;
  left: 0;
}
/* 悬停显示信息的样式 */
.custom-popover {
  color: white;
  font-weight: bold;
  font-family: '宋体';
  position: absolute;
  top: 110%;
  left: 50%;
  transform: translateX(-50%);
  width: 165px;
  background-image: linear-gradient(to top, #ff9956 0%, #ffe899 99%, #ffb955 100%);
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1000;
}
/*下分割线*/
.divider {
  width: 100%;
  border: none;
  border-top: 2px solid #e1e0e0;
  margin: 0;
}

.custom-popover .el-divider {
  margin: 5px 0;
}


/*在线用户*/
.onlineUser {
  margin-left: 125px;
/*  background-color: green;*/
  margin-top: 8px;
}
/*在线用户显示组件*/
.online-users {
  z-index: 1000;


}
.user-item {

  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 5px; /* 增加底部填充以确保用户名显示完全 */
}
#users-list {
  display: grid;
  grid-template-columns: repeat(5, 35px);
  gap: 10px;
  max-height: 120px; /* 控制显示区域的高度 */
  overflow-y: auto; /* 启用垂直滚动条 */
}

#users-list.expanded {
  max-height: 400px; /* 展开后的高度 */
}
/*在线用户头像*/
.user-avatar1 {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid rgba(172, 203, 238, 1); /* 头像边框 */
}

.user-item:hover .username {
  display: block; /* 鼠标悬浮时显示 */
}

.expand-button {
  cursor: pointer;
  color: #accbee;
  text-align: center;
  margin-top: 5px;
}

.collapse-button {
  position: absolute;
  bottom: 3px;
  right: 3px;
  color: #accbee;
  border: none;
  cursor: pointer;
}
/*在线用户悬浮字样*/
.online-uer {
  position: absolute;
  bottom: -30%;
  left: 68%;
  transform: translateX(-50%);
  background-image: linear-gradient(to top, #2b579a 0%, #c1d8f2 99%, #accbee 100%);
 text-align: center;
  padding: 5px;
  font-weight: bold;
  color:white;
  z-index: 100000;
  font-size: 12px;
}
/*用户名*/
.username {
  position: absolute;
  bottom: 0%; /* 确保用户名在头像上方 */
  left: 50%; /* 水平居中 */
  transform: translateX(-50%); /* 使用户名居中 */
  color: white;
  border-radius: 3px;
  font-size: 10px;
  font-weight: bold;
  white-space: nowrap; /* 防止用户名换行 */
  display: none; /* 默认隐藏 */
  z-index: 100000; /* 确保在头像上方显示 */
  min-width: 40px;
/*  max-width: 120px; !* 限制最大宽度，以防超出展板 *!*/
  text-align: center; /* 中心对齐文本 */
  padding: 2px;
  background-image: linear-gradient(to top, #2b579a 0%, #c1d8f2 99%, #accbee 100%);
}


</style>
