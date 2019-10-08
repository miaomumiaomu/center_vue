import { constantRouterMap } from '@/router';
import Layout from '@/views/layout';
import { getAllMenu, getUserRoute } from '@/api/common';
import { newPageFilter } from '@/utils/config';

const _import = require('@/router/_import_' + process.env.NODE_ENV);

/**
 * 获取当前路由表
 * @param 路由数据
 */
function routerDataArrange(routerData) {
  let _newRouter = [{
    path: '',
    component: Layout,
    children: []
  }];
  routerData.forEach(item => {
    if (!item.code || !item.path) return;

    try {
      item.component = eval(`_import('${item.url}')`);
    } catch (error) {
      return;
    }
    item.meta = {
      title: item.name,
      label: item.code,
    };
    item.name = item.code;

    delete item.id;
    delete item.pid;
    delete item.url;
    delete item.code;

    if (newPageFilter.includes(item.name)) {
      item.beforeEnter = (to, from, next) => {
        // 移除水印
        window.document.getElementById('watermark').style.backgroundImage = '';
        next();
      };
      _newRouter.push(item);
    } else {
      _newRouter[0].children.push(item);
    }
  });

  return _newRouter;
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: [],
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers;
      state.routers = constantRouterMap.concat(routers);
    }
  },
  actions: {
    GenerateRoutes({ commit }, menus) {
      return new Promise(resolve => {
        // 远程获取路由数据
        getUserRoute().then(res => {
          let routers = routerDataArrange(res.data);
          commit('SET_ROUTERS', routers);
          resolve();
        });
      });
    }
  }
};

export default permission;