<template>
  <div class="login">
    <el-form ref="loginForm" :model="loginForm"  class="login-form">
      <h3 class="title">富文本编辑器</h3>
      <el-form-item label="用户名" prop="user_id">
        <el-input v-model="loginForm.user_id" autocomplete="off" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="loginForm.password" autocomplete="off" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox>
      <div class="links" v-if="register">
        <router-link class="link-type" :to="'/ForgetPassword'">忘记密码</router-link>
        <router-link class="link-type" :to="'/UserRegister'">立即注册</router-link>
      </div>
      <el-form-item style="width:100%;">
        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width:100%;"
          @click="submitForm"
        >
          登录
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { login } from '@/api/UserLogin';

export default {
  data() {
    return {
      loginForm: {
        user_id: '',
        password: '',
        rememberMe: false
      },
      loading: false,
      register: true
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
    async submitForm() {
      this.loading = true;
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
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
html, body {
  height: 100%;
  margin: 0;
}

.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: linear-gradient(-20deg, #e9defa 0%, #fbfcdb 100%);
  background-size: cover;
}

.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  background: transparent;
  width: 400px;
  border: 5px solid white;
  padding: 25px 25px 5px 25px;
}

.links {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.link-type {
  margin: 0 10px;
}
</style>
