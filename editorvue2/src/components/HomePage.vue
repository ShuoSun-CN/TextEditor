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
        <el-dropdown>
          <span class="el-dropdown-link">
            用户名：{{ userName }}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="changeinfo">修改信息</el-dropdown-item>
            <el-dropdown-item>
              <el-upload
                class="avatar-uploader"
                action="https://jsonplaceholder.typicode.com/posts/"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <span>修改头像</span>
              </el-upload>
            </el-dropdown-item>
            <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <hr class="divider">
    <!-- 新列 -->
    <div>
      <div class="new-column">
        <!-- 创建文件按钮 -->
        <button class="action-button1" @click="MyEditor">创建文件</button>
        <!-- 最近文件按钮 -->
        <button class="action-button">最近文件</button>
        <!-- 共享文件按钮 -->
        <button class="action-button">共享文件</button>
        <!-- 全部文件按钮 -->
        <button class="action-button">全部文件</button>
      </div>
      <div class="divider1"></div>
    </div>
    <div class="fileist"></div>
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
      userAvatar: '', // 用户头像URL
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
    },
    async logout() {
      console.log('执行退出登录方法');
      localStorage.removeItem('session_id');
      this.userName = '';
      this.userAvatar = '';
      console.log('用户信息已清除');
      this.$router.push('/UserLogin');
      console.log('已跳转到登录页面');
    },
    async changeinfo() {
      this.$router.push('/UserInfo');
    },
    handleAvatarSuccess(res, file) {
      this.userAvatar = URL.createObjectURL(file.raw);
      this.$message.success(`头像上传成功: ${file.name}`);
    },
    beforeAvatarUpload(file) {
      const isJPGOrPNG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPGOrPNG) {
        this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPGOrPNG && isLt2M;
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
  height: 100vh; /* 让文件列表页面占据整个视口高度 */
}

.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}

.el-icon-arrow-down {
  font-size: 12px;
}

.top-row {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
}

.logo-and-title {
  display: flex;
  align-items: center; /* 垂直居中对齐 */
  margin-left: 10px;
}

.logo {
  width: 50px;
  height: 50px;
  margin-right: 10px;
}

.title {
  font-size: 30px;
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

.divider1 {
  border: none;
  border-right-style: dotted;
  /* border-right: 2px solid gray;*/
  height: 100%;
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
  width: 35px;
  height: 35px;
  border-radius: 50%;
  margin-right: 15px;
}

.avatar-uploader .el-upload {
  display: inline-block;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.new-column {
  display: inline-block;
  width: 15%; /* 新列占据页面15%的宽度 */
  padding: 10px;
  box-sizing: border-box;
  vertical-align: top;
  /*background-color: rgb(237, 241, 244);*/
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
  border-radius: 1px;
  text-align: center; /* 水平居中 */
  line-height: 1; /* 垂直居中 */
}

.action-button {
  font-weight: normal; /* 字体不加粗 */
}

.action-button1 {
  font-weight: bold; /* 字体加粗 */
  background-color: #e7f0fd;
}

.action-button:hover {
  background-color: #accbee;
}

.action-button1:hover {
  background-color: #accbee;
}

.file-thumbnail img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 5px;
}
</style>

