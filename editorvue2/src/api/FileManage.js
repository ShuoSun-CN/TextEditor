import request from "@/utils/request";
export function get_text_list(session_id) {
    return request({
        url:'http://127.0.0.1:8000/get_text_list/',
        method:'post',
        data:session_id
    })
}
export function get_shared_text_list(session_id) {
    return request({
        url:'http://127.0.0.1:8000/get_shared_text_list/',
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

export function delete_own_text(text_id,session_id) {
    const data={
        text_id,
        session_id,
    }
    return request({
        url:'http://127.0.0.1:8000/delete_own_text/',
        method:'post',
        data:data
    })
}

export function delete_own_text_list(text_id, session_id) {
    const data = {
        text_id, // 这里 file_ids 是一个数组
        session_id,
    };
    return request({
        url: 'http://127.0.0.1:8000/delete_own_text_list/',
        method: 'post',
        data: data
    });
}

export function rename_text(session_id,text_id,text_name) {
    const data = {
        session_id,
        text_id,
        text_name,
    };
    return request({
        url: 'http://127.0.0.1:8000/rename_text/',
        method: 'post',
        data: data
    });
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
