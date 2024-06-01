<template>
  <div class="login">
    <div class="login-container">
      <div class="login-left"></div>
      <div class="login-right">
        <el-form ref="loginForm" :model="loginForm" class="login-form">
          <h3 class="title">文曲星智能编辑器</h3>
          <h3 class="title1">welcome</h3>

          <el-form-item label="用户名" prop="user_id" class="shurukuang">
            <el-input v-model="loginForm.user_id" type="text" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password" class="shurukuang">
            <el-input type="password" v-model="loginForm.password" autocomplete="off"
                      placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox>
          <div class="button-container">
            <el-form-item style="width:100%;">
              <el-button
                  :loading="loading"
                  size="medium"
                  type="primary"
                  class="login-button"
                  @click="submitForm"
              >
                登录
              </el-button>
            </el-form-item>
            <el-form-item style="width:100%;">
              <el-button
                  :loading="registerLoading"
                  size="medium"
                  type="primary"
                  class="forget-password-button"
                  @click="Register"
              >
                注册
              </el-button>
            </el-form-item>
            <el-form-item style="width:100%;">
              <el-button
                  :loading="ForgetPasswordLoading"
                  size="medium"
                  type="primary"
                  class="forget-password-button"
                  @click="ForgetPassword"
              >
                忘记密码
              </el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import {login} from '@/api/UserLogin';

export default {
  data() {
    return {
      loginForm: {
        user_id: '',
        password: '',
        rememberMe: false
      },
      loading: false,
      registerLoading: false, // 新的加载状态属性
      register: true,
      ForgetPasswordLoading: false
    };
  },
  mounted() {
    // 自动填充本地存储中的用户名和密码
    if (localStorage.getItem('rememberMe') === 'true') {
      this.loginForm.user_id = localStorage.getItem('user_id');
      this.loginForm.password = localStorage.getItem('password');
      this.loginForm.rememberMe = true;
    }
  },
  methods: {
    async Register() {
      this.registerLoading = true; // 开始注册加载状态
      this.$router.push('/UserRegister');
    },
    async ForgetPassword() {
      this.ForgetPasswordLoading = true; // 开始注册加载状态
      this.$router.push('/ForgetPassword');
    },
    async submitForm() {
      this.loading = true; // 开始登录加载状态
      try {
        const response = await login(this.loginForm.user_id, this.loginForm.password);
        if (response.code === 0) {
          // 登录成功，处理记住密码逻辑
          if (this.loginForm.rememberMe) {
            localStorage.setItem('user_id', this.loginForm.user_id);
            localStorage.setItem('password', this.loginForm.password);
            localStorage.setItem('rememberMe', 'true');
          } else {
            localStorage.removeItem('user_id');
            localStorage.removeItem('password');
            localStorage.setItem('rememberMe', 'false');
          }
          this.$router.push('/MyEditor');
        } else {
          this.$message.error('用户名或密码错误');
        }
      } catch (error) {
        console.error('登录失败:', error);
        this.$message.error('登录失败，请稍后重试');
      } finally {
        this.loading = false; // 停止登录加载状态
      }
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
  height: 80%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-image: linear-gradient(to top, #accbee 0%, #e7f0fd 100%);
  border-radius: 25px;
}

.login-left {
  flex: 1;
  background-image: url('../assets/static/image/wawa.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

.login-right {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #e7f0fd;
  border-radius: 25px;
}

.title {
  margin: 20px auto 5px auto;
  text-align: center;
  color: #707070;
  font-size: 2em;
  background-image: linear-gradient(to top, #a3bded 0%, #6991c7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.title1 {
  margin: 0px auto 5px auto;
  text-align: center;
  color: #707070;
  font-size: 1em;
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
}

.forget-password-button {
  background-color: white !important;
  color: black !important;
  border-color: white !important;
  width: 100%
}

.shurukuang {
  margin-bottom: 5px;
}
</style>
