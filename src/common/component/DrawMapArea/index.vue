<template>
  <div class="map-container">
    <div class="map-area" ref="map"></div>
    <div class="opt-group">
      <ul>
        <li @click="_onMapMove">
          <svg-icon class-name="opt-icon" icon-class="hand"/>
          <span>移动</span>
        </li>
        <li @click="_onMapRect">
          <svg-icon class-name="opt-icon" icon-class="rect"/>
          <span>矩形</span>
        </li>
        <li @click="_onMapCircle">
          <svg-icon class-name="opt-icon" icon-class="circle"/>
          <span>圆形</span>
        </li>
        <li @click="_onMapPoly">
          <svg-icon class-name="opt-icon" icon-class="polygon"/>
          <span>多边形</span>
        </li>
      </ul>
    </div>
    <div class="extend-btn-group">
      <div><el-button size="mini" type="info" plain @click="_onMapMove" icon="el-icon-edit-outline">完成</el-button></div>
      <div><el-button size="mini" type="info" plain @click="_onCheckAll" icon="el-icon-circle-check-outline">全选</el-button></div>
      <div><el-button size="mini" type="info" plain @click="_onClearUp" icon="el-icon-delete">清空</el-button></div>
    </div>
  </div>
</template>

<script>
import { createMap } from "@/utils";

