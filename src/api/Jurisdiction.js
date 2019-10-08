import request from '@/utils/request'

// 获取用户警务区树
export function policeAreasList(params) {
  return request({
    url: `api/addr/policeAreas/currentUserPoliceAreaTree`,
    method: 'get',
    params
  })
}

// 警务区-详情
export function getPoliceAreas(id) {
  return request({
    url: `api/addr/policeAreas/${id}`,
    method: 'get',
  })
}

// 警务区-新增
export function addPoliceAreas(data) {
  return request({
    url: `api/addr/policeAreas`,
    method: 'post',
    data
  })
}

//  警务区-编辑
export function savepoliceAreas(id, data) {
  return request({
    url: `api/addr/policeAreas/${id}`,
    method: 'put',
    data
  })
}

//  警务区-关联街路巷
export function setAreaLinkRoad(data) {
  return request({
    url: `api/addr/policeAreas/areaLinkRoad`,
    method: 'post',
    data
  })
}

//  警务区-取消关联街路巷
export function delAreaLinkRoad(areaRoadId) {
  return request({
    url: `api/addr/policeAreas/areaCancelRoad/${areaRoadId}`,
    method: 'delete',
  })
}

//  查询警务区关联的路
export function getAreaLinkRoad(params) {
  return request({
    url: `api/addr/policeAreas/getAreaRoads`,
    method: 'get',
    params
  })
}

//  警务区-路关联门牌
export function setRoadLinkNumber(data) {
  return request({
    url: `api/addr/policeAreas/roadLinkNumber`,
    method: 'post',
    data
  })
}

//  警务区-路取消门牌关联
export function delRoadLinkNumber(data) {
  return request({
    url: `api/addr/policeAreas/batchRoadCancelNumber`,
    method: 'PUT',
    data
  })
}

//  查询警务区对应路关联的门牌
export function getRoadNumbers(params) {
  return request({
    url: `api/addr/policeAreas/getRoadNumbers`,
    method: 'get',
    params
  })
}

//  警务区-查询已被关联的门牌ID列表
export function getBindNumbersByRoad(roadLocationId) {
  return request({
    url: `api/addr/policeAreas/getBindNumbersByRoad/${roadLocationId}`,
    method: 'get',
  })
}

//地址树查询
export function addressSearch(params) {
  return request({
    url: `/api/addr/locations/search`,
    method: 'get',
    params
  })
}