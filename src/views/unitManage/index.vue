<template>
  <div class="house-manage app-container">
    <el-row>
      <!-- 左侧地址菜单 S -->
      <jurisdiction-addr-menu @change="onMenuChange" />
      <!-- 左侧地址菜单 E -->

      <el-col :span="18" class="table-box">
        <!-- 表单筛选 -->
        <el-form class="common-table-form" ref="listForm" :model="listQuery" :inline="true" @submit.native.prevent size="mini">
          <el-form-item prop="pageNo" class="m0" />
          <el-form-item prop="pageSize" class="m0" />
          <el-form-item prop="totalCount" class="m0" />
          <el-form-item label="单位名称" prop="_filter_like_name">
            <el-input @keyup.enter.native="onSearch" v-model="listQuery._filter_like_name" clearable />
          </el-form-item>
          <el-form-item label="单位类型" prop="_filter_eq_compType">
            <dict-select dict-name="comp_type" v-model="listQuery._filter_eq_compType"/>
          </el-form-item>
          <el-form-item label="行业类型" prop="_filter_eq_industryType">
            <dict-select dict-name="industry_type" v-model="listQuery._filter_eq_industryType"/>
          </el-form-item>
          <el-form-item label="管理级别" prop="_filter_eq_supervisoryLevel">
            <dict-select dict-name="supervisory_level" v-model="listQuery._filter_eq_supervisoryLevel"/>
          </el-form-item>
          <el-form-item label="所属小区" prop="_filter_eq_communityId">
            <communities-select v-model="listQuery._filter_eq_communityId" class="nowrap" clearable/>
          </el-form-item>
          <!-- <el-form-item label="所属辖区" prop="_filter_like_policeAreaCode">
            <jurisdiction-person-search v-model="listQuery._filter_like_policeAreaCode"></jurisdiction-person-search>
          </el-form-item> -->
          <el-form-item label="法人姓名" prop="_filter_like_legalPersonName">
            <el-input @keyup.enter.native="onSearch" v-model="listQuery._filter_like_legalPersonName" clearable />
          </el-form-item>
          <el-form-item label="证件号码" prop="_filter_like_legalPersonIdNo">
            <el-input @keyup.enter.native="onSearch" v-model="listQuery._filter_like_legalPersonIdNo" clearable />
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
            {{AddressName}}
            <em>{{listTableData.total?listTableData.total:0}}</em>
          </div>
          <div class="right">
            <el-button class="txt-btn" size="mini" type="text" icon="el-icon-plus" @click="onItemEdit()" v-permission="'FUNC_HOUSE_ADD'">添加</el-button>
            <el-button class="txt-btn" size="mini" type="text" icon="el-icon-delete" @click="onItemDelete" v-permission="'FUNC_HOUSE_DELETE'">删除</el-button>
          </div>
        </div>

        <!-- 表格模式 S -->
        <el-table
          ref="listTabel"
          :data="listTableData.rows"
          v-loading.body="listTableLoading"
          height="100%"
          highlight-current-row
          @selection-change="onListChange"
        >
          <el-table-column type="selection" width="50" />
          <el-table-column label="序号" align="center" type="index" width="50"/>
          <el-table-column label="单位名称" prop="name" min-width="200" align="left" />
          <!-- <el-table-column prop="code" label="实有单位代码" min-width="50" align="center" /> -->
          <el-table-column label="单位类型" min-width="80" align="center">
            <template slot-scope="{row: {compType}}">
              {{compType | commonFilter('comp_type')}}
            </template>
          </el-table-column>
          <el-table-column label="行业类型" min-width="80" align="center">
            <template slot-scope="{row: {industryType}}">
              {{industryType | commonFilter('industry_type')}}
            </template>
          </el-table-column>
          <el-table-column label="管理级别" min-width="80" align="center">
            <template slot-scope="{ row: { supervisoryLevel } }">{{ supervisoryLevel | commonFilter('supervisory_level')}}</template>
          </el-table-column>
          <el-table-column label="所属小区" prop="communityName" min-width="100" align="center" />
          <el-table-column label="单位地址" prop="fullName" min-width="180" align="center" />
          <el-table-column label="所属辖区" prop="policeAreaName" min-width="120" align="center" />
          <el-table-column label="法人姓名" prop="legalPersonName" min-width="80" align="center" />
          <el-table-column label="证件号码" prop="legalPersonIdNo" min-width="160" align="center" />
          <el-table-column label="最后更新人员" prop="" min-width="100" align="center" />
          <el-table-column label="最后更新时间" prop="" min-width="100" align="center" />
          <el-table-column fixed="right" width="150" label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="success" @click="onItemEdit(scope.row.id)" v-permission="'FUNC_HOUSE_UPDATE'">编辑</el-button>
              <el-button size="mini" type="success" @click="showEmployeesDialog(scope.row)">从业人员</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 表格模式 E -->

        <el-pagination @size-change="onListLimit" @current-change="onListPaging" :current-page="listQuery.pageNo" :page-size="listQuery.pageSize" :page-sizes="[15,30,50]" layout="total, sizes, prev, pager, next, jumper" :total="listTableData.total" />
      </el-col>
    </el-row>

    <!-- 单位表单 -->
    <unit-form ref="unitForm" :is-open.sync="isFormDialog" :id="houseFormId" :data="currentMenuData" @complete="updateView" :nodeData="nodeData"/>

    <!-- 从业人员 -->
    <employees-dialog ref="employees" :company="company" />
  </div>
