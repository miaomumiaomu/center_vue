import request from '@/utils/request'

// 新版地址树查找初始化

export function queryStreet(params) {
  return request({
    url: '/api/addr/locations/queryStreet',
    method: 'get',
    params
  })
}

// 街路巷实有单位楼栋单元树

export function addrTree(params) {
  return request({
    url: '/api/addr/locations/addrTree',
    method: 'get',
    params
  })
}

// 街路巷楼栋单元-新增

export function addLocation(data) {
  return request({
    url: '/api/addr/locations',
    method: 'post',
    data
  })
}

// 街路巷楼栋单元-删除

export function deleteLocations(id) {
  return request({
    url: `/api/addr/locations/${id}`,
    method: 'delete',
  })
}

//  新版标准地址保存

export function saveAddrStandard(id, data) {
  return request({
    url: `/api/addr/locations/${id}`,
    method: 'put',
    data
  })
}

//  获取完整标准地址
export function getAddrFull(id) {
  return request({
    url: `/api/addr/locations/full/${id}`,
    method: 'get',
  })
}

//  获取单个楼栋

export function getAddrStandard(id) {
  return request({
    url: `/api/addr/locations/${id}`,
    method: 'get'
  })
}

//获取乡镇街道
export function getAddrDistroct(params) {
  return request({
    url: `/api/addr/locations/getAddrDistroct`,
    method: 'get',
    params
  })
}

//莱州标准地址本地化
export function startAddrLocalize(data) {
  return request({
    url: `/api/addr/localize/startAddrLocalize`,
    method: 'post',
    data
  })
}

//福建标准地址本地化
export function startAddrLocalizeFile(id, data) {
  return request({
    url: `/api/addr/localize/startAddrLocalizeFile/${id}`,
    method: 'post',
    data,
    headers: {'Content-Type': 'multipart/form-data'},
  })
}

//地址导出（根节点）
export function getAddressExport(params) {
  return request({
    url: `/api/addr/locations/getAddressExport`,
    method: 'get',
    params
  })
}

//地址初始化（根节点）
export function postAddressImport(id, data) {
  return request({
    url: `/api/addr/locations/postAddressImport/${id}`,
    method: 'post',
    data,
    headers: {'Content-Type': 'multipart/form-data'},
  })
}
