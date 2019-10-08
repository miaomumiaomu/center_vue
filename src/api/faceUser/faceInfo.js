import request from '@/utils/request'

//获取人员信息
export function getPersonInfo(id) {
  return request({
    url: `/api/person/personInfos/base?personId=${id}`,
    method: 'get',
    banLoading: true,
  })
}

//获取人员最新活动地点
export function getPersonAddrInfo(id) {
  return request({
    url: `/api/track/passRecords/last?personId=${id}`,
    method: 'get',
  })
}