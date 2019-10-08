import request from '@/utils/request'

// 获取操作日志
export function getOperationLog(params) {
  return request({
    url: '/api/generic/operationLogs',
    method: 'get',
    params
  })
}