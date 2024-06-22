import request from "@/utils/request";

export function get_user_info(session_id) {
    return request({
        url: 'http://127.0.0.1:8000/get_user_info/',
        method: 'post',
        data: session_id
    });
}

export function update_other_user_info(user_name,session_id) {
    const data={
         user_name,
         session_id
     };
    return request({
        url: 'http://127.0.0.1:8000/update_other_user_info/',
        method: 'post',
        data: data
    });
}

export function update_avator(session_id) {
    return request({
        url: 'http://127.0.0.1:8000/update_avator/',
        method: 'post',
        data: session_id
    });
}
