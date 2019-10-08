<template>
  <div></div>
</template>
<script>
import { getDictionaryMap } from "@/api/common";

export default {
  name: "DictionariesPreLoad",
  data() {
    return {
      root: 'root'	,//根节点
      authority: 'authority'	,//权限字典
      authority_element: 'authority_element'	,//资源类型
      authority_menu: 'authority_menu'	,//菜单类型
      app_type: 'app_type'	,//应用类型
      document_types: 'document_types',

      comm:	'comm',//公共字典
      comm_sex:	'comm_sex',//性别
      comm_nation: 'comm_nation',//民族
      community: 'community'	,//小区
      community_type: 'community_type'	,//小区类型
      comm_handle_flag: 'comm_handle_flag'	,//处理状态

      label: 'label'	,//人脸
      label_type: 'label_type'	,//住户类型
      label_relation: 'label_relation'	,//与业主关系
      // race: 'race', //民族
      person_house_history_type: 'person_house_history_type', //人房历史拆迁类型

      enable_status: 'enable_status'	,//启用状态
      device: 'device'	,//设备
      web_subType: 'web_subType', //web应用服务器
      box_subType: 'box_subType', //智能盒子
      // camera_subType: 'camera_subType', //设想头设备子类型
      access_subType: 'access_subType', //门禁机
      visitor_subType: 'visitor_subType',//访客机
      device_type: 'device_type'	,//设备类型
      device_status: 'device_status'	,//设备状态
      device_readMethod: 'device_readMethod'	,//设备读取方式
      deviceCamera_type: 'deviceCamera_type', //设想头设备子类型

      address_type: 'address_type', //地址类别
      address_build_type: 'address_build_type', //建筑类型
      police_area_type: 'police_area_type', //辖区类型
      location0_type: 'location0_type'	,//街路巷类型
      location1_type: 'location1_type'	,//楼栋单元类型

      pass_type: 'pass_type'	,//通过类型
      vehicle_type: 'vehicle_type', //车辆类型
      comp_type: 'comp_type', //单位类型
      industry_type: 'industry_type', //行业类型
      supervisory_level: 'supervisory_level', //管理级别

      house_type: 'house_type', //房屋类型
      house_manage_level: 'house_manage_level', //房屋管理级别
      house_use_type: 'house_use_type', //房屋使用形式
      house_use: 'house_use', //房屋用途
      house_property: 'house_property', //房屋性质

      police_case_type: 'police_case_type',
      police_case_status: 'police_case_status',
      project_type: 'project_type',
      device_brand: 'device_brand'
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      let Obj = this._data;
      Object.keys(Obj).forEach(element => {
        getDictionaryMap(element).then( res => {
          // console.log(res.data)
          window.localStorage.setItem(element, JSON.stringify(res.data));
        })  
      });
    }
  },
};
</script>
<style lang="scss" scoped>
</style>