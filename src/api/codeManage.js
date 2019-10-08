import request from '@/utils/request'

// 获取序列号列表
export function getSequenceList(params) {
  return request({
    url: `/api/config/sequenceNos`,
    method: 'get',
    params
  })
}

// 获取编码菜单
export function getCodeMenu() {
  return request({
    url: `/api/config/sequenceTypes`,
    method: 'get',
    params: {
      pageNo: 1,
      pageSize: 9999
    }
  })
}

// 添加编码
export function postCode(data) {
  return request({
    url: '/api/config/sequenceTypes',
    method: 'post',
    data
  })
}

// 修改编码
export function putCode(data) {
  return request({
    url: `/api/config/sequenceTypes/${data.id}`,
    method: 'put',
    data
  })
}

// 获取编码
export function getCode(id) {
  return request({
    url: `/api/config/sequenceTypes/${id}`,
    method: 'get'
  })
}