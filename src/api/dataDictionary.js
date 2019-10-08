import request from '@/utils/request'

//获取字典树形结构
export function getDictTypeTree() {
  return request({
    url: `/api/config/dictTypes/dictTree`,
    method: 'get',
  })
}

//获取字典类型
export function getDictType(id) {
  return request({
    url: `/api/config/dictTypes/${id}`,
    method: 'get',
  })
}

//添加/修改字典类型
export function postDictType(data) {
  return request({
    url: `/api/config/dictTypes/saveOrUpdateDictType`,
    method: 'post',
    data
  })
}

//删除字典类型
export function deleteDictType(data) {
  return request({
    url: `/api/config/dictTypes`,
    method: 'delete',
    data
  })
}

//获取字典数据列表
export function getDictValueList(params) {
  return request({
    url: `/api/config/dictValue`,
    method: 'get',
    params
  })
}

//添加/修改字典数据
export function postDictValue(data) {
  return request({
    url: `/api/config/dictValue/saveOrUpdateDictValue`,
    method: 'post',
    data
  })
}

//删除字典数据
export function deleteDictValue(data) {
  return request({
    url: `/api/config/dictValue`,
    method: 'delete',
    data
  })
}
