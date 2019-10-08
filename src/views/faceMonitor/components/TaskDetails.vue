<template>
  <div class="container">
    <div class="collapse" :style="{ height: isCollapse ? '61px' : 'auto' }">
      <div class="arrow-wrap">
        <div class="first-line">
          <h3 class="task-name" v-if="id !== null">
            <span>{{detailsData.name}}</span>
            <small @click="hungTaskEdit"><i class="el-icon-edit"></i>编辑</small>
          </h3>
          <i :class="`up-down el-icon-arrow-${isCollapse ? 'down' : 'up'}`" @click="onCollapsePanel"></i>
        </div>
        <div class="info-line" v-show="isCollapse">
          <div>
            <label>任务类型：</label>
            <strong v-if="typeof(detailsData.alarmType)!='undefined'">{{detailsData.alarmType == 0 ? '正向布控' : detailsData.alarmType == 1 ? '反向布控' : '特征布控'}}</strong>
          </div>
          <div>
            <label>任务编号：</label>
            <strong>{{detailsData.code}}</strong>
          </div>
          <div>
            <label>布控状态：</label>
            <strong>{{detailsData.status == 1 ? '在控': detailsData.status == 0 ? '撤控' : '过期'}}</strong>
          </div>
          <div>
            <label>布控时间：</label>
            <strong>
              <template v-if="detailsData.timeFlag == 0">长期有效</template>
              <template v-else>
                {{detailsData.beginTime}} 至 {{detailsData.endTime}}
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
                <span>任务类型</span>
                <div class="txt"  v-if="typeof(detailsData.alarmType)!='undefined'">
                  {{detailsData.alarmType == 0 ? '正向布控' : detailsData.alarmType == 1 ? '反向布控' : '特征布控'}}
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="item">
                <span>任务编号</span>
                <div class="txt">{{detailsData.code}}</div>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <div class="item">
                <span>负责人</span>
                <div class="txt" v-if="detailsData.leaders">{{detailsData.leaders.map(item => item.name).join('，')}}</div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="item">
                <span>布控状态</span>
                <div class="txt" :class="{col1:detailsData.status==1, col2:detailsData.status==0}">{{detailsData.status==1?'在控': detailsData.status==0 ? '撤控' : '过期'}}</div>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <div class="item">
                <span>是否重复预警</span>
                <div class="txt">{{detailsData.reAlarm === 1 ? '是' : '否'}}</div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="item">
                <span>布控阈值</span>
                <div class="txt" v-if="detailsData.alarmType == 0 && detailsData.similarity">{{Math.floor(detailsData.similarity * 100)}}%</div>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <div class="item">
                <span>民族</span>
                <div class="txt" v-if="detailsData.tagMap">{{getRace}}</div>
              </div>
            </el-col>
            <el-col :span="24">
              <div class="item">
                <span>布控时间</span>
                <div class="txt">
                  <template v-if="detailsData.timeFlag == 0">长期有效</template>
                  <template v-else>
                    {{detailsData.beginTime}} 至 {{detailsData.endTime}}
                  </template>
                </div>
              </div>
            </el-col>
          </el-row>
          <div class="item">
            <span>布控库</span>
            <div class="txt" v-if="detailsData.libraries && detailsData.libraries.length">{{detailsData.libraries.map(item => item.name).join('，')}}</div>
            <div class="txt" v-else>-</div>
          </div>
          <div class="item">
            <span>布控个体</span>
            <div class="swiper-box" v-if="detailsData.persons && detailsData.persons.length">
              <swiper class="swiper" ref="swiper" :options="swiperOption">
                <swiper-slide v-for="(item,index) in detailsData.persons" :key="index">
                  <img-show class="pic" width="60px" height="60px" txt="暂无头像" :img-src="item.identityImgPath">
                    <div class="mask" v-if="item.name">{{item.name}}</div>
                  </img-show>
                </swiper-slide>
              </swiper>
              <div class="swiper-button-prev"></div>
              <div class="swiper-button-next"></div>
            </div>
            <div class="txt" v-else>-</div>
          </div>
          <div class="item">
            <span>布控白名单</span>
            <div class="swiper-box" v-if="detailsData.whiteList && detailsData.whiteList.length">
              <swiper class="swiper" ref="swiper" :options="swiperOption">
                <swiper-slide v-for="(item,index) in detailsData.whiteList" :key="index">
                  <img-show class="pic" width="60px" height="60px" txt="暂无头像" :img-src="item.identityImgPath">
                    <div class="mask" v-if="item.name">{{item.name}}</div>
                  </img-show>
                </swiper-slide>
              </swiper>
              <div class="swiper-button-prev"></div>
              <div class="swiper-button-next"></div>
            </div>
            <div class="txt" v-else>-</div>
          </div>
          <div class="item">
            <span>任务描述</span>
            <div class="txt">{{detailsData.remark}}</div>
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
        <span :style="{ marginRight: '8px' }">总数: {{listTableData.total || 0}}</span>
        <span>未处理：<b>{{handleCount}}</b></span>
      </div>
    </div>
    <!-- 表格模式 S -->
    <el-table ref="listTabel" :data="listTableData.rows" :height="`calc(100vh - ${isCollapse ? '264px' : '672px'})`" v-loading.body="listTableLoading" highlight-current-row>
      <el-table-column label="序号" align="center" type="index" width="50" />
      <el-table-column label="抓拍照片" align="center" width="80">
        <template slot-scope="scope">
          <suspension-menu :SuspensionData="scope.row" />
        </template>
      </el-table-column>
      <el-table-column label="相似度" align="center" width="80">
        <template slot-scope="scope" v-if="scope.row.similarity">{{scope.row.similarity|percentage}}%</template>
      </el-table-column>
      <el-table-column label="证件照片" align="center" width="80">
        <template slot-scope="scope">
          <img-show class="pic" width="48px" height="48px" text="暂无照片" :img-src="scope.row.identityImgPath" />
        </template>
      </el-table-column>
      <el-table-column label="背景图" align="center" width="120">
        <template slot-scope="scope">
          <a @click="onLookPicture(scope.row)">
            <img-show height="48px" text="暂无背景" :img-src="scope.row.bgImgPath" class="bg-pic" />
          </a>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="姓名/证件号" width="200">
        <template slot-scope="scope">
          <div class="identity txt">
            <label>{{scope.row.name}}</label>
            <p>{{scope.row.identityNo}}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="类别" align="center" min-width="120px">
        <template slot-scope="scope">
          <face-category-list :data="faceLibraryData" :type="0" :chosen="scope.row.personTags?scope.row.personTags.split(','):[]" />
        </template>
      </el-table-column>
      <el-table-column align="center" width="60" prop="sex" label="性别" />
      <el-table-column align="center" width="60" prop="age" label="年龄" />
      <el-table-column prop="nationName" label="民族" width="60px" align="center" >
        <!-- <template slot-scope="scope">
          <div>{{ scope.row.nation === 5 ? '维族' : '未知' }}</div>
        </template> -->
      </el-table-column>
      <el-table-column align="left" min-width="90" label="采集设备">
        <template slot-scope="scope">
          <camera-video :mode="0" :deviceCode="scope.row.deviceCode" :deviceName="scope.row.deviceName" :onLine="scope.row.onLine" :chanDpid="scope.row.chanDpid"/>
        </template>
      </el-table-column>
      <el-table-column align="left" min-width="120" prop="policeAreaName" label="辖区" />
      <el-table-column prop="imgTime" width="150" :label="detailsData.alarmType === 1 ? '最后抓拍时间' : '抓拍时间'" />
      <el-table-column fixed="right" width="80" align="center" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" :type="scope.row.handleFlag == 0?'warning':'success'" v-permission="scope.row.handleFlag == 0?'FUNC_FACEMONITOR_WARNINFO_UPDATE':''" @click="onAlarmDetails(scope.row.id)">{{scope.row.handleFlag == 0 ? '处理' : '详情'}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格模式 E -->

    <el-pagination @size-change="onListLimit" @current-change="onListPaging" :current-page="listQuery.pageNo" :page-size="listQuery.pageSize" :page-sizes="[15,30,50]" layout="total, sizes, prev, pager, next, jumper" :total="listTableData.total" />

    <!-- 处理弹窗 -->
    <dispose-layer :is-open.sync="isDisposeDialog" :id="detailId" :data="disposeData" @complete="handleRefresh" />

    <!-- 图片弹窗 -->
    <picture-viewer :isOpen.sync="isBgDialog" :bgImgInfo="bgImgInfo" />
  </div>
