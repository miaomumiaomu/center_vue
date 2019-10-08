import { Message } from 'element-ui'
import { getAllMenu } from '@/api/common'
import { postUserLogin, getUserInfo } from '@/api/login'
import { authStatus } from "@/api/system";
import { getToken, setToken, removeToken } from '@/utils/auth'
import { newPageFilter } from '@/utils/config';
import { transparentWatermark, compareDate } from '@/utils'

const user = {
  state: {
    userInfo: null,
    permissionMenus: null,
    token: getToken(),
    elements: undefined,
    systemInfo: {}
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
      setToken(state.token)
    },
    SET_USERINFO: (state, userInfo) => {
      state.userInfo = userInfo
    },
    SET_SYSTEMINFO: (state, systemInfo) => {
      state.systemInfo = systemInfo
    },
    SET_PERMISSION_MENUS: (state, permissionMenus) => {
      state.permissionMenus = permissionMenus
    },
    DELETE_USERINFO: (state) => {
      state.userInfo = null
    },
    DELETE_PERMISSION_MENUS: (state) => {
      state.permissionMenus = null
    },
    // 按钮权限
    SET_ELEMENTS:(state, elements) => {
      state.elements = elements
    }
  },

  actions: {
    // 用户名登录
    login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        postUserLogin(userInfo).then(res => {
          if (res.status !== 200) {
            Message({
              message: '账户或密码错误！',
              type: 'warning'
            })
            reject(res.data);
            return;
          }
          commit('SET_TOKEN', res.data.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    logOut({ commit }) {
      return new Promise((resolve) => {
        removeToken();
        // 移除水印
        window.document.getElementById('watermark').style.backgroundImage = '';
        commit('DELETE_USERINFO');
        commit('DELETE_PERMISSION_MENUS');
        resolve();
      });
    },
    getUserInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getAllMenu().then(res => {
          commit('SET_PERMISSION_MENUS', res.data);
        });
        getUserInfo().then(res => {
          if (res.status !== 200) {
            reject(res.data);
            return;
          }
          const elements={}
          for (let i = 0; i < res.data.resourceCodes.length; i++) {
            elements[res.data.resourceCodes[i]] = true;
          }
          commit('SET_ELEMENTS', elements);
          commit('SET_USERINFO', res.data);
          resolve(res.data);
        }).catch(error => {
          reject(error);
        });
      })
    },
    getSystemInfo({ commit }) {
      const handlePolling = () => {
        window.setTimeout(() => {
          this._vm.$alert('系统已过期，请联系相关技术人员', '提示', {
            confirmButtonText: '确定',
            callback: () => {
              handlePolling();
            }
          });
        }, 5 * 60 * 1000);
      }
      const getHtmlStr = (str, date) => {
        return `
          <img src="/static/encrype/warn-icon.png" style="float: left; width: 38px; margin-right: 4px" />
          <p style="font-size: 18px; margin-bottom: 2px">${str}</p>
          <p style="font-size: 16px">过期时间：<span style="font-size: 18px;">${date}</span></p>
        `;
      }
      const pathArr = window.location.hash.replace('#', '').split('/');
      authStatus().then(res => {
        const { code, message, serial, activateDate, activateExpireDate, status } = res.data;
        if (code == 0) {
          const bottomRightInfoDom = document.createElement('div');
          bottomRightInfoDom.style.height = '44px';
          bottomRightInfoDom.style.position = 'absolute';
          bottomRightInfoDom.style.bottom = '18px';
          bottomRightInfoDom.style.right = '13px';
          bottomRightInfoDom.style.overflow = 'hidden';
          bottomRightInfoDom.style.color = 'rgba(191, 191, 191, .45)'; // 黑暗主题
          bottomRightInfoDom.style.zIndex = '9999';
          // 区分视窗显示
          if (newPageFilter.includes(pathArr[pathArr.length - 1])) {
            bottomRightInfoDom.style.backgroundColor = 'rgba(0, 0, 0, .5)';
            bottomRightInfoDom.style.color = '#fff';
          }
          window.document.getElementById('watermark').appendChild(bottomRightInfoDom);
          const date = activateExpireDate.split(' ')[0];
          // 判断时间的过期性
          const dateLen = compareDate(activateExpireDate);
          if (dateLen >= 0 && dateLen <= 7) {
            bottomRightInfoDom.style.width = '264px';
            // 系统过期前7天
            this._vm.$alert(`系统将于${date}到期，届时系统无法产生新的数据，为避免影响正常使用，请及时联系相关技术人员进行处理`, '提示', {
              confirmButtonText: '确定',
              callback: () => {
                bottomRightInfoDom.innerHTML = getHtmlStr('系统即将过期，请及时处理', date);
              }
            });
          } else if (dateLen < 0) {
            bottomRightInfoDom.style.width = '248px';
            // 系统过期
            this._vm.$alert('系统已过期，请联系相关技术人员', '提示', {
              confirmButtonText: '确定',
              callback: () => {
                bottomRightInfoDom.innerHTML = getHtmlStr('系统已过期，请进行激活', date);
                handlePolling();
              }
            });
          }
          commit('SET_SYSTEMINFO', { serial, activateDate, activateExpireDate, status });
        } else {
          this._vm.$message.error(message);
        }
      });
    },
    async getTokenRefresh({ commit },state) {
      commit('SET_TOKEN', state);
    },
  },
}


export default user
