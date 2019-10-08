import request from '@/utils/request'

// 房屋性质分析
export function getHousePurposeType(params) {
  return request({
    url: `/api/addr/statis/housePurposeType`,
    method: 'get',
    params
  })
}

// 房屋登记（采集）情况分析
export function getHouseCollectt(params) {
  return request({
    url: `api/addr/statis/houseCollect`,
    method: 'get',
    params
  })
}

// 楼栋单元房屋数据统计
export function getHouseCommon(params) {
  return request({
    url: `api/addr/statis/houseCommon`,
    method: 'get',
    params
  })
}

// 房屋居住人数排行
export function getHouseMemberTop(params) {
  return request({
    url: `api/addr/statis/houseMemberTop`,
    method: 'get',
    params
  })
}

// 房屋出租情况分析
export function getHouseRent(params) {
  return request({
    url: `api/addr/statis/houseRent`,
    method: 'get',
    params
  })
}

// 人均居住面积排行榜
export function getHousePerCapitaAreaTop(params) {
  return request({
    url: `api/addr/statis/housePerCapitaAreaTop`,
    method: 'get',
    params
  })
}

// 房屋分布统计
export function getHouseDistribution(params) {
  return request({
    url: `/api/addr/statis/houseDistribution`,
    method: 'get',
    params
  })
}
// 房屋分布统计
export function getHouseUnihabited(params) {
  return request({
    url: `/api/addr/statis/houseUnihabited`,
    method: 'get',
    params
  })
}

// 房屋管理级别
export function getHouseManageLevel(params) {
  return request({
    url: `/api/addr/statis/houseManageLevel`,
    method: 'get',
    params
  })
}