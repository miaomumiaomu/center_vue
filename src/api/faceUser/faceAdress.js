import request from '@/utils/request'

//获取 居住信息
export function getHouseInfo(id) {
  return request({
    url: `/api/person/personInfos/houses?personId=${id}`,
    method: 'get',
    banLoading: true,
  })
}
