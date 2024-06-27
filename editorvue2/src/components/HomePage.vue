<template>
  <div class="file-list-page">
    <!-- 顶部行 -->
    <div class="top-row">
      <!-- Logo 和 标题 -->
      <div class="logo-and-title">
        <img src="../assets/logo.png" alt="logo" class="logo">
        <span class="title2">文曲星编辑器</span>
      </div>
      <!-- 搜索栏 -->
      <div class="top-search-bar">
        <input type="text" v-model="searchQuery" placeholder="搜索文件">
      </div>
      <!-- 用户信息 -->
      <div class="user-info">
        <img v-if="userAvator" :src="userAvator" alt="用户头像" class="user-avator">
        <img v-if="isVIP" src="../assets/icons/vip.svg" alt="VIP 图标" class="vip-icon">
        <el-dropdown>
          <span class="el-dropdown-link">
            用户名：{{ userName }}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="changeinfo">
              <img src="../assets/icons/xiugaixinxi.svg" class="button-icon2"> 修改信息
            </el-dropdown-item>
            <el-dropdown-item @click.native="charge">
              <img src="../assets/icons/vipmanage.svg" class="button-icon2"> 充值（续费vip）
            </el-dropdown-item>
            <el-dropdown-item @click.native="logout">
              <img src="../assets/icons/logout.svg" class="button-icon2"> 退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <!-- 水平分隔线 -->
    <hr class="divider">

    <!-- 一左一右显示的两个区域 -->
    <div class="content-container">
      <!-- 左侧列 -->
      <div class="all">
        <div class="new-column">
          <!-- 创建文件按钮 -->
          <button class="action-button1" @click="MyEditor">
            <img src="../assets/icons/createfile.svg" alt="创建文件图标" class="button-icon"> 创建文件
          </button>
          <!-- 最近文件按钮 -->
          <button class="action-button" @click="RecentFile">
            <img src="../assets/icons/history.svg" alt="最近文件图标" class="button-icon"> 最近文件
          </button>
          <!-- 共享文件按钮 -->
          <button class="action-button">
            <img src="../assets/icons/share.svg" alt="共享文件图标" class="button-icon"> 共享文件
          </button>
          <!-- 全部文件按钮 -->
          <button class="action-button" @click="AllFile">
            <img src="../assets/icons/allfile.svg" alt="全部文件图标" class="button-icon"> 全部文件
          </button>
        </div>
      </div>
      <!-- 右侧文件列表区域 -->
      <div class="file-list-container">
        <div class="kuaisufangwen">
          <div class="biaoti1">快速访问</div>
          <div class="additional-buttons">
            <button class="action-button5" @click="MyEditor">
              <img src="../assets/icons/createfile1.svg" alt="快速创建图标" class="button-icon1">
              <div class="text-container">
                <div class="main-text">快速创建</div>
                <div class="sub-text">从空文本起草</div>
              </div>
            </button>
            <button class="action-button5" @click="aiWriting">
              <img src="../assets/icons/aifile.svg" alt="AI写作图标" class="button-icon1">
              <div class="text-container">
                <div class="main-text">AI写作</div>
                <div class="sub-text">让AI辅助您高效写作</div>
              </div>
            </button>
          </div>
          <hr class="divider1">
        </div>
        <div class="filemanagement">
          <div class="biaoti2">最近文件</div>
          <!-- 删除选中文件按钮 -->
          <button class="action-button6" @click="deleteSelectedFiles" v-if="selectedFiles.length > 0"
                  :class="{ 'disabled-button': selectedFiles.length === 0 }">
            <img src="../assets/icons/delete.svg" alt="删除文件图标" class="button-icon2"> 删除选中文件
          </button>
          <span v-if="selectedFiles.length === 0" class="no-selected-text">删除选中文件</span>
        </div>

        <div v-if="loading" class="loading-icon">
          <i class="el-icon-loading"></i>
        </div>
        <div v-else>
          <div v-for="(dayFiles, index) in recentDaysFiles" :key="index">
            <div class="biaoti1">{{ dayFiles.date }}</div>
            <div class="file-list">
              <div
                v-for="file in dayFiles.files"
                :key="file.file_id"
                class="file-card"
                @mouseenter="file.hovered = true"
                @mouseleave="file.hovered = false"
              >
                <div @click="openFile(file)" class="file-content">
                  <img src="../assets/icons/allfile.svg" alt="文件图标" class="file-icon">
                  <div class="file-info">
                    <div class="file-name">{{ file.file_name }}</div>
                    <div class="file-details">
                      <span class="file-time">{{ file.update_time }}</span>
                      <span class="file-creator">{{ file.user_id }}</span>
                    </div>
                  </div>
                </div>
                <div class="selection-box" v-if="file.hovered || file.isSelected">
                  <input type="checkbox" v-model="file.isSelected" @click.stop @change="toggleSelection(file)">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { get_user_info } from '@/api/UserFile'; // 假设这是从后端获取用户信息的 API
import { create_text, get_text_list, delete_own_text, delete_own_text_list } from '@/api/FileManage'; // 假设这是从后端获取文件列表的 API

