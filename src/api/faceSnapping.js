import request from '@/utils/request'

// 获取序列号列表
export function getSnappingList(params) {
  return request({
    url: `/api/faceRec/faceSnaps`,
    method: 'get',
    params
  })
}

// 获取过滤抓拍数据
export function getFaceClearning(params){
  return request({
    url:'/api/faceRec/imgMismatchs',
    method:'get',
    params
  })
}