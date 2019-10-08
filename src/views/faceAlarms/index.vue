<template>
  <div class="app-container">
    <!-- 表单筛选 -->
    <el-form class="common-table-form" ref="listForm" :model="listQuery" :inline="true" @keyup.enter.native="onSearch" size="mini">
      <el-form-item prop="pageNo" class="m0" />
      <el-form-item prop="pageSize" class="m0" />
      <el-form-item prop="totalCount" class="m0" />
      <el-form-item label="以图搜图">
        <picture-search2 ref="picSearch"></picture-search2>
      </el-form-item>
      <el-form-item label="关键字" prop="_filter_like_keyword">
        <el-input size="mini" placeholder="姓名/证件号" v-model="listQuery._filter_like_keyword" />
      </el-form-item>
      <el-form-item label="时间" prop="_filter_ge_beginTime">
        <date-picker :beginTime.sync="listQuery._filter_ge_beginTime" :endTime.sync="listQuery._filter_le_endTime" />
      </el-form-item>
      <el-form-item label="民族" prop="_filter_eq_race">
        <race-select v-model="listQuery._filter_eq_race" clearable placeholder="请选择" />
      </el-form-item>
      <el-form-item label="布控任务" prop="_filter_in_monitorIds">
        <el-select v-model="listQuery._filter_in_monitorIds" filterable placeholder="布控任务" remote clearable>
          <el-option v-for="item in taskData" :key="item.id" :value="item.id" :label="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="实有设备" prop="_filter_in_deviceIds">
        <!-- <communities-select style="min-width:130px" class="nowrap" collapse-tags v-model="listQuery._filter_in_communityIds" placeholder="请选择布控区域" multiple /> -->
        <device-select ref="deviceSelect" @change="deviceChange" :deviceCameraType="1"></device-select>
      </el-form-item>
      <el-form-item label="处理状态" prop="_filter_eq_handleFlag">
        <dict-select dict-name="comm_handle_flag" v-model="listQuery._filter_eq_handleFlag"/>
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
      <div class="right">
        <el-button class="txt-btn" size="mini" type="text" icon="el-icon-download" @click="download(0)">Excel导出当前页</el-button>
        <el-button class="txt-btn" size="mini" type="text" icon="el-icon-download" @click="download(1)">Excel导出全部</el-button>
      </div>
      <div class="title">
        告警消息
        <em v-if="listTableData.total">{{listTableData.total}}</em>
      </div>
    </div>

    <!-- 表格模式 S -->
    <el-table ref="listTabel" :data="listTableData.rows" :height="tableHeight" v-loading.body="listTableLoading" highlight-current-row>
      <el-table-column label="序号" align="center" type="index" width="50" />
      <el-table-column label="抓拍照片" align="center" width="80">
        <template slot-scope="scope">
          <suspension-menu :SuspensionData="scope.row" width="48px" height="48px"/>
        </template>
      </el-table-column>
      <el-table-column label="相似度" align="center" width="70">
        <template slot-scope="scope" v-if="scope.row.similarity">{{scope.row.similarity |percentage}}%</template>
      </el-table-column>
      <el-table-column label="证件照片" align="center" width="80">
        <template slot-scope="scope">
          <img-show class="pic" width="48px" height="48px" text="暂无照片" :img-src="scope.row.identityImgPath" />
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
      <el-table-column prop="name" label="姓名/证件号" width="180px">
        <template slot-scope="scope">
          <div class="identity txt">
            <label>{{scope.row.name}}</label>
            <p>{{scope.row.identityNo}}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="类别" align="center" min-width="60px">
        <template slot-scope="scope">
          <face-category-list :data="faceLibraryData" :type="0" :chosen="scope.row.personTags?scope.row.personTags.split(','):[]" />
        </template>
      </el-table-column>
      <el-table-column align="center" width="60" prop="sex" label="性别" />
      <el-table-column align="center" width="60" prop="age" label="年龄" />
      <el-table-column prop="nationName" label="民族" width="60px" align="center" >
        <!-- <template slot-scope="scope">
          <div>{{ scope.row.nation === 5 ? '维族' : '未知'}}</div>
        </template> -->
      </el-table-column>
      <el-table-column align="left" min-width="90" label="采集设备">
        <template slot-scope="scope">
          <camera-video :mode="0" :deviceCode="scope.row.deviceCode" :deviceName="scope.row.deviceName" :onLine="scope.row.onLine" :chanDpid="scope.row.chanDpid"/>
        </template>
      </el-table-column>
      <el-table-column align="left" min-width="120" prop="policeAreaName" label="辖区" />
      <el-table-column align="left" min-width="120" prop="monitorName" label="布控任务" />
      <el-table-column align="center" min-width="150" prop="imgTime" label="采集时间" />
      <el-table-column align="center" min-width="150" prop="createTime" label="告警生成时间" />
      <el-table-column align="center" min-width="80" label="处理状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row.handleFlag == 1 ? 'primary' : 'danger'" close-transition>
            <span>{{scope.row.handleFlag == 1 ? '已处理' : '未处理'}}</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" width="80" align="center" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" :type="scope.row.handleFlag == 0?'warning':'success'" v-permission="scope.row.handleFlag == 0?'FUNC_FACEALARM_UPDATE':'FUNC_FACEALARM_INFO'" @click="onDetails(scope.row.id)">{{scope.row.handleFlag == 0 ? '处理' : '详情'}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格模式 E -->
    <el-pagination @size-change="onListLimit" @current-change="onListPaging" :current-page="listQuery.pageNo" :page-size="listQuery.pageSize" :page-sizes="[15,30,50]" layout="total, sizes, prev, pager, next, jumper" :total="listTableData.total" />

    <!-- 图片弹窗 -->
    <picture-viewer :isOpen.sync="isBgDialog" :bgImgInfo="bgImgInfo" />

    <!-- 处理弹窗 -->
    <dispose-layer :is-open.sync="isDisposeDialog" :id="disposeId" :data="disposeData" @complete="getTableList" />
  </div>
</template>
<script>
import { mapState } from "vuex";
import { singlePickerOptions  } from "@/utils";
import { postSearchIdentityNo } from "@/api/common";
import { getMonitorTaskPersonalSelect } from "@/api/faceMonitor";
import { getAlarmList, getAlarmDetail, getExcel } from "@/api/faceAlarms";
import { postChanList, getCheckOnline } from "@/api/video";

export default {
  name: "faceAlarms",
  components: {
    DisposeLayer: () => import("./components/DisposeLayer"),
    JurisdictionPersonSearch: () => import("@/components/JurisdictionPersonSearch")
  },
  data() {
    return {
      singlePickerOptions: singlePickerOptions,
      tableHeight: 'calc(100vh - 303px)',

      listQuery: {
        pageNo: 1,
        pageSize: 15,
        totalCount: null,
        _filter_ge_beginTime: null,
        _filter_le_endTime: null,
        _filter_in_deviceIds: null,
        _filter_in_monitorIds: null,
        _filter_eq_handleFlag: null,
        _filter_in_identityNos: null,
        _filter_eq_race: null,
        _filter_like_policeAreaCode: null, //辖区
      },

      conctrl: false,
      identityQuery: {
        imgBase64: null,
        keyword: ""
      },
      listTableData: {},
      listTableLoading: false,

      isDisposeDialog: false,
      disposeData: null,
      disposeId: null,

      taskData: [],

      // 控制背景图显示
      isBgDialog: false,
      bgImgInfo: {},

      // 视频
      chanListData:null,
      deviceCache: [],//设备缓存
    };
  },
  computed: {
    ...mapState({
      faceLibraryData: state => state.commonData.faceLibraryData,
      userInfo: state=> state.user.userInfo,
    })
  },
  async created() {
    this.listQuery._filter_like_policeAreaCode = this.userInfo.policeAreaCode
    await postChanList([]).then(res => {
      this.chanListData=res.data;
    })
    this.initData();
  },
  activated() {
    this.initData();
  },
  methods: {
    initData() {
      //1秒内禁止访问两次,activated引发的重复调用
      if (this.conctrl) {
        return
      }
      this.conctrl = true
      setTimeout(() => {
        this.conctrl = false
      }, 1000)
      this.$store.dispatch("commonData/getFaceLibraryData");

      getMonitorTaskPersonalSelect().then(res => {
        this.taskData = res.data;
      });
      if (this.$route.query.type) {
        this.$nextTick(() => {
          switch (this.$route.query.type) {
            case "time":
              this.$refs.listForm.resetFields();
              this.listQuery = Object.assign(this.listQuery, {
                _filter_ge_beginTime: this.moment()
                  .startOf("days")
                  .format("YYYYMMDDHHmmss"),
                _filter_le_endTime: this.moment()
                  .hour(23)
                  .minute(59)
                  .second(59)
                  .format("YYYYMMDDHHmmss")
              });
              this.getTableList();
              break;
            case "state":
              this.$refs.listForm.resetFields();
              this.listQuery._filter_eq_handleFlag = 0;
              this.getTableList();
              break;
          }
        });
      } else {
        this.getTableList();
      }
    },
    async getTableList() {
      this.listTableLoading = true;
      let _data;
      await getAlarmList({ ...this.listQuery }).then(res => {
          _data = res.data;
          return _data;
        })
        .finally(() => {
          this.listTableLoading = false;
        });
      
      if (_data.rows) {
        for(let i =0; i < _data.rows.length; i++) {
          if(this.chanListData) {
            for(let j = 0; j < this.chanListData.length; j++) {
              if(_data.rows[i].deviceCode == this.chanListData[j].deviceCode) {
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
    },
    // 查询
    async onSearch() {
      //传关键字到组件搜索身份证号
      let data = []
      await this.$refs.picSearch.picSearch(this.listQuery._filter_like_keyword).then(res => {
        data = res
      })
      if (!data) { //当以图搜图条件都为空
        this.listQuery = Object.assign(this.listQuery, {
          pageNo: 1,
          // pageSize: 15,
          totalCount: null,
          _filter_in_identityNos: null,
        });
        this.getTableList();
      } else if (data.length) { //当有身份证时
        this.listQuery = Object.assign(this.listQuery, {
          pageNo: 1,
          // pageSize: 15,
          totalCount: null,
          _filter_in_identityNos: data.join(',')
        });
        this.getTableList();
      } else { 
        this.listTableData = {
          rows: [],
          total: 0
        }
      }
    },
    onResetForm() {
      this.$refs.listForm.resetFields();
      this.listQuery._filter_in_identityNos = null;
      this.$refs.deviceSelect.clear();
      this.$refs.picSearch.clear();
      this.$refs.jurisdictionPersonSearch.clear();
      this.getTableList();
    },
    // 查看底库资料
    onDetails(id) {
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
        this.disposeId = id;
        this.$nextTick(() => {
          this.isDisposeDialog = true;
        });
      });
    },
    // 查看大图
    onLookPicture(data) {
      if (!data) return;
      const { bgImgPath, snapImgPath, identityImgPath, similarity } = data;
      this.bgImgInfo = {
        rowBgImg: bgImgPath,
        snapImgPath,
        identityImgPath,
        similarity: Math.floor(similarity * 100)
      };
      this.isBgDialog = true;
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
    onSearchChange(val, img) {
      this.identityQuery = {
        keyword: val,
        imgBase64: img
      };
    },

     // excel下载
    download(val) {
      let _listQuery = this.listQuery;
      this.$set(_listQuery, "doAll", val)
      getExcel(_listQuery).then(res => {
        let isSuccess = res.status === 200;
        if (!isSuccess) {
          this.$notify({
            title: "失败",
            message: response.message,
            type: "error",
            duration: 2000
          });
          return;
        }else {
          this.$notify({
            title: "成功",
            message: '文件导出中，请到导出记录进行查看',
            type: "success",
            duration: 2000
          });
          this.$router.push({
            name: "exportRecord",
          });
        }
      })
    },
    deviceChange(val) {
      this.$set(this.listQuery, '_filter_in_deviceIds', val)
    },
    getjurisdiction(val) {
      console.log(val)
      this.listQuery._filter_like_policeAreaCode = val
    }
  },
  mounted() {
    // document.title = '警情速递 - AiTensor'
    this.$nextTick(() => {
      this.tableHeight = `calc(100vh - ${ this.$refs.listForm.$el.clientHeight + 209 }px)`
    })
  }
};
</script>
<style lang="scss" scoped>
.app-container {
  display: table;
  position: relative;
  height: 100%;
  .common-table-form {
    .el-date-editor {
      width: 330px;
    }
    .el-select {
      width: 100px;
    }
    .picture-search {
      width: 140px;
    }
  }

  .el-table {
    .identity {
      line-height: 140%;
      label {
        font-size: 14px;
      }
      p {
        color: #9da5af;
      }
    }
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
    .el-button {
      margin: 2px 0;
    }
  }

  .el-pagination {
    padding: 10px;
  }
}
</style>
