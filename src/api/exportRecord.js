import request from '@/utils/request'

//excel 导出
export function getExcelList(params){
  return request({
    url:`/api/config/exportFile`,
    method:'get',
    params
  })
}

//excel 导出
export function delExcelList(data){
  return request({
    url:`/api/config/exportFile`,
    method:'delete',
    data
  })
}