</template>
<script>
import { addrCompanyList, delAddrCompany } from "@/api/unitManage";
import { mapState } from "vuex";

export default {
  components: {
    unitForm: () => import("./components/unitForm"),
    employeesDialog: () => import("./components/employeesDialog"),
    JurisdictionAddrMenu: () => import("@/components/JurisdictionAddrMenu"),
    JurisdictionPersonSearch: () => import("@/components/JurisdictionPersonSearch")
  },
  data() {
    return {
      currentMenuData: null,
      listIds: [],
      listQuery: {
        pageNo: 1,
        pageSize: 15,
        totalCount: null,
        _filter_like_locationCode: null,
        _filter_like_policeAreaCode: null,
        _filter_like_name: null,
        _filter_eq_compType: null,
        _filter_eq_industryType: null,
        _filter_eq_supervisoryLevel: null,
        _filter_eq_communityId: null,
        _filter_like_policeAreaCode: null,
        _filter_like_legalPersonName: null,
        _filter_like_legalPersonIdNo: null,
      },
      listTableData: {},
      listTableLoading: false,

      isFormDialog: false,
      employeesDialog: false,
      houseFormId: null,
      company: null,
      AddressName: '',
      nodeData: {}, //标准地址返回的参数
    };
  },
  computed: {
    ...mapState({
      addrDistrictCode: state => state.globalState.AddrDistrictCode,
      AddrDistrictName: state => state.globalState.AddrDistrictName,
      userInfo: state=> state.user.userInfo,
    })
  },
  methods: {
    init() {
      this.getRegionData();
    },
    updateView() {
      this.getTableList();
    },
    onMenuChange(status, data, node, labels) {
      this.$refs.listForm.resetFields()
      if (data.areaCode) {
        this.listQuery._filter_like_locationCode = data.code
        this.listQuery._filter_like_policeAreaCode = data.areaCode
      } else {
        this.listQuery._filter_like_locationCode = null
        this.listQuery._filter_like_policeAreaCode = data.code
      }
      this.AddressName = labels
      this.nodeData = { ...data, labels }
      this.getTableList()
    },
    getTableList() {
      this.listTableLoading = true;
      addrCompanyList(this.listQuery)
        .then(res => {
          this.listTableData = res.data;
        })
        .finally(() => {
          this.listTableLoading = false;
        });
    },
    // 查询
    onSearch() {
      this.listQuery = Object.assign(this.listQuery, {
        pageNo: 1,
        pageSize: 15,
        totalCount: null
      });
      this.getTableList();
    },
    // 列表参数重置
    onResetForm() {
      this.$refs.listForm.resetFields();
      // this.getTableList();
    },
    // 更新列表选中
    onListChange(val) {
      this.listIds = val.map(item => item.id);
    },
    // 表单编辑
    onItemEdit(id) {
      this.houseFormId = id || null;
      this.$nextTick(() => {
        this.isFormDialog = true;
      });
    },
    // 批量删除
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
        delAddrCompany({
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
            this.updateView();
          }
        });
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
    getDictionary() {
      getDictionary('house_type').then(res => {
        this.listData = res.data;
      });
    },

    showEmployeesDialog(row) {
      this.company = row
      this.$refs.employees.showDialog()
    }
  },
  mounted() {
    this.listQuery._filter_like_policeAreaCode = this.userInfo.policeAreaCode
    this.AddressName = this.userInfo.policeAreaName
    this.getTableList()
  }
};
</script>
<style lang="scss" scoped>
.house-manage {
  height: 100%;

  .expand-form {
    display: flex;
    justify-content: space-between;
    /deep/ .el-form-item {
      margin-bottom: 0px;
    }
  }

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

  .table-box {
    display: flex;
    flex-direction: column;
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