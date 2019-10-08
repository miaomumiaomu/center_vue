import request from '@/utils/request'

//获取 门禁通行
export function getDoorPass(params) {
  return request({
    url: `/api/track/statis/accessAnalysis`,
    method: 'get',
    banLoading: true,
    params
  })
}

//获取 门禁通行 统计
export function getDoorPassCount(params) {
  return request({
    url: `/api/track/statis/accessStatis`,
    method: 'get',
    banLoading: true,
    params
  })
}

//获取 门禁通行 TOP
export function getDoorPassTop(params) {
  return request({
    url: `/api/track/statis/accessTop`,
    method: 'get',
    banLoading: true,
    params
  })
}
