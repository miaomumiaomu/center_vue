<template>
  <div class="map-container">
    <div class="abs map" ref="map"></div>
    <!-- 社区详情弹窗 -->
    <community-popup ref="commPopup" :code="cCode" :cName="cName" @drillDown="onCommunityShow" :data="community" />
    <div :class="`category-panel ${isScale ? 'up' : 'down'}`" v-if="mapMode === 2">
      <el-checkbox-group v-model="focusTypes" @change="handleFilterType" :max="2">
        <template v-for="item in typeList" >
          <el-checkbox  :label="item.id" :key="item.id" v-if="item.id !== 3">{{item.name}}</el-checkbox>
          <el-popover v-model="tagVisible" v-else placement="top" width="200" trigger="click" :key="item.id" :visible-arrow="false" style="margin-left: 30px;">
            <div class="popover-bar">
              <el-tree :data="tagTree" @node-click="handleNodeClick">
                <span class="custom-tree-node" slot-scope="{ node, data }">
                  <i class="el-icon-check" v-if="!data.children && focusTag.includes(data.id)"></i>
                  <span :class="{ 'tag-select': !data.children && focusTag.includes(data.id)}">{{data.label}}</span>
                </span>
              </el-tree>
              <div style="flex: 1; background-color: #131e37"></div>
            </div>
            <el-checkbox  slot="reference" :label="item.id" @click.native="checkClick">{{item.name}}</el-checkbox>
          </el-popover>
        </template>
      </el-checkbox-group>
    </div>
    <!-- 实有房屋弹窗 -->
    <house ref="house" :locationCode="locationCode" :houseHeader="houseName" />
    <!-- 实有单位弹窗 -->
    <unit ref="unit" :locationCode="locationCode" />
    <!-- 关注人口弹窗 -->
    <person-detail ref="focus" :locationCode="locationCode" />
    <!-- 人脸摄像头弹窗 -->
    <device-video-dialog ref="camera" :chanListData="chanListData" :deviceData="deviceData" />
    <!-- 其他设备弹窗 -->
    <device-dialog ref="device" :deviceData="deviceData" />
  </div>
</template>

<script>
import {
  getCommunityHouse,
  getCommunityCompany,
  getCommunityDevice,
  getCommunityPerson
} from "@/api/dataViews/policeArea";
import { postChanList } from "@/api/video";
import { getCenterConfig } from "@/api/centerConfig";
import { findTagTree } from "@/api/libTagsManage";

