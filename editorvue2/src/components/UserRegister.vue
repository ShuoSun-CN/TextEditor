<template>
  <div class="register">
    <div class="register-container">
      <div class="register-left">
        <el-form ref="registerForm" :model="registerForm" :rules="registerRules" class="register-form">
          <h3 class="title">文曲星智能编辑器</h3>
            <div class="compact-form-container">
              <el-form-item label="用户名" prop="user_id" class="compact-form-item">
                <el-input v-model="registerForm.user_id"  placeholder="请输入用户名"></el-input>
              </el-form-item>

              <el-form-item label="邮箱" prop="email" class="compact-form-item">
                <el-input v-model="registerForm.email" type="text"
                          placeholder="请输入正确邮箱号"></el-input>
              </el-form-item>
            </div>


          <div class="button-container">
            <el-form-item style="width:100%;">
              <el-button
                  :loading="loading"
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
                  size="medium"
                  type="primary"
                  class="register-button"
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
      this.registerloading = true; // 开始注册加载状态
      this.$router.push('/UserLogin');
    },
    async sendCode() {
      if (!this.passwordsMatch) {
        this.$message.error('两次输入的密码不一致');
        return;
      }
      try {
        const response = await send_rm_code({email: this.registerForm.email});
        if (response.code === 1) {
          this.$message.success('验证码发送成功，请查收');
        }
      } catch (error) {
        console.error('发送验证码失败:', error);
        this.$message.error('发送验证码失败，请稍后重试');
      }
    },
    async handleRegister() {
      this.loading = true;
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
@import '../assets/register.css';
</style>