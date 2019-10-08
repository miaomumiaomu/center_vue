import request from '@/utils/request'

export function getNoteRecordsList(params){
  return request({
    method: 'get',
    url: '/api/datapush/smsSendRecords',
    params
  })
}