import request from "@/utils/request";

export function saveEditor(session_id,text_id,text_content,file_name){
    const data = {
        session_id,
        text_id,
        text_content,
        file_name,
    }
    return request({
        url:'http://127.0.0.1:8000/save_text/',
        method:'post',
        data: data
    })

}
