export default {
  state: {
    dataList: {}, // 咨询已访问的id列表。避免重复加载
    placeList: [
      { lat: 24.48, lng: 118.08, value: '厦门市' },
      { lat: 37.45, lng: 121.43, value: '烟台市' },
      { lat: 23.12, lng: 114.42, value: '惠州市' },
      { lat: 30.60, lng: 114.30, value: '武汉市' },
      { lat: 29.85, lng: 114.32, value: '赤壁市' }
    ]
  },
  getters: {
    inspectType: (state, getters) => ({ type, id }) => {
      if (!state.dataList[type]) {
        return false;
      }
      return !!state.dataList[type][id];
    }
  },
  mutations: {
    // 添加路由类型
    SET_CACHE_DATA_LIST(state, { type, id, data }) {
      if (!state.dataList[type]) {
        state.dataList[type] = [];
      }

      state.dataList[type][id] = data;
    }
  },
  actions: {
    // 添加缓存数据
    setCacheData: ({ commit }, data) => {
      commit('SET_CACHE_DATA_LIST', data);
    },

    // 获取缓存数据
    getCacheData: ({ commit, state }, data) => {
      return state.dataList[data.type][data.id];
    }
  }
}
