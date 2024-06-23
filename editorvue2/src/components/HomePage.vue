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
            <el-dropdown-item @click.native="logout">
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

    <!-- 新列 -->
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

    <!-- 文件列表区域 -->
    <div class="fileist">
      <div class="file">
        <!-- 使用 v-for 遍历 files 数组，生成文件列表 -->
        <div v-for="file in files" :key="file.file_id" class="file-thumbnail">
          <span>{{ file.file_name }}</span>
          <img :src="getIconForFileType(file.file_type)" alt="文件图标">
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
      const response = await create_text({ session_id: session_id });
      if (response.code === 0) {
        this.$router.push({ path: '/MyEditor', query: { file_id: response.file_id } });
      }
    } catch (error) {
      console.error('创建文件失败:', error);
    }
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
          this.userAvator = response.user_avator; // 更新用户头像URL
          this.isVIP = response.vip === 1; // 检查用户是否是VIP
        }
      } catch (error) {
        console.error('获取用户信息失败:', error);
      }
    },
    async fetchTextList() {
      try {
        const session_id = localStorage.getItem('session_id');
        const response = await get_text_list({ session_id: session_id });
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
    handleAvatorSuccess(res, file) {
      this.userAvator = URL.createObjectURL(file.raw);
      this.$message.success(`头像上传成功: ${file.name}`);
    },
    beforeAvatorUpload(file) {
      const isJPGOrPNG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPGOrPNG) {
        this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPGOrPNG && isLt2M;
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
          return '../assets/icons/default-icon.svg'; // 默认图标路径
      }
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
}

.file-thumbnail {
  width: 100px;
  height: 100px;
  margin: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.file-thumbnail img {
  width: 50px; /* 根据需要调整文件图标的大小 */
  height: 50px; /* 根据需要调整文件图标的大小 */
  object-fit: contain;
  margin-bottom: 5px;
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
  justify-content: flex-start; /* 修改为左对齐 */
  align-items: center;
  margin-top: 10px;
  margin-bottom: 5px;
}

.logo-and-title {
  display: flex;
  align-items: center; /* 垂直居中对齐 */
  margin-left: 10px;
  margin-right: 10px; /* 调整为10px */
}
.usermanaage{
  align-items: center;
}
.logo {
  width: 50px;
  height: 50px;
  margin-right: 10px;
  border-radius: 50%;
  margin-top:10px;
}

.title2 {
  text-align: center;
  font-weight: bold;
  color: #707070;
  font-size: 30px;
  background-image: linear-gradient(to top, #a3bded 0%, #6991c7 100%);
  margin-top: 10px;
}

.top-search-bar {
  display: flex;
  flex: 1;
  margin-top:10px;
}

.top-search-bar input {
  width: 400px;
  padding: 10px;
  margin-left: 50px; /* 移除 margin-left */
  margin-right: 10px; /* 调整为10px */
  border: 1px solid #ccc;
  border-radius: 20px;
  text-align: left;
}

.divider {
  border: none;
  border-top: 2px solid #bfb8b8;
  margin: 0;
}

.user-info {
  display: flex;
  align-items: center;
  margin-right: 10px;
  margin-top:10px;
}

.user-avator {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  margin-right: 15px;
}

.vip-icon {
  width: 15px; /* 调整VIP图标的大小 */
  height: 15px; /* 调整VIP图标的大小 */
  margin-right: 10px; /* 调整图标与其他元素之间的间距 */
}

.el-dropdown-menu {
  padding: 10px;
}

.el-dropdown-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
}

.el-dropdown-item img.button-icon {
  margin-right: 10px;
}

.avator-uploader .el-upload {
  display: inline-block;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avator-uploader .el-upload:hover {
  border-color: #409EFF;
}

.all {
  height: 100%;
  width:18%;
  border-right: 1px solid #bfb8b8; /* 右边框为灰色 */
}

.new-column {
  display: inline-block;
  padding: 10px;
  width: 100%;
  box-sizing: border-box;
  vertical-align: top;
  margin-right:20px;
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
}

.action-button1 {
  color: white;
  background-color: #6991c7;
  font-weight: bold; /* 字体加粗 */
  margin-bottom: 15px; /* 创建文件按钮下方的间距 */
}

.action-button {
  background-color: #ffffff;
  text-align: left; /* 左对齐 */
  color: black;
}

.action-button:hover,
.action-button1:hover {
  background-color: #accbee;
}

.button-icon {
  width: 20px; /* 图标宽度 */
  height: 20px; /* 图标高度 */
  margin-right: 10px;
}
.button-icon2 {
  width: 15px; /* 图标宽度 */
  height: 15px; /* 图标高度 */
  margin-right: 10px;
}

.button-icon1 {
  width: 20px; /* 图标宽度 */
  height: 20px; /* 图标高度 */
  margin-right: 30px; /* 图标与文字之间的间距 */
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
