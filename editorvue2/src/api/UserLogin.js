import request from '@/utils/request';

// 登录方法
export function login(user_id, password) {
    const data = {
        user_id,
        password
    };
    return request({
        url: 'http://127.0.0.1:8000/verify_login/',
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
        method: 'post',
        data: data
    });
}

// 忘记密码验证
export function verify_forget_password(user_id,password,email_code) {
    const data={
         user_id,
        password,
         email_code
     };
    return request({
         url: 'http://127.0.0.1:8000/verify_forget_password/',

        method: 'post',
        data: data
    });
}

// 忘记密码邮箱验证码发送
export function send_fm_code(user_id,email) {
     const data={
         user_id,
         email
     };
    return request({
        url: 'http://127.0.0.1:8000/send_fm_code/',
        method: 'post',
        data: data
    });
}
export function send_rm_code(email) {
    // const data={
    //     email
    // };
    return request({
        url: 'http://127.0.0.1:8000/send_rm_code/',
        method: 'post',
        data: email
    });
}

export function verify_session(session_id) {

    return request({
        url: 'http://127.0.0.1:8000/verify_session/',
        method: 'post',
        data: session_id
    });
}

