import request from '@/utils/request'

export function getAlarmList(params) {
  return request({
    url: '/api/faceMonitor/alarms',
    method: 'get',
    params
  })
}

export function getAlarmDetail(id) {
  return request({
    url: `/api/faceMonitor/alarms/detail/${id}`,
    method: 'get'
  })
}

export function postAlarmHandle(data) {
  return request({
    url: `/api/faceMonitor/alarms/handle`,
    method: 'post',
    data
  })
}

export function deleteAlarms(data) {
  return request({
    url:'/api/faceMonitor/alarms',
    method: 'delete',
    data
  })
}

// 根据id获取人脸摄像头告警消息数
export function getFaceAlarmCounts(params) {
  return request({
    url: '/api/faceMonitor/alarms/deviceAlarmCnt',
    method: 'get',
    params
  })
}

//excel 导出
export function getExcel(params){
  return request({
    url:`/api/faceMonitor/alarms/writeExcel`,
    method:'get',
    params
  })
}
