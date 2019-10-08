<template>
  <div class="container">
    <div class="collapse" :style="{ height: isCollapse ? '61px' : 'auto' }">
      <div class="arrow-wrap">
        <div class="first-line">
          <h3 class="task-name" v-if="id !== null">
            <span>{{form.name}}</span>
            <small @click="hungTaskEdit"><i class="el-icon-edit"></i>编辑</small>
          </h3>
          <i :class="`up-down el-icon-arrow-${isCollapse ? 'down' : 'up'}`" @click="onCollapsePanel"></i>
        </div>
        <div class="info-line" v-show="isCollapse">
          <div>
            <label>任务编号：</label>
            <strong>{{form.code}}</strong>
          </div>
          <div>
            <label>布控状态：</label>
            <strong>{{form.status==1?'在控': form.status==0 ? '撤控' : '过期'}}</strong>
          </div>
          <div>
            <label>布控时间：</label>
            <strong>
              <template v-if="form.timeFlag == 0">长期有效</template>
              <template v-else>
                {{form.beginTime}} 至 {{form.endTime}}
              </template>
            </strong>
          </div>
        </div>
      </div>
      <el-row class="info">
        <el-col :span="12" :style="{ padding: '12px 6px 0 0' }">
          <el-row>
            <el-col :span="12">
              <div class="item">
                <span>任务编号</span>
                <div class="txt">{{form.code}}</div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="item">
                <span>负责人</span>
                <div class="txt" v-if="form.leaders">{{form.leaders.map(item => item.name).join('，')}}</div>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <div class="item">
                <span>布控状态</span>
                <div class="txt" :class="{col1:form.status==1, col2:form.status==0}">{{form.status==1?'在控': form.status==0 ? '撤控' : '过期'}}</div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="item">
                <span>布控库</span>
                <div class="txt" v-if="form.libraries">{{form.libraries.map(item => item.name).join('，')}}</div>
              </div>
            </el-col>
          </el-row>
          <div class="item">
            <span>布控时间</span>
            <div class="txt">
              <template v-if="form.timeFlag == 0">长期有效</template>
              <template v-else>
                {{form.beginTime}} 至 {{form.endTime}}
              </template>
            </div>
          </div>
          <div class="item">
            <span>布控车辆</span>
            <div class="swiper-box" v-if="form.cars">
              <swiper class="swiper" ref="swiper" :options="swiperOption">
                <swiper-slide v-for="(item,index) in form.cars" :key="index">
                  <div class="mask" v-if="item.plateNumber">{{item.plateNumber}}</div>
                </swiper-slide>
              </swiper>
              <div class="swiper-button-prev"></div>
              <div class="swiper-button-next"></div>
            </div>
          </div>
          <div class="item">
            <span>布控车牌号</span>
            <div class="txt">
              <div class="plat-num" v-for="(item,index) in form.regexArrays" :key="index">
                <b v-for="(subItem,subIndex) in item.regexVOList" :key="subIndex">{{subItem.regexValue ? subItem.regexValue : '*'}}</b>
              </div>
            </div>
          </div>
          <div class="item">
            <span>布控白名单</span>
            <div class="swiper-box" v-if="form.whiteList">
              <swiper class="swiper" ref="swiper" :options="swiperOption">
                <swiper-slide v-for="(item,index) in form.whiteList" :key="index">
                  <div class="mask" v-if="item.plateNumber">{{item.plateNumber}}</div>
                </swiper-slide>
              </swiper>
              <div class="swiper-button-prev"></div>
              <div class="swiper-button-next"></div>
            </div>
          </div>
          <div class="item">
            <span>任务描述</span>
            <div class="txt">{{form.description}}</div>
          </div>
        </el-col>
        <el-col :span="12">
          <h4 class="map-title">布控区域</h4>
          <div class="map" ref="map"></div>
        </el-col>
      </el-row>
    </div>

    <!-- 工具栏 -->
    <div class="common-tool">
      <div class="title">告警消息</div>
      <div class="right">
        <span :style="{ marginRight: '8px' }">总数: {{form_data.total || 0}}</span>
        <span>未处理：<b>{{handleCount}}</b></span>
      </div>
    </div>
    <!-- 表格模式 S -->
    <el-table ref="listTabel" :data="form_data.rows" :height="`calc(100vh - ${isCollapse ? '264px' : '642px'})`" v-loading.body="listTableLoading" highlight-current-row>
      <el-table-column label="序号" align="center" type="index" width="50" />
      <el-table-column label="抓拍照片" align="center" width="80">
        <template slot-scope="scope">
          <img class="pic" :src="scope.row.plateImage" />
        </template>
      </el-table-column>
      <el-table-column prop="plateNumber" label="车牌号" align="center" width="120" />
      <el-table-column label="类别" width="80" align="center">
        <template slot-scope="scope">
          <div class="label-box">
            <face-category-list :data="carLibraryData" :type="0" :chosen="scope.row.libraryNums?scope.row.libraryNums.split(','):[]" />
          </div>
        </template>
      </el-table-column>
      <el-table-column min-width="80" prop="deviceName" align="center" label="采集设备" />
      <el-table-column align="left" min-width="120" prop="policeAreaName" label="辖区" />
      <el-table-column min-width="80" prop="passTime" align="center" label="告警时间" />
      <el-table-column min-width="80" prop="monitorName" align="center" label="任务名称" />
      <el-table-column width="80" prop="handleFlag" align="center" label="处理状态" />
      <el-table-column fixed="right" width="80" align="center" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="onItemDetails(scope.row.id)" v-if="scope.row.handleFlag === '未处理'" v-permission="'FUNC_CARCONTROL_WARNINFO_UPDATE'">处理</el-button>
          <el-button size="mini" type="success" @click="onItemDetails(scope.row.id)" v-else v-permission="!'FUNC_CARCONTROL_WARNINFO_UPDATE'">详情</el-button>
          <!-- <el-button size="mini" type="primary" @click="onItemEdit(scope.row.id)">轨迹</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格模式 E -->

    <el-pagination @size-change="onListLimit" @current-change="onListPaging" :current-page="listQuery.pageNo" :page-size="listQuery.pageSize" :page-sizes="[15,30,50]" layout="total, sizes, prev, pager, next, jumper" :total="form_data.total" />

    <!-- 处理弹窗 -->
    <alarm-form :is-open.sync="isAlarmDialog" :id="detailId" :formInfo="formInfo" :carLibraryData="carLibraryData" @complete="handleRefresh"/>

    <!-- 图片弹窗 -->
    <el-dialog title="背景大图" :visible.sync="isBgDialog" append-to-body>
      <img :src="rowBgImg" class="w100">
    </el-dialog>
  </div>
