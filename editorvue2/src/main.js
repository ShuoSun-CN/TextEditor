import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import VueRouter from "vue-router";
import router from "./router";
/*import axios from 'axios'; */

Vue.use(ElementUI);
Vue.use(VueRouter)
Vue.config.productionTip = false

/*// 添加请求拦截器
axios.interceptors.request.use(function(config) {
  // 在发送请求之前做些什么
  // 判断是否存在token,如果存在将每个页面header添加token
  if (window.localStorage.getItem("token")) {
    config.headers.common['Access-Token'] = window.localStorage.getItem("token");
  }
  return config
});*/

new Vue({
  el: '#app',
  render: h => h(App),
  router,
});
