import Vue from 'vue';
import App from './App.vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import * as echarts from 'echarts';
import VueRouter from 'vue-router';
import router from './router';

Vue.use(ElementUI);
Vue.use(VueRouter);

Vue.config.productionTip = false;
Vue.prototype.$echarts = echarts;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
