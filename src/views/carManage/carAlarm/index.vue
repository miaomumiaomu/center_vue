<template>
  <div class="app-container">
    <!-- 表单筛选 -->
    <el-form class="common-table-form" ref="listQuery"  :model="listQuery"
    :inline="true" @keyup.enter.native="onSearch" size="mini">
      <!-- <el-form-item prop="pageNo" class="m0" />
      <el-form-item prop="pageSize" class="m0" /> -->
      <el-form-item label="关键字" prop="_filter_like_plateNumber">
        <el-input @keyup.enter.native="onSearch" placeholder="车牌号" v-model="listQuery._filter_like_plateNumber" style="width:140px" />
      </el-form-item>
      <el-form-item label="时间" prop="_filter_ge_beginTime">
        <date-picker :beginTime.sync="listQuery._filter_ge_beginTime" :endTime.sync="listQuery._filter_le_endTime" />
      </el-form-item>
      <el-form-item label="" prop="_filter_le_endTime" />
      <!-- <el-form-item label="抓拍地点" prop="_filter_eq_communityCode">
        <el-select v-model="listQuery._filter_eq_communityCode" placeholder="请选择" style="width:120px" clearable>
          <el-option v-for="(item,index) in selectData" :key="index" :label="item.name" :value="item.code" />
        </el-select>
      </el-form-item> -->
      <el-form-item label="布控任务" prop="_filter_eq_monitorId">
        <el-select v-model="listQuery._filter_eq_monitorId" placeholder="请选择" filterable style="width:100px" clearable>
          <el-option v-for="(item,index) in options" :key="index" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="实有设备" prop="_filter_in_deviceIds">
        <device-select ref="deviceSelect" @change="deviceChange" :deviceCameraType="0"></device-select>
      </el-form-item>
      <el-form-item label="处理状态" prop="_filter_eq_handleFlag">
       <dict-select dict-name="comm_handle_flag" v-model="listQuery._filter_eq_handleFlag" style="width:100px" />
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
        告警消息
        <em v-if="listTableData.total">{{listTableData.total}}</em>
      </div>
      <!-- <div class="right">
        <el-button class="txt-btn" size="mini" type="text" icon="el-icon-delete" @click="onItemDelete()">删除</el-button>
        <el-button class="txt-btn" size="mini" type="text" icon="el-icon-upload" @click="onItemOutput()">导出</el-button>
      </div> -->
    </div>

    <!-- 表格模式 S -->
    <el-table ref="listTabel" :data="listTableData.rows" :height="tableHeight" v-loading.body="listTableLoading" highlight-current-row @select="select">
      <!-- <el-table-column label="多选" align="right" type="selection" width="60" /> -->
      <el-table-column label="序号" align="center" type="index" width="60" />
      <el-table-column label="抓拍照片" align="center" width="80" >
        <template slot-scope="scope">
          <img class="pic" :src="scope.row.plateImage" />
        </template>
      </el-table-column>
      <el-table-column prop="plateNumber" align="center" label="车牌号" width="120" />
      <el-table-column prop="libraryNums" align="center" label="类别" width="80" >
      <template slot-scope="scope">
          <face-category-list :data="carLibraryData" :type="0" :chosen="scope.row.libraryNums?scope.row.libraryNums.split(','):[]" />
        </template>
      </el-table-column>
      <!-- <el-table-column min-width="80" prop="communityName" align="center" label="抓拍地点" /> -->
      <el-table-column min-width="80" prop="deviceName" align="center" label="采集设备">
        <template slot-scope="{row: {deviceName, communityName}}">{{`${communityName ? communityName : ''} ${deviceName}`}}</template>
      </el-table-column>
      <el-table-column align="left" min-width="120" prop="policeAreaName" label="辖区" />
      <el-table-column min-width="150" prop="passTime" align="center" label="告警时间" />
      <el-table-column min-width="80" prop="monitorName" align="left" label="任务名称" />
      <el-table-column min-width="80" prop="handleFlag" align="center" label="处理状态" >
        <template slot-scope="scope">
          <el-tag :type="scope.row.handleFlag == '已处理' ? 'primary' : 'danger'" close-transition>
            <span>{{scope.row.handleFlag}}</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" width="80" align="center" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="warning" @click="onItemDetails(scope.row.id)"  v-if="scope.row.handleFlag === '未处理'" v-permission="'FUNC_CARMANAGE_UPDATE'">处理</el-button>
          <el-button size="mini" type="success" @click="onItemDetails(scope.row.id)" v-else v-permission="'FUNC_CARMANAGE_INFO'">详情</el-button>
          <!-- <el-button size="mini" type="primary" @click="onItemEdit(scope.row.id)">轨迹</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <!-- 页码 -->
    <el-pagination @size-change="onListLimit" @current-change="onListPaging" :current-page.sync="listQuery.pageNo" :page-sizes="[15,30,50]" layout="total, sizes, prev, pager, next, jumper" :total="listTableData.total" />

    <!-- 表单详情   -->
    <alarm-form :is-open.sync="isAlarmDialog" :form="form" @complete="getTableList" :id="dealId"/>
  </div>


