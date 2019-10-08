import request from '@/utils/request';

// 车辆告警

  //告警 获取列表
  export function getCarAlarmList(params) {
    return request({
      url: `/api/car/alarmLogs`,
      method: 'get',
      params
    })
  }

  //告警 获取 详情
  export function getCarAlarmInfo(id) {
    return request({
      url: `/api/car/alarmLogs/details/${id}`,
      method: 'get',
    })
  }
  
  //告警  处理
  export function postCarAlarmHandle(data) {
    return request({
      url: '/api/car/alarmLogs/handle',
      method: 'post',
      data
    })
  }

  //布控 下拉 列表 获取
  export function getCarAlarmAllData() {
    return request({
      url: `/api/car/monitors/allData`,
      method: 'get',
    })
  }

  // 布控个人下拉列表获取
  export function getCarAlarmPersonalData() {
    return request({
      url: `/api/car/monitors/personalData`,
      method: 'get',
    })
  }

  //告警 数据删除
  export function deleteCarAlarmLogs(data) {
    return request({
      url: `/api/car/alarmLogs`,
      method: 'DELETE',
      data
    })
  }

  // 告警 根据id获取消息数
  export function getCarAlarmCounts(params) {
    return request({
      url: '/api/car/alarmLogs/deviceAlarmCnt',
      method: 'get',
      params
    })
  }

// 车辆告警

//车辆布控

  //布控  列表 获取
  export function getcarControlList(params) {
    return request({
      url: `/api/car/monitors`,
      method: 'get',
      params
    })
  }

   //布控  详情 新增
   export function PostcarContro(data) {
    return request({
      url: `/api/car/monitors`,
      method: 'POST',
      data
    })
  }

   //布控  详情 修改
   export function PutcarContro(data) {
    return request({
      url: `/api/car/monitors/${data.id}`,
      method: 'put',
      data
    })
  }

   //布控  详情 获取
   export function GetcarContro(id) {
    return request({
      url: `/api/car/monitors/details/${id}`,
      method: 'GET',
    })
  }

  //布控  详情 查看
  export function getcarControInfo(id) {
    return request({
      url: `/api/car/monitors/details/${id}`,
      method: 'GET',
    })
  }

  //布控  布控概要
  export function getCarControlOverview(id) {
    return request({
      url: `/api/car/monitors/${id}/overview`,
      method: 'GET',
    })
  }

  // 布控 个人布控概要
  export function getCarOverviewById(id) {
    return request({
      url: `api/car/monitors/${id}/overview`,
      method: 'GET',
    })
  }

  // 布控未处理事件
  export function getCarHandleCount(params){
    return request({
      url:`/api/car/alarmLogs/handleStatic`,
      method:'get',
      params
    })
  }

//车辆布控



//车辆库管理

  //车辆库  列表 获取
  export function getcarLibraries() {
    return request({
      url: `/api/car/libraries`,
      method: 'get',
    })
  }

  //车辆库 新增 获取
  export function AddcarLibraries(data) {
    return request({
      url: `/api/car/libraries`,
      method: 'post',
      data
    })
  }

  //车辆库 删除
  export function DeletecarLibraries(id) {
    return request({
      url: `/api/car/libraries/${id}`,
      method: 'delete',
    })
  }

  //车辆库 提交修改
  export function putcarLibraries(data) {
    return request({
      url: `/api/car/libraries/${data.id}`,
      method: 'put',
      data
    })
  }
  
  //车辆库 修改获取
  export function getEditcarLibraries(id) {
    return request({
      url: `/api/car/libraries/${id}`,
      method: 'get',
    })
  }

//车辆库管理

//车辆信息

//车辆列表
  export function getRealCarinfos(params) { // 获取实有车辆列表
    return request({
      url: `/api/car/infos/queryPageByHouse`,
      method: 'get',
      params
    })
  }

  export function getCarinfos(params) {
    return request({
      url: `/api/car/infos`,
      method: 'get',
      params
    })
  }

  // //车辆 添加
  // export function Addcarinfos(data) {
  //   return request({
  //     url: `/api/car/infos`,
  //     method: 'post',
  //     data
  //   })
  // }

  // //车辆 编辑
  // export function Editcar(data) {
  //   return request({
  //     url: `/api/car/infos/${data.id}`,
  //     method: 'put',
  //     data
  //   })
  // }

   //车辆 编辑 信息 获取
   export function saveCarinfos(data) {
    return request({
      url: `api/car/infos/saveOrUpdateCar`,
      method: 'post',
      data
    })
  }

  //车辆 编辑 信息 获取
  export function Editcarinfos(id) {
    return request({
      url: `/api/car/infos/${id}`,
      method: 'get',
    })
  }

  //人员 信息 获取
  export function getperson(id) {
    return request({
      url: `/api/person/personInfos/${id}`,
      method: 'get',
    })
  }

  //车辆信息 删除
  export function DeletecarInfos(data) {
    return request({
      url: `/api/car/infos/deleteCarHouseRel`,
      method: 'delete',
      data
    })
  }
//车辆信息

  //获取个人车辆
  export function getCarByPersonId(params) {
    return request({
      url: `/api/car/infos/getCarByPersonId`,
      method: 'get',
      params
    })
  }

//获取个人车辆
export function getCarHistory(params) {
  return request({
    url: `api/car/CarHouseRelHistory/findHistoryByCarId`,
    method: 'get',
    params
  })
}