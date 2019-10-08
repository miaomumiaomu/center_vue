import request from "@/utils/request"

// 修改证件
export function putIdentityNo(data) {
    return request({
        url: '/api/faceRec/faceSnaps/changeIdentityNo',
        method: 'put',
        data
    })
}
// 人脸检测
export function postFaceCheck(data) {
    return request({
        url: '/api/faceRec/images/faceAlign',
        method: 'post',
        data
    })
}

// 人脸对比
export function postFaceCompare(data) {
    return request({
        url: '/api/faceRec/images/compare',
        method: 'post',
        data
    })
}

// 人脸特征值
export function postFaceFeature(data) {
    return request({
        url: '/api/faceRec/images/feature',
        method: 'post',
        data
    })
}

// 人脸对齐
export function postFaceLocation(data) {
    return request({
        url: '/api/faceRec/images/detect',
        method: 'post',
        data
    })
}

// 人脸深度对齐
export function postFaceDeepLocation(data) {
    return request({
        url: '/api/faceRec/images/deepDetect',
        method: 'post',
        data
    })
}

// 综合搜索
export function postRouteSearch(data) {
    return request({
        url: '/api/faceRec/images/routeSearch',
        method: 'post',
        data
    })
}

//模拟 车辆 数据推送
export function postCarSimulate(data) {
    return request({
        url: '/api/car/passRecords/imitateUpload',
        method: 'post',
        data
    })
}

//模拟 车辆 数据推送
export function postPersonSimulate(data) {
    return request({
        url: '/api/faceRec/images/imitateUpload',
        method: 'post',
        data
    })
}