import request from '@/utils/request'

// 获取区域菜单
export function getRegionTree(params) {
  return request({
    url: '/api/addr/districts/treeSubNodes',
    method: 'get',
    params
  })
}

// 获取地址菜单
export function getAddressMenu(params) {
  return request({
    url: '/api/addr/locations/tree',
    method: 'get',
    params
  })
}

/* 街路巷、楼栋、单元处理 */
// 添加街路巷、楼栋、单元
export function postAddress(data) {
  return request({
    url: '/api/addr/locations',
    method: 'post',
    data
  })
}

// 删除街路巷、楼栋、单元
export function deleteAddress(id) {
  return request({
    url: `/api/addr/locations/${id}`,
    method: 'delete'
  })
}

// 修改街路巷、楼栋、单元
export function putAddress(data) {
  return request({
    url: `/api/addr/locations/${data.id}`,
    method: 'put',
    data
  })
}


// 获取街路巷、楼栋、单元
export function getAddress(id) {
  return request({
    url: `/api/addr/locations/${id}`,
    method: 'get'
  })
}
/* 街路巷、楼栋、单元处理 */

/* 实有单位处理 */
// 添加实有单位
export function postCommunities(data) {
  return request({
    url: '/api/addr/communities',
    method: 'post',
    data
  })
}

// 删除实有单位
export function deleteCommunities(id) {
  return request({
    url: `/api/addr/communities/${id}`,
    method: 'delete'
  })
}

// 修改实有单位
export function putCommunities(data) {
  return request({
    url: `/api/addr/communities/${data.id}`,
    method: 'put',
    data
  })
}

// 获取实有单位
export function getCommunities(id) {
  return request({
    url: `/api/addr/communities/info`,
    method: 'get',
    params: {
      communityId: id
    }
  })
}
/* 实有单位处理 */

/* 房间处理 */
// 获取房间列表
export function getHouseList(params) {
  return request({
    url: `/api/addr/houses`,
    method: 'get',
    params
  })
}

// 添加房间
export function postHouse(data) {
  return request({
    url: '/api/addr/houses',
    method: 'post',
    data
  })
}

// 删除房间
export function deleteHouse(data) {
  return request({
    url: `/api/addr/houses`,
    method: 'delete',
    data
  })
}

// 修改房间
export function putHouse(data) {
  return request({
    url: `/api/addr/houses/${data.id}`,
    method: 'put',
    data
  })
}

// 获取房间
export function getHouse(id) {
  return request({
    url: `/api/addr/houses/${id}`,
    method: 'get'
  })
}
/* 房间处理 */

//  街路巷实有单位楼栋单元树
export function getAddrTree(params){
  return request({
    url:`/api/addr/locations/addrTree`,
    method:'get',
    params
  })
}

//  房屋下对应人员信息
export function personInHouse(params){
  return request({
    url:`/api/person/personInfos/personInHouse`,
    method:'get',
    params
  })
}

//  房屋下对应人员历史信息
export function personInHouseHistory(params){
  return request({
    url:`/api/person/personInfos/personInHouseHistory`,
    method:'get',
    params
  })
}

//  房屋下删除对应人员
export function deletePersonHouseRel(data){
  return request({
    url:`/api/person/personHouseRels/deletePersonHouseRel`,
    method:'delete',
    data
  })
}

//  房屋下对应车辆信息
export function carInHouse(params){
  return request({
    url:`/api/car/infos/carInHouse`,
    method:'get',
    params
  })
}

//  房屋下对应车辆历史信息
export function carInHouseHistory(params){
  return request({
    url:`/api/car/infos/carInHouseHistory`,
    method:'get',
    params
  })
}

//  房屋关联车辆
export function saveCarHouseRel(data){
  return request({
    url:`/api/car/carHouseRel/saveCarHouseRel`,
    method:'post',
    data
  })
}

//  房屋删除车辆
export function deleteCarHouseRel(data){
  return request({
    url:`/api/car/infos/deleteCarHouseRel`,
    method:'delete',
    data
  })
}