export default {
  model: {
    event: "change"
  },
  props: {
    mapInitFlag: {
      type: Boolean,
      default: false
    },
    // 布控设备列表
    cameraList: {
      type: Array,
      default: () => []
    },
    // 圆形信息及区域内的设备
    circleData: {
      type: Array,
      default: () => []
    },
    // 多边形信息及区域内的设备
    polygonData: {
      type: Array,
      default: () => []
    },
    // 外围散点列表
    deviceIds: {
      type: Array,
      default: () => []
    }
  },
  mounted() {
    if (!this.cMap) {
      this.$nextTick(() => {
        this.initMap();
      });
    }
  },
  data() {
    return {
      cMap: null,
      cameraLayer: {},
      circleAreas: [],
      polygonAreas: [],
      outsideIds: [],
      grayIcon: '/static/leaflet/images/marker-gray.png',
      greenIcon: '/static/leaflet/images/marker-green.png',
      shadowIcon: '/static/leaflet/images/marker-shadow.png'
    };
  },
  watch: {
    mapInitFlag(val) {
      val ? this.initData() : this._onClearUp();
    },
    circleData(val) {
      this.circleAreas = val;
    },
    polygonData(val) {
      this.polygonAreas = val;
    },
    deviceIds(val) {
      this.outsideIds = val;
    }
  },
  methods: {
    initMap() {
      const mapElement = this.$refs.map;
      this.cMap = createMap(mapElement, false);
      this.cameraLayer = L.layerGroup().addTo(this.cMap);
      this.layerGroup = L.layerGroup().addTo(this.cMap);
    },
    initData() {
      // 初始化形状区域
      const group = this.layerGroup;
      let shape = null;
      let markers = [];
      if (this.circleData.length === 1) {
        let circle = this.circleData[0];
        shape = L.circle(L.latLng(circle.center), { radius: circle.radius, color: "#ff0000" });
        markers = circle.ids || [];
      }
      if (this.polygonData.length === 1) {
        let polygon = this.polygonData[0];
        const shapePoints = polygon.coordinates || [];
        if (shapePoints.length == 2) {
          // 矩形
          const bounds = [[shapePoints[0].lat, shapePoints[0].lng], [shapePoints[1].lat, shapePoints[1].lng]];
          shape = L.rectangle(bounds, {
            color: "#ff0000",
            fillOpacity: 0.1
          });
        } else {
          // 多边形
          shape = L.polygon([], { color: "#ff0000", fillOpacity: 0.1 });
          shapePoints.forEach(item => {
            shape.addLatLng(item);
          });
        }
        markers = polygon.ids || [];
      }
      shape && group.addLayer(shape);

      // 往地图添加所有标记点
      const highLightPoints = this.deviceIds.concat(markers);
      this.cameraList.map(item => {
        let _point = L.latLng(item.lat, item.lng);
        _point.id = item.id;
        let icon = null;
        if (highLightPoints.includes(item.id)) {
          icon = L.icon({ iconUrl: this.greenIcon, iconSize: [26, 40], iconAnchor: [13, 40], shadowUrl: this.shadowIcon });
        } else {
          icon = L.icon({ iconUrl: this.grayIcon, iconSize: [26, 40], iconAnchor: [13, 40], shadowUrl: this.shadowIcon });
        }
        let marker = L.marker(_point, { icon }).bindTooltip(item.name).addTo(this.cameraLayer);
        // 监听标记点击事件
        marker.on('click', e => {
          const m = e.target || {};
          const { id } = m._latlng;
          this.handlePointHighlight(m, id);
          this.$emit('changeArea', this.circleAreas, this.polygonAreas, this.outsideIds);
        });
      });
    },
    // 点亮标记点操作
    handlePointHighlight(marker, id) {
      let innerIds = [];
      if (this.circleAreas.length === 1) {
        let temp = this.circleAreas[0].ids;
        temp && (innerIds = temp);
      }
      if (this.polygonAreas.length === 1) {
        let temp = this.polygonAreas[0].ids;
        temp && (innerIds = temp);
      }
      if (!innerIds.includes(id)) {
        let outsideIdList = this.outsideIds.slice();
        if (outsideIdList.includes(id)) {
          // 点暗操作
          marker.setIcon(L.icon({
            iconUrl: this.grayIcon,
            shadowUrl: this.shadowIcon
          }));
          outsideIdList.splice(outsideIdList.indexOf(id), 1);
        } else {
          // 点亮操作
          marker.setIcon(L.icon({
            iconUrl: this.greenIcon,
            shadowUrl: this.shadowIcon
          }));
          outsideIdList.push(id);
        }
        this.outsideIds = outsideIdList;
      }
    },
    // 全选功能
    _onCheckAll() {
      const outsideIdList = [];
      let ids = [];
      this.circleAreas.length > 0 && (ids = this.circleAreas[0].ids);
      this.polygonAreas.length > 0 && (ids = this.polygonAreas[0].ids);
      const pointGroup = this.cameraLayer.getLayers();
      for (let key in pointGroup) {
        const marker = pointGroup[key];
        const point = marker.getLatLng();
        const id = point.id;
        marker.setIcon(L.icon({
          iconUrl: this.greenIcon,
          shadowUrl: this.shadowIcon
        }));
        if (!ids.includes(id)) outsideIdList.push(id);
      }
      this.outsideIds = outsideIdList;
      this.$emit('changeArea', this.circleAreas, this.polygonAreas, this.outsideIds);
    },
    // 清空功能
    _onClearUp() {
      const pointGroup = this.cameraLayer.getLayers();
      const group = this.layerGroup;
      group.clearLayers();
      for (let key in pointGroup) {
        const marker = pointGroup[key];
        marker.setIcon(L.icon({
          iconUrl: this.grayIcon,
          shadowUrl: this.shadowIcon
        }));
      }
      this.circleAreas = [];
      this.polygonAreas = [];
      this.outsideIds = [];
      this.$emit('changeArea', this.circleAreas, this.polygonAreas, this.outsideIds);
    },
    _onRemoveMapEvent() {
      const map = this.cMap;
      map.off("mousedown");
      map.off("mousemove");
      map.off("mouseup");
    },
    _onMapMove() {
      const map = this.cMap;
      this._onRemoveMapEvent();
      map.dragging.enable();
    },
    // 绘制矩形
    _onMapRect() {
      const map = this.cMap;
      const group = this.layerGroup;
      let startP = null;
      let bounds = null;
      this._onRemoveMapEvent();
      map.dragging.disable();
      map.on("mousedown", e => (startP = e.latlng));
      map.on("mousemove", e => {
        if (startP) {
          bounds = L.latLngBounds(startP, e.latlng);
          let tempRect = L.rectangle(bounds, {
            color: "#ff0000",
            fillOpacity: 0.1
          });
          group.clearLayers();
          group.addLayer(tempRect);
        }
      });
      map.on("mouseup", e => {
        if (bounds) {
          const p1 = bounds.getNorthWest();
          const p2 = bounds.getSouthEast();
          // 处理所有需要点亮的标记
          const ids = this._onDrawPublic('rect', { bounds });
          // 清空圆形信息
          this.circleAreas = [];
          // 存储矩形信息
          this.polygonAreas = [{
            coordinates: [
              { lat: p1.lat, lng: p1.lng },
              { lat: p2.lat, lng: p2.lng }
            ],
            ids: Array.from(ids)
          }];
        }
        startP = null;
        bounds = null;
        this.$emit('changeArea', this.circleAreas, this.polygonAreas, this.outsideIds);
      });
    },
    // 绘制圆形
    _onMapCircle() {
      const map = this.cMap;
      const group = this.layerGroup;
      let center = null;
      let radius = 0;
      let startP = null;
      let tempCircle = new L.circle();
      this._onRemoveMapEvent();
      map.dragging.disable();
      map.on("mousedown", e => (startP = e.latlng));
      map.on("mousemove", e => {
        if (startP) {
          let startPixel = map.latLngToLayerPoint(startP);
          let point = map.latLngToLayerPoint(e.latlng);
          let xAxis = point.x - startPixel.x;
          let yAxis = point.y - startPixel.y;
          // 像素直径
          let d = Number(Math.min(xAxis, yAxis).toFixed(2));
          let endP = map.layerPointToLatLng(
            L.point(startPixel.x + d, startPixel.y + d)
          );
          let bounds = L.latLngBounds(startP, endP);
          // 圆心
          center = bounds.getCenter();
          // 经度
          let longitude = (bounds.getEast() + bounds.getWest()) / 2;
          // 地理坐标半径
          radius = map.distance(
            L.latLng(bounds.getNorth(), longitude),
            L.latLng(bounds.getSouth(), longitude)
          );
          tempCircle.setLatLng(center);
          tempCircle.setRadius(Math.abs(radius));
          tempCircle.setStyle({
            color: "#ff0000",
            fillOpacity: 0.1
          });
          group.clearLayers();
          group.addLayer(tempCircle);
        }
      });
      map.on("mouseup", () => {
        if (center) {
          // 处理所有需要点亮的标记
          const ids = this._onDrawPublic('circle', { center, radius });
          // 清空多边形信息
          this.polygonAreas = [];
          // 存储圆形信息
          this.circleAreas = [{
            center: { lat: center.lat, lng: center.lng },
            radius,
            ids: Array.from(ids)
          }];
        }
        startP = null;
        radius = 0;
        center = null;
        this.$emit('changeArea', this.circleAreas, this.polygonAreas, this.outsideIds);
      });
    },
    // 绘制多边形
    _onMapPoly() {
      const map = this.cMap;
      const group = this.layerGroup;
      let polygon = L.polygon([], { color: "#ff0000", fillOpacity: 0.1 });
      this._onRemoveMapEvent();
      map.dragging.disable();
      map.on("mousedown", e => {
        polygon.addLatLng(e.latlng);
        group.clearLayers();
        group.addLayer(polygon);
        // 处理所有需要点亮的标记
        const ids = this._onDrawPublic('poly', { polygon });
        // 清空圆形信息
        this.circleAreas = [];
        // 存储多边形信息
        const polyLayer = group.getLayers()[0];
        const pointList = polyLayer.getLatLngs()[0] || [];
        const coordinates = pointList.map(item => {
          let { lat, lng } = item;
          return { lat, lng };
        });
        this.polygonAreas = [{
          coordinates,
          ids: Array.from(ids)
        }];
        this.$emit('changeArea', this.circleAreas, this.polygonAreas, this.outsideIds);
      });
    },
    // 提取绘制图形公共代码
    _onDrawPublic(shape, options) {
      const pointGroup = this.cameraLayer.getLayers();
      let ids = new Set();
      let outsideIdList = this.outsideIds.slice();
      let judgeBoundary = null;
      let params = [];
      switch(shape) {
        case 'rect':
          judgeBoundary = this.pointInsideRect;
          break;
        case 'circle':
          judgeBoundary = this.pointInsideCircle;
          break;
        case 'poly':
          judgeBoundary = this.pointInsidePolygon;
          break;
      }
      // 遍历地图上所有的标记点
      for(let key in pointGroup) {
        const marker = pointGroup[key];
        const point = marker.getLatLng();
        const id = point.id;
        marker.setIcon(L.icon({
          iconUrl: this.grayIcon,
          shadowUrl: this.shadowIcon
        }));
        if (judgeBoundary({ marker, point, ...options })) {
          marker.setIcon(L.icon({
            iconUrl: this.greenIcon,
            shadowUrl: this.shadowIcon
          }));
          // 判断外围数组中是否需要清除
          if (outsideIdList.includes(id)) {
            outsideIdList.splice(outsideIdList.indexOf(id), 1);
          }
          ids.add(id);
        } else {
          if (outsideIdList.includes(id)) {
            marker.setIcon(L.icon({
              iconUrl: this.greenIcon,
              shadowUrl: this.shadowIcon
            }));
          }
        }
      }
      // 更新外围点信息
      this.outsideIds = outsideIdList;
      return ids;
    },
    // 判断点是否在矩形内部
    pointInsideRect(params) {
      const { bounds, point } = params;
      return bounds.contains(point);
    },
    // 判断点是否在圆形内部
    pointInsideCircle(params) {
      const { point, center, radius } = params;
      if (radius === 0) return false;
      let dis = this.cMap.distance(point, center);
      return dis <= radius;
    },
    // 判断点是否在多边形内部
    pointInsidePolygon(params) {
      const { marker, polygon } = params;
      const polyPoints = polygon.getLatLngs()[0];  
      let x = marker.getLatLng().lng, y = marker.getLatLng().lat;
      let inside = false;
      for (let i = 0, j = polyPoints.length - 1; i < polyPoints.length; j = i++) {
        let xi = polyPoints[i].lng, yi = polyPoints[i].lat;
        let xj = polyPoints[j].lng, yj = polyPoints[j].lat;
        let intersect = ((yi > y) != (yj > y))
          && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
      }
      return inside;
    }
  }
};
</script>

<style lang="scss" scoped>
.map-container {
  width: 100%;
  position: relative;
  .opt-group {
    position: absolute;
    right: 10px;
    top: 10px;
    background-color: rgba($color: #000000, $alpha: 0.5);
    z-index: 888;
    ul {
      padding: 6px 0;
      cursor: default;
      li {
        margin-bottom: 4px;
        padding: 0 6px;
        font-size: 15px;
        color: #fff;
        .opt-icon {
          width: 15px;
        }
      }
      li:last-of-type {
        margin-bottom: 0;
      }
      li:hover {
        background-color: #5dade2;
      }
    }
  }
}
.map-area {
  width: 100%;
  height: 500px;
}
.extend-btn-group {
  width: 76px;
  position: absolute;
  right: 10px;
  top: 110px;
  z-index: 888;
  overflow: hidden;
  .el-button {
    width: 74px;
    margin-bottom: 6px;
  }
}
</style>
