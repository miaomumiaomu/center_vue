import request from '@/utils/request'

//获取中心未出现的标签

export function getCountByDays(params) {
  return request({
    url: 'api/person/personInfos/getCountByDays',
    method: 'get',
    params
  })
}

//获取辖区盘查列表

export function queryPersonHousePageByCan(params) {
  return request({
    url: 'api/person/personInfos/queryPersonHousePageByCan',
    method: 'get',
    params
  })
}

//保存盘查记录

export function savePersonCanHistory(data) {
  return request({
    url: 'api/person/personQuestionHistory',
    method: 'post',
    data
  })
}

//获取个人盘查记录

export function getPersonCanHistory(params) {
  return request({
    url: 'api/person/personQuestionHistory/getAllByPersonId',
    method: 'get',
    params
  })
}

//excel 导出

export function getPersonExcel(params){
  return request({
    url:`/api/person/personInfos/writeExcel`,
    method:'get',
    params
  })
}
