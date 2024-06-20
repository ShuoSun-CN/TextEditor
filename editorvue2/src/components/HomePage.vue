<template>
  <div class="file-list-page">
    <!-- 头部 -->
    <header class="header">
      <div class="search-bar">
        <input type="text" v-model="searchQuery" placeholder="搜索文件">
      </div>
      <div class="user-info">
        <img src="../assets/logo.png" alt="用户头像" class="user-avatar">
        <span class="username">用户名</span>
      </div>
    </header>

    <!-- 文件列表 -->
    <div class="file-list">
      <div v-for="(file, index) in fileList" :key="index" class="file-item">
        <!-- 文件缩略图/图标 -->
        <div class="file-thumbnail">
          <img :src="file.thumbnail" alt="文件缩略图">
        </div>
        <!-- 文件详情 -->
        <div class="file-details">
          <p class="file-name">{{ file.name }}</p>
          <p class="file-info">{{ file.size }} • {{ file.modifiedDate }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FileListPage',
  data() {
    return {
      searchQuery: '', // 搜索框输入
      fileList: [ // 文件列表数据示例
        { name: '文档1', thumbnail: 'thumbnail1.jpg', size: '10 MB', modifiedDate: '2024-06-05' },
        { name: '文档2', thumbnail: 'thumbnail2.jpg', size: '5 MB', modifiedDate: '2024-06-04' },
        // 添加更多文件对象
      ]
    };
  }
}
</script>

<style scoped>
/* 文件列表页面样式 */
.file-list-page {
  font-family: Arial, sans-serif;
  padding: 20px;
  background-image: url('../assets/static/image/background.png');
  background-size: cover;
  background-position: center;
  background-color: rgba(255, 255, 255, 0.9); /* 背景图片透明度为10% */
  height: 100vh; /* 让文件列表页面占据整个视口高度 */
}



.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-bar input {
  width: 200px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.username {
  font-weight: bold;
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