</template>

<script>

import "swiper/dist/css/swiper.css";
import { mapState } from 'vuex'
import { swiper, swiperSlide } from "vue-awesome-swiper";
import { createMap } from "@/utils";
import { getCarAlarmList, getCarAlarmInfo, getCarHandleCount, getcarControInfo } from "@/api/carManage";

export default {
  components: {
    swiper,
    swiperSlide,
    AlarmForm: () => import("./AlarmForm")
  },
  props: {
    id: Number,
    // 布控设备列表
    cameraList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      cMap: null,
      cameraLayer: null,
      areaLayer: null,
      // 处理 数据
      isBgDialog: false, // 控制背景图显示
      rowBgImg: null,

      isAlarmDialog: false,
      disposeData: null,

      form: {},
      listQuery: {
        pageNo: 1,
        pageSize: 15,
      },
      formInfo: {},
      form_data: {},
      listTableLoading: false,
      handleCount: 0,

      swiperOption: {
        slidesPerView: "auto",
        spaceBetween: 5,
        freeMode: true,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true
        },
      },
      detailId: null,
      isCollapse: false,
      isCollapse: false,
      grayIcon: '/static/leaflet/images/marker-gray.png',
      greenIcon: '/static/leaflet/images/marker-green.png',
      shadowIcon: '/static/leaflet/images/marker-shadow.png'
    };
  },
  computed: {
    ...mapState({
      carLibraryData: state => state.commonData.carLibraryData,
      waterBg: state => state.user.waterBg, // 水印
    })
  },
  mounted() {
    this.initMap();
  },
  watch: {
    id(val) {
      if (val) {
        this.listQuery = {
          pageNo: 1,
          pageSize: 15,
          _filter_eq_monitorId: this.id,
        };
        this.listTableLoading = false;
        this.form_data = {};

        this.initData();
      }
    }
  },
  methods: {
    getTableList() {
      const monitorId = this.id;
      getCarAlarmList(this.listQuery).then(res => {
        let isSuccess = res.status === 200;
        if (!isSuccess) {
          // 错误提示处理
          this.$notify({
            title: "失败",
            message: res.message,
            type: "error",
            duration: 2000
          });
          return;
        }
        this.form_data = res.data;
        getCarHandleCount({ monitorId, handleFlag: 0 }).then(res => {
        this.handleCount = res.data.data;
      });
      })
    },
    initData() {
      // 获取表格数据
      this.getTableList();

      this.$store.dispatch("commonData/getCarLibraryData");

      getcarControInfo(this.id).then(res => {
        let isSuccess = res.status === 200;
        if (!isSuccess) {
          // 错误提示处理
          this.$notify({
            title: "失败",
            message: res.message,
            type: "error",
            duration: 2000
          });
          return;
        }
        this.form = res.data;

        // 划出地图区域
        const data = res.data || { circleAreas: [], polygonAreas: [] };
        let shape = null;
        let markers = [];
        this.areaLayer.clearLayers();
        if (data.circleAreas.length === 1) {
          const circle = data.circleAreas[0];
          shape = L.circle(L.latLng(circle.center), { radius: circle.radius, color: "#ff0000" });
          markers = circle.ids || [];
        }
        if (data.polygonAreas.length === 1) {
          const polygon = data.polygonAreas[0];
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
        shape && this.areaLayer.addLayer(shape);

        // 批量添加标记点
        let highLightPoints = [];
        if (data.outsideIds instanceof Array) highLightPoints = data.outsideIds.concat(markers);
        this.cameraLayer.clearLayers();
        this.cameraList.map(item => {
          if (item.lat && item.lng) {
            let _point = L.latLng(item.lat, item.lng);
            _point.id = item.id;
            let icon = null;
            if (highLightPoints.includes(item.id)) {
              icon = L.icon({ iconUrl: this.greenIcon, iconSize: [26, 40], iconAnchor: [13, 40], shadowUrl: this.shadowIcon });
            } else {
              icon = L.icon({ iconUrl: this.grayIcon, iconSize: [26, 40], iconAnchor: [13, 40], shadowUrl: this.shadowIcon });
            }
            L.marker(_point, { icon }).bindTooltip(item.name).addTo(this.cameraLayer);
          }
        });
      });
    },
    initMap() {
      const mapElement = this.$refs.map;
      this.cMap = createMap(mapElement, false);
      this.cameraLayer = L.layerGroup().addTo(this.cMap);
      this.areaLayer = L.layerGroup().addTo(this.cMap);
    },
    handleRefresh() {
      this.getTableList();
      this.$emit('onUpdate');
    },
    onCollapsePanel() {
      this.isCollapse = !this.isCollapse;
    },
    hungTaskEdit() {
      this.$emit('awaken');
    },
    // 查看 详情
    onItemDetails(id) {
      this.detailId = id;
      getCarAlarmInfo(id).then(res => {
        let isSuccess = res.status === 200;
        if (!isSuccess) {
          // 错误提示处理
          this.$notify({
            title: "失败",
            message: res.message,
            type: "error",
            duration: 2000
          });
          return;
        }
        this.formInfo = res.data;
        this.$nextTick(() => {
          this.isAlarmDialog = true;
        });
      });
    },
    /* 分页处理 */
    onListPaging(val) {
      this.listQuery.pageNo = val;
      this.listQuery.totalCount = this.form_data.total;
      this.getTableList();
    },
    onListLimit(val) {
      this.listQuery.pageSize = val;
      this.listQuery.totalCount = this.form_data.total;
      this.getTableList();
    },
    /* 分页处理 */
    onAlarmDetails(id) {
      getAlarmDetail(id).then(res => {
        let isSuccess = res.status === 200;
        if (!isSuccess) {
          // 错误提示处理
          this.$notify({
            title: "失败",
            message: res.message,
            type: "error",
            duration: 2000
          });
          return;
        }

        this.disposeData = res.data;
        this.$nextTick(() => {
          this.isAlarmDialog = true;
        });
      });
    },
    // 查看大图
    onLookPicture(url) {
      if (!url) return;
      this.rowBgImg = url;
      this.isBgDialog = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  .collapse {
    overflow: hidden;
    transition: all 1s ease-in-out;
    .arrow-wrap {
      line-height: 36px;
      padding: 0 10px;
      cursor: pointer;
      .first-line {
        height: 37px;
        overflow: hidden;
        .task-name {
          height: 100%;
          float: left;
          font-size: 16px;
          span {
            padding-left: 4px;
            border-left: 4px solid #1989fa;
          }
          small {
            margin-left: 3px;
            color: #1989fa;
            font-size: 12px;
          }
        }
        i.up-down {
          position: relative;
          top: 8px;
          float: right;
          font-size: 20px;
        }
      }
      .info-line {
        padding: 0 6px;
        line-height: 24px;
        > div {
          display: inline-block;
          margin-right: 28px;
          font-size: 14px;
          label {
            color: #999;
            font-weight: normal;
          }
          strong {
            font-weight: normal;
          }
        }
      }
    }
  }
  .col1 {
    color: #fa0610;
  }
  .col2 {
    color: #4dd861;
  }

  .swiper-box {
    position: relative;
    background: #e8e8e8;
    margin-left: 90px;
    padding: 10px 30px;
    border-radius: 8px;
    .swiper-button-next,
    .swiper-button-prev {
      background-size: 12px 20px;
      width: 12px;
      height: 20px;
      margin-top: -10px;
    }
    .swiper-pagination {
      bottom: 0;
      line-height: 10px;
    }
    .swiper-slide {
      float: left;
      width: auto;
    }
    .mask {
      border: 1px solid #97c2f0;
      padding: 5px;
      right: 0;
      bottom: 0;
      left: 0;
      line-height: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: center;
      font-size: 12px;
      border-radius: 15px;
    }
    .pic {
      position: relative;
      display: inline-block;
      overflow: hidden;
      vertical-align: top;
      border-radius: 6px;
    }
  }

  .info {
    padding: 0 20px;
    font-size: 13px;
    color: #3f4041;
    .item {
      margin-bottom: 4px;
      overflow: hidden;
    }
    span {
      float: left;
      text-align: justify;
      width: 72px;
      font-size: 14px;
      color: #999;
    }
    span::after {
      content: '';
			display: inline-block;
			width: 100%;
    }
    .txt {
      margin-left: 90px;
      font-size: 14px;
      word-break: break-all;
      word-wrap: break-word;
      .plat-num {
        display: inline-block;
        margin-right: 8px;
        background-color: gainsboro;
        b {
          font-weight: normal;
          margin-right: 2px;
        }
      }
    }
  }

  .right {
    span {
      font-size: 13px;
      margin-right: 16px;
    }
    b {
      font-weight: normal;
      color: #EA4423;
    }
  }
  .el-table {
    .pic {
      display: inline-block;
      overflow: hidden;
      border-radius: 4px;
      vertical-align: top;
    }
    .bg-pic {
      display: inline-block;
      overflow: hidden;
      border-radius: 4px;
      vertical-align: top;
    }
  }
  .el-pagination {
    padding: 10px;
  }
  .pic {
    display: block;
    width: 48px;
    height: 48px;
    margin: 0 auto;
  }
}
.map-title {
  font-size: 14px;
}
.map {
  width: 100%;
  height: 374px;
  margin: 6px 0;
}
</style>