import VueRouter from "vue-router"
import UserLogin from "../components/UserLogin"
import MyEditor from "../components/MyEditor"
import UserRegister from "../components/UserRegister"
import ForgetPassword from "../components/ForgetPassword"


// 获取原型对象push函数
const originalPush = VueRouter.prototype.push

// 获取原型对象replace函数
const originalReplace = VueRouter.prototype.replace

// 修改原型对象中的push函数
VueRouter.prototype.push = function push(location){
return originalPush.call(this , location).catch(err=>err)
}

// 修改原型对象中的replace函数
VueRouter.prototype.replace = function replace(location){
return originalReplace.call(this , location).catch(err=>err)
}

export default new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/MyEditor',
            name:'MyEditor',
            component: MyEditor
        },
        {
            path: '/UserLogin',
            name:'UserLogin',
            component: UserLogin
        },
        {
            path: '/UserRegister',
            name:'UserRegister',
            component: UserRegister
        },
        {
            path: '/ForgetPassword',
            name:'ForgetPassword',
            component: ForgetPassword
        }
    ]
})
