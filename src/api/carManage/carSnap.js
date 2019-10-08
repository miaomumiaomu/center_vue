import request from '@/utils/request'

// 获取车辆抓拍列表
export function getCarPassRecordsList(params) {
    return request({
        url: '/api/car/passRecords',
        method: 'get',
        params
    })
}

// 删除车辆抓拍记录
export function deleteCarPassRecords(data) {
    return request({
        url: '/api/car/passRecords',
        method: 'delete',
        data
    })
}