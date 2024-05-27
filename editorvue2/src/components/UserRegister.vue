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
                    <el-input type="email" v-model="registerForm.email" autocomplete="off" placeholder="请输入邮箱"></el-input>
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
    import axios from 'axios';

    export default {
        data() {
            return {
                registerForm: {
                    user_id: '',
                    password: ''
                }
            };
        },
        methods: {
            async submitForm() {
                try {
                    // 发送注册请求
                    const response = await axios.post('http://127.0.0.1:8000/verify_register/', {
                        user_id: this.registerForm.user_id,
                        password: this.registerForm.password
                    });
                    const data = response.data;
                    if (data.code === 0) {
                        // 注册成功，返回登录页面
                        this.$router.push('/login');
                    } else {
                        this.$message.error('注册失败，请稍后重试');
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
