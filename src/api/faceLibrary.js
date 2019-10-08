import request from '@/utils/request'

// 获取实有单位列表
export function getCommunitiesList(params) {
  return request({
    url: '/api/addr/communities',
    method: 'get',
    params
  })
}

/* 标签库处理 */
// 获取标签库树
export function getLabelLibraryList() {
  return request({
    url: '/api/person/personLibrarys/libraryList',
    method: 'get'
  })
}

// 添加标签库
export function postLabelLibrary(data) {
  return request({
    url: '/api/person/personLibrarys',
    method: 'post',
    data
  })
}

// 删除标签库
export function deleteLabelLibrary(data) {
  return request({
    url: `/api/person/personLibrarys`,
    method: 'delete',
    data
  })
}

// 修改标签库
export function putLabelLibrary(data) {
  return request({
    url: `/api/person/personLibrarys/${data.id}`,
    method: 'put',
    data
  })
}

// 获取标签库
export function getLabelLibrary(id) {
  return request({
    url: `/api/person/personLibrarys/${id}`,
    method: 'get'
  })
}
/* 标签库处理 */

/* 标签处理 */
// 获取标签列表
export function getLabelList(params) {
  return request({
    url: '/api/person/personInfos',
    method: 'get',
    params
  })
}

// 人员管理列表
export function getPersonRecord(params) {
  return request({
    url: '/api/person/personInfos/queryPersonRecord',
    method: 'get',
    params
  })
}

// 添加标签
export function postLabel(data) {
  return request({
    url: '/api/person/personInfos',
    method: 'post',
    data
  })
}

// 删除标签
export function deleteLabel(data) {
  return request({
    url: `/api/person/personInfos/deleteByIds`,
    method: 'delete',
    data
  })
}

// 修改标签
export function putLabel(data) {
  return request({
    url: '/api/person/personInfos',
    method: 'post',
    data
  })
}

// 获取标签
export function getLabel(id) {
  return request({
    url: `/api/person/personInfos/${id}`,
    method: 'get'
  })
}
/* 标签处理 */

// 初始化人员库
export function getInitFeatures(params){
  return request({
    url:'/api/faceRec/imgFeatures/initFeatures',
    method:'get',
    params
  })
}

// 删除人员陌生人
export function deleteLibrary(id){
  return request({
    url: `/api/person/personInfos/deleteAll/${id}`,
    method:'delete',
  })
}

//获取用户变更历史
export function getLiveInfo(params){
  return request({
    url:'/api/person/personInfos/getHistoryList',
    method:'get',
    params
  })
}

//获取单位变更历史
export function getCompanyHistory(params){
  return request({
    url:'/api/person/personCompanyRelHistory/getCompanyHistory',
    method:'get',
    params
  })
}

// 获取全部一类库
export function getPersonCategories(params){
  return request({
    url:'/api/person/personCategories/findAll',
    method:'get',
    params
  })
}

// 添加一类库
export function addPersonCategory(data){
  return request({
    url:`/api/person/personCategories`,
    method:'post',
    data
  })
}

// 保存一类库
export function updatePersonCategory(data){
  return request({
    url:`/api/person/personCategories/${data.id}`,
    method:'put',
    data
  })
}

// 获取单个一类库
export function getPersonCategory(id){
  return request({
    url:`/api/person/personCategories/${id}`,
    method:'get'
  })
}

// 删除一类库
export function delPersonCategory(id){
  return request({
    url:`/api/person/personCategories/${id}`,
    method:'delete'
  })
}

//获取二类字库
export function getPersonLibrarys(params){
  return request({
    url:'/api/person/personLibrarys/findByCategorieId',
    method:'get',
    params
  })
}
//根据人、身份证搜索已有的人
export function personSearch(params){
  return request({
    url:'/api/person/personInfos/search',
    method:'get',
    params
  })
}