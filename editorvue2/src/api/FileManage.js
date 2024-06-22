import request from "@/utils/request";
export function get_text_list(session_id) {
    return request({
        url:'http://127.0.0.0:8000/get_text_list/',
        method:'post',
        data:session_id
    })
}

export function creat_text(data) {
    return request({
        url: 'http://127.0.0.1:8000/creat_text/',
        method: 'post',
        data: data
    });
}