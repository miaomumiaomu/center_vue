import request from '@/utils/request'

/* 用户相关 */
// 获取用户列表
export function getUserList(params) {
  return request({
    url: `/api/auth/users`,
    method: 'get',
    params
  })
}

// 重置密码
export function putResetPassword(data) {
  return request({
    url: `/api/auth/users/${data.id}/resetPwd`,
    method: 'put',
    data: {
      password: data.password
    }
  })
}

// 获取用户
export function postUser(data) {
  return request({
    url: `/api/auth/users`,
    method: 'post',
    data
  })
}

// 删除用户
export function deleteUser(data) {
  return request({
    url: `/api/auth/users`,
    method: 'delete',
    data
  })
}

// 修改用户
export function putUser(data) {
  return request({
    url: `/api/auth/users/${data.id}`,
    method: 'put',
    data
  })
}

// 查询用户
export function getUser(id) {
  return request({
    url: `/api/auth/users/${id}`,
    method: 'get'
  })
}
/* 用户相关 */

/* 角色相关 */
// 获取角色列表
export function getRoleList(params) {
  return request({
    url: `/api/auth/roles`,
    method: 'get',
    params
  })
}

// 获取所有角色
export function getAllRole() {
  return request({
    url: `/api/auth/roles`,
    method: 'get'
  })
}

// 获取角色
export function postRole(data) {
  return request({
    url: `/api/auth/roles`,
    method: 'post',
    data
  })
}

// 删除角色
export function deleteRole(data) {
  return request({
    url: `/api/auth/roles`,
    method: 'delete',
    data
  })
}

// 修改角色
export function putRole(data) {
  return request({
    url: `/api/auth/roles/${data.id}`,
    method: 'put',
    data
  })
}

// 查询角色
export function getRole(id) {
  return request({
    url: `/api/auth/roles/${id}`,
    method: 'get'
  })
}
/* 角色相关 */