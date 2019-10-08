import request from '@/utils/request'

// 单位数量分析
export function getCommunityCommon(params) {
  return request({
    url: `/api/addr/statis/communityCommon`,
    method: 'get',
    params
  })
}

// 行业类型分析
export function getCommunityIndustryType(params) {
  return request({
    url: `/api/addr/statis/communityIndustryType`,
    method: 'get',
    params
  })
}

// 实有单位类型统计
export function getCommunityTypeStatis(params) {
  return request({
    url: `/api/addr/statis/communityTypeStatis`,
    method: 'get',
    params
  })
}

// 实有单位列表
export function getCommunitiesList(params) {
  return request({
    url: `/api/addr/addrCompany`,
    method: 'get',
    params
  })
}