<template>
  <div class="app-container">
    <!-- 表单筛选 -->
    <el-form class="common-table-form" ref="listForm" :model="listQuery" :inline="true" @keyup.enter.native="onSearch" size="mini">
      <el-form-item prop="pageNo" class="m0" />
      <el-form-item prop="pageSize" class="m0" />
      <el-form-item prop="totalCount" class="m0" />
      <el-form-item prop="_filter_le_collectTime_date" class="m0" />
      <el-form-item label="以图搜图">
        <picture-search2 ref="picSearch"></picture-search2>
      </el-form-item>
      <el-form-item prop="_filter_like_keywords" label="关键字">
        <el-input v-model="listQuery._filter_like_keywords" style="width: 130px" placeholder="姓名/证件号码" />
      </el-form-item>
      <el-form-item prop="_filter_ge_collectTime_date" label="时间">
        <date-picker :beginTime.sync="listQuery._filter_ge_collectTime_date" :endTime.sync="listQuery._filter_le_collectTime_date" />
        <!-- <el-date-picker v-model="listQuery._filter_ge_collectTime_date" value-format="yyyyMMddHHmmss" type="datetime" placeholder="请选择开始时间" :picker-options="singlePickerOptions()" />
        <el-date-picker v-model="listQuery._filter_le_collectTime_date" value-format="yyyyMMddHHmmss" type="datetime" placeholder="请选择结束时间" :picker-options="singlePickerOptions(listQuery._filter_ge_collectTime_date)" /> -->
      </el-form-item>
      <el-form-item prop="_filter_in_personTags" label="人员类别">
        <face-library-select v-model="listQuery._filter_in_personTags" clearable class="nowrap" placeholder="全部" />
      </el-form-item>
      <el-form-item prop="_filter_eq_passType" label="通行类型">
        <el-select v-model="listQuery._filter_eq_passType" clearable>
          <el-option v-for="item in passTypeOption" :key="item.value" :value="item.value" :label="item.label" />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="民族" prop="_filter_eq_tagsValue">
        <race-select v-model="listQuery._filter_eq_tagsValue" clearable placeholder="请选择" />
        <el-select v-model="listQuery._filter_eq_tagsValue" clearable>
          <el-option v-for="item in raceTypeOption" :key="item.value" :value="item.value" :label="item.label"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="民族" prop="_filter_eq_nation_int">
        <!-- <race-select v-model="listQuery._filter_eq_tagsValue" clearable placeholder="请选择" /> -->
        <dict-select dict-name="comm_nation" v-model="listQuery._filter_eq_nation_int" />
        <!-- <el-select v-model="listQuery._filter_eq_nation_int" clearable>
          <el-option v-for="item in raceTypeOption" :key="item.value" :value="item.value" :label="item.label"></el-option>
        </el-select> -->
      </el-form-item>
      <el-form-item prop="_filter_eq_communityId_long" label="所属小区">
        <communities-select v-model="listQuery._filter_eq_communityId_long" class="nowrap" clearable/>
      </el-form-item>
      <el-form-item prop="_filter_eq_deviceId_long" label="实有设备">
        <device-select ref="deviceSelect" @change="deviceChange" :deviceCameraType="1"/>
      </el-form-item>
      <el-form-item label="辖区" prop="_filter_like_policeAreaCode">
        <div style="width: 178px;height: 26px;">
          <jurisdiction-person-search @change="getjurisdiction" ref="jurisdictionPersonSearch"></jurisdiction-person-search>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="onResetForm">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 工具栏 -->
    <div class="common-tool">
      <div class="title">
        人行记录
        <em v-if="listTableData.total">{{listTableData.total}}</em>
      </div>
      <div class="right">
        <el-button-group class="switch">
          <el-button :type="mode===0?'primary':'info'" @click="mode=0" size="mini">
            <svg-icon icon-class="category" />
          </el-button>
          <el-button :type="mode===1?'primary':'info'" @click="mode=1" size="mini">
            <svg-icon icon-class="images" />
          </el-button>
        </el-button-group>
      </div>
    </div>

    <!-- 表格模式 S -->
    <el-table v-if="mode==0" ref="listTabel" :data="listTableData.rows" :height="tableHeight" v-loading.body="listTableLoading" element-loading-text="加载中，请稍后..." highlight-current-row>
      <el-table-column align="center" label="序号" type="index" width="50px" />
      <el-table-column align="center" label="照片对比" width="200px">
        <template slot-scope="scope">
          <suspension-menu :SuspensionData="scope.row" :passRecord="true" />
        </template>
      </el-table-column>
      <el-table-column label="背景图" align="center" width="120">
        <template slot-scope="scope">
          <a @click="onLookPicture(scope.row)" v-if="scope.row.bgImgPath">
            <img-show height="48px" txt="暂无背景" :img-src="scope.row.bgImgPath" class="bg-pic" />
          </a>
          <div v-else>暂无背景</div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="personName" label="姓名" />
      <el-table-column align="center" prop="identityNo" label="证件号码" min-width="160" />
      <el-table-column align="center" prop="passType" label="类型">
        <template slot-scope="scope">
          <span>{{scope.row.passType | commonFilter('pass_type')}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="nationName" label="民族" width="60px" align="center" >
        <!-- <template slot-scope="scope">
          <div>{{ scope.row.tags && scope.row.tags.length ? scope.row.tags[0].value === 1 ? '维族' : '未知' : '' }}</div>
        </template> -->
      </el-table-column>
      <el-table-column align="center" prop="communityName" label="所属小区" min-width="100px" />
      <el-table-column align="center" label="采集设备">
        <template slot-scope="scope">
          <camera-video :mode="mode" :deviceCode="scope.row.deviceCode" :deviceName="scope.row.deviceName" :onLine="scope.row.onLine" :chanDpid="scope.row.chanDpid"/>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="policeAreaName" label="辖区" min-width="100px" />
      <!-- <el-table-column align="center" prop label="单位类型"/> -->
      <el-table-column align="center" label="类别">
        <template slot-scope="scope">
          <face-category-list :data="faceLibraryData" :type="0" :chosen="scope.row.personTagsStr?scope.row.personTagsStr.split(','):[]" />
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" prop label="年龄"/> -->
      <!-- <el-table-column align="center" prop label="性别"/> -->
      <el-table-column align="center" prop="collectTime" label="通行时间" min-width="150px" />
      <el-table-column align="center" prop="createTime" label="入库时间" min-width="150px" />
      <el-table-column fixed="right" align="center" label="操作" min-width="180px">
        <template slot-scope="scope">
          <video-button :videoData="scope.row" :page="listQuery.pageNo" @complete="isLoading" />
          <el-button size="mini" type="primary" v-if="scope.row.passType==2" @click="onDoor(scope.row)">门禁详情</el-button>
          <el-button size="mini" type="primary" @click="onVisit(scope.row)">拜访详情</el-button>
          <el-button size="mini" type="success" @click="onDetails(scope.row)" v-permission="'FUNC_PASSRECORD_PERSORINFO'">底库资料</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格模式 E -->
    <!-- 卡片模式 S -->
    <div class="card-list" v-if="mode == 1" v-loading.body="listTableLoading" :style="{ height: tableHeight }">
      <div class="item" v-for="item in listTableData.rows" :key="item.id">
        <div class="pic">
          <img-show class="pic" width="180px" height="180px" text="暂无照片" :img-src="item.snapImgPath" />
          <face-category-list :data="faceLibraryData" :type="1" :chosen="item.personTagsStr?item.personTagsStr.split(','):[]" />
          <div class="mask">
            <span>{{item.collectTime}}</span>
          </div>
        </div>
        <div class="box">
          <div class="txt">
            <svg-icon icon-class="user" />
            <b class="name">{{item.personName}}</b>
          </div>
          <div class="txt">
            <svg-icon icon-class="category" />
            <label>{{item.communityName}}</label>
          </div>
          <div class="txt">
            <svg-icon icon-class="credentials" />
            <label>{{item.identityNo}}</label>
          </div>
          <div class="txt">
            <svg-icon icon-class="locale" />
            <label style="margin-right:10px">{{item.communityName}}</label>
            <label>
              <camera-video :mode="mode" :deviceCode="item.deviceCode" :deviceName="item.deviceName" :onLine="item.onLine" :chanDpid="item.chanDpid" />
            </label>
          </div>
          <div class="txt">
            <svg-icon icon-class="home" />
            <label>社区</label>
          </div>
          <div class="txt">
            <svg-icon icon-class="clustering" />
            <label v-if="item.similarity">相似度：{{item.similarity |percentage}}%</label>
            <label v-else>相似度：未知</label>
          </div>
          <div class="btns">
            <el-button size="mini" v-if="item.passType==2" @click.stop="onDoor(item)">门禁详情</el-button>
            <el-button size="mini" v-if="item.passType==3" @click="onVisit(item)">拜访详情</el-button>
            <!-- <el-button size="mini" @click="onOpenLayer(item)">轨迹</el-button>-->
            <el-button size="mini" @click.stop="onDetails(item)" v-permission="'FUNC_PASSRECORD_PERSORINFO'">底库资料</el-button>
          <video-button :videoData="item" @complete="isLoading" />
          </div>
        </div>
      </div>
    </div>
    <!-- 卡片模式 E -->
    <el-pagination @size-change="onListLimit" @current-change="onListPaging" :current-page.sync="listQuery.pageNo" :page-sizes="[15,30,50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="listTableData.total" />

    <!-- 图片弹窗 -->
    <picture-viewer :isOpen.sync="isBgDialog" :bgImgInfo="bgImgInfo" />

    <!-- 视频弹窗 -->
    <!-- <video-play :is-open.sync="isVideoDialog" :videoData="videoData" :type="1" /> -->
    <!-- 底库详情弹窗 -->
    <label-form :is-open.sync="isDetailsForm" :id.sync="personId" :readonly="formReadonly"/>

    <!-- 门禁详情 -->
    <door-form :is-open.sync="isDoorForm" :data="doorData" />

    <!-- 拜访详情 -->
    <visit-form :is-open.sync="isVisitForm" :data="visitData" />

    <!-- 以图搜图 - 弹窗 -->
    <picture-layer :is-open.sync="isPictureDialog" :data="trackAnalysis" :single="single" :jumpData="jumpData" />
  </div>
</template>
<script>
import moment from "moment";
import { mapState } from "vuex";
import { singlePickerOptions } from "@/utils";
import { getFaceLibraryList, getPersonImg } from "@/api/common";
import { getPassRecordsList, getIdentityImg } from "@/api/passRecord";
import { postChanList, getCheckOnline, getReqVideo } from "@/api/video";

export default {
  name: "passRecord",
  components: {
    DoorForm: () => import("./components/DoorForm"),
    VisitForm: () => import("./components/VisitForm"),
    LabelForm: () => import("@/components/FaceLabelForm"),
    JurisdictionPersonSearch: () => import("@/components/JurisdictionPersonSearch")
  },
  data() {
    return {
      isWaitting: true,
      isPlayVideo: true,
      isPictureDialog: false,
      trackAnalysis: null,
      single: false,
      jumpData: {
        jump: false,
        jumpUrl: String
      },

      tableHeight: '200px',
      mode: 0,
      singlePickerOptions: singlePickerOptions,
      isPictureDialog: false,
      isBgDialog: false, // 控制背景图显示
      bgImgInfo: {},

      listQuery: {
        pageNo: 1,
        pageSize: 15,
        totalCount: null,
        _filter_ge_collectTime_date: this.moment(new Date().getTime() - (3 * 3600 * 24 * 1000)).format("YYYYMMDDHHmmss"),
        _filter_le_collectTime_date: null,
        _filter_eq_communityId_long: null,
        _filter_in_libraryNumArr_intarr: null,
        _filter_like_keywords: null,
        _filter_eq_passType: null,
        _filter_eq_personId_long: null,
        _filter_eq_nation_int: null,
        _filter_eq_deviceId_long: null,
        _filter_like_policeAreaCode: null,
      },

      passTypeOption: [
        { value: "Face", label: "人脸" },
        { value: "Car", label: "车辆" },
        { value: "Access", label: "门禁" },
        { value: "Visit", label: "拜访" }
      ],
      raceTypeOption: [
        // { value: "Common" , label: '汉族'},
        { value: 5 , label: '维族'},
        // { value: "White" , label: '白人'},
        // { value: "Black" , label: '黑人'},
      ],
      listTableData: {},
      listTableLoading: false,
      // 实时视频
      videoData: null,
      isVideoDialog: false,
      videoDialogType: 0, //0为实时视频，1为抓拍视频
      // 人员详情
      isDetailsForm: false,
      formReadonly: true,
      state: null,
      personId: null,
      // 门禁详情
      isDoorForm: false,
      doorData: null,
      // 拜访详情
      isVisitForm: false,
      visitData: null,
      // 轨迹
      trackAnalysis: null,
      single: false,
      jumpData: {
        jump: false,
        jumpUrl: String
      },

      chanListData: null,
      deviceCache: [],
    };
  },
  mounted() {
    this.listQuery._filter_like_policeAreaCode = this.userInfo.policeAreaCode
    this.$nextTick(() => {
      this.tableHeight = `calc(100vh - ${ this.$refs.listForm.$el.clientHeight + 209 }px)`
    })
  },
  activated() {
    this.queryByUrlParams();
  },
  async created() {
    this.queryByUrlParams();
    await postChanList([]).then(res => {
      this.chanListData = res.data;
    })
    if (!this.$route.query.personId) {
      this.$nextTick(() => {
        this.getTableList();
        this.$store.dispatch("commonData/getFaceLibraryData");
      })
    }
  },
  computed: {
    ...mapState({
      faceLibraryData: state => state.commonData.faceLibraryData,
      userInfo: state=> state.user.userInfo,
    })
  },
  methods: {
    queryByUrlParams() {
      if (Object.keys(this.$route.query).length > 0) {
        this.listQuery = Object.assign(this.listQuery, {
          pageNo: 1,
          pageSize: 15,
          totalCount: null,
          _filter_ge_collectTime_date: null,
          _filter_le_collectTime_date: null,
          _filter_eq_communityId_long: null,
          _filter_in_libraryNumArr_intarr: null,
          _filter_like_keywords: null
        });
        this.listQuery._filter_eq_passType = this.$route.query.type;
        this.listQuery._filter_eq_personId_long = this.$route.query.personId;
        this.getTableList();
      }
    },
    async getTableList() {
      // if (this.listQuery._filter_eq_nation_int) {
      //   this.$set(this.listQuery, '_filter_eq_tagsType', 'Race')
      // }
      let _data;
      await getPassRecordsList({ ...this.listQuery }).then(res => {
        if (res.status == 200) {
          _data = res.data;
          return _data
        }
      })
      .finally(() => {
        this.listTableLoading = false;
      });
      
      if (_data.rows) {
        for(let i = 0; i < _data.rows.length; i++) {
          if(this.chanListData) {
            for(let j = 0; j < this.chanListData.length; j++) {
              if(this.chanListData[j].deviceCode == _data.rows[i].deviceCode) {
                this.$set(_data.rows[i], 'isReqVideo', true);
                this.$set(_data.rows[i], 'chanDpid', this.chanListData[j].chanDpid);
                if(this.deviceCache.indexOf(this.chanListData[j].chanDpid) < 0) {
                await getCheckOnline(this.chanListData[j].chanDpid).then(res => {
                    if (res.data.state == 1) {
                      this.deviceCache.push(this.chanListData[j].chanDpid);
                      this.$set(_data.rows[i], 'onLine', true);
                    };
                  })
                }else {
                  this.$set(_data.rows[i], 'onLine', true);
                }
              }
            }
          }
        }
      }
      this.listTableData = _data;
      this.listQuery.totalCount = this.listTableData.total;
    },
    // 查询
    async onSearch() {
      let data = []
      await this.$refs.picSearch.picSearch(this.listQuery._filter_like_keywords).then(res => {
        data = res
      })
      if (!data) { //当以图搜图条件都为空
        this.listQuery = Object.assign(this.listQuery, {
          pageNo: 1,
          pageSize: 15,
          totalCount: null,
          _filter_in_identityNo_strarr: null
        });
        this.getTableList();
      } else if (data.length) { //当有身份证时
        this.listQuery.totalCount = null;
        this.listQuery = Object.assign(this.listQuery, {
          pageNo: 1,
          // pageSize: 15
          totalCount: null,
          _filter_in_identityNo_strarr: data.join(',')
        });
        this.getTableList();
      } else {
        this.listTableData = {
          rows: [],
          total: 0
        }
      }
    },
    // 列表参数重置
    onResetForm() {
      this.$refs.listForm.resetFields();
      this.listQuery._filter_in_identityNo_strarr = null
      this.$refs.deviceSelect.clear()
      this.$refs.jurisdictionPersonSearch.clear()
      this.$refs.picSearch.clear()
      this.getTableList();
    },
    // 分页更新
    onListLimit(val) {

      this.listQuery.pageSize = val;
      this.getTableList();
    },
    // 分页更新
    onListPaging(val) {
      this.listQuery.pageNo = val;
      this.getTableList();
    },
    // 实时视频
    onVideo(row) {
      this.isVideoDialog = true;
      this.videoData = row;
    },
    // 查看门禁详情
    onDoor(row) {
      this.doorData = row;
      this.isDoorForm = true;
    },
    // 查看拜访详情
    onVisit(row) {
      this.visitData = row;
      this.isVisitForm = true;
    },
    // 查看底库资料
    onDetails(row) {
      this.isDetailsForm = true;
      this.personId = row.personId;
    },
    // 查看背景大图
    onLookPicture(data) {
      const { bgImgPath, snapImgPath, similarity = 0, personId } = data;
      this.bgImgInfo = {
        rowBgImg: bgImgPath,
        snapImgPath,
        identityImgPath: `/api/person/personInfos/${personId}/img`,
        similarity: Math.floor(similarity * 100)
      };
      this.isBgDialog = true;
    },
    // 请求视频
    onReqVideo(data, e) {
      getReqVideo(data.refObjId).then(res => {
        if (res.data.ret === 0 && res.data.url) {
        }
        // 等待中 按钮
        this.$set(data, "isWaitting", true);
      })
    },
    isLoading(data) {
      this.listTableLoading = data;
    },
    deviceChange(val) {
      this.$set(this.listQuery, '_filter_eq_deviceId_long', val)
    },
    getjurisdiction(val) {
      this.listQuery._filter_like_policeAreaCode = val
    }
  }
};
</script>
<style lang="scss" scoped>
.app-container {
  height: 100%;
  // @media screen and (max-width:1500px){
  //    height: 106%;
  // }
  .common-table-form {
    .el-input {
      width: 100px;
    }
    .el-select {
      width: 110px;
    }
    .el-date-editor {
      width: 180px;
    }
  }
  .el-table {
    .picDiv {
      display: flex;
    }
    .picDiv span {
      line-height: 48px;
      width: 48px;
      white-space: nowrap;
      overflow: hidden;
    }
    .pic {
      width: 48px;
      height: 48px;
      margin: 0 auto;
      border-radius: 3px;
      overflow: hidden;
    }
    .bg-pic {
      display: inline-block;
      overflow: hidden;
      border-radius: 4px;
      vertical-align: top;
    }
    .el-button {
      margin-left: 0px !important;
      margin: 2px 0;
    }
    /deep/ {
      .el-button.el-button--small {
        padding: 10px !important;
      }
    }
  }
  .video {
    /deep/ {
      .el-button.el-button--mini {
        padding: 0px;
      }
    }
  }
  .el-pagination {
    padding: 10px;
  }
}

.card-list {
  height: calc(100vh - 255px);
  padding-bottom: 10px;
  overflow: auto;
  border-bottom: 1px #eee solid;
  .pic {
    position: relative;
    display: block;
    width: 180px;
    height: 180px;
    overflow: hidden;
    // img {
    //   display: block;
    //   width: 180px;
    //   height: 180px;
    // }
  }
  .mask {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.4);
    line-height: 18px;
    padding: 0 4px;
    font-size: 12px;
    color: #fff;
    .el-button {
      float: right;
      font-size: 12px;
      font-weight: bold;
      padding: 0px;
      color: #ffc600;
    }
    /deep/ {
      .el-button.el-button--mini {
        padding: 0;
        height: 18px;
      }
    }
  }
  .item {
    float: left;
    margin: 10px 0 0 10px;
    overflow: hidden;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    border: 1px solid transparent;
    &.sel {
      border-color: #0fa0ff;
    }
    b {
      font-size: 14px;
      color: #333;
    }
    label {
      font-size: 12px;
      color: #9da5af;
    }
    .box {
      width: 180px;
      padding: 6px;
    }
    .txt {
      display: flex;
      width: 100%;
      height: 18px;
      line-height: 18px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      .name {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .svg-icon {
      display: inline-block;
      height: 100%;
      margin-right: 4px;
      vertical-align: top;
      color: #b5c0cd;
    }
    .btns {
      margin-top: 4px;
      .el-button + .el-button {
        margin-left: 15px !important;
      }
    }
    .el-checkbox {
      float: right;
      margin-left: 4px;
      pointer-events: none;
    }
  }
}
</style>
