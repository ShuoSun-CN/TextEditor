<template>
    <div class="forgot-password-container">
        <el-card class="forgot-password-card" :body-style="{backgroundColor: 'transparent'}">
            <el-form ref="forgotPasswordForm" :model="forgotPasswordForm" label-width="100px" class="forgot-password-form">
              <el-form-item label="用户名" prop="user_id">
                    <el-input v-model="forgotPasswordForm.user_id" type="text" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="forgotPasswordForm.email" type="text" auto-complete="off" placeholder="请输入正确邮箱号"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="sendCode" style="width: 100%;">发送验证码</el-button>
                </el-form-item>
                <el-form-item label="验证码" prop="email_code">
                    <el-input v-model="forgotPasswordForm.email_code" autocomplete="off" placeholder="请输入验证码"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="password">
                    <el-input type="password" v-model="forgotPasswordForm.password" autocomplete="off" placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="confirmPassword">
                    <el-input type="password" v-model="forgotPasswordForm.confirmPassword" autocomplete="off" placeholder="再次输入密码"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="resetPassword" style="width: 100%;">重置密码</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
import {verify_forget_password,  send_fm_code} from '@/api/UserLogin';

    export default {
        data() {
            return {
                forgotPasswordForm: {
                    user_id:'',
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
        }
        else if(response.code===1){
           this.$message.error('验证码发送失败');
        }
        else if(response.code===2){
           this.$message.error('用户名与邮箱不匹配，请重新输入用户名');
        }
        else{
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
                try{
                  const response =await verify_forget_password(this.forgotPasswordForm.user_id, this.forgotPasswordForm.password, this.forgotPasswordForm.email_code)
                  if (response.code === 0) {
                            this.$message.success('密码重置成功');
                            this.$router.push('/UserLogin');
                        } else if (response.code === 1) {
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

<style scoped>
    .forgot-password-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background-image: linear-gradient(-20deg, #e9defa 0%, #fbfcdb 100%);
    }

    .forgot-password-card {
        width: 400px;
        padding: 20px;
        border-radius: 10px;
        background: transparent;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    }

    .forgot-password-form {
        margin-top: 20px;
    }
</style>
