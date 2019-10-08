import request from '@/utils/request'

// 获取布控任务列表
export function getMonitorTaskList(params) {
  return request({
    url: `/api/faceMonitor/monitors`,
    method: 'get',
    params
  })
}

// 获取布控下拉选项
export function getMonitorTaskSelect() {
  return request({
    url: `/api/faceMonitor/monitors/allData`,
    method: 'get'
  })
}

// 获取布控个人下拉选项
export function getMonitorTaskPersonalSelect() {
  return request({
    url: `/api/faceMonitor/monitors/personalData`,
    method: 'get'
  })
}

// 添加布控任务
export function postMonitorTask(data) {
  return request({
    url: `/api/faceMonitor/monitors`,
    method: 'post',
    data
  })
}

// 编辑布控任务
export function putMonitorTask(data) {
  return request({
    url: `/api/faceMonitor/monitors/${data.id}`,
    method: 'put',
    data
  })
}

// 获取布控任务
export function getMonitorTask(id) {
  return request({
    url: `/api/faceMonitor/monitors/detail/${id}`,
    method: 'get'
  })
}

// 获取负责人树
export function getResponsibleTree() {
  return request({
    url: `/api/admin/user/departUserTree`,
    method: 'get'
  })
}

// 获取工作概览
export function getOverview(id) {
  return request({
    url: `/api/faceMonitor/monitors/${id}/overview`,
    method: 'get'
  })
}

// 获取个人工作概览
export function getPersonOverviewById(id) {
  return request({
    url: `/api/faceMonitor/monitors/${id}/overview`,
    method: 'get'
  })
}

// 获取未处理事件 
export function getFaceHandleCount(params){
  return request({
    url:`/api/faceMonitor/alarms/handleStatic`,
    method:'get',
    params
  })
}