import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 5000, // 设置请求超时时间
    headers: {
        'Content-Type': 'application/json'
    }
});

// 登录请求
export const userLogin = (user_id, password) => {
    return api.post('/verify_login/', { user_id, password });
};
