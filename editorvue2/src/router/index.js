import VueRouter from "vue-router";
import UserLogin from "../components/UserLogin";
import MyEditor from "../components/MyEditor";
import UserRegister from "../components/UserRegister";
import ForgetPassword from "../components/ForgetPassword";

import Vue from 'vue';

Vue.use(VueRouter);

// 获取原型对象push函数
const originalPush = VueRouter.prototype.push;

// 获取原型对象replace函数
const originalReplace = VueRouter.prototype.replace;

// 修改原型对象中的push函数
VueRouter.prototype.push = function push(location){
    return originalPush.call(this, location).catch(err => err);
};

// 修改原型对象中的replace函数
VueRouter.prototype.replace = function replace(location){
    return originalReplace.call(this, location).catch(err => err);
};

// 创建路由实例
const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/MyEditor',
            name: 'MyEditor',
            component: MyEditor
        },
        {
            path: '/UserLogin',
            name: 'UserLogin',
            component: UserLogin
        },
        {
            path: '/UserRegister',
            name: 'UserRegister',
            component: UserRegister
        },
        {
            path: '/ForgetPassword',
            name: 'ForgetPassword',
            component: ForgetPassword
        }
    ]
});
// 添加路由守卫
/*router.beforeEach((to, from, next) => {
  // 获取存储localStorage的token
  let token = localStorage.getItem('token');
  // 获取存储的登录时间戳
  const loginTime = localStorage.getItem('loginTime');
  // 定义三天的时间，单位是毫秒
  const threeDays = 3 * 24 * 3600 * 1000;
  // 当前时间
  let currentTime = new Date().getTime();

  // 检查登录时间戳是否存在以及是否超过三天
  if (!loginTime || (currentTime - loginTime > threeDays)) {
    token = null;
  }

  // 如果token过期了
  if (!token) {
    if (to.path === '/UserLogin') return next();
    // 注意要import element的Message组件
    Message.error("登录状态过期，请重新登录");
    return next('/UserLogin');
  }

  // 如果token没有过期，又是选择了登录页面就直接重定向到首页，不需要重新输入账户密码
  if (to.path === '/UserLogin') {
    return next('/MyEditor');
  }
  next();
});*/


export default router;
