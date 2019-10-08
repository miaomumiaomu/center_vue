import request from '@/utils/request'

// 获取警情管理列表
export function getPolicecaseList(params){
  return request({
    url:'/api/police/policeCases/search',
    method: 'get',
    params
  })
}

// 添加警情
export function addPolicecase(data){
  return request({
    url:'/api/police/policeCases',
    method: 'post',
    data
  })
}

// 警情更新
export function putPolicecase(data){
  return request({
    url:`/api/police/policeCases/${data.id}`,
    method: 'put',
    data
  })
}

// 警情详情
export function getPolicecaseInfo(id){
  return request({
    url:`/api/police/policeCases/${id}`,
    method: 'get',
  })
}

// 警情处理
export function handlePolicecase(data){
  return request({
    url:`/api/police/policeCases/handle/${data.id}`,
    method: 'post',
    data
  })
}