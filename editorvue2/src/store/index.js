import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './app'
import settings from './settings'
import user from './user'
// 引入login
import login from './login'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    login
  },
  getters
})

export default store

