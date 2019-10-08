import request from '@/utils/request'

// 综合查询
export function getAllList(params) {
  return request({
    url: `/api/search/search/result`,
    method: 'get',
    params
  })
}