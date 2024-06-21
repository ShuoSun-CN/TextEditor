<template>
  <div class="file-list-page">
    <!-- 顶部行 -->
    <div class="top-row">
  <!-- Logo 和 标题 -->
  <div class="logo-and-title">
    <img src="../assets/logo.png" alt="logo" class="logo">
    <span class="title">文曲星编辑器</span>
  </div>

  <!-- 搜索栏 -->
  <div class="top-search-bar">
    <input type="text" v-model="searchQuery" placeholder="搜索文件">
  </div>

  <!-- 用户信息 -->
  <div class="user-info">
    <img v-if="userAvatar" :src="userAvatar" alt="用户头像" class="user-avatar">
    <span class="username">{{ userName }}</span>
  </div>
</div>
<hr class="divider">


    <!-- 新列 -->
    <div class="new-column">
      <!-- 创建文件按钮 -->
      <button class="action-button1">创建文件</button>

      <!-- 最近文件按钮 -->
      <button class="action-button">最近文件</button>

      <!-- 共享文件按钮 -->
      <button class="action-button">共享文件</button>

      <!-- 全部文件按钮 -->
      <button class="action-button">全部文件</button>

    </div>
    <button class="action-button" @click="MyEditor">进入MyEditor</button>

    <!-- 文件列表 -->
    <!--
    <div class="file-list">
      <div v-for="(file, index) in fileList" :key="index" class="file-item">
        <div class="file-thumbnail">
          <img :src="file.thumbnail" alt="文件缩略图">
        </div>
        <div class="file-details">
          <p class="file-name">{{ file.name }}</p>
          <p class="file-info">{{ file.size }} • {{ file.modifiedDate }}</p>
        </div>
      </div>
    </div>
    -->
  </div>
</template>

<script>
import { get_user_info } from '@/api/UserFile';

export default {
  name: 'FileListPage',
  data() {
    return {
      searchQuery: '', // 搜索框输入
      userName: '', // 用户名
      userAvatar: '' // 用户头像URL
    };
  },
  async created() {
    await this.fetchUserInfo();
  },
  methods: {
    async MyEditor() {
      this.$router.push('/MyEditor');
    },
    async fetchUserInfo() {
      try {
        const session_id = localStorage.getItem('session_id');
        const response = await get_user_info({ session_id });
        if (response.code === -1) {
          this.$message.error('登录过期，请重新登录');
        } else if (response.code === 1) {
          this.$message.error('系统故障');
        } else {
          this.userName = response.user_name;
          this.userAvatar = response.user_avator; // 更新用户头像URL
        }
      } catch (error) {
        console.error("获取用户信息失败:", error);
      }
    }
  }
}
</script>

<style scoped>
/* 文件列表页面样式 */
.file-list-page {
  font-family: Arial, sans-serif;
  background-size: cover;
  background-position: center;
  background-color: rgba(255, 255, 255, 0.9); /* 背景图片透明度为10% */
  height: 100vh; /* 让文件列表页面占据整个视口高度 */
}

.top-row {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px;
  background-color: rgb(237, 241, 244);

}

.logo-and-title {
  display: flex;
  align-items: center; /* 垂直居中对齐 */
  margin-left:10px;
}

.logo {
  width: 50px;
  height: 50px;
  margin-right: 10px;
}

.title {
  font-size: 36px;
  font-weight: bold;
  margin-top: 0; /* 可选：消除标题的上边距 */
}

.top-search-bar input {
  width: 1000px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.divider {
  border: none;
  border-top: 2px solid gray;
  margin: 0;
}

.user-info {
  display: flex;
  align-items: center;
  margin-right: 5px;
}

.username {
  font-weight: bold;
  margin-right: 5px;
}

.user-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 15px;
}

.new-column {
  width: 15%; /* 新列占据页面20%的宽度 */
  padding: 10px;
  box-sizing: border-box;
  background-color: rgb(237, 241, 244);
}

.action-button,
.action-button1 {
  display: block;
  width: 100%;
  padding: 10px 12px;
  margin-bottom: 10px;
  border: none;
  background-color: #ffffff;
  color: black;
  font-size: 14px;
  cursor: pointer;
  border-radius: 5px;
  text-align: center; /* 水平居中 */
  line-height: 1; /* 垂直居中 */
}

.action-button {
  font-weight: normal; /* 字体不加粗 */
}

.action-button1 {
  font-weight: bold; /* 字体加粗 */
  background-color: #a3bded;
}

.action-button:hover {
  background-color: #0056b3;
}
.action-button1:hover {
  background-color: #0056b3;
}

.file-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.file-item {
  display: flex;
  flex-direction: column;
  background-color: #f9f9f9;
  padding: 10px;
  border-radius: 5px;
}

.file-thumbnail img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 5px;
}

.file-details {
  margin-top: 10px;
}

.file-name {
  font-weight: bold;
}

.file-info {
  font-size: 12px;
  color: #666;
}
</style>


