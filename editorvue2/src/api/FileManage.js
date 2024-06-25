import request from "@/utils/request";
export function get_text_list(session_id) {
    return request({
        url:'http://127.0.0.1:8000/get_text_list/',
        method:'post',
        data:session_id
    })
}
export function get_recent_text_list(session_id) {
    return request({
        url:'http://127.0.0.1:8000/get_recent_text_list/',
        method:'post',
        data:session_id
    })
}

export function create_text(session_id) {
    return request({
        url: 'http://127.0.0.1:8000/create_text/',
        method: 'post',
        data: session_id
    });
}
//在编辑器创建时获取文件内容
export function get_file(session_id, text_id) {
  return request({
    url: 'http://127.0.0.1:8000/get_text/',
    method: 'post',
    data: { session_id, text_id },
  });
}
