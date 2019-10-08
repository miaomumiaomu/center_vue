import request from '@/utils/request'

// 加密狗-授权状态
export function authStatus(){
  return request({
    url: '/usbkey/auth/status',
    method: 'get'
  })
}

// 加密狗-获取授权文档
export function getAuthData(){
  return request({
    url:'/usbkey/auth/getAuthData',
    method: 'get'
  })
}

// 加密狗-激活
export function activateAuth(data){
  return request({
    url: '/usbkey/auth/activate',
    method: 'post',
    data
  })
}
