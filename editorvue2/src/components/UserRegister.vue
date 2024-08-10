<template>
  <div class="register">
    <div class="register-container">
      <div class="register-left">
        <a class="back-link1" href="/UserLogin">&lt; &lt; 返回登录页面</a>
        <el-form ref="registerForm" :model="registerForm" :rules="registerRules" class="register-form">
          <h3 class="title2">文曲星智能编辑器</h3>
          <div class="compact-form-container">
            <el-form-item label="用户名" prop="user_id" class="compact-form-item">
              <el-input v-model="registerForm.user_id" placeholder="请输入用户名"></el-input>
            </el-form-item>

            <el-form-item label="邮箱" prop="email" class="compact-form-item">
              <el-input v-model="registerForm.email" type="text"
                        placeholder="请输入正确邮箱号"></el-input>
            </el-form-item>
          </div>
          <div class="button-container">
            <el-form-item style="width:100%;">
              <el-button
                  :loading="yanzhengma"
                  size="medium"
                  type="primary"
                  class="register-button"
                  @click="sendCode"
              >
                获取邮箱验证码
              </el-button>
            </el-form-item>
          </div>
          <div class="compact-form-container">
            <el-form-item label="密码" prop="password" class="compact-form-item">
              <el-input type="password" v-model="registerForm.password"
                        placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword" class="compact-form-item">
              <el-input type="password" v-model="registerForm.confirmPassword"
                        placeholder="再次输入密码"></el-input>
            </el-form-item>
          </div>
          <el-form-item label="验证码" prop="email_code">
            <el-input v-model="registerForm.email_code" autocomplete="off" placeholder="请输入验证码"></el-input>
          </el-form-item>
          <div class="button-container">
            <el-form-item style="width:100%;">
              <el-button
                  :loading="loading"
                  size="medium"
                  type="primary"
                  class="register1-button"
                  @click="handleRegister"
              >
                注册
              </el-button>
            </el-form-item>
          </div>
          <div class="button-container">
            <el-form-item style="width:100%;">
              <el-button
                  :loading="registerloading"
                  size="medium"
                  type="primary"
                  class="forget-password-button"
                  @click="Login"
              >
                使用已有账户登录
              </el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div class="register-right"></div>
    </div>
  </div>
</template>

<script>
import {register, send_rm_code} from '@/api/UserLogin';

export default {
  data() {
    return {
      registerForm: {
        user_id: '',
        password: '',
        confirmPassword: '',
        email: '',
        email_code: ''
      },
      loading: false,
      registerloading: false,
      yanzhengma:false,
      registerRules: {}
    };
  },
  computed: {
    passwordsMatch() {
      return this.registerForm.password === this.registerForm.confirmPassword;
    }
  },
  methods: {
    async Login() {
      this.yanzhengma = true; // 开始注册加载状态
      this.$router.push('/UserLogin');
    },
    async sendCode() {
       if (!this.registerForm.user_id || !this.registerForm.email) {
    this.$message.error('用户名和邮箱不能为空');
    return;
  }
      try {
        const response = await send_rm_code({email: this.registerForm.email});
        if (response.code === 0) {
          this.$message.success('验证码发送成功，请查收');
        }
      } catch (error) {
        console.error('发送验证码失败:', error);
        this.$message.error('发送验证码失败，请稍后重试');
      }finally {
        this.yanzhengma = false;}
    },
    async handleRegister() {
      if (!this.registerForm.password || !this.registerForm.confirmPassword|| !this.registerForm.email_code) {
    this.$message.error('密码不能为空');
    return;
  }
      this.loading = true;
      if (!this.passwordsMatch) {
        this.$message.error('两次输入的密码不一致');
        return;
      }
      try {
        const response = await register(this.registerForm.user_id, this.registerForm.password, this.registerForm.email, this.registerForm.email_code);
        if (response.code === 0) {
          this.$router.push('/UserLogin');
        } else {
          this.$message.error('注册失败，请稍后重试');
        }
      } catch (error) {
        console.error('注册失败:', error);
        this.$message.error('注册失败，请稍后重试');
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss">

body {
  margin: 0 !important;
  overflow: hidden;
}

.el-input {
  background-color: transparent !important; /* 使输入框的背景色透明 */
}

.compact-form-container {
  display: flex; /* 使用 Flexbox 布局 */
}

.compact-form-item {
  flex: 1; /* 让子元素平均分配剩余空间 */
  margin-right: 10px; /* 调整子元素之间的间距 */
}

.register {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url('../assets/static/image/background.png');
}

.register-container {
  display: flex;
  width: 80%;
  height: 85%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-image: linear-gradient(to top, #accbee 0%, #e7f0fd 100%);
  border-radius: 25px;
}

.register-right {
  flex: 1;
  background-image: url('../assets/static/image/wawa.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

.register-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #e7f0fd;
  border-radius: 25px;
  position: relative;
  padding: 20px;
}

.back-link1 {
  position: absolute;
  top: 20px;
  left: 20px;
  color: #3e5da8;
  text-decoration: none;
  font-size: 16px;
}

.back-link1:hover {
  text-decoration: underline;
}

.register-form {
  width: 80%;
  margin-top: 30px; /* 调整这个值以创建标题和表单之间的距离 */
}

.title2 {
  margin-top: 40px; /* 增加标题的顶部间距 */
  margin-bottom: 10px; /* 调整这个值以创建标题和表单之间的距离 */
  text-align: center;
  color: #707070;
  font-size: 2em;
  background-image: linear-gradient(to top, #a3bded 0%, #6991c7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.title1 {
  margin: 0 auto 5px auto;
  text-align: center;
  color: #707070;
  font-size: 1em;
  background-image: linear-gradient(to top, #a3bded 0%, #6991c7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* 确保样式优先级足够高 */
.register-button {
  width: 100%;
  background-color: #0c3483 !important;
  color: white !important;
  border-color: #accbee !important;
}

.button-container {
  margin-top: 20px;
}

.forget-password-button {
  background-color: white !important;
  color: black !important;
  border-color: white !important;
  width: 100%;
}

.register1-button {
  width: 100%;
  background-color: #0c3483 !important;
  color: white !important;
  border-color: #accbee !important;
}
</style>
