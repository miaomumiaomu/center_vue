import request from '@/utils/request'

// 获取网卡列表
export function getNetworkCardList() {
  return request({
    url: '/api/config/commonConfigs/getNetWorkCardList',
    method: 'get'
  })
}

// 更新网卡信息
export function postNetworkCard(data) {
  return request({
    url: '/api/config/commonConfigs/updateNetWorkCard',
    method: 'post',
    data
  })
}
