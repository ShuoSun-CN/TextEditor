import request from "@/utils/request";

export function get_user_info(session_id) {
    return request({
        url: 'http://127.0.0.1:8000/get_user_info/',
        method: 'post',
        data: session_id
    });
}

export function update_avater(session_id) {
    return request({
        url: 'http://127.0.0.1:8000/update_avater/',
        method: 'post',
        data: session_id
    });
}

export function update_other_user_info(session_id) {
    return request({
        url: 'http://127.0.0.1:8000/update_other_user_info/',
        method: 'post',
        data: session_id
    });
}
