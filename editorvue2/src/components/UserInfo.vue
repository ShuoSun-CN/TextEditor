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
        <img v-if="userAvator" :src="userAvator" alt="用户头像" class="user-avator" @mouseover="handleMouseOver" @mouseleave="handleMouseLeave">
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
      <div class="fundamental">
         <div class="words">基础信息</div>
      </div>
      <hr class="divider1">
      <div class="xia">
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
              <el-button @click="backHome">返回</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="avator-container" @mouseover="handleMouseOver" @mouseleave="handleMouseLeave">
          <img v-if="userAvator" :src="userAvator" alt="用户头像" class="avator" :style="{ opacity: showOverlay ? '0.5' : '1' }">
          <div class="avator-overlay" v-if="showOverlay" @click="handleUploadAvatar">
            修改头像
          </div>
        </div>
      </div>
    </div>
    <div class="biaodan-avator-container">
      <div class="fundamental">
         <div class="words">充值信息</div>
      </div>
      <hr class="divider1">
      <div class="xia">
        <div v-if="isUserInfoLoaded" class="biaodan">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item v-if="isVIP" label="会员时间" prop="vip_expired_time">
              <el-input v-model="ruleForm.vip_expired_time"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="charge">续费会员</el-button>
              <el-button @click="backHome">返回</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>

    <!-- Avatar Cropper Dialog -->
    <el-dialog :visible.sync="dialogVisible" title="裁剪头像" @close="handleDialogClose">
      <div>
        <img id="image" :src="imageDataUrl" alt="源图像">
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="cropImage">裁剪并上传</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { get_user_info, update_other_user_info } from '@/api/UserFile';
import axios from "axios";
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';

export default {
  data() {
    return {
      imageUrl: '',
      file: null,
      ruleForm: {
        user_name: '',
        balance: '',
        vip_expired_time: '',
      },
      userName: '',
      userAvator: '',
      isUserInfoLoaded: false,
      isVIP: false,
      rules: {
        user_name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        vip_expired_time: [{ required: true, message: '请输入会员到期时间', trigger: 'blur' }]
      },
      showOverlay: false,
      dialogVisible: false,
      cropper: null,
      imageDataUrl: '',
    };
  },
  async created() {
    await this.fetchUserInfo();
  },
  methods: {
    handleMouseOver() {
      this.showOverlay = true;
    },
    handleMouseLeave() {
      this.showOverlay = false;
    },
    handleUploadAvatar() {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*'; // 改为接受图片
      input.onchange = async (event) => {
        const file = event.target.files[0];
        if (file) {
          this.imageDataUrl = URL.createObjectURL(file);
          this.dialogVisible = true;
          this.$nextTick(() => {
            const image = document.getElementById('image');
            if (this.cropper) {
              this.cropper.destroy();
            }
            this.cropper = new Cropper(image, {
              aspectRatio: 1, // 固定裁剪的形状为正方形
              viewMode: 1,
            });
          });
        }
      };
      input.click();
    },
    async cropImage() {
      if (this.cropper) {
        const canvas = this.cropper.getCroppedCanvas();
        canvas.toBlob(async (blob) => {
          const formData = new FormData();
          const session_id = localStorage.getItem('session_id');
          formData.append('session_id', session_id);
          formData.append('file', blob);

          try {
            const response = await axios.post('http://127.0.0.1:8000/update_avatar/', formData);
            const data = response.data;
            if (data.url) {
              this.userAvator = data.url;
              this.dialogVisible = false;
              this.$message.success('头像上传成功');
            } else {
              this.$message.error('头像上传失败');
            }
          } catch (error) {
            this.$message.error('头像上传失败');
          }
        }, 'image/jpeg');
      }
    },
    handleDialogClose() {
      if (this.cropper) {
        this.cropper.destroy();
      }
      this.cropper = null;
      this.imageDataUrl = '';
    },
    async submitForm() {
      try {
        const session_id = localStorage.getItem('session_id');
        const response = await update_other_user_info(this.ruleForm.user_name, session_id);

        if (response.code === 0) {
          this.$message.success('用户信息更新成功');
          this.fetchUserInfo(); // Refresh user info
        } else {
          this.$message.error('用户信息更新失败');
        }
      } catch (error) {
        this.$message.error('更新用户信息时出错');
      }
    },
    backHome() {
      this.$router.push('/HomePage');
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
          this.userAvator = "http://127.0.0.1:8000/avatar/"+response.user_avator;
          this.isVIP = response.vip === 1; // Set isVIP based on response.vip
          // 将用户信息填入表单
          this.ruleForm.user_name = response.user_name;
          this.ruleForm.balance = response.balance;
          if (this.isVIP) {
            this.ruleForm.vip_expired_time = response.vip_expired_time;
          }

          this.isUserInfoLoaded = true;
        }
      } catch (error) {
        this.$message.error("获取用户信息失败");
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
  height: 100vh; /* 让文件列表页面占据整个视口高度 */
  overflow: auto; /* 允许滚动 */
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
  background-color: #ffffff;
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
  font-weight:   bold;
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
  width: 100%;
  border: none;
  border-top: 2px solid #e1e0e0;
  margin: 0;
}
.divider1 {
  width: 90%;
  border: none;
  border-top: 2px solid #e1e0e0;
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
  transition: opacity 0.3s ease;
}

.avator {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-top: 10px;
  transition: opacity 0.3s ease;
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

.fundamental {
  width: 100%;
  text-align: left;
  font-size: 20px; /* 调整字体大小 */
  margin-left: 1150px; /* 增加左边距，使其更靠左 */
  margin-bottom: 20px;
  margin-top: 20px;
}

.words {
  font-size: 24px; /* 调整字体大小 */
  font-weight: bold; /* 增加字体加粗效果 */
}

.xia {
  width: 95%;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.biaodan-avator-container {
  width: 85%; /* 设置容器宽度 */
  display: flex;
  text-align: left;
  flex-direction: column;
  align-items: center; /* 垂直居中对齐 */
  margin: 10px auto; /* 上下间距为30px，左右自动居中 */
  background-color: #ffffff;
  padding: 20px;
  border-radius: 20px;
  margin-bottom:50px
}

.biaodan {
  padding: 20px;
  width: 90%;
  margin-right: 100px;
  margin-top: 10px;
}

.avator-container {
  position: relative;
  cursor: pointer;
}

.avator-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  color: #ffffff;
  font-size: 14px;
  font-weight: bold;
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 50%;
}

.avator-container:hover .avator-overlay {
  opacity: 1;
}
</style>
