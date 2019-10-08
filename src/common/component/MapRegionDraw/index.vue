<template>
  <el-dialog title="地图区域绘制" class="map-layer body0" :visible.sync="isFormDialog" width="800px" append-to-body>
    <div class="header">
      <el-button size="mini" type="success" icon="el-icon-edit" @click="onCustomDraw(isEditMap)">{{isEditMap?'结束':'开始'}}绘制区域</el-button>
      <el-button size="mini" type="danger" @click="onEmptyPolygon">清空绘制区域</el-button>
      <el-autocomplete size="mini" v-model="locationDetailAddr" :fetch-suggestions="placeSearch" placeholder="请输入查询地址" @select="onAutoSelect"></el-autocomplete>
    </div>
    <div class="map-inner" ref="regionMap"></div>
    <div slot="footer">
      <el-button size="mini" type="primary" @click="onMapUpdate">保存</el-button>
      <el-button size="mini" @click="isFormDialog = false">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from "vuex";
import { createMap } from "@/utils/";

export default {
  props: {
    data: Array,
    isOpen: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      map: null,
      isEditMap: false,
      mapPointArr: [],
      mapPolygon: null,
      locationDetailAddr: "",
      isFormDialog: false,
      polygon: null,
      layerGroup: null
    };
  },
  computed: {
    ...mapState({
      placeList: state => state.data.placeList
    })
  },
  watch: {
    isOpen(val) {
      this.isFormDialog = val;
    },
    isFormDialog(val) {
      if (val) {
        // 在下次 DOM 更新循环结束之后执行延迟回调
        this.$nextTick(() => {
          this.initMap();
          console.log('range', this.data)
          this.cMapPointArr = this.data;
          // 初始化多边形顶点数据
          for(let i = 0; i < this.data.length; i++) {
            let point = this.data[i];
            this._onDraw(point);
          }
        });
      }else {
        this.locationDetailAddr = '';
        this.cMap && this.cMap.remove();
      }
      this.$emit("update:isOpen", val);
    }
  },
  methods: {
    /**
     * 初始化地图
     */
    initMap() {
      const mapElement = this.$refs.regionMap;
      this.cMap = createMap(mapElement, true);
      // 创建图层容器
      this.layerGroup = L.layerGroup([]).addTo(this.cMap);
      // 创建多边形
      this.polygon = L.polygon([]);
      this.layerGroup.addLayer(this.polygon);
    },

    /**
     * 设置可绘制多边形
     */
    setDrawPolygon() {
      this.cMap.on('click', (e) => {
        const p = e.latlng;
        this._onDraw([p.lng, p.lat], true);
      });
    },
    _onDraw(point, add) {
      if (add) this.cMapPointArr.push(point);
      this.polygon.addLatLng(point.reverse());
      let circle = L.circle(point.reverse(), {
        radius: 80,
        weight: 2,
        color: 'gray',
      });
      this.layerGroup.addLayer(circle);
    },

    /**
     * 绘制多边形
     */
    onCustomDraw(mode) {
      if (mode) {
        this.cMap.off('click');
      }else {
        this.setDrawPolygon();
      }
      this.isEditMap = !mode;
    },
    placeSearch(txt, cb) {
      let places = [];
      this.placeList.forEach(item => {
        if (item.value.indexOf(txt) != -1) {
          places.push(item);
        }
      });
      cb(places);
    },
    onAutoSelect(val) {
      const { lng, lat } = val;
      // 设置中心点
      if (lng && lat) {
        this.cMap.setView(L.latLng(lat, lng));
      }
    },
    onMapUpdate() {
      if (this.isEditMap) {
        this.$notify({
          title: "提示",
          message: `请先结束绘制`,
          type: "warning",
          duration: 2000
        });
        return;
      }
      if (this.cMapPointArr.length < 3) {
        this.$notify({
          title: "提示",
          message: `请绘制区域`,
          type: "warning",
          duration: 2000
        });
        return;
      }
      this.$emit("complete", this.cMapPointArr.slice());
      this.isFormDialog = false;
    },
    
    /**
     * 清空覆盖物
     */
    onEmptyPolygon() {
      this.layerGroup.clearLayers();
      this.polygon.setLatLngs([]);
      this.layerGroup.addLayer(this.polygon);
      this.cMapPointArr = [];
    }
  }
};
</script>
<style lang="scss" scoped>
.map-layer {
  .header {
    height: 46px;
    line-height: 46px;
    padding: 0 10px;
  }
  .el-autocomplete {
    float: right;
    width: 280px;
  }
  .map-inner {
    width: 100%;
    height: calc(100vh - 246px);
    max-height: 450px;
  }
  .dialog-footer {
    margin-top: 20px;
  }
}
</style>
