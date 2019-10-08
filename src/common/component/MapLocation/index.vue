<template>
  <el-dialog :title="isUnChange?'地址查看':'地址选择'" :visible.sync="dialogVisible" :appendToBody="true" width="60%">
    <div class="map-outer">
      <div class="header" v-if="!isUnChange">
        <div class="qry-addr">
          <el-autocomplete v-model="locationDetailAddr" :fetch-suggestions="placeSearch" placeholder="请输入查询地址" @select="onAutoSelect"></el-autocomplete>
        </div>
        <div class="cur-location">
          <div class="location-header">
            经度：<input class="location-input" v-model="outLocation.lng" @input="modLocate" />&nbsp;&nbsp;
            纬度：<input class="location-input" v-model="outLocation.lat" @input="modLocate" />&nbsp;&nbsp;
          </div>
        </div>
      </div>
      <div class="map-inner" ref="map"></div>
    </div>
    <div slot="footer">
      <el-button size="mini" type="primary" @click="chooseLocation" v-if="!isUnChange">确定</el-button>
      <el-button size="mini" @click="onClose">{{isUnChange?'关闭':'取消'}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from "vuex";
import { createMap } from "@/utils/";

export default {
  props: {
    zoom: {
      default: 12,
      type: Number
    },
    region: Array,
    isUnChange:Boolean
  },
  data: function() {
    return {
      dialogVisible: false,
      position: {},
      cMap: null,
      marker: null,
      inLocation: {},
      outLocation: {},
      locationDetailAddr: ""
    };
  },
  computed: {
    ...mapState({
      placeList: state => state.data.placeList
    })
  },
  watch: {
    dialogVisible(val) {
      if (!val) {
        this.marker.remove();
        this.cMap.remove();
      }
    }
  },
  methods: {
    /**
     * 打开位置选择器弹框
     * @param location 格式：{lng:127, lat:28, addr:'', detailAddr:''}
     */
    open(location) {
      this.inLocation = Object.assign({}, location);
      this.outLocation = Object.assign({}, location);
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.initMap();
      });
    },

    /**
     * 关闭弹层
     */
    onClose() {
      this.dialogVisible = false;
    },

    /**
     * 地图初始化地图
     */
    initMap() {
      const mapElement = this.$refs.map;
      this.cMap = createMap(mapElement, false);
      // 定义覆盖物
      if (this.outLocation.lng && this.outLocation.lat) {
        this.marker = L.marker(this.outLocation, this.$iconConfig).addTo(this.cMap);
      } else {
        this.marker = L.marker([0, 0], this.$iconConfig).addTo(this.cMap);
      }
      this.cMap.on('click', (e) => {
        const { lat, lng } = e.latlng;
        this.setMarker(lat, lng);
      });
    },

    /**
     * 地图地点搜索
     */
    placeSearch(txt, cb) {
      let places = [];
      this.placeList.forEach(item => {
        if (item.value.indexOf(txt) != -1) {
          places.push(item);
        }
      });
      cb(places);
    },

    /**
     * 地图地点搜索
     */
    onAutoSelect(val) {
      const { lng, lat } = val;
      // 设置中心点
      if (lng && lat) {
        this.setMarker(lat, lng);
      }
    },

    /**
     * 修改坐标后重新设置marker
     */
    modLocate() {
      const { lat, lng } = this.outLocation;
      this.setMarker(lat, lng);
    },

    /**
     * 设置图标定位点
     */
    setMarker(lat, lng) {
      let latitude = Number(lat).toFixed(6);
      let longitude = Number(lng).toFixed(6);
      this.outLocation = { lat: latitude, lng: longitude };
      this.marker.setLatLng([latitude, longitude]);
      this.cMap.setView(L.latLng(latitude, longitude));
    },

    /**
     * 确定选中地址
     */
    chooseLocation() {
      const zoom = this.cMap.getZoom();
      const outLocation = Object.assign({}, this.outLocation, { zoom });
      this.$emit("local", outLocation);
      this.onClose();
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.map-outer {
  width: 100%;
  position: relative;
  .header {
    position: absolute;
    top: 5px;
    left: 10px;
    z-index: 888;
    width: 98%;

    .qry-addr {
      float: left;
      width: 50%;
      .el-autocomplete {
        width: 100%;
      }
    }

    .cur-location {
      float: right;
      width: 290px;
      padding: 5px 5px 5px 5px;
      background-color: #fff;
      text-align: right;

      .location-header {
        /*text-align: right;*/

        input {
          width: 80px;
          -webkit-appearance: none;
          border-radius: 4px;
          border: 1px solid #dcdfe6;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          color: #606266;
          display: inline-block;
          font-size: 12px;
          height: 28px;
          line-height: 28px;
          outline: 0;
          padding: 0 6px;
          -webkit-transition: border-color 0.2s
            cubic-bezier(0.645, 0.045, 0.355, 1);
          transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
        }
      }

      .location-footer {
        padding: 3px 7px 0px 0px;
        text-align: right;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
  .map-inner {
    width: 100%;
    height: 520px;
  }
  .dialog-footer {
    margin-top: 20px;
  }
}
</style>
