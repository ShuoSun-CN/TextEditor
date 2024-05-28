<template>
  <div class="login">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
      <h3 class="title">富文本编辑器</h3>
     <el-form-item label="用户名" prop="user_id">
                    <el-input v-model="loginForm.user_id" autocomplete="off" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="loginForm.password" autocomplete="off" placeholder="请输入密码"></el-input>
                </el-form-item>

      <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox>
       <div style="float: right;" v-if="register">
          <router-link class="link-type" :to="'/ForgetPassword'">忘记密码</router-link>
        </div>
      <el-form-item style="width:100%;">
        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width:100%;"
          @click.native.prevent="handleLogin"
        >
          <el-button type="primary" @click="submitForm" style="width: 100%;">登录</el-button>

        </el-button>
        <div style="float: right;" v-if="register">
          <router-link class="link-type" :to="'/UserRegister'">立即注册</router-link>
        </div>
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
        password: ''
      },
      captchaEnabled: true,
      loading: false,
      codeUrl: '',  // Add your captcha URL here
      register: true
    };
  },
  methods: {
    submitForm() {
      this.handleLogin(this.loginForm.user_id, this.loginForm.password);
    },
    async handleLogin(user_id, password) {
      this.loading = true;
      try {
        const response = await login(user_id, password);
        const data = response;
        if (data.code === 0) {
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
    },
    getCode() {
      // Logic to refresh captcha
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
  .el-input {
    height: 38px;
    input {
      height: 38px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}

.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}

.login-code {
  width: 33%;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}

.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}

.login-code-img {
  height: 38px;
}
</style>
