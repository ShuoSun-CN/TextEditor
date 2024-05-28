<template>
    <div class="register-container">
        <el-card class="register-card" :body-style="{backgroundColor: 'transparent'}">
            <el-form ref="registerForm" :model="registerForm" label-width="80px" class="register-form">
                <el-form-item label="用户名" prop="user_id">
                    <el-input v-model="registerForm.user_id" autocomplete="off" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="registerForm.password" autocomplete="off" placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="registerForm.email" autocomplete="off" placeholder="请输入邮箱"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="sendCode" style="width: 100%;">点击获取邮箱验证码</el-button>
                </el-form-item>
                <el-form-item label="验证码" prop="email_code">
                    <el-input v-model="registerForm.email_code" autocomplete="off" placeholder="请输入验证码"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm" style="width: 100%;">注册</el-button>
                    <router-link to="/UserLogin">已有账号？去登录</router-link>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
    import { send_fm_code, register } from "@/api/UserLogin";

    export default {
        data() {
            return {
                registerForm: {
                    user_id: '',
                    password: '',
                    email: '',
                    email_code: ''
                }
            };
        },
        methods: {
            async sendCode() {
                try {
                    const response = await send_fm_code({ email: this.registerForm.email });
                    if (response.data.code === 0) {
                        this.$message.success('验证码发送成功');
                    } else {
                      this.$message.error('验证码发送失败');
                    }
                } catch (error) {
                  console.error('验证码发送失败:', error);
                  this.$message.error('验证码发送失败，请重新输入邮箱');
                }
            },
          async submitForm() {
            const {user_id, password, email, email_code} = this.registerForm;
            try {
              const response = await register(user_id, password, email, email_code);
              if (response.data.code === 0) {
                this.$message.success('注册成功');
                this.$router.push('/UserLogin');
              } else if (response.data.code === 2) {
                this.$message.error('验证码输入错误，请重新检查验证码输入');
              } else {
                this.$message.error('其他错误');
              }
            } catch (error) {
              console.error('注册失败:', error);
              this.$message.error('注册失败，请稍后重试');
            }
          }
        }
    };
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: linear-gradient(-20deg, #e9defa 0%, #fbfcdb 100%);
}

.register-card {
  width: 400px;
  padding: 20px;
  border-radius: 10px;
  background: transparent;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

.register-form {
  margin-top: 20px;
}

.el-input__inner {
  border-radius: 5px;
}

.el-button {
  border-radius: 5px;
}
</style>
