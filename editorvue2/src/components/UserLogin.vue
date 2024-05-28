<template>
    <div class="login-container">
        <el-card class="login-card" :body-style="{backgroundColor: 'transparent'}">
            <el-form ref="loginForm" :model="loginForm" label-width="80px" class="login-form">
                <el-form-item label="用户名" prop="user_id">
                    <el-input v-model="loginForm.user_id" autocomplete="off" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="loginForm.password" autocomplete="off" placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm" style="width: 100%;">登录</el-button>
                    <router-link to="/UserRegister">没有账号？去注册</router-link>
                </el-form-item>
                <el-form-item>
                    <router-link to="/ForgetPassword">忘记密码，去验证</router-link>
                </el-form-item>
            </el-form>
        </el-card>
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
                }
            };
        },
        methods: {
            submitForm() {
                this.handleLogin(this.loginForm.user_id, this.loginForm.password);
            },
            async handleLogin(user_id, password) {
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
                }
            }
        }
    };
</script>
<style scoped>
    .login-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background-image: linear-gradient(-20deg, #e9defa 0%, #fbfcdb 100%);
    }

    .login-card {
        width: 400px;
        padding: 20px;
        border-radius: 10px;
        background: transparent;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    }

    .login-form {
        margin-top: 20px;
    }

    .el-input__inner {
        border-radius: 5px;
    }

    .el-button {
        border-radius: 5px;
    }
</style>
