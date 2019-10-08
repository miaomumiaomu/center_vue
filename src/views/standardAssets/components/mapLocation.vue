<template>
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
    isUnChange:Boolean,
    location: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data: function() {
    return {
      position: {},
      cMap: null,
      marker: null,
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
    location(val) {
      this.cMap.invalidateSize()
      if (val.lng !== this.outLocation.lng || val.lat !== this.outLocation.lat) {
        this.setMarker(val.lat, val.lng)
      }
    }
  },
  mounted() {
    this.outLocation = Object.assign({}, this.location);
    this.$nextTick(() => {
      this.initMap()
    })
  },
  methods: {
    /**
     * 打开位置选择器弹框
     * @param location 格式：{lng:127, lat:28, addr:'', detailAddr:''}
     */
    open(location) {
      this.outLocation = Object.assign({}, location);
      this.$nextTick(() => {
        this.initMap();
      });
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
      let latitude = null, longitude = null
      if (lat && lng) {
        latitude = Number(lat).toFixed(8)
        longitude = Number(lng).toFixed(8)
      }
      this.outLocation = { lat: latitude, lng: longitude };
      this.marker.setLatLng([latitude, longitude]);
      this.cMap.setView(L.latLng(latitude, longitude));
      this.$emit("local", this.outLocation);
    },

    /**
     * 确定选中地址
     */
    chooseLocation() {
      const zoom = this.cMap.getZoom();
      const outLocation = Object.assign({}, this.outLocation, { zoom });
      this.$emit("local", outLocation);
    }
  }
}
</script>
<style lang="scss" scoped>
.map-outer {
  width: 480px;
  position: relative;
  .header {
    position: absolute;
    top: 5px;
    left: 10px;
    z-index: 888;
    width: 98%;

    .qry-addr {
      float: left;
      width: 25%;
      padding: 5px 5px 5px 5px;
      /deep/ .el-input--medium .el-input__inner {
        width: 100px !important;
      }
    }

    .cur-location {
      float: right;
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
    height: 320px;
  }
}
</style>

