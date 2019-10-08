import request from '@/utils/request'

// 获取中心信息
export function getCenterConfig() {
  return request({
    url: `/api/config/centerInfos/getInfo`,
    method: 'get'
  })
}

// 保存中心信息
export function putCenterConfig(data) {
  return request({
    url: `/api/config/centerInfos/${data.id}`,
    method: 'put',
    data
  })
}