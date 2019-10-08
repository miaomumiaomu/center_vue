import request from '@/utils/request'

// 获取停车场列表信息
export function getParkingLotList(params) {
    return request({
        url: '/api/car/parks',
        method: 'get',
        params
    })
}

// 新增停车场信息
export function postParkingLot(data) {
    return request({
        url: '/api/car/parks',
        method: 'post',
        data
    })
}

// 根据id获得停车场信息
export function getParkingLot(id) {
    return request({
        url: `/api/car/parks/${id}`,
        method: 'get'
    })
}

//编辑停车场信息
export function putParkingLot(data) {
    return request({
        url: `/api/car/parks/${data.id}`,
        method: 'put',
        data
    })
}

// 批量删除停车场信息
export function deleteParkingLot(data) {
    return request({
        url: '/api/car/parks',
        method: 'delete',
        data
    })
}