<template>
  <div class="company-table">
    <!-- 表单筛选 -->
    <el-form class="common-table-form" ref="listForm" :model="listQuery" :inline="true" @submit.native.prevent size="mini">
      <el-form-item prop="pageNo" class="m0"/>
      <el-form-item prop="pageSize" class="m0"/>
      <el-form-item prop="_filter_like_keyword" label="关键字">
        <el-input
          @keyup.enter.native="onSearch"
          placeholder="姓名/证件号"
          v-model="listQuery._filter_like_keyword"
        ></el-input>
      </el-form-item>
      <el-form-item prop="_filter_eq_status" label="审核状态">
        <dict-select dict-name="label_type" v-model="listQuery._filter_eq_status"/>
      </el-form-item>
      <el-form-item prop="_filter_eq_result" label="审核结果">
        <dict-select dict-name="comm_sex" v-model="listQuery._filter_eq_result"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="onResetForm">重置</el-button>
      </el-form-item>
    </el-form>

    <div class="common-tool">
      <div class="title">
        实有单位采集审核
        <em>{{ listTableData.total ? listTableData.total : 0 }}</em>
      </div>
      <div class="right">
        待审核：{{ checkNum }}
      </div>
    </div>

    <!-- 表格模式 S -->
    <el-table
      ref="listTabel"
      :data="listTableData.rows"
      height="calc(100% - 136px)"
      v-loading.body="listTableLoading"
      highlight-current-row
    >
      <el-table-column label="序号" type="index" align="center"/>
      <el-table-column label="单位名称" align="center">
        <template slot-scope="scope">
          <suspension-menu :SuspensionData="scope.row" />
        </template>
      </el-table-column>
      <el-table-column label="单位分类" prop="name" align="center"/>
      <el-table-column label="单位类型" prop="sex" align="center"/>
      <el-table-column label="监管级别" prop="type" align="center"/>
      <el-table-column label="单位地址" prop="identity" align="center"/>
      <el-table-column label="提审时间" prop="mobile" align="center"/>
      <el-table-column label="审核人" prop="house" align="center"/>
      <el-table-column label="审核状态" prop="status" align="center" width="120"></el-table-column>
      <el-table-column label="审核结果" prop="result" align="center" width="120"/>
      <el-table-column label="审核时间" prop="result" align="center"/>
      <el-table-column label="操作" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="handleAudit(scope.row)">审核</el-button>
          <el-button size="mini" type="success" @click="showDetail(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格模式 E -->

    <el-pagination
      @size-change="onListLimit"
      @current-change="onListPaging"
      :current-page="listQuery.pageNo"
      :page-size="listQuery.pageSize"
      :page-sizes="[15,30,50]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="listTableData.total"
    />

    <audit-dialog ref="auditDialog"></audit-dialog>
  </div>
</template>
<script>

export default {
  components: {
    AuditDialog: () => import("./AuditDialog"),
  },
  data: () => ({
    checkNum: 5,
    listQuery: {
      pageNo: 1,
      pageSize: 15,
      _filter_like_keyword: null,
      _filter_eq_status: null,
      _filter_eq_result: null
    },
    listTableData: {},
    listTableLoading: false,
  }),
  mounted() {
    this.getTableList()
  },
  methods: {
    // 获取表格数据
    getTableList() {
      this.listTableLoading = true;
      this.listTableData = {
        rows: [
          {
            name: '测试',
            sex: '男',
            type: '本地户籍人员',
            identity: '452723199411140016',
            mobile: '17040505040',
            house: '世贸湖滨首府D区',
            status: '未审核',
            result: '-----'
          },
          {
            name: '不测试',
            sex: '女',
            type: '外地户籍人员',
            identity: '452723199411140016',
            mobile: '16485958888',
            house: '世贸湖滨首府A区',
            status: '未审核',
            result: '-----'
          }
        ],
        total: 2
      }
      this.listTableLoading = false;
      // getPersonHousePageList({ ...this.listQuery })
      //   .then(res => {
      //     if (res.status === 200) {
      //       this.listTableData = res.data;
      //     }
      //   })
      //   .finally(err => {
      //     this.listTableLoading = false;
      //   });
    },
    onSearch() {
      this.listQuery = Object.assign(this.listQuery, {
        pageNo: 1,
        // pageSize: 15,
        totalCount: null,
      });
      this.getTableList();
    },
    // 列表参数重置
    onResetForm() {
      this.$refs.listForm.resetFields();
      this.getTableList();
    },
    // 分页处理
    onListPaging(val) {
      this.listQuery.pageNo = val;
      this.getTableList();
    },
    onListLimit(val) {
      this.listQuery.pageSize = val;
      this.getTableList();
    },
    // 审核弹窗
    handleAudit (row) {
      this.$refs.auditDialog.showDialog(row)
    }
  }
};
</script>
<style lang="scss" scoped>
.company-table {
  height: 100%;
  .el-pagination {
    padding: 10px;
  }
}
</style>