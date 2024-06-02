
const state = {
  // 上一次点击页面的时间
  lastTime: new Date().getTime(),

};

const mutations = {
  SET_LASTTIME: (state, lastTime) => {
    state.lastTime = lastTime;
  }
};

const actions = {

};

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
