<template>
  <div class="map-main">
    <!-- 地图 -->
    <div id="map" ref="map" class="map"></div>

    <!-- 地图弹窗 -->
    <div class="map-layer" ref="mapLayer">
      <template v-if="listData[map.markerIndex]">
        <div class="title">人脸轨迹详情</div>
        <div class="head">
          <p>人员姓名：
            <span>
              <em>{{listData[map.markerIndex].personName}}</em>（{{listData[map.markerIndex].identityNo}}）</span>
          </p>
          <p>抓拍地点：
            <span>{{listData[map.markerIndex].address}}</span>
          </p>
          <p>驻留时间：
            <label>{{listData[map.markerIndex].stayTimeBegin + ' - ' + listData[map.markerIndex].stayTimeEnd}}</label>
          </p>
        </div>
        <div class="pic-list">
          <div class="swiper-box">
            <swiper ref="swiper" :options="swiperOption">
              <swiper-slide v-for="(item,index) in detailsData" :key="index">
                <div class="pic-box">
                  <img v-if="item.bgImgPath" :src="item.bgImgPath" class="bg" @click="onLookPicture(item)" />
                  <div v-else class="none">暂无背景</div>
                  <img :src="item.snapImgPath" class="pic"></div>
                <div class="time">抓拍时间：{{item.collectTime}}</div>
                <div class="similarity">
                  <label>相似度：{{Math.floor(item.similarity * 10000) / 100}}%</label>
                </div>
              </swiper-slide>
            </swiper>
            <div class="swiper-pagination" slot="pagination"></div>
            <div class="swiper-button-prev swiper-button-white" slot="button-prev"></div>
            <div class="swiper-button-next swiper-button-white" slot="button-next"></div>
          </div>
        </div>
      </template>
    </div>

    <!-- 图片弹窗 -->
    <picture-viewer :isOpen.sync="isBgDialog" :bgImgInfo="bgImgInfo" />
  </div>
</template>

<script>
import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import lmyMapTrajectory from "@/utils/lmyMapTrajectory.js";
import { getTrajectoryDetails } from "@/api/faceTrackAnalysis";
import { createMap } from "@/utils/";

export default {
  components: {
    swiper,
    swiperSlide
  },
  props: {
    play: {
      required: true,
      type: Boolean
    },
    listQuery: Object,
    currentUser: Object,
    listData: {
      required: true,
      type: [Array]
    },
    index: {
      required: true,
      type: [Number]
    }
  },
  data() {
    return {
      map: {
        markerIndex: null,
        pointList: [], // 点坐标数组
        markerList: [], // 点图标数组
        imgList: [
          require("@/assets/face-track-analysis/icon-maker-img1.png"),
          require("@/assets/face-track-analysis/icon-maker-img2.png")
        ]
      },
      cMap: null,
      isInit: true,
      isPlay: false,
      canvasTrajectory: null,
      detailsData: null,

      swiperOption: {
        pagination: {
          el: '.swiper-pagination',
          type: 'fraction'
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        }
      },

      isBgDialog: false, // 控制背景图显示
      bgImgInfo: {}
    };
  },
  watch: {
    play(val) {
      this.isPlay = val;
    },
    isPlay(val) {
      this.$emit("update:play", val);
    },
    listData() {
      this.isInit = true;
      // 开始分析按钮触发轨迹的绘制
      this.cMap.closePopup();
      this.updateMap();
    },
    index() {
      if (this.isInit) {
        this.isInit = false;
        return;
      }
      this.updatePoint();
    }
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      // 地图调用开始
      const mapElement = this.$refs.map;
      this.cMap = createMap(mapElement, false);
      // 定义上层轨迹canvas
      this.canvasTrajectory = new lmyMapTrajectory();
      this.addCanvas(this.canvasTrajectory.canvas);
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
      this.listData.forEach((item, index) => {
        if (item.lat && item.lng) {
          let _point = L.latLng(item.lat, item.lng);
          _point.id = item.id;

          // 添加点
          this.map.pointList.push(_point);
          this.map.markerList.push(this.addMarker(_point, index, item.id));
        }
      });

      // 重新定位中心点
      if (this.listData.length) {
        let group = L.featureGroup(this.map.markerList);
        this.cMap.fitBounds(group.getBounds());
      }
    },
    updatePoint() {
      // 清空相邻数组
      // 更新轨迹
      this.drawTrajectory(this.index > this.map.pointList.length - 1 ? this.map.pointList.length - 1 : this.index);
      // 显示隐藏对应点
      this.map.markerList.forEach(item => {
        if (item.index <= this.index) {
          item.setOpacity(1);
        } else {
          item.setOpacity(0);
        }
      });
    },
    /**
     * 添加轨迹点
     */
    addMarker(point, index, id) {
      let _marker = L.marker(point, { icon: this._customIcon('img2', index), zIndexOffset: index }).addTo(this.cMap);
      _marker.bindPopup(this.$refs.mapLayer, { maxWidth: 450, offset: L.point(0, -38), autoPan: false });
      let that = this;
      _marker.on('popupopen', function () {
        that.map.markerIndex = index;
        let data = that.listData[index];
        that.detailsData = null;
        // 标志物置顶处理
        that.map.markerList.forEach((item, i) => {
          item.setIcon(that._customIcon('img2', i))
          item.setZIndexOffset(0);
        });
        this.setZIndexOffset(5);
        this.setIcon(that._customIcon('img1', index));
        getTrajectoryDetails({
          _filter_eq_locationId: data.id
        }).then(res => {
          if (res.status === 200) {
            that.detailsData = res.data;
          }
        });
      })
      _marker.id = id;
      _marker.index = index;
      return _marker;
    },
    // 点击轨迹获取详情
    async onClickMarker(item) {
      // 偏移量
      const y = 180;
      const p1 = this.cMap.layerPointToLatLng(L.point(0, 0));
      const p2 = this.cMap.layerPointToLatLng(L.point(0, y));
      const offset = p2.lat - p1.lat;
      this.cMap.setView(L.latLng(item.lat - offset, item.lng));
      let _marker = this.map.markerList[item.index];
      _marker.openPopup();
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

    // 查看背景大图
    onLookPicture(data) {
      const { bgImgPath, snapImgPath, similarity = 0 } = data;
      const { identityImgPath } = this.currentUser;
      this.bgImgInfo = {
        rowBgImg: bgImgPath,
        snapImgPath,
        identityImgPath,
        similarity: Math.floor(similarity * 100)
      };
      this.isBgDialog = true;
    },
  }
};
</script>

<style lang="scss" scoped>
*/deep/ {
  .leaflet-popup-content {
    margin: 0;
  }
  .leaflet-container a.leaflet-popup-close-button {
    top: 4px;
    right: 4px;
  }
}
</style>
