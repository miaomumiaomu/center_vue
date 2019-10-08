import request from '@/utils/request'

// 项目管理-列表
export function getCommunitieList(params){
  return request({
    url:'/api/addr/communities',
    method:'get',
    params
  })
}

export function getCommunitie(id, params){
  return request({
    url:`/api/addr/communities/info?communityId=${id}`,
    method:'get',
    params
  })
}

// 项目管理-新增
export function addCommunities(data){
  return request({
    url:'/api/addr/communities',
    method:'post',
    data
  })
}

// 项目管理-修改
export function updateCommunities(id, data){
  return request({
    url:`/api/addr/communities/${id}`,
    method:'put',
    data
  })
}

// 项目管理-删除
export function delCommunities(data){
  return request({
    url:`/api/addr/communities/`,
    method:'delete',
    data
  })
}

// 项目管理获取地图
export function getMapRange(params){
  return request({
    url:`api/addr/communities/findByCommunityId`,
    method:'get',
    params
  })
}

// 项目关联门楼牌号
export function communitieslinkNumbers(data){
  return request({
    url:`/api/addr/communities/linkNumbers`,
    method:'post',
    data
  })
}
