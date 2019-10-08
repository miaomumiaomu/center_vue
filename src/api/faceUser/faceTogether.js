import request from '@/utils/request'

//获取 同行信息 抓拍地点
export function getTogetherCommunityInfo(params) {
  return request({
    url: `/api/track/statis/togetherAnalysis`,
    method: 'get',
    banLoading: true,
    params
  })
}

//获取 同行信息 抓拍时间
export function getTogetherTime(params) {
  return request({
    url: `/api/track/statis/togetherPeriodAnalysis`,
    method: 'get',
    banLoading: true,
    params
  })
}


//获取 同行信息 排行榜
export function getTogetherTop(params) {
  return request({
    url: `api/track/statis/togetherTop`,
    method: 'get',
    banLoading: true,
    params
  })
}

// 同行记录查询
export function getTravelTogethers(params) {
  return request({
    url: `api/track/passTogethers`,
    method: 'get',
    banLoading: true,
    params
  })
}