<template>
  <div class="file-list-page">
    <!-- 顶部行 -->
    <div class="top-row">
      <!-- Logo 和 标题 -->
      <div class="logo-and-title">
        <img src="../assets/logo.png" alt="logo" class="logo">
        <span class="title2">文曲星编辑器</span>
      </div>
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
    <hr class="divider">
    <div class="biaodan-avator-container">
      <div v-if="isUserInfoLoaded" class="biaodan">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="用户名" prop="user_name">
            <el-input v-model="ruleForm.user_name"></el-input>
          </el-form-item>
          <el-form-item v-if="isVIP" label="会员时间" prop="vip_expired_time">
            <el-input v-model="ruleForm.vip_expired_time"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm">立即修改</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <img v-if="userAvator" :src="userAvator" alt="用户头像" class="avator">
    </div>
  </div>
</template>

<script>
import { get_user_info, update_other_user_info, update_avator } from '@/api/UserFile';

export default {
  data() {
    return {
      imageUrl: '',
      file: null, // 用于存储上传的文件
      ruleForm: {
        user_name: '',
        balance: '',
        vip_expired_time: '',
      },
      userName: '', // 用户名
      userAvator: '', // 用户头像URL
      isUserInfoLoaded: false, // 用户信息是否加载完成
      isVIP: false, // 是否是VIP用户
      rules: {
        user_name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        vip_expired_time: [{ required: true, message: '请输入会员到期时间', trigger: 'blur' }]
      }
    };
  },
  async created() {
    await this.fetchUserInfo();
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      this.file = file.raw; // 保存文件对象
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    async submitForm() {
      try {
        const session_id = localStorage.getItem('session_id');
        const response = await update_other_user_info(this.ruleForm.user_name, session_id);

        if (response.code === 0) {
          this.$message.success('用户信息更新成功');

          if (this.file) {
            const formData = new FormData();
            formData.append('avatar', this.file);
            formData.append('session_id', session_id);
            await update_avator(formData);
          }

          this.fetchUserInfo(); // Refresh user info
          this.$router.push('/HomePage');
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
          this.userAvator = response.user_avator;
          this.isVIP = response.vip === 1; // Set isVIP based on response.vip
          // 将用户信息填入表单
          this.ruleForm.user_name = response.user_name;
          this.ruleForm.balance = response.balance;
          if (this.isVIP) {
            this.ruleForm.vip_expired_time = response.vip_expired_time;
          }

          this.isUserInfoLoaded = true; // 标记用户信息已加载
        }
      } catch (error) {
        console.error("获取用户信息失败:", error);
      }
    },
    logout() {
      localStorage.removeItem('session_id');
      this.userName = '';
      this.userAvator = '';
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
  background-color: #f0f0f0;
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
.button-icon2 {
  width: 15px; /* 图标宽度 */
  height: 15px; /* 图标高度 */
  margin-right: 10px;
  font-size: 20px;
}
.vip-icon {
  width: 15px; /* 调整VIP图标的大小 */
  height: 15px; /* 调整VIP图标的大小 */
  margin-right: 10px; /* 调整图标与其他元素之间的间距 */
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
  border-radius: 50%;
}

.title2 {
  text-align: center;
  font-weight: bold;
  color: #707070;
  font-size: 30px;
  background-image: linear-gradient(to top, #a3bded 0%, #6991c7 100%);
  margin-top: 10px; /* 可选：消除标题的上边距 */
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

.user-avator {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  margin-right: 15px;
}

.avator {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-right: 100px;
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

.biaodan-avator-container {
  width: 85%; /* 设置容器宽度 */
  display: flex;
  align-items: center; /* 垂直居中对齐 */
  justify-content: center; /* 水平居中对齐 */
  margin: 30px auto; /* 上下间距为20px，左右自动居中 */
  background-color: #ffffff;
}


.biaodan {
  padding: 20px;
  width:70%;
  margin-right: 100px;
  margin-top: 30px;
}
</style>
