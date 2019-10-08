import request from '@/utils/request'

// 获取序列号列表
export function getPassRecordsList(params) {
  return request({
    url: `/api/track/passRecords`,
    method: 'get',
    params
  })
}

// 获取人员最近的抓拍情况
export function getPassRecordsLast(params) {
  return request({
    url: `api/track/passRecords/last`,
    method: 'get',
    params
  })
}

// 获取门禁访客信息
export function getAccessRecordInfos(id){
  return request({
    url:`api/pms/accessRecordInfos/${id}`,
    method:'get'
  })
}

// 人员证件照查询
export function getIdentityImg(id){
  return request({
    url:`/api/person/personInfos/${id}/img`,
    method:'get'
  })
}