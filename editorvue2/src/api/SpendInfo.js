import request from "@/utils/request";

export function get_all_token_usage(session_id) {    //获取前不得token使用信息
    return request({
        url: 'http://127.0.0.1:8000/get_all_token_usage/',
        method: 'post',
        data: session_id
    });
}

export function get_consume_token_usage(session_id) {    //获取前不得token使用信息
    return request({
        url: 'http://127.0.0.1:8000/get_all_token_usage/',
        method: 'post',
        data: session_id
    });
}

export function get_obtain_token_usage(session_id) {    //获取前不得token使用信息
    return request({
        url: 'http://127.0.0.1:8000/get_all_token_usage/',
        method: 'post',
        data: session_id
    });
}