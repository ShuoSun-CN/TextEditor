import axios from 'axios';

const instance = axios.create({
    baseURL: process.env.VUE_APP_BASE_URL,
    timeout: 8000 // adjust as needed
});

// Request interceptor
instance.interceptors.request.use(
    config => {
        // Add any headers or configurations here
        // For example, authorization token
        // config.headers.Authorization = 'Bearer ' + getToken();
        return config;
    },
    error => {
        // Do something with request error
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
instance.interceptors.response.use(
    response => {
        // Handle response data
        return response.data;
    },
    error => {
        // Handle response errors
        console.error('Response error:', error);
        return Promise.reject(error);
    }
);

export default instance;
