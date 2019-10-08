<template>
  <div class="face-track-analysis">
    <!-- 表单筛选 -->
    <el-form class="form" @keyup.enter.native="onSubmit">
      <div class="title">轨迹分析</div>
      <el-button type="primary" size="mini" icon="el-icon-plus" @click="isPictureDialog=true">选择分析对象</el-button>
      <el-button-group class="switch">
        <el-button :type="mode===1?'primary':'info'" @click="mode=1" size="mini">
          <svg-icon icon-class="category" />
        </el-button>
        <el-button :type="mode===0?'primary':'info'" @click="mode=0" size="mini">
          <svg-icon icon-class="images" />
        </el-button>
      </el-button-group>
    </el-form>

    <!-- 以图搜图 - 弹窗 -->
    <picture-layer :is-open.sync="isPictureDialog" @complete="personnelConfirm" />

    <!-- 数据展示 -->
    <div class="main">
      <transition name="fade" mode="out-in">
        <!-- 地图展示 -->
        <div class="map-show" v-show="mode===0">
          <!-- 地图展示 -->
          <a-map :play.sync="timeSchedulePlay" :listData="listData" :index="mapIndex" :currentUser="currentUser" :listQuery.sync="listQuery" ref="aMap" />

          <!-- 地图菜单 -->
          <div class="map-menu" v-if="currentUser">
            <div class="form-box">
              <div class="current-user">
                <div class="toggle" @click="toggle = !toggle">{{toggle?'收缩':'展开'}}</div>
                <img-show class="pic" width="48px" height="48px" text="暂无头像" :img-src="currentUser.identityImgPath" />
                <div class="name">
                  {{currentUser.name}}
                  <face-category-list :data="faceLibraryData" :type="0" :chosen="currentUser.personTags?currentUser.personTags.split(','):[]" />
                </div>
                <div class="identity">{{currentUser.identityNo}}</div>
              </div>
              <el-form size="mini" :model="listQuery" label-width="36px" v-show="toggle">
                <el-form-item label="时间" prop="_filter_ge_stayTimeBegin_date">
                  <el-date-picker v-model="listQuery._filter_ge_stayTimeBegin_date" value-format="yyyyMMddHHmmss" type="datetime" placeholder="请选择开始时间" :picker-options="singlePickerOptions()" />
                </el-form-item>
                <el-form-item label="至" prop="_filter_le_stayTimeEnd_date">
                  <el-date-picker v-model="listQuery._filter_le_stayTimeEnd_date" value-format="yyyyMMddHHmmss" type="datetime" placeholder="请选择结束时间" :picker-options="singlePickerOptions(listQuery._filter_ge_stayTimeBegin_date)" />
                </el-form-item>
                <el-button type="success" @click="onSubmit">深度分析</el-button>
              </el-form>
            </div>
            <div class="user-list">
              <div class="tit">
                轨迹列表：
                <em>{{listData.length}}</em>
              </div>
              <ul>
                <li v-for="(item,index) in listData" :key="index" :class="{sel:index==currentUserIndex}" @click="onMarkerChange(item,index)">
                  <img-show class="pic" width="48px" height="48px" text="暂无头像" :img-src="item.snapImgPath" />
                  <div class="icon">{{index+1}}</div>
                  <div class="address">{{item.address}}</div>
                </li>
              </ul>
            </div>
          </div>

          <!-- 时间进度 -->
          <time-schedule :play.sync="timeSchedulePlay" :startTime="scheduleTime.startTime" :endTime="scheduleTime.endTime" :listData="listData" @change="onScheduleChange"></time-schedule>
        </div>
      </transition>

      <transition name="fade" mode="out-in">
        <!-- 列表展示 -->
        <div class="list-show" v-show="mode===1">
          <div class="null-data" v-if="typeof listTableData.total == 'undefined' || listTableData.total == null">
            暂无数据，请
            <span @click="isPictureDialog=true">选择分析对象</span>
          </div>
          <template v-else>
            <!-- 表单筛选 -->
            <el-form class="list-form" size="mini" :model="listQuery" :inline="true" @keyup.enter.native="onSubmit">
              <div class="user-info">
                <img-show class="pic" width="48px" height="48px" text="暂无头像" :img-src="currentUser.identityImgPath" />
                <div class="name">
                  <b>{{currentUser.name}}</b>
                  <face-category-list :data="faceLibraryData" :type="0" :chosen="currentUser.personTags?currentUser.personTags.split(','):[]" />
                </div>
                <p>{{currentUser.identityNo}}</p>
              </div>
              <div class="txt">时间</div>
              <el-form-item class="w-a">
                <el-date-picker v-model="listQuery._filter_ge_stayTimeBegin_date" value-format="yyyyMMddHHmmss" type="datetime" placeholder="请选择开始时间" :picker-options="singlePickerOptions()" />
                <el-date-picker v-model="listQuery._filter_le_stayTimeEnd_date" value-format="yyyyMMddHHmmss" type="datetime" placeholder="请选择结束时间" :picker-options="singlePickerOptions(listQuery._filter_le_stayTimeEnd_date)" />
              </el-form-item>
              <el-form-item>
                <el-button type="success" @click="onSubmit">深度分析</el-button>
              </el-form-item>
              <div class="total">
                <span>{{listTableData.total}}</span>条
              </div>
            </el-form>

            <el-table :data="listTableData.rows" class="table" v-loading="listTableLoading" height="calc(100vh - 270px)">
              <el-table-column align="center" prop="address" label="抓拍地点">
                <template slot-scope="scope">
                  <el-tooltip placement="right" :open-delay="200" effect="light">
                    <div slot="content">
                      <iframe :src="'https://m.amap.com/navi/?dest='+scope.row.lng+','+scope.row.lat+'&destName='+scope.row.address+'&hideRouteIcon=1&key=d25d6295beb6a7baf473a1a6d5b2eca7'" class="map-marker"></iframe>
                    </div>
                    <span class="look-map">
                      <svg-icon icon-class="locale" />{{scope.row.address}}
                    </span>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column align="center" label="驻留时间" min-width="180">
                <template slot-scope="scope">
                  <div class="txt">
                    {{scope.row.stayTimeBegin}}　至　{{scope.row.stayTimeEnd}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column fixed="right" width="100" align="center" label="操作">
                <template slot-scope="scope">
                  <el-button size="mini" type="success" @click="onItemDetails(scope.row)">人行记录</el-button>
                </template>
              </el-table-column>
            </el-table>

            <el-pagination @size-change="onListLimit" @current-change="onListPaging" :current-page="listQuery.pageNo" :page-size="listQuery.pageSize" :page-sizes="[15,30,50]" layout="total, sizes, prev, pager, next, jumper" :total="listTableData.total" />
          </template>
        </div>
      </transition>
    </div>

    <!-- 抓拍记录 -->
    <trajectory-layer ref="trajectoryLayer" />
  </div>
</template>
<script>
import { mapState } from "vuex";

import { singlePickerOptions } from "@/utils";
import { getTrajectoryList, getPersonnelList } from "@/api/faceTrackAnalysis";
import { getPersonInfo } from "@/api/faceUser/faceInfo";

export default {
  name: "faceTrackAnalysis",
  components: {
    AMap: () => import("./components/AMap"),
    TimeSchedule: () => import("./components/TimeSchedule"),
    TrajectoryLayer: () => import("./components/TrajectoryLayer"),
  },
  data() {
    return {
      mode: 0,
      mapIndex: 0,
      isDialog: false,
      isPictureDialog: false,
      personId: null,
      listQuery: {
        pageNo: 1,
        pageSize: 15,
        totalCount: null,
        _filter_in_personIds: null,
        _filter_ge_stayTimeBegin_date: this.moment()
          .subtract(1, "d")
          .format("YYYYMMDDHHmmss"),
        _filter_le_stayTimeEnd_date: this.moment().format("YYYYMMDDHHmmss")
      },
      isInitData: [true, true], // 用于判断是否需要初始化地图或列表数据。避免重复请求接口
      currentUser: null,
      listData: [], // 轨迹坐标返回的数据
      listTableData: {}, // 轨迹列表返回的数据
      listTableLoading: false,
      scheduleTime: {
        startTime: null,
        endTime: null
      },
      timeSchedulePlay: false,

      currentUserIndex: null,
      toggle: true, // true展开，false收缩
      singlePickerOptions: singlePickerOptions
    };
  },
  computed: {
    ...mapState({
      faceLibraryData: state => state.commonData.faceLibraryData
    })
  },
  created() {
    if(window.location.hash.split("?")[1]) {
      this.personId = window.location.hash.split("?")[1].split("=")[1]
    }
    this.$store.dispatch("commonData/getFaceLibraryData");
    this.JumpQuery()
  },
  watch: {
    mode(val) {
      this.timeSchedulePlay = false;
      if (this.isInitData[val] && this.listQuery._filter_in_personIds) {
        this.$set(this.isInitData, val, false);
        this.onSubmit();
      };
    },
    $route() {
      if (window.location.hash.split("?")[0] === '#/application/faceTrackAnalysis' && window.location.hash.split("?")[1]) {
        if(window.location.hash.split("?")[1].split('=')[0] === 'personId') {
          this.$router.push("/_empty");
          this.$router.go(-1);
        }
      }
    },
    listQuery: {
      handler: function (val) {
        this.isInitData = [true, true];
      },
      deep: true
    }
  },
  activated() {
    this.JumpQuery()
  },
  methods: {
    JumpQuery() {
      if (Object.keys(this.$route.query).length > 0) {
        this.personnelConfirmJump(this.$route.query.personId)
      }
      else {
        this.personnelConfirm(this.$route.params.data);
      }
    },
    // 地图点变更
    onMarkerChange(item, index) {
      // 停止播放
      this.timeSchedulePlay = false;
      this.currentUserIndex = index;
      this.$refs.aMap.onClickMarker({
        lng: item.lng,
        lat: item.lat,
        index: index
      });
  
    },
    // 进度变更
    onScheduleChange(val) {
      this.mapIndex = val;
    },
    // 抓拍记录
    onItemDetails(data) {
      data.identityImgPath = this.currentUser.identityImgPath;
      this.$refs.trajectoryLayer.open(data);
    },
    // 轨迹分析提交
    onSubmit() {
      // 空数据过滤
      if (!this.listQuery._filter_in_personIds) {
        this.$notify({
          title: "提示",
          message: "请先选择一个人员",
          type: "warning",
          duration: 2000
        });
        return;
      }

      let type = this.mode;
      this.$set(this.isInitData, type, false);

      // 接口调用处理
      let listQuery = JSON.parse(JSON.stringify(this.listQuery));
      // 地图模式
      if (type === 0) {
        this.currentUserIndex = null;
        delete listQuery.pageNo;
        delete listQuery.pageSize;
        delete listQuery.totalCount;
      }
      // 列表模式
      if (type === 1) {
        this.listTableLoading = true;
      }
      getTrajectoryList(listQuery)
        .then(res => {
          let isSuccess = res.status === 200;
          // 错误处理
          if (!isSuccess) {
            this.$notify({
              title: "失败",
              message: res.message,
              type: "error",
              duration: 2000
            });
            return;
          }

          if (type === 0) {
            this.listData = res.data || [];
            this.mapIndex = this.listData.length;
            this.scheduleTime.startTime = this.moment(
              listQuery._filter_ge_stayTimeBegin_date,
              "YYYYMMDDHHmmss"
            ).format("YYYY-MM-DD HH:mm:ss");
            this.scheduleTime.endTime = this.moment(
              listQuery._filter_le_stayTimeEnd_date,
              "YYYYMMDDHHmmss"
            ).format("YYYY-MM-DD HH:mm:ss");
          }
          if (type === 1) {
            this.listTableData = res.data || {};
          }
        })
        .finally(() => {
          if (type === 1) {
            this.listTableLoading = false;
          }
        });
    },
    //人员直接跳转
    personnelConfirmJump(id) {
      this.listQuery._filter_in_personIds = id;
      getPersonInfo(id).then( res => {
        const { age, images=[], identityNo, id, name, sex } = res.data
        this.currentUser = { age: age, identityImgPath: images[0].imgPath, identityNo: identityNo, name: name, personId: id, sex: sex }
      })
      this.$nextTick(() => {
        this.onSubmit();
      });
    },
    // 人员选择完成
    personnelConfirm(arr) {
      if (!arr || !arr.length) {
        return;
      }
      this.currentUser = arr[0];
      this.listQuery._filter_in_personIds = arr
        .map(item => item.personId)
        .join(",");
      this.$nextTick(() => {
        this.onSubmit();
      });
    },
    onListPaging(val) {
      this.listQuery.pageNo = val;
      this.listQuery.totalCount = this.listTableData.total;
      this.onSubmit();
    },
    onListLimit(val) {
      this.listQuery.pageSize = val;
      this.listQuery.totalCount = this.listTableData.total;
      this.onSubmit();
    },
  }
};
</script>
<style lang="scss" scoped>
@import "~@/styles/modules/faceTrackAnalysis.scss";
</style>
