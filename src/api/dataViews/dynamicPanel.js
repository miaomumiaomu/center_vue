import request from '@/utils/request'


// 数据视窗今日人员统计
export function getPersonTodayAnalysis(params) {
  return request({
    url: '/api/track/statis/personTodayAnalysis',
    method: 'get',
    params
  })
}

// 数据视窗今日车辆统计
export function getCarTodayAnalysis(params) {
  return request({
    url: '/api/car/carStatistics/carTodayAnalysis',
    method: 'get',
    params
  })
}

// 数据视窗今日人员统计
export function getAlarmAnaly(params) {
  return request({
    url: '/api/faceMonitor/statis/alarmAnaly',
    method: 'get',
    params
  })
}

// 数据视窗-车辆布控告警
export function getCarAlarmAnaly(params) {
  return request({
    url: '/api/car/statis/alarmAnaly',
    method: 'get',
    params
  })
}

// 今日访客统计
export function getVisitorFlow(params) {
  return request({
    url: '/api/track/statis/visitorFlow',
    method: 'get',
    params
  })
}

// 数据视窗动态分析人脸采集
export function getTrackDynamicAnalysis(params) {
  return request({
    url: '/api/track/statis/getTrackDynamicAnalysis',
    method: 'get',
    params
  })
}

// 数据视窗动态分析车辆采集
export function getCarDynamicAnalysis(params) {
  return request({
    url: '/api/car/carStatistics/getCarDynamicAnalysis',
    method: 'get',
    params
  })
}
