<template>
  <div class="file-list-page">
    <!-- 顶部行 -->
    <div class="top-row">
      <!-- Logo 和 标题 -->
      <div class="logo-and-title">
        <img src="../assets/logo.png" alt="logo" class="logo">
        <span class="title">文曲星编辑器</span>
      </div>
      <div class="user-info">
        <img v-if="userAvatar" :src="userAvatar" alt="用户头像" class="user-avatar">
        <el-dropdown>
          <span class="el-dropdown-link">
            用户名：{{ userName }}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown" class="custom-dropdown-menu">
            <el-dropdown-item @click.native="changeinfo">修改信息</el-dropdown-item>
            <el-dropdown-item>修改头像</el-dropdown-item>
            <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <hr class="divider">
    <div v-if="isUserInfoLoaded" class="biaodan">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="user_name">
          <el-input v-model="ruleForm.user_name"></el-input>
        </el-form-item>
        <el-form-item label="账户余额" prop="balance">
          <el-input v-model="ruleForm.balance"></el-input>
        </el-form-item>
        <el-form-item label="会员到期时间" prop="vip_expired_time">
          <el-input v-model="ruleForm.vip_expired_time"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">立即修改</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 新列 -->
  </div>
</template>

<script>
import { get_user_info, update_other_user_info } from '@/api/UserFile';

export default {
  name: 'FileListPage',
  data() {
    return {
      ruleForm: {
        user_name: '',
        balance: '',
        vip_expired_time: '',
      },
      searchQuery: '', // 搜索框输入
      userName: '', // 用户名
      userAvatar: '', // 用户头像URL
      isUserInfoLoaded: false, // 用户信息是否加载完成
      rules: {
        user_name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        balance: [{ required: true, message: '请输入账户余额', trigger: 'blur' }],
        vip_expired_time: [{ required: true, message: '请输入会员到期时间', trigger: 'blur' }]
      }
    };
  },
  async created() {
    await this.fetchUserInfo();
  },
  methods: {
    async submitForm() {
      try {
        const session_id = localStorage.getItem('session_id');
        const response = await update_other_user_info({
          user_name: this.ruleForm.user_name,
          session_id: session_id,
        });

        if (response.code === 0) {
          this.$message.success('用户信息更新成功');
          this.fetchUserInfo(); // Refresh user info
        } else {
          this.$message.error('用户信息更新失败');
        }
      } catch (error) {
        console.error('更新用户信息失败:', error);
        this.$message.error('更新用户信息时出错');
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    async fetchUserInfo() {
      try {
        const session_id = localStorage.getItem('session_id');
        const response = await get_user_info({ session_id });
        if (response.code === -1) {
          this.$message.error('登录过期，请重新登录');
          this.$router.push('/UserLogin');
        } else if (response.code === 1) {
          this.$message.error('系统故障');
        } else {
          this.userName = response.user_name;
          this.userAvatar = response.user_avatar; // 更新用户头像URL

          // 将用户信息填入表单
          this.ruleForm.user_name = response.user_name;
          this.ruleForm.balance = response.balance;
          this.ruleForm.vip_expired_time = response.vip_expired_time;

          this.isUserInfoLoaded = true; // 标记用户信息已加载
        }
      } catch (error) {
        console.error("获取用户信息失败:", error);
      }
    },
    logout() {
      localStorage.removeItem('session_id');
      this.userName = '';
      this.userAvatar = '';
      this.$router.push('/UserLogin');
    },
    changeinfo() {
      this.$router.push('/UserInfo');
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
  width: 800px;
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

.user-avatar {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  margin-right: 15px;
}

.custom-dropdown-menu .el-dropdown-item {
  font-size: 12px;
  padding: 5px 10px;
}

.file-thumbnail img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 5px;
}
.biaodan {
  padding: 80px;
}
</style>
