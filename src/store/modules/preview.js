// 数据整理
function dataArrange(state, commit, data, key) {
    let _data = {};
    try {
      let _isAlarm = ["1", "3"].includes(data.code.toString()); // 判断是否预警
      // 更新告警item
      if (_isAlarm) {
        commit('SET_LAST_WARN', _data);
      }
    } catch (error) {
      console.dir(error);
    }
  }
  
  export default {
    namespaced: true,
    state: {
      lastWarnData: {}, // 最新的一条告警记录
    },
    mutations: {
      // 更新告警item
      SET_LAST_WARN(state, json) {
        state.lastWarnData = json;
      }
    },
    actions: {
      async init({ state, commit }, list) {
        const sortList = list.sort((a, b) => (Date.parse(a.data.createTime) - Date.parse(b.data.createTime)));
        for (var i = 0; i < sortList.length; i++) {
          await dataArrange(state, commit, sortList[i], (new Date().getTime() + i))
        }
      },
      async push({ state, commit }, data) {
        await dataArrange(state, commit, data, new Date().getTime())
      },
    }
  }
  