import request from '@/utils/request'


// 获取今日访客数量统计
export function getVisitorToday(params) {
  return request({
    // url: '/mock/11/api/track/statis/visitorCommon',
    url: '/api/track/statis/visitorCommon',
    method: 'get',
    params
  })
}

// 获取拜访时间分布分析
export function getVisitorTimeAnaly(params) {
  return request({
    // url: '/mock/11/api/track/statis/visitorTimeAnaly',
    url: '/api/track/statis/visitorTimeAnaly',
    method: 'get',
    params
  })
}

// 获取频繁受访统计
export function getVisitorFrequent(params) {
  return request({
    url: '/api/track/statis/visitedHouseFrequent',
    method: 'get',
    params
  })
}


// 获取访客流量统计
export function getVisitorFlow(params) {
  return request({
    // url: '/mock/11/api/track/statis/visitorFlow',
    url: '/api/track/statis/visitorFlow',
    method: 'get',
    params
  })
}

// 获取受访房间排行榜
export function getVisitorRoom(params) {
  return request({
    // url: '/mock/11/api/track/statis/visitHouse',
    url: '/api/track/statis/visitHouse',
    method: 'get',
    params
  })
}

// 获取拜访人员排行榜
export function getVisitorPerson(params) {
  return request({
    // url: '/mock/11/api/track/statis/visitorTop',
    url: '/api/track/statis/visitorTop',
    method: 'get',
    params
  })
}
