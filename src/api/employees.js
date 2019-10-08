import request from '@/utils/request'

// 获取当前从业人员
export function getEmployeesCurrent(params) {
  return request({
    url: '/api/person/personInfos/personInCompany',
    method: 'get',
    params
  })
}

// 获取历史从业人员
export function getEmployeesHisory(params) {
  return request({
    url: '/api/person/personInfos/personInCompanyHistory',
    method: 'get',
    params
  })
}

// 获取历史从业人员
export function deleteEmployees(data) {
  return request({
    url: '/api/person/personCompanyRel/deletePersonCompanyRel',
    method: 'delete',
    data
  })
}