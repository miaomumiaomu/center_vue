import request from '@/utils/request'


// 获取房屋性质分析
export function getHousePropertyType(params) {
  return request({
    // url: '/api/addr/statis/housePropertyType',
    url: '/api/addr/statis/housePurposeType',
    method: 'get',
    params
  })
}

// 获取人员管理类别
export function getPersonManage(params) {
  return request({
    url: '/api/person/statis/householdType',
    method: 'get',
    params
  })
}

// 获取人员居住情况
export function getPersonLive(params) {
  return request({
    url: '/api/person/statis/userType',
    method: 'get',
    params
  })
}


