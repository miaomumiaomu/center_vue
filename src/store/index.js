import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters'; // 全局getters配置

/* 基础配置（必备）*/
import permission from './modules/permission'; // 动态路由配置
import tagsView from './modules/tagsView'; // 全局选项卡切换
import user from './modules/user'; // 用户相关
import data from './modules/data'; // 数据缓存
import commonData from './modules/commonData'; // 公共数据
import preview from './modules/preview';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    permission,
    tagsView,
    user,
    data,
    commonData,
    preview
  },
  getters
});

export default store
