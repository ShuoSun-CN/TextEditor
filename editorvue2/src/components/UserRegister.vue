<template>
  <div class="register">
    <el-form ref="registerForm" :model="registerForm" :rules="registerRules" class="register-form">
      <h3 class="title">富文本编辑器</h3>
      <el-form-item prop="user_id">
        <el-input v-model="registerForm.username" type="text" auto-complete="off" placeholder="用户名">
          <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="registerForm.password"
          type="password"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter.native="handleRegister"
        >
          <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="confirmPassword">
        <el-input
          v-model="registerForm.confirmPassword"
          type="password"
          auto-complete="off"
          placeholder="确认密码"
          @keyup.enter.native="handleRegister"
        >
          <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="email">
        <el-input v-model="registerForm.username" type="text" auto-complete="off" placeholder="邮箱">
          <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item>
                    <el-button type="primary" @click="sendCode" style="width: 100%;">点击获取邮箱验证码</el-button>
                </el-form-item>
                <el-form-item label="验证码" prop="email_code">
                    <el-input v-model="registerForm.email_code" autocomplete="off" placeholder="请输入验证码"></el-input>
                </el-form-item>

      <el-form-item prop="code" v-if="captchaEnabled">
        <el-input
          v-model="registerForm.code"
          auto-complete="off"
          placeholder="验证码"
          style="width: 63%"
          @keyup.enter.native="handleRegister"
        >
          <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />
        </el-input>
        <div class="register-code">
          <img :src="codeUrl" @click="getCode" class="register-code-img"/>
        </div>
      </el-form-item>
      <el-form-item style="width:100%;">
        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width:100%;"
          @click.native.prevent="handleRegister"
        >
          <span v-if="!loading">注 册</span>
          <span v-else>注 册 中...</span>
        </el-button>
        <div style="float: right;">
          <router-link class="link-type" :to="'/login'">使用已有账户登录</router-link>
        </div>
      </el-form-item>
    </el-form>
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
<style rel="stylesheet/scss" lang="scss">
.register {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh; // 保证最小高度为100vh，填满整个屏幕
  background-image: linear-gradient(-20deg, #e9defa 0%, #fbfcdb 100%);
  background-size: cover;
}

.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.register-form {
  border-radius: 6px;
  background:transparent;
   border: 5px solid white;
  width: 400px;
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
.register-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.register-code {
  width: 33%;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-register-footer {
  height: 40px;
  line-height: 40px;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.register-code-img {
  height: 38px;
}
</style>

