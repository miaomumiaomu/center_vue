import request from '@/utils/request'

//获取实有信息
export function getRealInfo() {
  return request({
    url: `/api/datapush/multiDataWindows/realInfo`,
    method: 'get',
    banLoading: true,
    loginOut:true
  })
}

//获取人员类型统计
export function getLibraryStatistics() {
  return request({
    url: `/api/person/personLibrarys/countByLibraryNum`,
    method: 'get',
    banLoading: true,
    loginOut:true
  })
}

// 获取近一周社区预警统计
export function getCommunitiesAlarmWeekStatistics() {
  return request({
    url: `/api/datapush/multiDataWindows/getAddrAlarmInfo`,
    method: 'get',
    banLoading: true,
    loginOut:true
  })
}

// 获取一周人脸抓拍统计
export function getFaceSnapStatistics() {
  return request({
    url: `/api/faceRec/faceSnaps/getWeekSnapFlowAndTotal`,
    method: 'get',
    banLoading: true,
    loginOut:true
  })
}

// 获取一周人脸预警统计
export function getFaceAlarmStatistics(id) {
  return request({
    url: `/api/faceMonitor/statistics/${id ? id + '/' : ''}faceAlarmWeekStatistics`,
    method: 'get',
    banLoading: true,
    loginOut: true
  })
}

// 获取一周车辆抓拍统计
export function getCarSnapStatistics() {
  return request({
    url: `/api/car/carStatistics/getWeekCarFlowAndTotal`,
    method: 'get',
    banLoading: true,
    loginOut:true
  })
}

// 获取一周车辆预警统计
export function getCarAlarmStatistics(id) {
  return request({
    url: `/api/car/alarmLogs/${id ? id + '/' : ''}carAlarmDateStatic`,
    method: 'get',
    banLoading: true,
    loginOut:true
  })
}

// 获取摄像头
export function getMapMarker() {
  return request({
    url: `/api/datapush/multiDataWindows/getDeviceAndAddr`,
    method: 'get',
    banLoading: true,
    loginOut:true
  })
}

// 获取人脸抓拍历史数据
export function getAllHistory() {
  return request({
    url: `/api/datapush/multiDataWindows/getAllHistory`,
    method: 'get',
    banLoading: true,
    loginOut:true
  })
}