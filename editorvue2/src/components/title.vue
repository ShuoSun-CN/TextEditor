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
      <!--用户信息-->
      <div class="user-info">
        <img
            v-if="userAvatar"
            :src="userAvatar"
            alt="用户头像"
            class="user-avatar"
            @mouseleave="showUser = false"
            @mouseover="showUser = true"
        />
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
  },
  data() {
    return {
      showPopover: false,
      showUser: false,
    };
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
  padding: 10px;
  position: relative;
}

.title-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 22%;
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
/*头像*/
.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 80px;
}

.user-info {
  display: flex;
  align-items: center;
  position: relative;
  margin-left: auto;
}
/*用户名-星辉*/
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
</style>
