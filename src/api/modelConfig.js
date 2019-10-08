import request from '@/utils/request'

// 获取库模型配置列表
export function getLibraryModelList(params) {
  return request({
    url: `/api/faceRec/modelLibraries`,
    method: 'get',
    params
  })
}

// 获取库模型配置
export function getLibraryModel(id) {
  return request({
    url: `/api/faceRec/modelLibraries/${id}`,
    method: 'get'
  })
}

// 修改库模型配置
export function putLibraryModel(data) {
  return request({
    url: `/api/faceRec/modelLibraries/${data.id}`,
    method: 'put',
    data
  })
}

// 获取模型菜单
export function getModelMenu() {
  return request({
    url: `/api/faceRec/models/allData`,
    method: 'get'
  })
}

// 添加模型
export function postModel(data) {
  return request({
    url: '/api/faceRec/models',
    method: 'post',
    data
  })
}

// 删除模型
export function deleteModel(id) {
  return request({
    url: `/api/faceRec/models/${id}`,
    method: 'delete'
  })
}

// 修改模型
export function putModel(data) {
  return request({
    url: `/api/faceRec/models/${data.id}`,
    method: 'put',
    data
  })
}

// 获取模型
export function getModel(id) {
  return request({
    url: `/api/faceRec/models/${id}`,
    method: 'get'
  })
}