import request from '@/utils/request'

// 获取关注人员列表
export function getFocusedList(params) {
  return request({
    url: 'api/person/personInfos/queryPersonRecord',
    method: 'get',
    params
  })
}

// 获取人员类别人数
export function getFocusedLib(params) {
  return request({
    url: '/api/person/statistics/getAttentionPerson',
    method: 'get',
    params
  })
}