</template>
<script>
import { mapState } from "vuex";
import { singlePickerOptions } from "@/utils";
import { getCommunitiesList } from "@/api/faceLibrary";
import { getCarAlarmList, getCarAlarmInfo, getCarAlarmPersonalData, deleteCarAlarmLogs } from "@/api/carManage";

export default {
  name: "carAlarm",
  components: {
    AlarmForm: () => import("./components/AlarmForm"),
    JurisdictionPersonSearch: () => import("@/components/JurisdictionPersonSearch")
  },
  data: () => ({
    dealId: null,
    listQuery: {
      pageNo: 1, //页码
      pageSize: 15, //页数
      _filter_like_plateNumber: null, //搜索车牌号
      _filter_ge_beginTime: null, //开始时间
      _filter_le_endTime: null, //结束时间
      _filter_eq_communityCode: null, //抓拍地点
      _filter_eq_monitorId: null, // 布控ID
      _filter_eq_handleFlag: null, //处理状态
    },
    ids: [],
    //详情窗口
    isAlarmDialog: false,
    taskFormId: null,
    //数据加载状态
    listTableLoading: false,
    //选中 删除 或 导出 的数据
    listIds: [],
    //工具栏 表单  数据
    listTableData: {},
    // 处理 数据
    form: {},
    //抓拍地点数据 
    options: Array,
    singlePickerOptions: singlePickerOptions,
    selectData: null,//小区选择
    tableHeight: '200px',
  }),
  computed: {
    ...mapState({
      carLibraryData: state => state.commonData.carLibraryData,
      userInfo: state=> state.user.userInfo,
    })
  },
  activated() {
    // if( Object.keys(this.$route.params).length > 0 ) {
    //   this.listQuery = Object.assign(this.listQuery, {
    //     pageNo: 1, //页码
    //     pageSize: 15, //页数
    //     _filter_like_plateNumber: null, //搜索车牌号
    //     _filter_ge_beginTime: null, //开始时间
    //     _filter_le_endTime: null, //结束时间
    //     _filter_eq_communityCode: null, //抓拍地点
    //     _filter_eq_monitorId: null, // 布控ID
    //     _filter_eq_handleFlag: null //处理状态
    //   })

    //   this.listQuery._filter_like_plateNumber = this.$route.params.plateNumber
    //   this.$nextTick( () => {
        this.initData();
    //   })
    // }
  },
  created() {
    this.listQuery._filter_like_policeAreaCode = this.userInfo.policeAreaCode
    this.initData();
    this.$store.dispatch("commonData/getCarLibraryData");
    getCarAlarmPersonalData().then(res => {
      this.options = res.data
    });
    getCommunitiesList().then(res => {
      this.selectData = res.data;
    });
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = `calc(100vh - ${ this.$refs.listQuery.$el.clientHeight + 209 }px)`
    })
  },
  methods: {
    initData() {
      if (this.$route.query.type) {
        this.$nextTick(() => {
          switch (this.$route.query.type) {
            case "time":
              this.$refs.listQuery.resetFields();
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
              this.onSearch();
              break;
            case "state":
              this.$refs.listQuery.resetFields();
              this.listQuery._filter_eq_handleFlag = 0;
              this.onSearch();
              break;
          }
        });
      } else {
        this.getTableList();
      }
    },
    getTableList() {
      getCarAlarmList(this.listQuery)
        .then(res => {
          if (res.status == 200) {
            this.listTableData = res.data;
          }
        })
        .finally(() => {
          this.listTableLoading = false;
        });
    },

    //查询
    onSearch() {
      this.listQuery = Object.assign(this.listQuery, {
        pageNo: 1,
        pageSize: 15
      });
      this.getTableList();
    },
    //重置
    onResetForm() {
      this.$refs.listQuery.resetFields();
      this.$refs.deviceSelect.clear()
      this.$refs.jurisdictionPersonSearch.clear()
      this.getTableList();
    },
    //删除
    onItemDelete() {
      if (!this.listIds.length) {
        this.$notify({
          title: "提示",
          message: "请选择需要删除的数据",
          type: "warning",
          duration: 2000
        });
        return;
      }

      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        confirmButtonClass: "el-button--mini",
        cancelButtonClass: "el-button--mini fr",
        type: "warning"
      }).then(() => {
        deleteCarAlarmLogs({
          ids: this.listIds
        }).then(res => {
            let isSuccess = res.status === 200;
            this.$notify({
              title: isSuccess ? "成功" : "失败",
              message: isSuccess ? "删除成功" : res.message,
              type: isSuccess ? "success" : "error",
              duration: 2000
            });
            if (isSuccess) {
              this.getTableList();
            }
          });
      });
    },

    //导出
    onItemOutput() {
      if (!this.listIds.length) {
        this.$notify({
          title: "提示",
          message: "请选择需要导出的数据",
          type: "warning",
          duration: 2000
        });
        return;
      }
      this.$confirm("此操作将导出数据, 是否继续?", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        confirmButtonClass: "el-button--mini",
        cancelButtonClass: "el-button--mini fr",
        type: "success"
      }).then(() => {
        // this.$store
        //   .dispatch("camera/remove", { ids: this.listIds })
        //   .then(res => {
        //     let isSuccess = res.status === 200;
        //     this.$notify({
        //       title: isSuccess ? "成功" : "失败",
        //       message: isSuccess ? "删除成功" : res.message,
        //       type: isSuccess ? "success" : "error",
        //       duration: 2000
        //     });
        //     if (isSuccess) {
        //       this.updateView();
        //     }
        //   });
      });
    },

    // 表格选中 数据
    select(selection) {
      this.listIds = selection.map(item => item.id);
    },

    // 查看 详情
    onItemDetails(id) {
      this.dealId = id
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

        this.form = res.data;
        this.$nextTick(() => {
          this.isAlarmDialog = true;
        });
      });
    },

    //轨迹
    onItemEdit(id) {
      this.taskFormId = id;
    },

    /* 分页处理 */
    onListPaging(val) {
      this.listQuery.pageNo = val;
      this.getTableList();
    },
    onListLimit(val) {
      this.listQuery.pageSize = val;
      this.getTableList();
    },
    /* 分页处理 */
    deviceChange(val) {
      console.log(val)
      this.$set(this.listQuery, '_filter_in_deviceIds', val)
    },
    getjurisdiction(val) {
      this.listQuery._filter_like_policeAreaCode = val
    }
  }
};
</script>

<style lang="scss" scoped>
.app-container {
  position: relative;
  height: 100%;
  // @media screen and (max-width:1500px){
  //    height: 106%;
  // }
  .el-pagination {
    padding: 10px;
  }
  .label-item {
    display: inline-block;
    height: 22px;
    line-height: 18px;
    padding: 0 3px;
    margin: 0 4px 4px;
    text-align: center;
    border: 2px #fff solid;
    border-radius: 99px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    font-size: 12px;
    color: #fff;
    
  }
  .pic {
      display: block;
      width: 48px;
      height: 48px;
      margin: 0 auto;
      border-radius: 4px;
    }
}
</style>