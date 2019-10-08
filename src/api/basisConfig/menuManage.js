import request from '@/utils/request'

// 获取菜单树
export function getMenuTree() {
  return request({
    url: '/api/auth/resources/tree',
    method: 'get'
  })
}

// 添加菜单
export function postMenu(data) {
  return request({
    url: '/api/auth/resources',
    method: 'post',
    data
  })
}

// 删除菜单
export function deleteMenu(id) {
  return request({
    url: `/api/auth/resources/${id}`,
    method: 'delete'
  })
}

// 修改菜单
export function putMenu(data) {
  return request({
    url: `/api/auth/resources/${data.id}`,
    method: 'put',
    data
  })
}

// 获取菜单
export function getMenu(id) {
  return request({
    url: `/api/auth/resources/${id}`,
    method: 'get'
  })
}