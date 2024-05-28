import request from '@/utils/request';

// 登录方法
export function login(user_id, password) {
    const data = {
        user_id,
        password
    };
    return request({
        url: 'http://127.0.0.1:8000/verify_login/',
        headers: {
            isToken: false,
            repeatSubmit: false
        },
        method: 'post',
        data: data
    });
}

// 注册方法
export function register(user_id, password, email, email_code) {
    const data = {
        user_id,
        password,
        email,
        email_code
    };
    return request({
        url: 'http://127.0.0.1:8000/verify_register/',
        headers: {
            isToken: false
        },
        method: 'post',
        data: data
    });
}

// 忘记密码验证
export function forget(data) {
    return request({
        url: 'http://127.0.0.1:8000/verify_forget_password/',
        headers: {
            isToken: false
        },
        method: 'post',
        data: data
    });
}

// 忘记密码邮箱验证码发送
export function send_fm_code(data) {
    return request({
        url: 'http://127.0.0.1:8000/send_fm_code/',
        headers: {
            isToken: false
        },
        method: 'post',
        data: data
    });
}
