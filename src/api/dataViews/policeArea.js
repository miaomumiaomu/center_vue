import request from '@/utils/request';


// 获取辖区统计面板数据（房屋、单位、人口、关注人员）
export function getPoliceAreaPartTotal(params) {
  return request({
    url: '/api/addr/statis/addrTotal',
    method: 'get',
    params
  })
}

// 获取辖区统计面板实有设备总数
export function getPoliceAreaDeviceTotal(params) {
  return request({
    url: '/api/device/deviceStatis/deviceTotal',
    method: 'get',
    params
  })
}

// 获取辖区统计面板实有车辆总数
export function getPoliceAreaCarTotal(params) {
  return request({
    url: '/api/car/carStatistics/carTotal',
    method: 'get',
    params
  })
}

// 根据辖区获取下级所有社区
export function getCommunityByCode(params) {
  return request({
    url: '/api/addr/communities/getCommunityByPoliceCode',
    method: 'get',
    params
  })
}

// 获取社区实有房屋
export function getCommunityHouse(params) {
  return request({
    url: '/api/addr/locations/getLocationByCommunityCode',
    method: 'get',
    params
  })
}

// 获取社区实有单位
export function getCommunityCompany(params) {
  return request({
    url: '/api/addr/addrCompany/getCompanyLocation',
    method: 'get',
    params
  })
}

// 获取社区实有设备
export function getCommunityDevice(params) {
  return request({
    url: '/api/device/deviceInfos',
    method: 'get',
    params
  })
}

// 获取社区关注人员
export function getCommunityPerson(params) {
  return request({
    url: '/api/person//personInfos/getPersonLocation',
    method: 'get',
    params
  })
}
