import request from '@/utils/request'

// 新版实有单位查询
export function addrCompanyList(params){
  return request({
    url:'/api/addr/addrCompany',
    method:'get',
    params
  })
}

// 新版实有单位查询
export function getAddrCompany(id){
  return request({
    url:`/api/addr/addrCompany/${id}`,
    method:'get',
  })
}

//  新版实有单位-新增
export function addAddrCompany(data){
  return request({
    url:` api/addr/addrCompany`,
    method:'post',
    data
  })
}

//  新版实有单位-编辑
export function updateAddrCompany(data){
  return request({
    url:` api/addr/addrCompany/${data.id}`,
    method:'put',
    data
  })
}

//  新版实有单位-删除
export function delAddrCompany(data){
  return request({
    url:` api/addr/addrCompany`,
    method:'delete',
    data
  })
}

// 获取所属小区关联的门牌号
export function getCommunityNumbers(id){
  return request({
    url:`/api/addr/communities/${id}/numbers`,
    method:'get',
  })
}