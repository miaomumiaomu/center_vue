<template>
  <div class="house-manage app-container">
    <el-row>
      <!-- 左侧地址菜单 S -->
      <jurisdiction-addr-menu @change="onMenuChange" />
      <!-- 左侧地址菜单 E -->

      <div class="time-list">
        <div :class="{ time: true, 'time-hover': index == currentIndex }" @click="timeClick(index)" v-for="(item, index) of timeList" :key="index">
          <div>{{item.day}}天未出现</div>
          <dir>{{item.num}}人</dir>
        </div>
      </div>

      <el-col :span="18" class="table-box">
        <!-- 表单筛选 -->
        <el-form class="common-table-form" ref="listForm" :model="listQuery" :inline="true" @submit.native.prevent size="mini">
          <el-form-item prop="pageNo" class="m0" />
          <el-form-item prop="pageSize" class="m0" />
          <el-form-item prop="totalCount" class="m0" />
          <el-form-item label="以图搜图">
            <picture-search2 ref="picSearch"></picture-search2>
          </el-form-item>
          <el-form-item label="关键字" prop="_filter_like_keyword">
            <el-input @keyup.enter.native="onSearch" placeholder="姓名/证件号" v-model="listQuery._filter_like_keyword" clearable />
          </el-form-item>
          <el-form-item prop="_filter_eq_communityId" label="所属小区">
            <communities-select v-model="listQuery._filter_eq_communityId" :policeAreaCode="listQuery._filter_like_policeAreaCode" class="nowrap" clearable/>
          </el-form-item>
          <el-form-item label="标记时间早于" prop="_filter_le_endTime">
            <el-date-picker v-model="listQuery._filter_le_endTime" value-format="yyyyMMddHHmmss" type="datetime" placeholder="请选择标记时间" :picker-options="singlePickerOptions()" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSearch">搜索</el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="onResetForm">重置</el-button>
          </el-form-item>
        </el-form>

        <!-- 工具栏 -->
        <div class="common-tool">
          <div class="title">
            {{AddressName}}
            <em>{{listTableData.total?listTableData.total:0}}</em>
          </div>
          <div class="right">
            <el-button class="txt-btn" size="mini" type="text" icon="el-icon-download" @click="_export(0)">Excel导出当前页</el-button>
            <el-button class="txt-btn" size="mini" type="text" icon="el-icon-download" @click="_export(1)">Excel导出全部</el-button>
          </div>
        </div>

        <!-- 表格模式 S -->
        <el-table ref="listTabel" :data="listTableData.rows" :height="tableHeight" v-loading.body="listTableLoading" highlight-current-row>
          <el-table-column label="序号" align="center" type="index" width="50"/>
          <el-table-column width="80" label="证件照" align="center">
            <template slot-scope="scope">
              <suspension-menu :SuspensionData="scope.row" width="48px" height="48px"/>
            </template>
          </el-table-column>
          <el-table-column width="180" prop="name" label="姓名"></el-table-column>
          <el-table-column min-width="60" prop="identityNo" label="证件号" align="center" />
          <el-table-column label="类别" width="60" align="center">
            <template slot-scope="scope">
              <face-category-list :data="faceLibraryData" :type="0" :chosen="scope.row.personTags?scope.row.personTags.split(','):[]" />
            </template>
          </el-table-column>

          <el-table-column label="所属小区" prop="communityName" align="center"/>
          <el-table-column min-width="60" prop="houseName" label="居住地址" align="center" />
          <el-table-column min-width="60" prop="markTime" label="最后标记时间" align="center">
            <template slot-scope="{ row: { markTime } }">{{markTime ? markTime : '从未出现'}}</template>
          </el-table-column>
          <el-table-column fixed="right" width="180" label="操作">
            <template slot-scope="{ row : { id } }">
              <el-button size="mini" type="success" @click="onItemEdit(0, id)">底库资料</el-button>
              <el-button size="mini" type="success" @click="onItemEdit(1, id)">盘查登记</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 表格模式 E -->

        <el-pagination @size-change="onListLimit" @current-change="onListPaging" :current-page="listQuery.pageNo" :page-size="listQuery.pageSize" :page-sizes="[15,30,50]" layout="total, sizes, prev, pager, next, jumper" :total="listTableData.total" />
      </el-col>
    </el-row>

    <!-- 盘查登记 -->
    <register-form ref="registerForm" @complete="updateView"></register-form>

    <!-- 底库资料 -->
    <label-form :is-open.sync="isAddFormDialog" :id.sync="labelFormId" :readonly="true"/>
  </div>