</template>

<script>
import { mapState } from "vuex";

import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";

import { createMap } from "@/utils";
import { getMonitorTask, getFaceHandleCount } from "@/api/faceMonitor";
import { getAlarmList, getAlarmDetail } from "@/api/faceAlarms";
import { postChanList } from "@/api/video";

export default {
  components: {
    swiper,
    swiperSlide,
    DisposeLayer: () => import("@/views/faceAlarms/components/DisposeLayer")
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
      isBgDialog: false,
      bgImgInfo: {},
      detailsData: {},
      isDisposeDialog: false,
      disposeData: null,
      listQuery: {
        pageNo: 1,
        pageSize: 15,
        totalCount: null
      },
      listTableData: {},
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
        }
      },
      detailId: null,
      isCollapse: false,
      grayIcon: '/static/leaflet/images/marker-gray.png',
      greenIcon: '/static/leaflet/images/marker-green.png',
      shadowIcon: '/static/leaflet/images/marker-shadow.png'
    };
  },
  computed: {
    ...mapState({
      faceLibraryData: state => state.commonData.faceLibraryData,
      waterBg: state => state.user.waterBg, // 人脸库标识
    }),
    getRace() {
      const { tagMap = {} } = this.detailsData;
      let result = [];
      if (tagMap[0]) {
        const raceTags = tagMap[0];
        for(let i = 0; i < raceTags.length; i++) {
          let temp = '';
          switch (raceTags[i]) {
            // case '0':
            //   temp = '汉族';
            //   break;
            case '1':
              temp = '维族';
              break;
            // case '2':
            //   temp = '白人';
            //   break;
            // case '3':
            //   temp = '黑人';
            //   break;
            default:
              break;
          }
          result.push(temp);
        }
      }
      return result.join(', ');
    }
  },
  mounted() {
    this.initMap();
  },
  watch: {
    id(val) {
      if (val) {
        this.detailsData = {};
        this.listQuery = {
          pageNo: 1,
          pageSize: 15,
          totalCount: null
        };
        this.listTableLoading = false;
        this.listTableData = {};

        this.initData();

        postChanList([]).then(res => {
          this.chanListData = res.data;
        })
      }
    }
  },
  methods: {
    initData() {
      this.$store.dispatch("commonData/getFaceLibraryData");
      this.listQuery._filter_in_monitorIds = this.id;
      // 获取详情
      getMonitorTask(this.id).then(res => {
        if (res.status == 200) {
          const data = res.data || { circleAreas: [], polygonAreas: [] };
          this.detailsData = data;

          // 划出地图区域
          let shape = null;
          let markers = [];
          this.areaLayer.clearLayers();
          if (data.circleAreas.length === 1) {
            const circle = data.circleAreas[0];
            shape = L.circle(L.latLng(circle.center), { radius: circle.radius, color: '#ff0000' });
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
            let _point = L.latLng(item.lat, item.lng);
            _point.id = item.id;
            let icon = null;
            if (highLightPoints.includes(item.id)) {
              icon = L.icon({ iconUrl: this.greenIcon, iconSize: [26, 40], iconAnchor: [13, 40], shadowUrl: this.shadowIcon });
            } else {
              icon = L.icon({ iconUrl: this.grayIcon, iconSize: [26, 40], iconAnchor: [13, 40], shadowUrl: this.shadowIcon });
            }
            L.marker(_point, { icon }).bindTooltip(item.name).addTo(this.cameraLayer);
          });
        }
      });
      
      // 获取表格数据
      this.getTableList();
    },
    initMap() {
      const mapElement = this.$refs.map;
      this.cMap = createMap(mapElement, false);
      this.cameraLayer = L.layerGroup().addTo(this.cMap);
      this.areaLayer = L.layerGroup().addTo(this.cMap);
    },
    onCollapsePanel() {
      this.isCollapse = !this.isCollapse;
    },
    hungTaskEdit() {
      this.$emit('awaken');
    },
    handleRefresh() {
      this.getTableList();
      this.$emit('onUpdate');
    },
    getTableList() {
      getAlarmList(this.listQuery).then(res => {
        let _data = res.data;
          if (_data.rows) {
            _data.rows.forEach(item => {
              this.chanListData && this.chanListData.forEach(element => {
                if(element.deviceCode == item.deviceCode) {
                  this.$set(item, 'isReqVideo', true);
                }
              });
            });
          }
        this.listTableData = _data;
      }).finally(() => {
        this.listTableLoading = false;
      });
      getFaceHandleCount({ monitorId: this.id, handleFlag: 0 }).then(res=>{
        this.handleCount=res.data.data;
      });
    },
    /* 分页处理 */
    onListPaging(val) {
      this.listQuery.pageNo = val;
      this.listQuery.totalCount = this.listTableData.total;
      this.getTableList();
    },
    onListLimit(val) {
      this.listQuery.pageSize = val;
      this.listQuery.totalCount = this.listTableData.total;
      this.getTableList();
    },
    /* 分页处理 */
    onAlarmDetails(id) {
      this.detailId = id
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
          this.isDisposeDialog = true;
        });
      });
    },
    // 查看大图
    onLookPicture(data) {
      if (!data) return;
      const { bgImgPath, snapImgPath, identityImgPath, similarity = 0 } = data;
      this.bgImgInfo = {
        rowBgImg: bgImgPath,
        snapImgPath,
        identityImgPath,
        similarity: Math.floor(similarity * 100)
      };
      this.isBgDialog = true;
    }
  }
};
</script>

<style lang="scss" scoped>
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
    margin-left: 112px;
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
    .pic {
      position: relative;
      display: inline-block;
      overflow: hidden;
      vertical-align: top;
      border-radius: 6px;
      .mask {
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.4);
        line-height: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: center;
        font-size: 12px;
        color: #fff;
      }
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
      width: 94px;
      font-size: 14px;
      color: #999;
    }
    span::after {
      content: '';
			display: inline-block;
			width: 100%;
    }
    .txt {
      margin-left: 112px;
      font-size: 14px;
      word-break: break-all;
      word-wrap: break-word;
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
  .map-title {
    font-size: 14px;
  }
  .map {
    width: 100%;
    height: 404px;
    margin: 6px 0;
  }
</style>
