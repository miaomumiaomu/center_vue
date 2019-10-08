import request from '@/utils/request'

//获取 个人抓拍
export function getPersonSnap(params) {
  return request({
    url: `/api/track/statis/snapAnalysis`,
    method: 'get',
    banLoading: true,
    params
  })
}

//获取 个人抓拍 统计
export function getPersonSnapCount(params) {
  return request({
    url: `/api/track/statis/snapStatis`,
    method: 'get',
    banLoading: true,
    params
  })
}

