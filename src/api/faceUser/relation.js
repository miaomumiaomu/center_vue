import request from '@/utils/request'

//获取 同行关系图
export function getPersonRelation(id) {
  return request({
    url: `/api/personRel/personRelations/getRelationsById/${id}`,
    banLoading: true,
    method: 'get',
  })
}

//获取 人车房关系图
export function getPersonRelationAndCar(id) {
  return request({
    url: `/api/personRel/personRelations/getPersonComplexRelationById/${id}`,
    banLoading: true,
    method: 'get',
  })
}

// TOP 关系图
export function getPersonRelationTop(data) {
  return request({
    url: '/api/personRel/personRelations/fetchMultiTogetherRelation',
    method: 'post',
    data
  })
}

// 房屋 二级
export function getHouseRelation(data) {
  return request({
    url: '/api/personRel/personRelations/fetchSecondRelationByType',
    method: 'post',
    data
  })
}