export default {
  props: {
    mode: {
      type: Number,
      default: 1
    },
    center: {
      type: Object,
      default: null
    },
    communityData: {
      type: Array,
      default: () => ([])
    },
    isScale: {
      type: Boolean,
      default: false
    }
  },
  components: {
    CommunityPopup: () => import("../CommunityPopup"),
    House: () => import("../dialog/house"),
    Unit: () => import("../dialog/unit"),
    PersonDetail: () => import("../dialog/personDetail"),
    DeviceVideoDialog: () => import("../dialog/deviceVideoDialog"),
    DeviceDialog: () => import("../dialog/deviceDialog")
  },
  data() {
    return {
      mapMode: 1,
      mapCenter: {},
      cMap: null,
      cCode: '',
      cName: '',
      community: {}, //辖区参数
      layerGroup: null,
      markerLayer: null,
      hideLayers: [],
      focusTypes: [0],
      typeList: [
        { id: 0, name: '实有房屋', api: this.fetchCommunityHouse },
        { id: 1, name: '实有单位', api: this.fetchCommunityCompany },
        { id: 2, name: '实有设备', api: this.fetchCommunityDevice },
        { id: 3, name: '关注人口', api: this.fetchCommunityPerson }
      ],
      locationCode: '',
      chanListData: [],
      deviceData: {},
      houseName: '',
      markerList: [],
      clusterList: [],  // 重叠标记聚类数组
      separateList: [],  // 离散标记点数组
      prePolygon: null, //先前弹窗的辖区
      tagTree: [], //人员标签树
      focusTag: [], //选中的标签
      tagVisible: false, // 标签弹窗的使能
    };
  },
  mounted() {
    // 初始化地图
    this.initMap();
    // 获取拾联摄像头列表
    postChanList().then(res => {
      const { status, data } = res;
      if (status === 200) {
        this.chanListData = data;
      }
    });
    //获取人员标签树
    findTagTree().then(res => this.tagTree = res.data)
  },
  watch: {
    mode(val) {
      this.$nextTick(() => {
        this.mapMode = val;
      });
    },
    mapMode(val) {
      if (val === 1) {
        // this.cMap.flyTo(this.mapCenter, 15);
        this.cMap.setZoom(15);
        this.cMap.scrollWheelZoom.enable();
        this.cMap.setMaxZoom(15);
        this.markerLayer.clearLayers();
        this.focusTypes = [0];
        // 弹窗回绑
        const div = this.$refs.commPopup.$el;
        this.layerGroup.eachLayer(layer => {
          if (layer.id == this.communityCode) {
            layer.bindPopup(div, { minWidth: 457, maxHeight: 434, offset: [180, 180] });
          }
        });
        this.hideLayers.forEach(item => {
          this.layerGroup.addLayer(item);
        });
      } else if (val === 2) {
        // this.cMap.scrollWheelZoom.disable();
        this.cMap.setMaxZoom(18);
        this.cMap.flyTo(this.mapCenter, 18);
        // 默认显示房屋
        this.handleFilterType([0]);
      }
      this.$emit('update:mode', val);
    },
    center(val) {
      this.$nextTick(() => {
        this.mapCenter = val;
      });
    },
    communityData(val) {
      if (val.length > 0) {
        if (this.layerGroup) this.layerGroup.clearLayers();
        // 圈出所有社区
        val.forEach(item => {
          let { code, name, range, lat, lng } = item;
          range.forEach(subItem => { subItem.reverse() });
          this.drawCommunity({ code, name, center: { lat, lng }, range }, item);
        });
      }
    }
  },
  methods: {
    initMap() {
      const mapElement = this.$refs.map;
      const center = { lat: 28.42, lng: 104.21 };
      const path = '/map/788865972/{z}/{x}/{y}';
      this.cMap = L.map(mapElement, { center, zoomControl: false, attributionControl: false, zoom: 15, minZoom: 3, maxZoom: 15 });
      L.tileLayer.grayscale(path, { keepBuffer: 0 }).addTo(this.cMap);
      getCenterConfig().then(res => {
        let lat = 0, lng = 0;
        if (res.status == 200) {
          const { range } = res.data;
          range.map(item => {
            lat += item[1];
            lng += item[0];
          });
          lat = (lat / range.length).toFixed(2);
          lng = (lng / range.length).toFixed(2);
          this.cMap.setView({ lat, lng });
        }
      });
      this.layerGroup = L.layerGroup([]).addTo(this.cMap);
      this.markerLayer = L.layerGroup([]).addTo(this.cMap);
    },
    // 处理底层标记重叠判断并聚类
    cluster(list) {
      var newList = list.slice();
      if (newList.length > 0) {
        var center = newList[0];
        var tempObj = {
          clusterLayer: null,
          clusterMarkers: [center]
        };
        for (var i = 1; i < newList.length; i++) {
          var distance = ((center.getLatLng().lat - newList[i].getLatLng().lat)**2 + (center.getLatLng().lng - newList[i].getLatLng().lng)**2).toFixed(5);
          // 判断重叠的距离阈值，可根据实际场景调优
          if (distance <= 0.0001) {
            tempObj.clusterMarkers.push(newList[i]);
            newList.splice(i, 1);
            i--;
          }
        }
        if (tempObj.clusterMarkers.length > 1) {
          var baseMarkers = new L.MarkerClusterGroup();
          tempObj.clusterLayer = baseMarkers;
          this.clusterList.push(tempObj);
        } else {
          this.separateList.push(newList[0]);
        }
        newList.shift();
        this.cluster(newList);
      }
    },
    // 添加底层聚类层
    addInsideCluster() {
      this.clusterList.forEach(item => {
        var { clusterLayer, clusterMarkers } = item;
        clusterLayer.clearLayers();
        clusterMarkers.forEach(m => {
          clusterLayer.addLayer(m);
        });
        clusterLayer.on('clusterclick', function (a) {
          a.layer.spiderfy();
        });
        this.markerLayer.addLayer(clusterLayer);
      });
      // 生成离散点层
      this.separateList.forEach(item => {
        this.markerLayer.addLayer(item);
      });
    },
    // 圈出社区区域
    drawCommunity(comm, val) {
      const { code, name, center, range } = comm;
      const polygon = L.polygon(range, { color: '#1472E8', weight: 2 });
      const div = this.$refs.commPopup.$el;
      let time = null;
      let commonData = { polygon, longLight: false } //当前区域变量和常亮变量
      let func = (e) => { //区域悬浮颜色变化函数
        if (this.prePolygon && this.prePolygon !== commonData) { //同一块区域不做颜色处理
          this.prePolygon.polygon.setStyle({ color: '#1472E8' })
          this.prePolygon.longLight = false
        }
        commonData.longLight = true
        this.prePolygon = commonData
        const { id, name, center } = e.target || {};
        this.cCode = id;
        this.cName = name;
        this.community = val
        this.mapCenter = center;
      }
      polygon.id = code;
      polygon.name = name;
      polygon.center = center;
      this.layerGroup.addLayer(polygon);
      polygon.bindPopup(div, { minWidth: 457, maxHeight: 434, offset: [260, 217] });
      polygon.on('mouseover', (e) => {
        polygon.setStyle({ color: '#FFE617' })
        time =  setTimeout(() => {
          func(e)
          // this.cMap.setView(center);
          polygon.openPopup()
        }, 300);
      })
      polygon.on('mouseout', (e) => {
        if (!commonData.longLight) {
          polygon.setStyle({ color: '#1472E8' })
        }
        clearTimeout(time)
      })
      polygon.on('click', (e) => {
        clearTimeout(time)
        func(e)
      })
    },
    // 地图下钻
    onCommunityShow(commCode) {
      if (commCode instanceof Object) {
        this.mapCenter = { lat: commCode.lat, lng: commCode.lng };
        this.cName = commCode.name
        commCode = commCode.code
      }
      this.communityCode = commCode;
      this.$emit('updateCommunityCode', commCode);
      this.cName &&　this.$emit('setAreaTreeName', this.cName);
      let hideLayers = [];
      this.layerGroup.eachLayer(layer => {
        if (layer.id == commCode) {
          layer.closePopup().unbindPopup();
        } else {
          hideLayers.push(layer);
          this.layerGroup.removeLayer(layer);
        }
      });
      // 暂存其他社区圈选范围
      this.hideLayers = hideLayers;
      this.mapMode = 2;
    },
    // 关注类型选择
    handleFilterType(val) {
      const types = val
      // const types = val.length ? val : [val];
      types.length > 1 ? types.shift() : '' //让el-checkbox单选
      const list = this.typeList.slice();
      // 清空标记点
      this.markerLayer.clearLayers();
      this.markerList = [];
      this.clusterList = [];
      this.separateList = [];
      const contextGroup = [];
      // 请求所有选中类型的数据
      types.forEach(item => {
        contextGroup.push(list[item]['api']());
      });
      Promise.all(contextGroup).then(() => {
        this.cluster(this.markerList);
        this.addInsideCluster();
      });
    },
    // 获取社区实有房屋
    async fetchCommunityHouse() {
      const params = { communityCode: this.communityCode };
      await getCommunityHouse(params).then(res => {
        const { status, data } = res;
        if (status === 200) {
          this.addMarker(data, 'house-marker', 'house');
        }
      });
    },
    // 获取社区实有单位
    async fetchCommunityCompany() {
      const params = { communityCode: this.communityCode };
      await getCommunityCompany(params).then(res => {
        const { status, data } = res;
        if (status === 200) {
          this.addMarker(data, 'building-marker', 'company');
        }
      });
    },
    // 获取社区实有设备
    async fetchCommunityDevice() {
      const params = {
        pageNo: 1,
        pageSize: 10000,
        _filter_eq_communityCode: this.communityCode
      };
      await getCommunityDevice(params).then(res => {
        const { status, data = {} } = res;
        if (status === 200) {
          let { rows = [] } = data;
          this.addMarker(rows, 'camera-online', 'device');
        }
      });
    },
    // 获取社区关注人员
    async fetchCommunityPerson() {
      let personTags = this.focusTag.join(',')
      const params = { communityCode: this.communityCode, personTags };
      await getCommunityPerson(params).then(res => {
        const { status, data } = res;
        if (status === 200) {
          this.addMarker(data, 'focus-marker', 'focus');
        }
      });
    },
    addMarker(list, icon, type) {
      let markerList = this.markerList.slice();
      list.forEach(item => {
        const { code, locationCode, name, communityCode, deviceTypeId, onlineStatus, countPerson = 0, countCompany = 0, countHouse = 0, lat, lng } = item;
        let cusIcon = null;
        let htmlElem = null;
        let popupParams = {};
        let options = {
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        };
        if (type === 'device') {
          let cIcon = '';
          switch(deviceTypeId) {
            // 智能盒子
            case 1:
              cIcon = 'box-marker';
              htmlElem = this.$refs.device.$el;
              popupParams = { minWidth: 459, maxHeight: 388, offset: [246, 210] };
              break;
            // 摄像头：0离线 1在线
            case 2:
              if (onlineStatus == 1) {
                cIcon = 'camera-online';
              } else {
                cIcon = 'camera-offline';
              }
              htmlElem = this.$refs.camera.$el;
              popupParams = { minWidth: 760, maxHeight: 520, offset: [398, 210] };
              break;
            // 门禁机
            case 3:
              cIcon = 'forbid-marker';
              htmlElem = this.$refs.device.$el;
              popupParams = { minWidth: 459, maxHeight: 388, offset: [246, 210] };
              break;
            default:
              break;
          }
          cusIcon = L.icon({
            iconUrl: `/static/leaflet/images/${cIcon}.png`,
            ...options
          });
        } else if (type === 'focus') {
          htmlElem = this.$refs.focus.$el;
          popupParams = { minWidth: 461, maxHeight: 461, offset: [240, 288] };
          cusIcon = L.divIcon({
            html: `<div style="position: relative">
                    <img style="width: 100%" src="/static/leaflet/images/${icon}.png" />
                    <b style="position:absolute;right:4px;top:2px;width:14px;height:14px;line-height:14px;transform:scale(0.7);border-radius:50%;background-color:#D14242;font-size:12px;color:#fff;text-align:center">${countPerson}</b>
                  </div>`,
            ...options
          });
        } else if (type === 'house') {
          htmlElem = this.$refs.house.$el;
          popupParams = { minWidth: 461, maxHeight: 503, offset: [248, 288] };
          cusIcon = L.divIcon({
            html: `<div style="position: relative">
                    <img style="width: 100%" src="/static/leaflet/images/${icon}.png" />
                    <b style="position:absolute;${countHouse > 999 ? 'right: -19px;top:-10px;width:39px;height:20px;line-height:19px;border-radius:5px;' : 'right:-15px;top:-15px;width:30px;height:30px;line-height:29px;border-radius:50%;'}transform:scale(0.7);background-color:#D14242;font-size:14px;color:#fff;text-align:center">${countHouse}</b>
                  </div>`,
            ...options
          });
        } else if (type === 'company') {
          htmlElem = this.$refs.unit.$el;
          popupParams = { minWidth: 420, maxHeight: 340, offset: [226, 262] };
          cusIcon = L.divIcon({
            html: `<div style="position: relative">
                    <img style="width: 100%" src="/static/leaflet/images/${icon}.png" />
                    <b style="position:absolute;right:2px;top:2px;width:16px;height:16px;line-height:14px;transform:scale(0.7);border-radius:50%;background-color:#D14242;font-size:12px;color:#fff;text-align:center">${countCompany}</b>
                  </div>`,
            ...options
          });
        }
        let m = new L.marker(L.latLng(lat, lng), { icon: cusIcon });
        m.bindPopup(htmlElem, popupParams);
        m.id = code || locationCode;
        m.name = name;
        m.on('click', (e) => {
          const { id, name } = e.target || {};
          this.locationCode = id;
          this.houseName = name;
          this.cMap.setView(e.latlng);
          if (type === 'device') {
            this.deviceData = item;
          }
        });
        //监听摄像头弹窗打开关闭
        if (type === 'device' && deviceTypeId === 2) {
          m.on('popupopen', (e) => {
            this.$nextTick(() => {
              this.$refs.camera.open(item) 
            })
          })
          m.on('popupclose', (e) => this.$refs.camera.close())
        }
        markerList.push(m);
      });
      this.markerList = markerList;
    },
    handleNodeClick(data) {
      if(data.children) {
        return 
      }
      let index = this.focusTag.indexOf(data.id)
      if (index !== -1) {
        this.focusTag.splice(index, 1)
      } else {
        this.focusTag.push(data.id)
      }
      //清除标记内容
      this.markerLayer.clearLayers();
      this.markerList = [];
      this.clusterList = [];
      this.separateList = [];
      const contextGroup = [];
      //获取关注人员
      this.fetchCommunityPerson().then(() => {
        this.cluster(this.markerList);
        this.addInsideCluster();
      })
    },
    checkClick() {
      if (this.focusTypes.includes(3)) {
        this.tagVisible = false
      } else {
        this.tagVisible = true
      }
    }
  }
};
</script>
<style lang="scss" scoped>
  .map-container {
    height: 0;
  }
  .abs {
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
  }
  .map {
    width: 100vw;
    background-color: #050A0F;
    z-index: 666;
  }
  .category-panel {
    position: absolute;
    left: 52px;
    padding: 4px;
    padding-left: 12px;
    background-color: #151F2C;
    z-index: 668;
    transition: all 0.8s;
    .el-checkbox-group {
      /deep/ {
        .el-checkbox__inner {
          width: 12px;
          height: 12px;
          line-height: 12px;
        }
        .el-checkbox {
          .el-checkbox__label {
            font-size: 12px;
            color: rgba(255, 255, 255, .62);
          }
        }
      }
    }
  }
  .up {
    bottom: 7.1vh;
  }
  .down {
    bottom: calc(3.5vh + 235px);
  }
  .popover-bar{
    height: 250px; 
    overflow: auto; 
    display: flex; 
    flex-direction: column;
  }
  .custom-tree-node{
    position: relative;
    i{
      position: absolute;
      left: -20px;
      top: 50%;
      transform: translateY(-50%);
      color: #0fa0ff;
    }
    .tag-select{
      color: #0fa0ff;
    }
  }
  ::-webkit-scrollbar-thumb {
    border: 2px solid #1E2638;
  }
  ::-webkit-scrollbar-track {
    background-color: #11151F;
  }
  /deep/ {
    .leaflet-div-icon {
      background-color: transparent;
      border: none;
    }
    .leaflet-popup-tip-container {
      width: 0;
    }
    .leaflet-popup-content-wrapper {
      background-color: transparent;
      box-shadow: none;
    }
    .leaflet-popup-content {
      margin: 0;
    }
    .leaflet-container a.leaflet-popup-close-button {
      width: 18px;
      height: 18px;
      top: 26px;
      right: 12px;
      line-height: 15px;
      border: 1px solid #377AB8;
      border-radius: 50%;
      padding: 0;
      font-size: 12px;
      color: #377AB8;
    }
    .el-checkbox__input.is-checked .el-checkbox__inner::after {
      width: 2px;
      height: 6px;
    }
  }
</style>