import request from '@/utils/request'

// 获取实有单位菜单
export function getCommunitiesMenu() {
  return request({
    url: '/api/addr/communities/deviceCntData',
    method: 'get'
  })
}

// 设备列表
export function getDevicesList(params) {
  return request({
    url: '/api/device/deviceInfos',
    method: 'get',
    params
  })
}

// 添加设备
export function postDevices(data) {
  return request({
    url: '/api/device/deviceInfos',
    method: 'post',
    data
  })
}

// 修改设备
export function putDevices(data) {
  return request({
    url: `/api/device/deviceInfos`,
    method: 'put',
    data
  })
}

// 删除设备
export function deleteDevices(data) {
  return request({
    url: `/api/device/deviceInfos`,
    method: 'delete',
    data
  })
}

// 获取设备
export function getDevices(id) {
  return request({
    url: `/api/device/deviceInfos/${id}`,
    method: 'get'
  })
}

// 房屋选择
export function getHouseTree(id){
  return request({
    url:'/api/addr/locations/tree',
    method:'get',
    params: { communityId: id }
  })
}

// 
export function getAddrSnapDeviceTree(params){
  return request({
    url:'/api/device/deviceInfos/getAddrSnapDeviceTree',
    method:'get',
    params
  })
}

// 根据项目获取应用
export function getApplications(params){
  return request({
    url:`api/auth/applications/getByCommunityId`,
    method:'get',
    params
  })
}

// 根据项目获取应用
export function bindShiLianBoxSerial(shiLianBoxSerial){
  return request({
    url:`api/device/open/device/bind/${shiLianBoxSerial}`,
    method:'get'
  })
}