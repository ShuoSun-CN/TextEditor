<template>
  <div class="login">
    <div class="login-container">
      <div class="login-left">
        <a class="back-link2" href="/UserLogin">&lt; &lt; 返回登录页面</a>
      </div>
      <div class="login-right">
        <el-form ref="loginForm" :model="forgotPasswordForm" class="login-form">
          <h3 class="title2">文曲星智能编辑器</h3>
          <el-form-item label="用户名" prop="user_id" class="shurukuang">
            <el-input v-model="forgotPasswordForm.user_id" type="text" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email" class="shurukuang">
            <el-input v-model="forgotPasswordForm.email" type="text"
                      placeholder="请输入正确邮箱号"></el-input>
          </el-form-item>
          <div class="button-container">
            <el-form-item style="width:100%;">
              <el-button
                  size="medium"
                  type="primary"
                  class="register-button"
                  @click="sendCode"
              >
                发送验证码
              </el-button>
            </el-form-item>
          </div>
          <el-form-item label="验证码" prop="email_code" style="margin-bottom: 3px;">
            <el-input v-model="forgotPasswordForm.email_code" autocomplete="off" placeholder="请输入验证码"></el-input>
          </el-form-item>
          <div class="compact-form-container" style="margin-bottom: 1px;">
            <el-form-item label="密码" prop="password" class="compact-form-item">
              <el-input type="password" v-model="forgotPasswordForm.password"
                        placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword" class="compact-form-item">
              <el-input type="password" v-model="forgotPasswordForm.confirmPassword"
                        placeholder="再次输入密码"></el-input>
            </el-form-item>
          </div>
          <div class="button-container">
            <el-form-item style="width:100%;">
              <el-button
                  size="medium"
                  type="primary"
                  class="login-button"
                  @click="resetPassword"
              >
                重置密码
              </el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import {verify_forget_password, send_fm_code} from '@/api/UserLogin';

export default {
  data() {
    return {
      forgotPasswordForm: {
        user_id: '',
        email: '',
        email_code: '',
        password: '',
        confirmPassword: ''
      }
    };
  },
  methods: {
    async sendCode() {
      try {
        const response = await send_fm_code(this.forgotPasswordForm.user_id, this.forgotPasswordForm.email);
        if (response.code === 0) {
          this.$message.success('验证码发送成功，请查收');
        } else if (response.code === 1) {
          this.$message.error('验证码发送失败');
        } else if (response.code === 2) {
          this.$message.error('用户名与邮箱不匹配，请重新输入用户名');
        } else {
          this.$message.error('发送失败');
        }
      } catch (error) {
        console.error('发送验证码失败:', error);
        this.$message.error('发送验证码失败，请稍后重试');
      }
    },
    async resetPassword() {
      this.loading = true;
      if (!this.validateForm()) {
        return;
      }
      try {
        const response = await verify_forget_password(this.forgotPasswordForm.user_id, this.forgotPasswordForm.password, this.forgotPasswordForm.email_code)
        if (response.code === 0) {
          this.$message.success('密码重置成功');
          this.$router.push('/UserLogin');
        } else if (response.code === 2) {
          this.$message.error('验证码错误');
        } else {
          this.$message.error('重置密码失败，请稍后重试1');
        }
      } catch (error) {
        console.error('重置失败:', error);
        this.$message.error('重置密码失败，请稍后重试');
      } finally {
        this.loading = false;
      }
    },
    validateForm() {
      if (!this.forgotPasswordForm.email) {
        this.$message.error('请输入邮箱');
        return false;
      }
      if (!this.forgotPasswordForm.email_code) {
        this.$message.error('请输入验证码');
        return false;
      }
      if (!this.forgotPasswordForm.password) {
        this.$message.error('请输入新密码');
        return false;
      }
      if (this.forgotPasswordForm.password !== this.forgotPasswordForm.confirmPassword) {
        this.$message.error('两次输入的密码不一致');
        return false;
      }
      return true;
    }
  }
};
</script>

<style>
body {
  margin: 0 !important;
  overflow: hidden;
}


.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url('../assets/static/image/background.png');
}

.login-container {
  display: flex;
  width: 80%;
  height: 85%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-image: linear-gradient(to top, #accbee 0%, #e7f0fd 100%);
  border-radius: 25px;
}
.back-link2 {
  margin-left: 20px;
  color: #3e5da8;
  text-decoration: none;
  font-size: 16px;
  margin-top: 100px;
}

.back-link2:hover {
  text-decoration: underline;
}

.login-left {
  flex: 1;
  background-image: url('../assets/static/image/wawa.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  margin-top: 20px;
}

.login-right {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #e7f0fd;
  border-radius: 25px;
}

.title2 {
  margin: 20px auto 5px auto;
  text-align: center;
  color: #707070;
  font-size: 2em;
  background-image: linear-gradient(to top, #a3bded 0%, #6991c7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}



.login-form {
  width: 80%;
}

/* 确保样式优先级足够高 */
.login-button {
  width: 100%;
  background-color: #0c3483 !important;
  color: white !important;
  border-color: #accbee !important;
}

.button-container {
  margin-top: 20px;
}

.register-button {
  width: 100%;
  background-color: white !important;
  color: black !important;
  border-color: white !important;
  margin-top: 3px;
}

.shurukuang {
  margin-bottom: 5px;
}
</style>
