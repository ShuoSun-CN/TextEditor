<template>
  <div>
    <div class="logo-and-title">
      <a class="back-link" href="/HomePage">&lt; &lt; 返回主页</a>
      <SavingOverlay :isSaving="isSaving" :saveSuccess="saveSuccess"/>
      <div class="title-buttons">
        <button class="editor-button" @click="openShareCollaboration">共享协作</button>
        <button class="editor-button" @click="saveEditor">保存</button>
        <button class="editor-button" @click="exportAs('docx')">导出</button>
        <!--        <button class="editor-button" @click="exportAs('pdf')">导出为PDF</button>-->
        <button class="exit-button" @click="showExitConfirm">退出</button>
      </div>
      <div
          class="onlineUser"
          @mouseleave="showInfo=false"
          @mouseover="showInfo=true">
       <svg t="1723571295755" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1479" width="40" height="40"><path d="M725.333333 362.666667c0-117.333333-96-213.333333-213.333333-213.333334s-213.333333 96-213.333333 213.333334c0 61.866667 25.6 117.333333 68.266666 155.733333h-2.133333c-46.933333 19.2-89.6 46.933333-123.733333 83.2-36.266667 36.266667-64 78.933333-83.2 123.733333-14.933333 36.266667-25.6 74.666667-27.733334 115.2-2.133333 19.2 12.8 34.133333 29.866667 34.133334h21.333333c17.066667 0 32-14.933333 34.133334-32 2.133333-27.733333 10.666667-55.466667 21.333333-83.2 14.933333-36.266667 36.266667-68.266667 64-96 27.733333-27.733333 59.733333-49.066667 96-64 36.266667-14.933333 74.666667-23.466667 115.2-23.466667 117.333333 0 213.333333-96 213.333333-213.333333z m-213.333333 128c-70.4 0-128-57.6-128-128s57.6-128 128-128 128 57.6 128 128-57.6 128-128 128z" fill="#335c8e" p-id="1480"></path><path d="M714.666667 864m-32 0a32 32 0 1 0 64 0 32 32 0 1 0-64 0Z" fill="#335c8e" p-id="1481"></path><path d="M787.2 768c-6.4-4.266667-12.8-6.4-19.2-10.666667-17.066667-6.4-34.133333-10.666667-53.333333-10.666666s-36.266667 4.266667-53.333334 10.666666c-6.4 2.133333-12.8 6.4-19.2 10.666667-14.933333 8.533333-14.933333 29.866667-2.133333 42.666667l2.133333 2.133333c10.666667 10.666667 29.866667 10.666667 44.8 4.266667 8.533333-4.266667 19.2-6.4 27.733334-6.4s19.2 2.133333 27.733333 6.4c14.933333 6.4 34.133333 6.4 44.8-4.266667l2.133333-2.133333c12.8-12.8 12.8-34.133333-2.133333-42.666667zM864 691.2c-17.066667-12.8-36.266667-23.466667-55.466667-32-29.866667-12.8-61.866667-19.2-93.866666-19.2s-64 6.4-93.866667 19.2c-19.2 8.533333-38.4 19.2-55.466667 32-14.933333 10.666667-14.933333 32-2.133333 42.666667 12.8 12.8 34.133333 12.8 46.933333 2.133333 10.666667-8.533333 21.333333-12.8 34.133334-19.2 21.333333-8.533333 44.8-12.8 70.4-12.8s46.933333 4.266667 70.4 12.8c12.8 4.266667 23.466667 10.666667 34.133333 19.2 12.8 10.666667 34.133333 10.666667 46.933333-2.133333 12.8-12.8 12.8-32-2.133333-42.666667z" fill="#335c8e" p-id="1482"></path></svg>
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
        <div class="starlogo">
          <svg class="icon" height="32" p-id="4287" t="1723567288518" version="1.1"
               viewBox="0 0 1221 1024" width="32" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M1204.814491 122.670376l-104.202498-9.819364a18.026592 18.026592 0 0 1-14.655767-11.138382L1048.290907 11.139994a17.880035 17.880035 0 0 0-33.122032 0l-37.079088 90.572636a17.586919 17.586919 0 0 1-14.655767 11.138382l-104.349055 9.819364a18.026592 18.026592 0 0 0-10.112479 31.363339l78.554907 69.028659a17.733477 17.733477 0 0 1 5.715749 17.58692L908.91457 337.084236a18.026592 18.026592 0 0 0 26.673495 19.638727l86.908693-51.002067a17.586919 17.586919 0 0 1 18.173151 0L1128.751064 357.162636A18.026592 18.026592 0 0 0 1154.69177 337.084236l-23.302668-96.874615a17.733477 17.733477 0 0 1 5.715749-17.58692l78.554907-69.028659a18.319708 18.319708 0 0 0-10.845267-31.363339z"
                fill="#305a8d" p-id="4288"></path>
            <path
                d="M928.699854 224.674509l4.250173-17.147247a18.026592 18.026592 0 0 0-5.715749-17.000689l-74.451293-66.097505a18.026592 18.026592 0 0 0-4.103614 29.311532l78.554907 69.028659a14.655766 14.655766 0 0 1 1.465576 1.90525zM1211.263028 124.575625L1137.104851 190.526573a18.026592 18.026592 0 0 0-5.715749 17.733478l4.103614 17.293804 1.612135-1.758692 78.554907-69.028659a18.319708 18.319708 0 0 0-4.39673-30.190879zM1150.588155 320.376662a17.880035 17.880035 0 0 1-22.56988 3.663942L1040.816466 272.89198a18.319708 18.319708 0 0 0-18.17315 0l-86.908694 51.148624a17.733477 17.733477 0 0 1-22.423322-3.810499L908.91457 337.084236a18.026592 18.026592 0 0 0 26.673495 19.638727l86.908693-51.002067a17.586919 17.586919 0 0 1 18.173151 0L1128.751064 357.162636A18.026592 18.026592 0 0 0 1154.69177 337.084236z"
                fill="#305a8d" opacity=".5" p-id="4289"></path>
            <path
                d="M869.490559 544.463328a42.501722 42.501722 0 0 0-25.06136-73.278831L601.143479 448.321502a42.208607 42.208607 0 0 1-34.880724-25.794149l-86.762136-211.043034a41.622376 41.622376 0 0 0-77.235888 0l-86.469021 211.043034a41.182703 41.182703 0 0 1-34.734166 25.794149L37.922382 471.331055a41.915491 41.915491 0 0 0-23.595784 73.278831l183.050521 161.213429a42.062049 42.062049 0 0 1 13.336747 41.182703L155.608185 971.97203a42.062049 42.062049 0 0 0 61.993891 46.019106l190.524961-112.116612c71.227024-56.4247 69.468332-125.160244 56.717816-147.583566-14.655766-25.354476-34.294493-36.199743-52.760759-26.673495s-19.638727 18.319708-19.638727 18.319708a34.734166 34.734166 0 1 1 34.294493 60.381757s-40.303357 25.06136-67.416524-22.862995 18.612823-83.39131 28.432186-88.813944a83.537868 83.537868 0 0 1 112.995958 39.424011c27.845956 49.096817 16.414458 112.995958-28.432187 166.489505l193.163 113.435631a41.915491 41.915491 0 0 0 61.993891-46.019106l-54.372893-225.552243a41.915491 41.915491 0 0 1 13.19019-41.182703z"
                fill="#305a8d" p-id="4290"></path>
            <path
                d="M205.43779 713.590871l5.276076-24.768245a41.768934 41.768934 0 0 0-13.336747-41.036146L14.912829 487.012725A8.295164 8.295164 0 0 1 11.542003 483.641898 42.355164 42.355164 0 0 0 14.912829 544.463328l183.05052 161.213429a43.967299 43.967299 0 0 1 7.474441 7.914114zM871.542366 484.81436l-2.051807 2.198365-183.197078 161.213428a41.768934 41.768934 0 0 0-13.19019 41.036146l6.008864 24.621687a42.64828 42.64828 0 0 1 7.181326-8.353787l183.197078-161.213428a42.355164 42.355164 0 0 0 2.051807-59.502411zM460.887796 840.802922a41.622376 41.622376 0 0 0-40.596473 0.732788l-202.689247 119.15138a41.622376 41.622376 0 0 1-55.985027-13.19019l-6.008864 24.47513a42.062049 42.062049 0 0 0 61.993891 46.019106l190.524961-112.116612a173.524272 173.524272 0 0 0 52.760759-65.071602zM727.476184 971.97203l-5.862307-24.328572a41.622376 41.622376 0 0 1-56.131584 13.043632l-166.049832-97.607403a203.275478 203.275478 0 0 1-27.113168 41.475818l193.163 113.435631a41.915491 41.915491 0 0 0 61.993891-46.019106z"
                fill="#305a8d" opacity=".5" p-id="4291"></path>
          </svg>
        </div>
        <div
            class="star-text"
            @mouseleave="showUser = false"
            @mouseover="showUser = true"
        >
          星辉
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
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
    onlineUsers: {},
  },
  data() {
    return {
      showPopover: false,
      showUser: false,
      showInfo: false,
      isExpanded: false, // 控制展示板的展开和收起状态
    };
  },
  computed: {
    visibleUsers() {
      return this.isExpanded ? this.onlineUsers : this.onlineUsers.slice(0, 4);
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
    /*导出为pdf，存在bug*/
    async exportToPDF(htmlContent, fileName = 'exported-document.pdf') {
      const content = document.createElement('div');
      content.innerHTML = `
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
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
    ${htmlContent}
  `;

      const doc = new jsPDF();

      await html2canvas(content).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 210;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;

        let position = 0;

        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          doc.addPage();
          doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        doc.save(fileName);
      });
    },

    exportAs(type) {
      if (type === 'docx') {
        this.exportToDocx(this.fileContent, this.fileName);
      } else if (type === 'pdf') {
        this.exportToPDF(this.fileContent, this.fileName);
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

.editor-button,
.exit-button {
  font-size: 18px;
  font-weight: bold;
  font-family: '宋体';
  background-color: white;
  color: #305a8d;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  margin: 0 5px;
  cursor: pointer;
}

.editor-button:hover,
.exit-button:hover {
  background-color: #305a8d;
  color: white;
}

.back-link {
  margin-top: 10px;
  margin-left: 5px;
  color: #305a8d;
  text-decoration: none;
  font-size: 18px;
  width: 230px;
  font-weight: bold;
  font-family: '宋体';
}

.back-link:hover {
  text-decoration: underline;
}

.divider {
  width: 100%;
  border: none;
  border-top: 2px solid #e1e0e0;
  margin: 0;
}

/* 星辉文字样式 */
.star-text {
  color: #305a8d;
  font-weight: bold;
  font-family: '宋体';
  font-size: 18px;
  cursor: pointer;
  margin-right: 80px;
  margin-top: 10px;
}

/* 悬停显示信息的样式 */
.custom-popover {
  color: white;
  font-weight: bold;
  font-family: '宋体';
  position: absolute;
  top: 110%;
  left: 10%;
  transform: translateX(-50%);
  width: 165px;
  background-image: linear-gradient(to top, #305a8d 0%, #a1b2e3 99%, #305a8d 100%);
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1000;
}

.custom-popover .el-divider {
  margin: 5px 0;
}

.user-info {
  display: flex;
  align-items: center;
  position: relative;
  margin-left: auto;
}

.starlogo {
  left: 2px;
}

.onlineUser {
  margin-left: 120px;
  margin-top: 5px;
}
.online-users {
  z-index: 1000;
  background-color: white;
}

.user-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding-bottom: 5px; /* 增加底部填充以确保用户名显示完全 */
}

#users-list {
  display: grid;
  grid-template-columns: repeat(5, 30px);
  gap: 10px;
  max-height: 100px; /* 控制显示区域的高度 */
  overflow-y: auto; /* 启用垂直滚动条 */
}

#users-list.expanded {
  max-height: 400px; /* 展开后的高度 */
}

.user-avatar1 {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid rgba(11, 43, 152, 0.75); /* 头像边框 */
}

.user-item:hover .username {
  display: block; /* 鼠标悬浮时显示 */
}

.expand-button {
  cursor: pointer;
  color: #007bff;
  text-align: center;
  margin-top: 5px;
}

.collapse-button {
  position: absolute;
  bottom: 3px;
  right: 3px;
  color: #0c3483;
  border: none;
  cursor: pointer;
}

.online-uer {
  position: absolute;
  bottom: 20%;
  left: 62%;
  //transform: translateX(-50%);
  background-color: #0c3483;
  color: white;
  text-align: center;
  padding: 2px;
}

.username {
  position: absolute;
  bottom: 0%; /* 确保用户名在头像上方 */
  left: 80%; /* 水平居中 */
  transform: translateX(-50%); /* 使用户名居中 */
  background: #0c3483;
  color: white;
  border-radius: 3px;
  font-size: 12px;
  white-space: nowrap; /* 防止用户名换行 */
  display: none; /* 默认隐藏 */
  z-index: 500; /* 确保在头像上方显示 */
  max-width: 120px; /* 限制最大宽度，以防超出展板 */
  text-align: center; /* 中心对齐文本 */
  padding: 2px;
}


</style>
