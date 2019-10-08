<template>
  <div class="preview-container app-container">
    <div class="main">
      <div class="left-content">
        <div class="card-panel">
          <div class="card">
            <div class="card-inner">
              <div class="top">
                <strong>案件专栏</strong>
                <img src="@/assets/preview/statistics-case.png" alt="">
              </div>
              <div class="row">
                <span>未处理</span>
                <b>{{ policesStatis.legalCaseUnHandleCnt || 0 }}</b>
              </div>
              <div class="row">
                <span>今日新增</span>
                <p>{{ policesStatis.legalCaseTodayNewCnt || 0 }}</p>
              </div>
            </div>
          </div>
          <div class="card">
            <div class="card-inner">
              <div class="top">
                <strong>敏感警情</strong>
                <img src="@/assets/preview/statistics-sensitiveCase.png" alt="">
              </div>
              <div class="row">
                <span>未处理</span>
                <b>{{ policesStatis.sensitiveCaseUnHandleCnt || 0 }}</b>
              </div>
              <div class="row">
                <span>今日新增</span>
                <p>{{ policesStatis.sensitiveCaseTodayNewCnt || 0 }}</p>
              </div>
            </div>
          </div>
          <div class="card">
            <div class="card-inner">
              <div class="top">
                <strong>矛盾纠纷</strong>
                <img src="@/assets/preview/statistics-disputes.png" alt="">
              </div>
              <div class="row">
                <span>未处理</span>
                <b>{{ policesStatis.disputeCaseUnHandleCnt || 0 }}</b>
              </div>
              <div class="row">
                <span>今日新增</span>
                <p>{{ policesStatis.disputeCaseTodayNewCnt || 0 }}</p>
              </div>
            </div>
          </div>
          <div class="card">
            <div class="card-inner">
              <div class="top">
                <strong>其他警情</strong>
                <img src="@/assets/preview/statistics-other.png" alt="">
              </div>
              <div class="row">
                <span>未处理</span>
                <b>{{ policesStatis.otherCaseUnHandleCnt || 0 }}</b>
              </div>
              <div class="row">
                <span>今日新增</span>
                <p>{{ policesStatis.otherCaseTodayNewCnt || 0 }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="line-chart">
          <div class="section-header">
            <div style="display: flex">
              <img src="@/assets/views-center/tag.png" alt="">
              <span>近7天警情统计</span>
            </div>
          </div>
          <div class="section-content">
            <LeftLineCharts :data="lineData"/>
          </div>
        </div>
      </div>
      <div class="separator"></div>
      <div class="right-content" ref="right">
        <div class="map-box">
          <!-- 地图 -->
          <div id="map" ref="map" />
          <div v-for="(cameraItem,index) in markerData" :key="'mapCamera' + index" :id="'mapCamera' + cameraItem.type + cameraItem.id">
            <template v-if="cameraItem.lng && cameraItem.lat && cameraItem.id === deviceId">
              <control-list :monitorData="controlData" :category="category" @scroll-bottom="_onAlarmsLoadMore"/>
            </template>
          </div>
          <!-- 右侧悬浮弹框 -->
          <div class="right-box">
            <div class="alarm-box">
              <div class="header statis-padding">
                <img src="@/assets/views-center/tag.png" alt="">
                <span>预警统计</span>
              </div>
              <right-charts />
            </div>
            <div class="control-box">
              <div class="header mine-padding">
                <img src="@/assets/views-center/tag.png" alt="">
                <span>我的布控</span>
              </div>
              <div class="control-info">
                <div>
                  <div class="circle"></div>
                  <span class="section-header">人脸布控</span>
                </div>
                <ul>
                  <li>
                    <span class="row-name">布控任务</span>
                    <span class="number">
                      <iCountUp :startVal="0" :endVal="faceInfoData.monitorOnCnt || 0" :decimals="0" :duration="2" :options="countUpOptions" />
                    </span>
                    <!-- <span class="row-name">撤控</span>
                    <span class="number">
                      <iCountUp :startVal="0" :endVal="faceInfoData.monitorOffCnt || 0" :decimals="0" :duration="2" :options="countUpOptions" />
                    </span> -->
                  </li>
                  <li>
                    <span class="row-name">预警未处理</span>
                    <span class="warn">
                      <iCountUp :startVal="0" :endVal="faceInfoData.unHandleCnt || 0" :decimals="0" :duration="2" :options="countUpOptions" />
                    </span>
                  </li>
                  <li>
                    <span class="row-name">今日预警</span>
                    <span class="warn">
                      <iCountUp :startVal="0" :endVal="faceInfoData.todayAlarmCnt || 0" :decimals="0" :duration="2" :options="countUpOptions" />
                    </span>
                  </li>
                </ul>
              </div>
              <div class="control-info">
                <div>
                  <div class="circle"></div>
                  <span class="section-header">车辆布控</span>
                </div>
                <ul>
                  <li>
                    <span class="row-name">布控任务</span>
                    <span class="number">
                      <iCountUp :startVal="0" :endVal="carInfoData.monitorOnCnt || 0" :decimals="0" :duration="2" :options="countUpOptions" />
                    </span>
                    <!-- <span class="row-name">撤控</span>
                    <span class="number">
                      <iCountUp :startVal="0" :endVal="carInfoData.monitorOffCnt || 0" :decimals="0" :duration="2" :options="countUpOptions" />
                    </span> -->
                  </li>
                  <li>
                    <span class="row-name">预警未处理</span>
                    <span class="warn">
                      <iCountUp :startVal="0" :endVal="carInfoData.unHandleCnt || 0" :decimals="0" :duration="2" :options="countUpOptions" />
                    </span>
                  </li>
                  <li>
                    <span class="row-name">今日预警</span>
                    <span class="warn">
                      <iCountUp :startVal="0" :endVal="carInfoData.todayAlarmCnt || 0" :decimals="0" :duration="2" :options="countUpOptions" />
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { createMap, debounce } from "@/utils/";
import iCountUp from "vue-countup-v2";
import { getMapMarker, getAllHistory } from "@/api/dataViews";
import { getCarOverviewById, getCarAlarmList, getCarAlarmCounts } from "@/api/carManage";
import { getPersonOverviewById } from "@/api/faceMonitor";
import { getAlarmList, getFaceAlarmCounts } from "@/api/faceAlarms";
import { getStatusCnt, getPre7DayStatis } from "@/api/preview";

export default {
  components: {
    iCountUp,
    dictionariesPreLoad: () => import("@/common/component/DictionariesPreLoad"),
    ControlList: () => import("./components/ControlList"),
    RightCharts: () => import("./components/RightCharts"),
    LeftLineCharts: () => import("./components/LeftLineCharts"),
  },
  name: "preview",
  data() {
    return {
      personId: '',
      deviceId: '',
      category: '',
      pageNo: 1,
      total: 1,
      countUpOptions: {
        useEasing: true,
        useGrouping: true,
        separator: ",",
        decimal: "."
      },
      ip: process.env.NODE_ENV === "development" ? process.env.IP : location.host,
      carInfoData: {},
      faceInfoData: {},
      // 地图相关
      cMap: null,
      markerList: [],
      markerData: [],

      // 左侧统计
      policesStatis: {},
      lineData: [],
      
      // 地图内标记数据
      controlData: [],
      warnCountList: []
    }
  },
  computed: {
    ...mapState({
      lastWarnData: state => state.preview.lastWarnData
    })
  },
  watch: {
    lastWarnData(val) {
      this._onAlarmCount(val, 'add');
    }
  },
  mounted() {
    this.initMap();
    this.initState();
    this.initSnapData();
    getStatusCnt().then(res => {
      this.policesStatis = res.data
    })
    getPre7DayStatis().then(res => {
      for (let item of res.data) {
        item.date = this.moment(item.date).format('MM月DD日')
      }
      this.lineData = res.data
    })
  },
  methods: {
    initSnapData() {
      this.pushSocket = this.initWebSocket(
        "snapWebSocket",
        "isDestroySnap",
        `ws://${this.ip}/websocket`,
        data => {
          this.$store.dispatch("preview/push", data);
        }
      );
    },
    initWebSocket(webSocketKey, destroyKey, url, callback) {
      let webSocket = (this[webSocketKey] = new WebSocket(url));
      let destroy = this[destroyKey];

      //打开事件
      webSocket.onopen = () => {
        console.log("webSocket 已打开");
      };
      //获得消息事件
      webSocket.onmessage = msg => {
        try {
          let _data = JSON.parse(msg.data);
          callback && callback(_data);
        } catch (err) {}
      };
      //关闭事件
      webSocket.onclose = () => {
        console.log("Socket已关闭");
        if (destroy) {
          webSocket = null;
          setTimeout(() => {
            this.initWebSocket(webSocket, url, callback);
          }, 1000);
        }
      };
      //发生了错误事件
      webSocket.onerror = () => {
        console.log("Socket发生了错误");
      };
      return webSocket;
    },
    // 更新告警消息数
    _onAlarmCount(data, flag) {
      let list = data instanceof Array ? data : [data];
      for(let i = 0; i < list.length; i++) {
        let badge = this.warnCountList.find(item => (item.id === list[i].id || item.id === list[i].deviceId));
        if (badge) {
          let html = '';
          html = flag === 'update' ? list[i].cnt : badge.warnNum + 1;
          badge.setIcon(L.divIcon({
            html,
            className: 'control-num',
            iconSize: 30,
            iconAnchor: [0, 55],
            popupAnchor: [-30, -55]
          }));
          badge.warnNum = Number(html);
        }
      }
    },
    addMakerLayer(data) {
      let _camera = document.getElementById("mapCamera" + data.type + data.id);
      let _point = L.latLng(data.lat, data.lng);
      _point.id = data.id;
      let iconType = "";
      if (data.deviceCameraType == 1) {
        iconType = "camera";
        _point.category = 'face';
      } else {
        iconType = "car";
        _point.category = 'car';
      }

      // 自定义点
      let myIcon = L.icon({
        iconUrl: require(`@/assets/preview/map-${iconType}.png`),
        iconSize: [30, 40], iconAnchor: [14, 40], popupAnchor: [-40, -40]
      });
      // 坐标标记点
      let _marker = L.marker(_point, { icon: myIcon }).addTo(this.cMap);
      _marker.bindPopup(_camera, { minWidth: 310, autoClose: false, closeOnclick: false, autoPan: false, closeButton: true }).bindTooltip(data.name);
      // 右上角角标
      let badge_icon = L.divIcon({
        html: 0,
        className: 'control-num',
        iconSize: 30,
        iconAnchor: [0, 55],
        popupAnchor: [-30, -55]
      });
      let _badge = L.marker(_point, { icon: badge_icon }).addTo(this.cMap);
      _badge.bindPopup(_camera, { minWidth: 310, autoClose: false, closeOnclick: false, autoPan: false, closeButton: true }).bindTooltip(data.name);
      _badge.id = data.id;
      this.warnCountList = [...this.warnCountList, _badge];

      _badge.on('click', e => {
        const { id, category } = e.target._latlng;
        this.deviceId = id;
        this.loadAlarmList(id, category);
      });
      _badge.on('popupclose', e => {
        this.pageNo = 1;
        this.total = 1;
        this.controlData = [];
      });
      _marker.on('click', e => {
        const { id, category } = e.target._latlng;
        this.deviceId = id;
        this.loadAlarmList(id, category);
      });
      _marker.on('popupclose', e => {
        this.pageNo = 1;
        this.total = 1;
        this.controlData = [];
      });
    },
    loadAlarmList(id, category) {
      const pageNo = this.pageNo;
      if (this.controlData.length < this.total) {
        let params = { pageNo, pageSize: 10, _filter_eq_leaderId: this.personId, _filter_eq_handleFlag: 0 };
        if (category === 'face') {
          params._filter_in_deviceIds = id;
          // 人脸告警列表
          getAlarmList(params).then(res => {
            this.handleAlarmsResult(res, category, pageNo);
          });
        } else if (category === 'car') {
          params._filter_in_deviceIds = id;
          // 车辆告警列表
          getCarAlarmList(params).then(res => {
            this.handleAlarmsResult(res, category, pageNo);
          });
        }
      }
    },
    handleAlarmsResult(res, category, page) {
      if (res.status == 200) {
        let result;
        if (page == 1) {
          result = res.data.rows || [];
        } else {
          result = this.controlData.concat(res.data.rows);
        }
        this.total = res.data.total;
        this.controlData = result;
        this.category = category;
      }
    },
    initMap() {
      // 地图调用开始
      const mapElement = this.$refs.map;
      this.cMap = createMap(mapElement, false, false);
      // 获取摄像头
      getMapMarker().then(res => {
        if (res.status == 200) {
          this.markerData = res.data;
          this.markerData.map(item => {
            if (item.type === 1 && item.lng && item.lat) {
              this.$nextTick(() => {
                this.addMakerLayer(item);
              })
            }
          })
        }
      })
    },
    initState() {
      const { id } = this.$store.getters.userInfo;
      this.personId = id;
      getCarOverviewById(id).then(res => {
        this.carInfoData = res.data;
      });
      getPersonOverviewById(id).then(res => {
        this.faceInfoData = res.data;
      });
      // 更新告警消息数
      const params = { _filter_eq_leaderId: id, _filter_eq_handleFlag: 0 };
      getFaceAlarmCounts(params).then(faceRes => {
        let alarmList = faceRes.data;
        getCarAlarmCounts(params).then(carRes => {
          alarmList = [...alarmList, ...carRes.data];
          this._onAlarmCount(alarmList, 'update');
        });
      });
    },
    _onAlarmsLoadMore(category) {
      this.pageNo += 1;
      this.loadAlarmList(this.deviceId, category);
    }
  },
};

</script>

<style lang="scss" scoped>
@import "~@/styles/modules/preview.scss";
</style>
<style lang="scss" scoped>
.app-container {
  height: 100%;

  /deep/ {
    .leaflet-fade-anim {
      .leaflet-popup {
        left: -131px !important;
      }
    }
    .control-num {
      background-image:url('~@/assets/preview/circle.png');
      color: #ffffff;
      width:30px;
      line-height: 30px;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
      text-align:center;
    }
  }
}
</style>
