import request from '@/utils/request'

// 获取所有菜单
export function getAllMenu() {
  return request({
    url: '/api/auth/resources/menuTree',
    method: 'get'
  })
}

// 获取用户对应路由
export function getUserRoute() {
  return request({
    url: '/api/auth/resources/routes',
    method: 'get'
  })
}

// 获取项目基本信息
export function getProjectInfo() {
  return request({
    url: `/api/admin/depart/getTopOrg`,
    method: 'get'
  })
}

// 获取数据字典，并设置缓存
export function getDictionary(code) {
  return request({
    url: `/api/config/dictTypes/${code}/dictValues`,
    method: 'get',
    cache: {
      id: code,
      type: 'dictionary'
    }
  })
}

// 获取数据字典
export function getDictionaryMap(val) {
  return request({
    url: `/api/config/dictTypes/${val}/dictValues/map`,
    method: 'get',
  })
}

// 获取房间树
export function getHouseTree(id) {
  return request({
    url: `/api/addr/houses/tree`,
    method: 'get',
    params: { communityId: id }
  })
}

/**
 * 图片上传
 */
export function postPicturesUpload(data) {
  return request({
    url: `/api/person/fileUploads/batch`,
    method: 'post',
    data,
    isUpload: true
  })
}

/**
 * 获取人脸库列表
 */
export function getFaceLibraryList() {
  return request({
    url: `/api/person/personLibrarys/libraryList`,
    method: 'get'
  })
}

//车辆库  列表 获取
export function getCarLibraryList() {
  return request({
    url: `/api/car/libraries`,
    method: 'get',
  })
}

// 以图搜图
export function postImageSearch(data) {
  return request({
    url: '/api/faceRec/images/search',
    method: 'POST',
    data
  })
}

// 获取人员证件照
export function getPersonImg(id) {
  return request({
    url: `/api/person/personInfos/${id}/img`,
    method: 'get'
  })
}

// 搜索身份证
export function postSearchIdentityNo(data){
  return request({
    url:'/api/faceRec/images/searchIdentityNo',
    method:'post',
    data
  })
}

// 认证服务
export function getRefresh(){
  return request({
    url:'/api/auth/token/refresh',
    method:'get'  
  })
}

// 获取行政区域
export function getByCode(params){
  return request({
    url:'/api/addr/districts/getByCode',
    method:'get',
    params
  })
}

//短信模板

export function getSmsTemplete(params){
  return request({
    url:'/api/datapush/smsTemplates/templates',
    method:'get',
    params
  })
}

//字典树形结构

export function getDictValueTree(typeCode){
  return request({
    url:`/api/config/dictTypes/${typeCode}/dictValueTree`,
    method:'get'
  })
}