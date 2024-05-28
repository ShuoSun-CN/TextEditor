import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import VueRouter from "vue-router";
import router from "./router";
Vue.use(ElementUI);
Vue.use(VueRouter)
Vue.config.productionTip = false
Vue.use(ElementUI);
new Vue({
  el: '#app',
  render: h => h(App),
  router
});
