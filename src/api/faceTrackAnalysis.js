import request from '@/utils/request'

// 获取轨迹列表（分页字段控制是否查全部）
export function getTrajectoryList(params) {
  return request({
    url: '/api/track/locations',
    method: 'get',
    params
  })
}

// 获取轨迹详情
export function getTrajectoryDetails(params) {
  return request({
    url: `/api/track/passRecords`,
    method: 'get',
    params
  })
}