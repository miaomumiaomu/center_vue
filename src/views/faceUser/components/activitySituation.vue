<template>
  <div class="activity-situation">
    <div style="color: #9dbde7">最新活动情况：{{newStatus}}</div>
    <div class="map-bar">
      <div ref="map" class="map"></div>
      <div class="content">
        <div class="title">落脚点&轨迹</div>
        <div class="check">
          <el-checkbox-group class="checkbox" v-model="checkList">
            <el-checkbox label="轨迹时间"></el-checkbox>
            <el-radio-group v-model="trackTime"  size="small" style="margin-right: 20px;">
              <el-radio-button v-for="(item, index) in trackDate" :label="item" :key="index">{{item}}</el-radio-button>
            </el-radio-group>
            <el-checkbox label="落脚点时间"></el-checkbox>
            <el-radio-group v-model="footTime" size="small">
              <el-radio-button v-for="(item, index) in footDate" :label="item" :key="index">{{item}}</el-radio-button>
            </el-radio-group>
          </el-checkbox-group>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { getFootholdList, getFootholdDetails } from "@/api/foothold";
import { getTrajectoryList, getPersonnelList } from "@/api/faceTrackAnalysis";
import { createMap } from "@/utils/";
import { getPersonInfo, getPersonAddrInfo } from "@/api/faceUser/faceInfo";
import lmyMapTrajectory from "@/utils/lmyMapTrajectory.js";
export default {
  data() {
    return {
      newStatus: '无',//最新活动情况
      currentUser: null,
      footListQuery: {
        personIds: null,
        beginTime: this.moment().subtract(7, "d").format("YYYYMMDDHHmmss"),
        endTime: this.moment().format("YYYYMMDDHHmmss")
      },
      trackListQuery: {
        _filter_in_personIds: null,
        _filter_ge_stayTimeBegin_date: this.moment().subtract(1, "d").format("YYYYMMDDHHmmss"),
        _filter_le_stayTimeEnd_date: this.moment().format("YYYYMMDDHHmmss")
      },
      isPictureDialog: false,
      cMap: null,
      markerId: null,
      detailsData: null,
      markerList: [],
      heatmapData: [],
      checkList: ['轨迹时间', '落脚点时间'],
      trackDate: ['今日', '近七日', '近一个月'],
      footDate: ['近七日', '近一个月', '近六个月'],
      trackTime: '今日',
      footTime: '近七日',
      map: {
        markerIndex: null,
        pointList: [], // 点坐标数组
        markerList: [], // 点图标数组
        imgList: [
          require("@/assets/face-track-analysis/icon-maker-img1.png"),
          require("@/assets/face-track-analysis/icon-maker-img2.png")
        ]
      },
      trackListData: []
    }
  },
  props: {
    personId: [Number, String]
  },
  computed: {
    heatmapMax() {
      if (this.heatmapData.length) {
        return Math.max(...this.heatmapData.map(item => item.count));
      } else {
        return 0;
      }
    }
  },
  watch: {
    trackTime(val) {
      this.drawtrack()
    },
    footTime(val) {
      this.drawFoot()
    },
    checkList(val, oldVal) {
      let isAdd = null //是否是新增
      let arr = [] 
      if (val.length > oldVal.length) {
        isAdd = true
        arr = val.filter(item => !oldVal.includes(item))
      } else {
        isAdd = false
        arr = oldVal.filter(item => !val.includes(item))
      }
      if (isAdd) {
        arr.forEach(item => {
          if (item === '轨迹时间') {
            this.drawtrack()
          } else {
            this.drawFoot()
          }
        })
      } else {
        arr.forEach(item => {
          if (item === '轨迹时间') {
            this.markerRemove(this.map.markerList)
            this.canvasTrajectory.empty();
            this.map.pointList = []
          } else {
            this.markerRemove(this.markerList)
          }
        })
      }
    }
  },
  methods: {
    initMap() {
      const mapElement = this.$refs.map;
      this.cMap = createMap(mapElement, false);
      // 定义上层轨迹canvas
      this.canvasTrajectory = new lmyMapTrajectory();
      this.addCanvas(this.canvasTrajectory.canvas);
    },
    createHeatmap() {
      var popupElement = this.$refs.mapLayer;
      this.markerRemove(this.markerList)
      this.markerList = [];
      this.heatmapData.forEach(item => {
        let size = 20;
        let radius = size + (item.count / this.heatmapMax) * size;
        let fillOpacity = item.count / this.heatmapMax < 0.6 ? 0.6 : item.count / this.heatmapMax;
        let circle = L.circle([item.lat, item.lng], { color: "red", stroke: false, fillColor: "#f03", fillOpacity, radius }).addTo(this.cMap);
        this.markerList.push(circle);
      });
      // 监听弹层关闭事件
      this.cMap.on("popupclose", () => {
        this.detailsData = null;
      });
      // 重新定位中心坐标
      if (this.heatmapData.length) {
        let group = L.featureGroup(this.markerList);
        this.cMap.fitBounds(group.getBounds());
      }
    },
    JumpQuery() {
      this.onSubmit()
    },
    onSubmit() {
      // 清理地图
      this.cMap && this.cMap.remove();
      this.initMap();
      // 绘制落脚点
      this.drawFoot()
      //绘制轨迹
      this.drawtrack()
    },
    // 添加轨迹层
    addCanvas(canvas) {
      this.cMap._panes.overlayPane.appendChild(canvas);
      this.cMap.on('moveend', () => this._reset(canvas));
      this.cMap.on('zoomstart', () => this._resize(canvas));
      this._reset(canvas);
    },
    _resize(canvas) {
      // 清空地图
      canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
      this.isPlay = false;
    },
    _reset(canvas) {
      let topLeft = this.cMap.containerPointToLayerPoint([0, 0]);
      L.DomUtil.setPosition(canvas, topLeft);
      this.isPlay = false;
      this._redraw();
    },
    _redraw: function () {
      let size = this.cMap.getSize();
      let bounds = this.cMap.getBounds();
      let zoomScale = (size.x * 180) / (20037508.34 * (bounds.getEast() - bounds.getWest()));
      let zoom = this.cMap.getZoom();
      // 刷新画布
      this.drawTrajectory();
    },
    updateMap() {
      const canvas = this.canvasTrajectory.canvas;
      // 清空地图
      canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
      // 清空标记物
      L.DomUtil.empty(document.querySelector('.leaflet-marker-pane'));
      // 清空处理
      this.map.pointList = [];
      this.map.markerList = [];
      this.map.markerIndex = null;
      // 循环用户轨迹
      this.trackListData.forEach((item, index) => {
        if (item.lat && item.lng) {
          let _point = L.latLng(item.lat, item.lng);
          _point.id = item.id;

          // 添加点
          this.map.pointList.push(_point);
          this.map.markerList.push(this.addMarker(_point, index, item.id));
        }
      });

      // 重新定位中心点
      if (this.trackListData.length) {
        let group = L.featureGroup(this.map.markerList);
        this.cMap.fitBounds(group.getBounds());
      }
    },
    /**
     * 添加轨迹点
     */
    addMarker(point, index, id) {
      let _marker = L.marker(point, { icon: this._customIcon('img2', index), zIndexOffset: index }).addTo(this.cMap);
      _marker.id = id;
      _marker.index = index;
      return _marker;
    },
    // 自定义标志图标
    _customIcon(name, index) {
      let customIcon = L.divIcon({
        iconSize: L.point(0, 0),
        html: `<div class="custom-marker-icon"><img src="${require('@/assets/face-track-analysis/icon-maker-' + name + '.png')}" />${index + 1}</div>`,
        iconAnchor: [15, 44]
      });
      return customIcon;
    },
    // 绘制轨迹
    drawTrajectory(index) {
      this.canvasTrajectory.empty();
      if (index < 1) {
        return;
      }
      if (this.map.pointList.length > 1) {
        let _data = this.map.pointList.map(item =>
          this.cMap.latLngToContainerPoint(item)
        );
        let end = index || _data.length - 1;
        let animateStart = index ? index - 1 : _data.length - 1;

        this.canvasTrajectory.initData(
          Object.assign(this.cMap.getSize(), {
            pathList: _data
          }),
          0,
          end,
          this.isPlay ? animateStart : end
        );
      }
    },
    
    //绘制轨迹
    drawtrack() {
      this.trackListQuery._filter_in_personIds = this.personId
      this.getStartTime(this.trackListQuery, '_filter_ge_stayTimeBegin_date', this.trackTime)
      getTrajectoryList(this.trackListQuery).then(res => {
        if (res.status == 200) {
          this.trackListData = res.data || []
          this.cMap.closePopup();
          this.updateMap()
        }
      })
    },
    //绘制落脚点
    drawFoot() {
      this.footListQuery.personIds = [this.personId]
      this.getStartTime(this.footListQuery, 'beginTime', this.footTime)
      getFootholdList(this.footListQuery).then(res => {
        if (res.status == 200) {
          this.heatmapData = res.data;
          this.$nextTick(() => {
            this.createHeatmap();
          })
        }
      });
    },
    markerRemove(arr) {
      arr.forEach(item => {
        this.cMap.removeLayer(item)
      })
    },
    //获取落脚点、轨迹的开始时间
    getStartTime(obj, key, val) {
      switch (val) {
        case '今日':
          let time = this.moment().format("YYYYMMDD")
          obj[key] = time + '000000'
          break;
        case '近七日':
          obj[key] = this.moment().subtract(7, "d").format("YYYYMMDDHHmmss")
          break
        case '近一个月':
          obj[key] = this.moment().subtract(1, "M").format("YYYYMMDDHHmmss")
          break
        case '近六个月':
          obj[key] = this.moment().subtract(6, "M").format("YYYYMMDDHHmmss")
          break
        default:
          break;
      }
    }

  },
  mounted() {
    this.$nextTick(() => {
      this.JumpQuery()
    })
  },
  created() {
    getPersonAddrInfo(this.personId).then(res => {
      this.newStatus = res.data.address
    })
  },
  activated() {
    this.JumpQuery()
  },
}
</script>
<style lang="scss">
.activity-situation{
  height: 100%;
  display: flex;
  flex-direction: column;
  .map-bar{
    flex: 1;
    position: relative;
    .map{
      width: 100%;
      height: 100%;
      .custom-marker-icon {
      position: relative;
      width: 30px;
      height: 44px;
      line-height: 30px;
      text-align: center;
      font-size: 16px;
      color: #fff;
      img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
      }
    }
    }
    .content{
      position: absolute;
      width: 100%;
      top: 0;
      left: 0;
      z-index: 1000;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      .title{
        margin: 10px;
        font-weight: bold;
      }
      .checkbox{
        display: flex;
        align-items: center;
        padding: 10px;
      }
    }
  }
}
</style>
