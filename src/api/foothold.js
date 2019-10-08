import request from '@/utils/request'

// 获取落脚点列表
export function getFootholdList(data) {
  return request({
    url: '/api/track/passRecords/foothold/list',
    method: 'post',
    data
  })
}

// 获取落脚点详情
export function getFootholdDetails(data) {
  return request({
    url: '/api/track/passRecords/foothold/detail',
    method: 'post',
    data
  })
}