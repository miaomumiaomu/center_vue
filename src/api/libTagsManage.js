import request from '@/utils/request'

//获取标签类型列表
export function getTagTypeList(params) {
  return request({
    url: '/api/person/personCategories/findAll',
    method: 'get',
    params
  })
}
// 获取标签类型
export function findTagType(params) {
  return request({
    url: '/api/person/personTags/findByCategoryId',
    method: 'get',
    params
  })
}

// 标签类型添加修改
export function tagTypeSaveOrUpdate(data) {
  return request({
    url: '/api/person/personCategories/saveOrUpdate',
    method: 'post',
    data
  })
}

// 获取标签名称列表
export function getTagList(params) {
  return request({
    url: '/api/person/personTags',
    method: 'get',
    params
  })
}

// 标签签名添加修改
export function tagSaveOrUpdate(data) {
  return request({
    url: '/api/person/personTags/saveOrUpdate',
    method: 'post',
    data
  })
}

// 标签类型删除
export function delTagType(id) {
  return request({
    url: `/api/person/personCategories/deleteById/${id}`,
    method: 'delete',
  })
}

// 标签名称删除
export function delTag(data) {
  return request({
    url: '/api/person/personTags/deleteByIds',
    method: 'delete',
    data
  })
}

// 获取标签名称
export function getTagById(params) {
  return request({
    url: '/api/person/personTags/findByCategoryId',
    method: 'get',
    params
  })
}

// 获取标签树
export function findTagTree() {
  return request({
    url: '/api/person/personCategories/findTagTree',
    method: 'get'
  })
}