import request from '@/utils/request'


// 租户年龄分布统计
export function getRenterAge(params) {
  return request({
    url: '/api/addr/statis/renterAge',
    method: 'get',
    params
  })
}

// 获取出租房屋统计
export function getRentHouseCommon(params) {
  return request({
    url: '/api/addr/statis/rentHouseCommon',
    method: 'get',
    params
  })
}

// 获取租客籍贯分布统计
export function getRenterNativePlace(params) {
  return request({
    url: '/api/addr/statis/renterNativePlace',
    method: 'get',
    params
  })
}

// 获取房屋租客统计top10
export function getRenterCountTop(params) {
  return request({
    url: '/api/addr/statis/renterCountTop',
    method: 'get',
    params
  })
}

// 获取租客民族分布统计
export function getRenterNationPlace(params) {
  return request({
    url: '/api/addr/statis/renterNationPlace',
    method: 'get',
    params
  })
}

// 获取租户分布统计
export function getRenterDistribute(params) {
  return request({
    url: '/api/addr/statis/renterDistribute',
    method: 'get',
    params
  })
}
