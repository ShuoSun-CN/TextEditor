import VueRouter from "vue-router"
import UserLogin from "../components/UserLogin"
import MyEditor from "../components/MyEditor"
import UserRegister from "../components/UserRegister"
import ForgetPassword from "../components/ForgetPassword"
import DIYEditor from "@/components/DIYEditor.vue";
export default new VueRouter({
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
