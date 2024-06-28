import request from "@/utils/request";

export function get_user_list_by_id(session_id,user_id) {
    const data={
        session_id,
        user_id
    }
    return request({
        url:'http://127.0.0.1:8000/get_user_list_by_id/',
        method:'post',
        data:data
    })
}
export function get_shared_list(session_id,file_id) {
    const data={
        session_id,
        file_id
    }
    return request({
        url:'http://127.0.0.1:8000/get_shared_list/',
        method:'post',
        data:data
    })
}
export function set_shared_priority(session_id,file_id,search_id,priority) {
    const data={
        session_id,
        file_id,
        search_id,
        priority
    }
    return request({
        url:'http://127.0.0.1:8000/set_shared_priority/',
        method:'post',
        data:data
    })
}
export function remove_shared_priority(session_id,file_id,search_id) {
   const data={
       session_id,
       file_id,
       search_id,
   }
    return request({
        url:'http://127.0.0.1:8000/remove_shared_priority/',
        method:'post',
        data:data
    })
}