export default {
  name: 'FileListPage',
  data() {
    return {
      searchQuery: '', // 搜索框输入
      userName: '', // 用户名
      userAvator: '', // 用户头像URL
      isVIP: false, // 用户是否是VIP
      tableData: [], // 存储从后端获取的文件列表信息
      selectedFiles: [], // 存储选中的文件
      loading: true, // 加载状态
      recentDaysFiles: [], // 存储最近三个不同日期的文件列表
    };
  },
  async created() {
    await this.fetchUserInfo(); // 获取用户信息
    await this.fetchTextList(); // 获取文件列表信息
    this.recentDaysFiles.forEach(dayFiles => {
      dayFiles.files.forEach(file => {
        this.$set(file, 'hovered', false); // 初始化hovered属性
      });
    });
  },
  methods: {
    formatDateToChinese(dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const weekday = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][date.getDay()];
      return `${year}年${month}月${day}日 ${weekday}`;
    },

    async MyEditor() {
      try {
        const session_id = localStorage.getItem('session_id');
        const response = await create_text({ session_id: session_id });
        if (response.code === 0) {
          this.$router.push({ path: '/MyEditor', query: { file_id: response.file_id } });
        }
      } catch (error) {
        console.error('创建文件失败:', error);
      }
    },
    async AllFile() {
      this.$router.push('/AllFile');
    },
    async RecentFile() {
      this.$router.push('/RecentFile');
    },
    async fetchUserInfo() {
      try {
        // 假设从本地存储中获取 session_id
        const session_id = localStorage.getItem('session_id');
        const response = await get_user_info({ session_id });
        if (response.code === -1) {
          this.$message.error('登录过期，请重新登录');
          this.$router.push('/UserLogin');
        } else if (response.code === 1) {
          this.$message.error('系统故障');
        } else {
          this.userName = response.user_name;
          this.userAvator = "http://127.0.0.1:8000/avatar/" + response.user_avator;
          this.isVIP = response.vip === 1; // 检查用户是否是VIP
        }
      } catch (error) {
        console.error('获取用户信息失败:', error);
      }
    },
    async fetchTextList() {
      try {
        // Fetch text list from backend
        const session_id = localStorage.getItem('session_id');
        const response = await get_text_list({ session_id });
        if (response.code === 0) {
          let files = JSON.parse(response.text_list);
          files.sort((a, b) => new Date(b.update_time) - new Date(a.update_time));

          let dates = [];
          files.forEach(file => {
            const date = this.formatDateToChinese(file.update_time); // Format date to Chinese
            if (!dates.includes(date)) {
              dates.push(date);
            }
          });

          dates = dates.slice(0, 3);

          this.recentDaysFiles = dates.map(date => {
            return {
              date: date,
              files: files.filter(file => this.formatDateToChinese(file.update_time) === date)
            };
          });
        } else {
          this.$message.error('Failed to fetch file list');
        }
      } catch (error) {
        console.error('Failed to fetch file list:', error);
        this.$message.error('Failed to fetch file list');
      } finally {
        this.loading = false;
      }
    },
    showSelectionBox(file) {
      this.$set(file, 'selected', true);
    },

    hideSelectionBox(file) {
      this.$set(file, 'selected', false);
    },

    openFile(file) {
      if (!file.isSelected) {
        this.$router.push({ path: '/MyEditor', query: { file_id: file.file_id } });
      }
    },

    toggleSelection(file) {
      file.isSelected = !file.isSelected;
      this.updateSelectedFiles();
    },
    updateSelectedFiles() {
      this.selectedFiles = [];
      this.recentDaysFiles.forEach(dayFiles => {
        dayFiles.files.forEach(file => {
          if (file.isSelected) {
            this.selectedFiles.push(file);
          }
        });
      });
    },

    async deleteSelectedFiles() {
      if (this.selectedFiles.length === 0) {
        this.$message.warning('请选择要删除的文件');
        return;
      }

      try {
        const fileIds = this.selectedFiles.map(file => file.file_id);
        const session_id = localStorage.getItem('session_id');
        let response;

        if (fileIds.length === 1) {
          response = await delete_own_text(fileIds[0], session_id);
        } else {
          response = await delete_own_text_list(fileIds, session_id);
        }

        if (response.code === 0) {
          this.$message.success('删除成功');
          await this.fetchTextList(); // 重新获取文件列表
        } else if (response.code === -1) {
          this.$message.error('登录信息过期');
        } else if (response.code === 2) {
          this.$message.error('文件不存在，非法的文件访问');
        } else if (response.code === 3) {
          this.$message.error('当前用户无权删除该文件');
        }
      } catch (error) {
        console.error('删除文件失败:', error);
        this.$message.error('删除失败');
      }
    },
    async logout() {
      localStorage.removeItem('session_id');
      this.userName = '';
      this.userAvator = '';
      this.isVIP = false;
      this.$router.push('/UserLogin');
    },
    async changeinfo() {
      this.$router.push('/UserInfo');
    },
    async charge() {
      this.$router.push('/UserCharge');
    },

    async aiWriting() {
      // 处理AI写作逻辑
    }
  }
};
</script>



