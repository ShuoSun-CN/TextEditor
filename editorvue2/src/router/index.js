import VueRouter from "vue-router"
import UserLogin from "../components/UserLogin"
import MyEditor from "../components/MyEditor"
import UserRegister from "../components/UserRegister"
import ForgetPassword from "../components/ForgetPassword"
<<<<<<< HEAD

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

=======
import DIYEditor from "@/components/DIYEditor.vue";
>>>>>>> a1b2960133127add8058edfca759688b9fae860e
export default new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/MyEditor',
            name:'MyEditor',
            component: MyEditor
        },
        {
            path:'/DIYEditor',
            name:'DIYEditor',
            component:DIYEditor,
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
