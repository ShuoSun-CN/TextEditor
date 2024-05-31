import {post_json,get} from '@/http/axios'
import {setToken} from '../../utils/index'
export default {
    namespaced:true,
    state:{
        //登录用户信息
        info:[]
    },
    getters:{

    },
    mutations:{
        refreshInfo(state,info){
            state.info = info;
        }
    },
    actions:{
        // 登录，获取token
        async loginHandler(context,params){
            let res = await post_json('/user/login',params);
            let token = res.data.token;
            // 设置token到本地存储
            setToken(token)
        },
        // 根据令牌token换取登录信息
        async userInfo(context,token){
            let res = await get('/user/info',{token});
            context.commit('refreshInfo',res.data)
        }
    }
}