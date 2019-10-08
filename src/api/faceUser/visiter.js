import request from '@/utils/request'

//获取 访客 受客
export function getVisitInfo(params) {
  return request({
    url: `/api/pms/statis/visitAnalysis`,
    method: 'get',
    banLoading: true,
    params
  })
}

//获取 访客 受客 统计
export function getVisitInfoCont(params) {
  return request({
    url: `/api/pms/statis/visitStatis`,
    method: 'get',
    banLoading: true,
    params
  })
}

//获取 访客 受客 top
export function getVisitInfoTop(params) {
  return request({
    url: `/api/pms/statis/visitTop`,
    method: 'get',
    banLoading: true,
    params
  })
}
