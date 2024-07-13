import VueRouter from "vue-router";
import UserLogin from "../components/UserLogin";
import MyEditor from "../components/MyEditor";
import UserRegister from "../components/UserRegister";
import ForgetPassword from "../components/ForgetPassword";
import HomePage from "../components/HomePage";
import UserInfo from "../components/UserInfo";
import UserCharge from "../components/UserCharge";
import AllFile from "../components/AllFile";
import RecentFile from "../components/RecentFile";
import SharedToMe from "../components/SharedToMe";
import AIwriting from "../components/AIwriting";
import Vue from 'vue';

Vue.use(VueRouter);

// 获取原型对象push函数
const originalPush = VueRouter.prototype.push;

// 获取原型对象replace函数
const originalReplace = VueRouter.prototype.replace;

// 修改原型对象中的push函数
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err);
};

// 修改原型对象中的replace函数
VueRouter.prototype.replace = function replace(location) {
    return originalReplace.call(this, location).catch(err => err);
};

// 创建路由实例
const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/MyEditor',
            name: 'MyEditor',
            component: MyEditor,
            props: route => ({ file_id: route.query.file_id })
        },
        {
            path: '/UserLogin',
            name: 'UserLogin',
            component: UserLogin,
            meta: {
                needHomepage: false
            }
        },
        {
            path: '/UserRegister',
            name: 'UserRegister',
            component: UserRegister,
            meta: {
                needHomepage: false
            }
        },
        {
            path: '/ForgetPassword',
            name: 'ForgetPassword',
            component: ForgetPassword,
            meta: {
                needHomepage: false
            }
        },
        {
            path: '/HomePage',
            name: 'HomePage',
            component: HomePage,
            meta: {
                needHomepage: true
            }
        },
        {
            path: '/UserInfo',
            name: 'UserInfo',
            component: UserInfo,
            meta: {
                needHomepage: false
            }
        },
         {
            path: '/UserCharge',
            name: 'UserCharge',
            component: UserCharge,
        },
        {
            path: '/AllFile',
            name: 'AllFile',
            component: AllFile,
        },
        {
            path: '/RecentFile',
            name: 'RecentFile',
            component: RecentFile,
        },
         {
            path: '/SharedToMe',
            name: 'SharedToMe',
            component: SharedToMe,
        },
        {
            path: '/AIwriting',
            name: 'AIwriting',
            component: AIwriting,
        }
    ]
});


export default router;
