import request from '@/utils/request'


// 获取区域树
export function getAreaTree(params) {
  return request({
    url: '/api/addr/policeAreas/areaCommunityTree',
    method: 'get',
    params
  })
}

// 获取统计面板数据
export function getTotalData(params) {
  return request({
    url: '/api/track/statis/personCommon',
    method: 'get',
    params
  })
}

// 获取抓拍统计数据
export function getPersonSnap(params) {
  return request({
    url: '/api/track/statis/personSnap',
    method: 'get',
    params
  })
}

// 获取迁入/迁出人口数据
export function getHouseMove(params) {
  return request({
    url: '/api/addr/statis/houseMove',
    method: 'get',
    params
  })
}

// 获取感知人脸频次排行榜
export function getPersonTop10(params) {
  return request({
    url: '/api/track/statis/personSnapTop',
    method: 'get',
    params
  })
}

// 获取籍贯分布排行榜
export function getPlaceTop(params) {
  return request({
    url: '/api/person/statis/nativePlaceTop',
    method: 'get',
    params
  })
}

// 获取民族分布统计
export function getNationSpread(params) {
  return request({
    url: '/api/person/statis/nation',
    method: 'get',
    params
  })
}

// 获取年龄分布
export function getAgeSpread(params) {
  return request({
    url: '/api/person/statis/age',
    method: 'get',
    params
  })
}

// 获取人员类型分布
export function getPersonCategory(params) {
  return request({
    url: '/api/person/statis/library',
    method: 'get',
    params
  })
}

// 获取今日热点设备排行
export function getHotSnapDevice(params) {
  return request({
    url: '/api/track/statis/hotSnapDevice',
    method: 'get',
    params
  })
}

// 获取人口分布统计
export function getDistribution(params) {
  return request({
    url: '/api/person/statis/distribution',
    method: 'get',
    params
  })
}
