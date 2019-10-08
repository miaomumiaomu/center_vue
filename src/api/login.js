import request from '@/utils/request'

export function postUserLogin(data) {
  return request({
    url: '/api/auth/login',
    method: 'post',
    data
  })
}

export function getUserInfo() {
  return request({
    url: '/api/auth/users/info',
    method: 'get'
  })
}

export function putModifyPassword(data) {
  return request({
    url: '/api/auth/users/modifyPwd',
    method: 'put',
    data
  })
}

//获取水印图片
export function getWaterMark(id) {
  return request({
    url: `/api/auth/users/${id}/waterMarkImg`,
    method: 'get'
  })
}