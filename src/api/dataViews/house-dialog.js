import request from '@/utils/request'


// 获取房屋弹窗列表
export function getHouseList(params) {
  return request({
    url: '/api/addr/locations/getHouseByLocationCode',
    method: 'get',
    params
  })
}

// 获取房屋详情
export function getHouse(id) {
  return request({
    url: `api/addr/houses/getHouseByBelongId/${id}`,
    method: 'get',
  })
}

// 获取房屋弹窗上方过滤选项
export function getHouseFilterType(params) {
  return request({
    url: '/api/addr/statis/getByLocationCode',
    method: 'get',
    params
  })
}

// 获取房屋弹窗详情访客TOP20
export function getHouseVisitorTop(params) {
  return request({
    url: '/api/track/statis/visitorInHouseTop',
    method: 'get',
    params
  })
}



