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
          <el-dropdown-menu slot="dropdown" class="usermanaage">
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
    <div class="flex-container">
      <!-- 左侧列 -->
      <div class="all">
        <div class="new-column">
          <!-- 创建文件按钮 -->
          <button class="action-button1" @click="MyEditor">
            <img src="../assets/icons/createfile.svg" alt="创建文件图标" class="button-icon1"> 创建文件
          </button>
          <!-- 最近文件按钮 -->
          <button class="action-button">
            <img src="../assets/icons/history.svg" alt="最近文件图标" class="button-icon"> 最近文件
          </button>
          <!-- 共享文件按钮 -->
          <button class="action-button">
            <img src="../assets/icons/share.svg" alt="共享文件图标" class="button-icon"> 共享文件
          </button>
          <!-- 全部文件按钮 -->
          <button class="action-button">
            <img src="../assets/icons/allfile.svg" alt="全部文件图标" class="button-icon"> 全部文件
          </button>
        </div>
      </div>

      <!-- 右侧文件列表区域 -->
      <div class="file-list-container">
        <div class="additional-buttons">
          <button class="action-button1" @click="quickCreate">
            <img src="../assets/icons/allfile.svg" alt="快速创建图标" class="button-icon1"> 快速创建
          </button>
          <button class="action-button1" @click="aiWriting">
            <img src="../assets/icons/allfile.svg" alt="AI写作图标" class="button-icon1"> AI写作
          </button>
        </div>
        <div class="file-list">
          <div v-for="file in files" :key="file.id" class="file-thumbnail">
            <img :src="getIconForFileType(file.type)" :alt="file.name">
            <span>{{ file.name }}</span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { get_user_info } from '@/api/UserFile'; // 假设这是从后端获取用户信息的 API
import { create_text, get_text_list } from '@/api/FileManage'; // 假设这是从后端获取文件列表的 API

export default {
  name: 'FileListPage',
  data() {
    return {
      searchQuery: '', // 搜索框输入
      userName: '', // 用户名
      userAvator: '', // 用户头像URL
      isVIP: false, // 用户是否是VIP
      files: [] // 存储从后端获取的文件列表信息
    };
  },
  async created() {
    await this.fetchUserInfo(); // 获取用户信息
    await this.fetchTextList(); // 获取文件列表信息
  },
  methods: {
    async MyEditor() {
      try {
        const session_id = localStorage.getItem('session_id');
        const response = await create_text({session_id: session_id});
        if (response.code === 0) {
          this.$router.push({path: '/MyEditor', query: {file_id: response.file_id}});
        }
      } catch (error) {
        console.error('创建文件失败:', error);
      }
    },
    async fetchUserInfo() {
      try {
        // 假设从本地存储中获取 session_id
        const session_id = localStorage.getItem('session_id');
        const response = await get_user_info({session_id});
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
        const session_id = localStorage.getItem('session_id');
        const response = await get_text_list({session_id: session_id});
        if (response.code === 0) {
          this.files = response.text_list; // 将获取到的文件列表存储到 files 数组中
        } else {
          this.$message.error('获取文件列表失败');
        }
      } catch (error) {
        console.error('获取文件列表失败:', error);
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
    getIconForFileType(fileType) {
      // 根据文件类型返回对应的图标路径
      // 这里假设有一个函数根据文件类型返回图标路径，可以根据实际情况调整
      switch (fileType) {
        case 'pdf':
          return '../assets/icons/pdf-icon.svg';
        case 'doc':
          return '../assets/icons/doc-icon.svg';
        case 'txt':
          return '../assets/icons/txt-icon.svg';
          // 其他文件类型的处理逻辑
        default:
          return '../assets/icons/default-icon.svg';
      }
    },
    async quickCreate() {
      // 处理快速创建逻辑
    },
    async aiWriting() {
      // 处理AI写作逻辑
    }
  }
};
</script>

<style scoped>
.file-list-page {
  font-family: Arial, sans-serif;
  background-size: cover;
  background-position: center;
  height: 100vh; /* 让文件列表页面占据整个视口高度 */
  background-color: #f0f0f0;
  display: flex;
  flex-direction: column;
}

.top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  padding: 10px;
}

.logo-and-title {
  display: flex;
  align-items: center;
}

.logo {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
}

.title2 {
  font-weight: bold;
  color: #707070;
  font-size: 30px;
  background-image: linear-gradient(to top, #a3bded 0%, #6991c7 100%);
}

.top-search-bar {
  flex: 1;
  margin-left: 50px;
}

.top-search-bar input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 20px;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-avator {
    width: 35px;
  height: 35px;
  border-radius: 50%;
  margin-right: 15px;
}

.vip-icon {
  width: 15px;
  height: 15px;
  margin-right: 10px;
}

.divider {
  border: none;
  border-top: 2px solid #e1e0e0;
  margin: 0;
}

.flex-container {
  display: flex;
  justify-content: space-between;
}

.all {
  flex-direction: column;
  align-items: flex-start;
  width: 18%;
  border-right: 1px solid #e1e0e0; /* 右边框为灰色 */
  background-color: white;
  height:100%
}

.new-column {
  display: inline-block;
  padding: 10px;
  width: 100%;
  box-sizing: border-box;
  vertical-align: top;
  margin-right: 20px;
}

.action-button,
.action-button1 {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px 12px;
  margin-bottom: 10px;
  border: none;
  font-size: 14px;
  cursor: pointer;
  border-radius: 1px;
  text-align: left; /* 左对齐 */
  line-height: 1; /* 垂直居中 */
  border: 1px solid #e1e0e0; /* 右边框为灰色 */
}

.action-button1 {
  color: white;
  background-color: #6991c7;
  font-weight: bold; /* 字体加粗 */
  margin-bottom: 30px; /* 创建文件按钮下方的间距 */
}

.file-list-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding-left: 20px;
  padding-right: 20px;
}

.additional-buttons {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 10px;
  width: 100%;
  border-left: 1px solid #e1e0e0;
  background-color: white;
}

.file-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 10px;
  flex: 1;
}

.file-thumbnail {
  width: 100px;
  height: 100px;
  border: 1px solid #ccc;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.file-thumbnail img {
  width: 50px;
  height: 50px;
  object-fit: contain;
  margin-bottom: 5px;
}

.button-icon,
.button-icon1 {
  width: 20px; /* 图标宽度 */
  height: 20px; /* 图标高度 */
  margin-right: 50px;
}

.button-icon2 {
  width: 15px; /* 图标宽度 */
  height: 15px; /* 图标高度 */
  margin-right: 10px;
}

.file-thumbnail img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 5px;
}

.file {
  width: 15%;
  height: 20%;
}
</style>

}