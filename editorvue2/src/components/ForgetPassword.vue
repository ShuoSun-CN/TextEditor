<template>
    <div class="forgot-password-container">
        <el-card class="forgot-password-card" :body-style="{backgroundColor: 'transparent'}">
            <el-form ref="forgotPasswordForm" :model="forgotPasswordForm" label-width="100px" class="forgot-password-form">
                <el-form-item label="邮箱地址" prop="email">
                    <el-input v-model="forgotPasswordForm.email" autocomplete="off" placeholder="请输入邮箱地址"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="sendVerificationCode" style="width: 100%;">发送验证码</el-button>
                </el-form-item>
                <el-form-item label="验证码" prop="email_code">
                    <el-input v-model="forgotPasswordForm.email_code" autocomplete="off" placeholder="请输入验证码"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="password">
                    <el-input type="password" v-model="forgotPasswordForm.password" autocomplete="off" placeholder="请输入新密码"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="resetPassword" style="width: 100%;">重置密码</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
    import { send_fm_code, forget } from '@/utils/request';
    export default {
        data() {
            return {
                forgotPasswordForm: {
                    email: '',
                    email_code: '',
                    password: ''
                }
            };
        },
        methods: {
            sendVerificationCode() {
                send_fm_code()
                    .then(response => {
                        if (response.data.code === 1) {
                            this.$message.success('验证码已发送');
                        } else if (response.data.code === 2) {
                            this.$message.error('邮箱地址与申请时的邮箱不一致');
                        } else {
                            this.$message.error('发送验证码失败，请稍后重试');
                        }
                    })
                    .catch(error => {
                        console.error('发送验证码失败:', error);
                        this.$message.error('发送验证码失败，请稍后重试');
                    });
            },
            resetPassword() {
                forget({
                    email_code: this.forgotPasswordForm.email_code,
                    password: this.forgotPasswordForm.password,
                    user_id: this.forgotPasswordForm.email  // Assuming user_id is the same as email
                })
                    .then(response => {
                        if (response.data.code === 0) {
                            this.$message.success('密码重置成功');
                            this.$router.push('/UserLogin');
                        } else if (response.data.code === 2) {
                            this.$message.error('验证码错误');
                        } else {
                            this.$message.error('重置密码失败，请稍后重试');
                        }
                    })
                    .catch(error => {
                        console.error('重置密码失败:', error);
                        this.$message.error('重置密码失败，请稍后重试');
                    });
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

    .el-input__inner {
        border-radius: 5px;
    }

    .el-button {
        border-radius: 5px;
    }
</style>
