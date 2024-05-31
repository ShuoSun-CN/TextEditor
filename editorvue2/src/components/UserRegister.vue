<template>
  <div class="register">
    <el-form ref="registerForm" :model="registerForm" :rules="registerRules" class="register-form">
      <h3 class="title">富文本编辑器</h3>
      <el-form-item label="用户名" prop="user_id">
        <el-input v-model="registerForm.user_id" autocomplete="off" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="registerForm.password" autocomplete="off" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input type="password" v-model="registerForm.confirmPassword" autocomplete="off" placeholder="再次输入密码"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="registerForm.email" type="text" auto-complete="off" placeholder="请输入正确邮箱号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :disabled="!passwordsMatch" @click="sendCode" style="width: 100%;">点击获取邮箱验证码</el-button>
      </el-form-item>
      <el-form-item label="验证码" prop="email_code">
        <el-input v-model="registerForm.email_code" autocomplete="off" placeholder="请输入验证码"></el-input>
      </el-form-item>
      <el-form-item style="width:100%;">
        <el-button :loading="loading" size="medium" type="primary" style="width:100%;" @click.prevent="handleRegister">
          <span v-if="!loading">注 册</span>
          <span v-else>注 册 中...</span>
        </el-button>
        <div style="float: right;">
          <router-link class="link-type" :to="'/UserLogin'">使用已有账户登录</router-link>
        </div>
      </el-form-item>
    </el-form>
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
      registerRules:{

      }
    };
  },
  computed: {
    passwordsMatch() {
      return this.registerForm.password === this.registerForm.confirmPassword;
    }
  },
  methods: {
    async sendCode() {
      if (!this.passwordsMatch) {
        this.$message.error('两次输入的密码不一致');
        return;
      }
      try {
        const response = await send_rm_code({ email: this.registerForm.email });
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
