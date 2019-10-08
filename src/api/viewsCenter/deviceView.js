import request from '@/utils/request'

// 获取设备总数
export function getDeviceTotal(params) {
  return request({
    url: '/api/device/deviceStatis/common',
    method: 'get',
    params
  })
}

// 获取设备状态分析
export function getDeviceStatus(params) {
  return request({
    url: '/api/device/deviceStatis/status',
    method: 'get',
    params
  })
}

// 获取设备类型统计
export function getDeviceType(params) {
  return request({
    url: '/api/device/deviceStatis/type',
    method: 'get',
    params
  })
}

// 获取设备子类型和数量
export function getDeviceSubType(params) {
  return request({
    url: '/api/device/deviceStatis/getDeviceTypeCount',
    method: 'get',
    params
  })
}

// 获取设备列表
export function getDeviceList(params) {
  return request({
    url: '/api/device/deviceStatis',
    method: 'get',
    params
  })
}