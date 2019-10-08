import request from '@/utils/request'

// 车辆普通统计
export function getCarCommon(params) {
  return request({
    url: `/api/car/carStatistics/common`,
    method: 'get',
    params
  })
}

// 车辆感知趋势分析
export function getCarSnap(params) {
  return request({
    url: `/api/car/carStatistics/snap`,
    method: 'get',
    params
  })
}

// 车辆登记情况
export function getCarCollect(params) {
  return request({
    url: `api/car/carStatistics/collect`,
    method: 'get',
    params
  })
}

// 1-7-30抓拍次数排行榜
export function getCarSnapTop(params) {
  return request({
    url: `api/car/carStatistics/snapTop`,
    method: 'get',
    params
  })
}

// 车辆分布统计
export function getCardistribution(params) {
  return request({
    url: `/api/car/carStatistics/distribution`,
    method: 'get',
    params
  })
}

// 车辆归属地统计
export function getCarPlaceOwner(params) {
  return request({
    url: `/api/car/carStatistics/carPlaceOwner`,
    method: 'get',
    params
  })
}

// 车辆热点设备统计
export function getCarHotDevice(params) {
  return request({
    url: `/api/car/carStatistics/carHotDevice`,
    method: 'get',
    params
  })
}