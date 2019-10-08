import request from '@/utils/request'

// 获取设备信息
export function getDevices() {
  return request({
    url: `/api/device/deviceInfos/countCameraByStatus/0`,
    method: 'get'
  })
}

// 获取 24小时车辆 车次 统计
export function get24CarTotal() {
  return request({
    url: `/api/car/carStatistics/getCarFlowAndTotalByHour`,
    method: 'get'
  })
}

// 获取 24小时车辆预警统计
export function getCarAlarmTotal() {
  return request({
    url: `/api/car/carStatistics/getCarAlarmByHour`,
    method: 'get'
  })
}

// 获取 24小时车辆实有单位预警统计
export function getCarUnitAlarm() {
  return request({
    url: `/api/car/carStatistics/getCarAddressAlarmByHour`,
    method: 'get'
  })
}

// 获取 近30天车辆布控数量趋势
export function getCarTrend() {
  return request({
    url: `/api/car/carStatistics/getCarMonitorCount`,
    method: 'get'
  })
}

// 获取 车辆总数 
export function getCarTotal() {
  return request({
    url: `/api/car/carStatistics/countCar`,
    method: 'get'
  })
}

// 获取 人口情况
export function getPeopleType() {
  return request({
    url: `/api/car/carStatistics/countCarByNum`,
    method: 'get'
  })
}

// 获取 能源
export function getPowerType() {
  return request({
    url: `/api/car/carStatistics/countCarByType`,
    method: 'get'
  })
}