<style scoped>
@import '../assets/dingbu.css';

.divider1 {
  border: none;
  border-top: 2px solid #e1e0e0;
  margin: 0;
  width: 100%;
  z-index: 9;
}

.button-icon2 {
  width: 15px; /* Icon width */
  height: 15px; /* Icon height */
  margin-right: 10px; /* Space between icon and text */
}

.filemanagement {
  display: flex;
  align-items: center;
  justify-content: space-between; /* 使内容在水平轴上分散对齐 */
  padding: 10px 0; /* 上下内边距 */
  margin-left: 5px;
}

.biaoti2 {
  font-size: 16px;
  font-weight: bold; /* 加粗字体 */
  margin-bottom: 5px;
}

.action-button6 {
  display: flex;
  align-items: center;
  padding: 5px 10px; /* 按钮内边距 */
  margin-left: 10px; /* 按钮间距 */
  font-size: 14px;
  cursor: pointer;
  border-radius: 5px;
  border: 1px solid #e1e0e0;
  background-color: white;
}

.disabled-button {
  color: red;
}

.no-selected-text {
  color: red;
}

.additional-buttons .action-button5 {
  display: flex;
  align-items: center; /* 图标和文字垂直居中对齐 */
  height: 70px; /* 调整高度以适应两行文本 */
  width: 300px;
  margin-left: 5px;
  margin-right: 50px;
  background-color: white;
  margin-bottom: 20px;
  border: 1px solid gray; /* 添加灰色边框 */
  border-radius: 10px; /* 添加圆角 */
  padding: 10px; /* 添加内边距 */
  transition: background-color 0.3s, color 0.3s; /* 添加过渡效果 */
}

.additional-buttons .action-button5:hover {
  background-color: #e6e6e6; /* 悬浮时背景变黑 */
}

.button-icon1 {
  width: 40px; /* 图标宽度 */
  height: 40px; /* 图标高度 */
  margin-right: 30px; /* 图标与文本的间距 */
}

.text-container {
  display: flex;
  flex-direction: column; /* 使文字垂直排列 */
  text-align: left
}

.main-text {
  font-size: 16px; /* 增大字体 */
  font-weight: bold; /* 加粗 */
}

.sub-text {
  font-size: 14px; /* 调整字体大小 */
  color: gray; /* 灰色字体 */
  margin-top: 8px; /* 与主文本的间距 */
}


.action-button,
.action-button1 {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px 12px;
  margin-bottom: 10px;
  font-size: 14px;
  cursor: pointer;
  border-radius: 1px;
  text-align: left; /* 左对齐 */
  line-height: 1; /* 垂直居中 */
  border: 1px solid #e1e0e0; /* 右边框为灰色 */
  background-color: white;
}

.action-button1 {
  color: white;
  background-color: #6991c7;
  font-weight: bold; /* 字体加粗 */
  margin-bottom: 30px; /* 创建文件按钮下方的间距 */
}

.biaoti1 {
  font-size: 18px;
  padding: 5px;
  margin-left: 5px;
  margin-bottom: 3px;
  margin-top: 10px;
}

.action-button5 {
  height: 80px;
  width: 300px;
  margin-right: 50px; /* 让按钮之间有一些间距 */
  background-color: white;
  margin-bottom: 20px;
}

.batch-actions {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 10px;
}

.file-list-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 80%; /* 调整为剩余宽度 */
  margin-left: 20%; /* 避开左侧固定区域 */
  height: 100%;
  padding-left: 20px;
  padding-right: 20px;
  margin-bottom: 20px;
}

.loading-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 54px;
}

.kuaisufangwen {
  background-color: white;
  margin-top: 4px;
}

.additional-buttons {
  display: flex; /* 让按钮在同一行显示 */
  flex-direction: row;
  align-items: center;
  padding: 5px;
  width: 98%;
  justify-content: left;
}

.file-thumbnail img {
  width: 200px;
  height: 250px;
  object-fit: contain;
  margin-bottom: 5px;
}

.button-icon {
  width: 25px; /* 图标宽度 */
  height: 25px; /* 图标高度 */
  margin-right: 25px; /* 图标和文本之间的间距 */
}

.file-list {
  display: flex;
  flex-wrap: wrap; /* 允许换行 */
  gap: 10px; /* 方块之间的间距 */
  margin-top: 20px;
}

.file-card {
  position: relative; /* 相对定位 */
  display: flex;
  align-items: center;
  width: 27%; /* 每行三个方块 */
  margin-right: 20px;
  padding: 10px;
  border: 1px solid #e1e0e0;
  border-radius: 5px;
  background-color: white;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.file-card:hover {
  transform: scale(1.05);
}

.selection-box {
  position: absolute; /* 绝对定位 */
  top: 10px;
  right: 10px;
  z-index: 10; /* 放在最上层 */
}

.file-card:hover .selection-box {
  display: block; /* 鼠标悬浮时显示 */
}

.selection-box input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.file-icon {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}

.file-info {
  display: flex;
  flex-direction: column;
}

.file-name {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
  color: #595757; /* 文件名字体为黑色 */
}

.file-details {
  font-size: 12px;
  color: #888;
}
</style>

