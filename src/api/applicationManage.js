import request from '@/utils/request'

export function getApplicationList(params) {
    return request({
        url: '/api/auth/applications',
        method: 'get',
        params
    })
}

// 获取应用
export function getApplication(id) {
    return request({
        url: `/api/auth/applications/${id}`,
        method: 'get'
    })
}

// 删除应用
export function deleteApplication(data) {
    return request({
        url: `/api/auth/applications`,
        method: 'delete',
        data
    })
}

// 新增应用
export function postApplication(data){
    return request({
        url:'/api/auth/applications',
        method:'post',
        data
    })
}

// 修改应用
export function putApplication(data){
    return request({
        url:`/api/auth/applications/${data.id}`,
        method:'put',
        data
    })
}