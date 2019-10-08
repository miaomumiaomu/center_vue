import request from '@/utils/request'

// 参数配置列表
export function getParameterList(params) {
  return request({
    url: '/api/config/commonConfigs',
    method: 'get',
    params
  })
}

// 添加参数配置
export function postParameter(data) {
  return request({
    url: '/api/config/commonConfigs',
    method: 'post',
    data
  })
}

// 修改参数配置
export function putParameter(data) {
  return request({
    url: `/api/config/commonConfigs/${data.id}`,
    method: 'put',
    data
  })
}

// 获取参数配置
export function getParameter(id) {
  return request({
    url: `/api/config/commonConfigs/${id}`,
    method: 'get'
  })
}

// 参数配置 - 获取缓存中的值
export function getParameterCacheValue(configName) {
  return request({
    url: `/api/config/commonConfigs/values/${configName}`,
    method: 'get'
  })
}

// 参数配置 - 删除缓存
export function deleteParameterCache(configName) {
  return request({
    url: `/api/config/commonConfigs/caches/${configName}`,
    method: 'delete'
  })
}

// 参数配置 - 批量清除缓存
export function deleteParameterAllCache(data) {
  return request({
    url: `/api/config/commonConfigs/caches`,
    method: 'delete',
    data
  })
}