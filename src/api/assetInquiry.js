import request from '@/utils/request'

// 获取人员信息列表
export function getPersonHousePageList(params) {
  return request({
    url: `/api/person/personInfos/queryPersonHousePage`,
    method: 'get',
    params
  })
}

// 批量删除实有人口（人房关系）
export function batchDeletePerson(data) {
  return request({
    url: `/api/person/personHouseRels/deletePersonHouseRel`,
    method: 'delete',
    data
  })
}

// 获取人员详情
export function getPersonInfo(id){
  return request({
    url:`/api/person/personInfo/${id}`,
    method:'get'
  })
}

// 获取车辆信息列表
export function getCarInfoList(params){
  return request({
    url:'/api/car/infos',
    method:'get',
    params
  })
}

// 获取实有单位 楼栋单元
export function getCommunityLocationTree(){
  return request({
    url: '/api/addr/locations/communityLocationTree',
    method: 'get'
  })
}

// 获取房间树
export function getHousesTree(params){
  return request({
    url:'/api/addr/houses/tree',
    method: 'get',
    params
  })
}