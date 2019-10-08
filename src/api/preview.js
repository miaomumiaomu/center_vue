import request from '@/utils/request'

export function getDeviceCount() {
  return request({
    url:'api/device/deviceInfos/getCount',
    method: 'get'
  })
}

// 警情数据获取
export function getStatusCnt() {
  return request({
    url:'/api/police/statis/getStatusCnt',
    method: 'get'
  })
}

// 近7天警情统计
export function getPre7DayStatis() {
  return request({
    url:'/api/police/statis/getPre7DayStatis',
    method: 'get'
  })
}