</template>
<script>
import { addrCompanyList, delAddrCompany } from "@/api/unitManage";
import { mapState } from "vuex";
import moment from "moment";
import { singlePickerOptions } from "@/utils";
import { getCountByDays, queryPersonHousePageByCan, getPersonExcel } from '@/api/jurisdictionPerson'

export default {
  name: 'jurisdictionPerson',
  components: {
    RegisterForm: () => import("./components/registerForm"),
    JurisdictionAddrMenu: () => import("@/components/JurisdictionAddrMenu"),
    LabelForm: () => import("@/components/FaceLabelForm"),
  },
  data() {
    return {
      listQuery: {
        pageNo: 1,
        pageSize: 15,
        totalCount: null,
        _filter_like_keyword: null,
        _filter_like_locationCode: null,
        _filter_like_policeAreaCode: null,
        _filter_eq_day: null,
        _filter_le_endTime: null,
        _filter_eq_communityId: null,
      },
      listTableData: {},
      listTableLoading: false,

      AddressName: '',
      nodeData: {}, //标准地址返回的参数
      timeList: [],
      labelFormId: null, //底库资料所需的id
      isAddFormDialog: false, //底库资料弹窗使能
      singlePickerOptions: singlePickerOptions, 
      isSubmit: true, //判断是否是搜索获取的数据
      currentIndex: null,
      tableHeight: '200px',
    };
  },
  computed: {
    ...mapState({
      faceLibraryData: state => state.commonData.faceLibraryData,
      userInfo: state=> state.user.userInfo,
    })
  },
  watch: {
    '$route.fullPath': {
      handler(val) {
        if (this.timeList.length !== 0) {
          let index = val.substr(-1)
          this.currentIndex = index
          this.timeClick(index)
        } else {
          this.$nextTick(() => {
            let { _filter_like_policeAreaCode } = this.listQuery
            getCountByDays({ policeAreaCode: _filter_like_policeAreaCode }).then(res => {
              this.timeList = res.data

              let index = val.substr(-1)
              this.currentIndex = index
              this.timeClick(index)
            })
          })
        }
      },
      immediate: true
    }
  },
  methods: {
    updateView() {
      this.onSearch();
      this.getCountByDays()
    },
    onMenuChange(status, data, node, labels) {
      // this.$refs.listForm.resetFields()
      this.listQuery.pageNo = 1
      if (data.areaCode) {
        this.listQuery._filter_like_locationCode = data.code
        this.listQuery._filter_like_policeAreaCode = data.areaCode
      } else {
        this.listQuery._filter_like_locationCode = null
        this.listQuery._filter_like_policeAreaCode = data.code
      }
      this.AddressName = data.label
      this.nodeData = { ...data, labels }
      this.getCountByDays()
      this.getTableList()
    },
    getTableList() {
      this.listTableLoading = true;
      queryPersonHousePageByCan({ ...this.listQuery })
        .then(res => {
          this.listTableData = res.data;
          this.listQuery.totalCount = res.data.length
        })
        .finally(() => {
          this.listTableLoading = false;
        });
    },
    //获取标签
    getCountByDays() {
      let { _filter_like_policeAreaCode } = this.listQuery
      getCountByDays({ policeAreaCode: _filter_like_policeAreaCode }).then(res => {
        this.timeList = res.data
      })
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
          // pageSize: 15,
          totalCount: null,
          _filter_in_identityNos: null
        });
        this.getTableList();
      } else if (data.length) { //当有身份证时
        this.listQuery.totalCount = null;
        this.listQuery = Object.assign(this.listQuery, {
          pageNo: 1,
          // pageSize: 15
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
    // 列表参数重置
    onResetForm() {
      this.$refs.listForm.resetFields();
      this.listQuery._filter_in_identityNos = null
      this.$refs.picSearch.clear()
      this.clearTime()
      //选择时间时清空标签的数据
      this.currentIndex = null,
      this.listQuery._filter_eq_day = null
      this.getTableList();
    },
    // 表单编辑
    onItemEdit(val, id) {
      if (val) {
        this.$refs.registerForm.open(id)// 盘查登记
      } else {
        this.labelFormId = id || null;
        this.$nextTick(() => {
          this.isAddFormDialog = true;
        });
      }
    },
    /* 分页处理 */
    onListPaging(val) {
      this.listQuery.pageNo = val;
      // this.listQuery.totalCount = this.listTableData.total;
      this.getTableList();
    },
    onListLimit(val) {
      this.listQuery.pageSize = val;
      // this.listQuery.totalCount = this.listTableData.total;
      this.getTableList();
    },
    /* 分页处理 */
    getDictionary() {
      getDictionary('house_type').then(res => {
        this.listData = res.data;
      });
    },
    //时间标签点击事件
    timeClick(index) {
      this.currentIndex = index
      this.listQuery._filter_eq_day = this.timeList[index].day
      this.listQuery._filter_le_endTime = moment().subtract(this.timeList[index].day, "d").format("YYYYMMDDHHmmss")
      this.onSearch()
    },
    //导出
    _export(val) {
      let _listQuery = this.listQuery;
      this.$set(_listQuery, "doAll", val)
      getPersonExcel(_listQuery).then(res => {
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
    //清除时间
    clearTime() {
      this.listQuery = Object.assign({}, this.listQuery, {
        _filter_le_endTime: null
      })
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = `calc(100vh - ${ this.$refs.listForm.$el.clientHeight + 267 }px)`
    })
    this.listQuery._filter_like_policeAreaCode = this.userInfo.policeAreaCode
    this.AddressName = this.userInfo.policeAreaName
    this.getTableList()
    // this.getCountByDays()
    // this.$refs.registerForm.open(8085)
    this.$store.dispatch("commonData/getFaceLibraryData");
  }
};
</script>
<style lang="scss" scoped>
.house-manage {
  height: 100%;
  .region {
    height: 46px;
    line-height: 26px;
    padding: 10px 0;
    overflow: hidden;
    font-size: 0;
    label {
      display: inline-block;
      padding: 0 2px 0 10px;
      text-align: right;
      font-size: 13px;
      font-weight: normal;
      color: #3f4041;
    }
    .el-cascader {
      width: 420px;
    }
  }

  .el-row {
    height: 100%;
    .el-col {
      height: 100%;
    }
  }

  .el-pagination {
    padding: 10px;
  }

  .time-list{
    display: flex;
    justify-content: space-between;
    text-align: center;
    height: 58px;
    .time{
      flex: 1;
      margin: 10px 20px;
      padding: 10px;
      background-color: #EBEEF5;
      border-radius: 5px;
      display: flex;
      justify-content: space-between;
      cursor: pointer;
    }
    .time-hover{
      background-color: #409EFF;
      color: white;
    } 
  }

  .table-box {
    .form {
      background: #fafbfd;
      height: 46px;
      line-height: 46px;
      padding: 0 12px;
      font-size: 0;
      .el-form-item {
        height: auto;
        line-height: 100%;
        margin: 4px 6px 0 0;
      }
    }
    .el-button {
      margin-left: 0;
    }
    .el-pagination {
      padding: 10px;
    }
  }
}
</style>