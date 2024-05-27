import VueRouter from "vue-router"
import UserLogin from "../components/UserLogin"
import MyEditor from "../components/MyEditor"
import UserRegister from "../components/UserRegister"
import ForgetPassword from "../components/ForgetPassword"
export default new VueRouter({
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
