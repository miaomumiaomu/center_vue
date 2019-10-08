<template>
  <div>
    <!-- 表单筛选 -->
    <el-form class="common-table-form" ref="listForm" :model="listQuery" :inline="true" @submit.native.prevent size="mini">
      <el-form-item label="姓名" prop="_filter_like_name">
        <el-input @keyup.enter.native="onSearch" v-model="listQuery._filter_like_name" clearable />
      </el-form-item>
      <el-form-item label="证件号码" prop="_filter_like_identityNo">
        <el-input @keyup.enter.native="onSearch" v-model="listQuery._filter_like_identityNo" clearable />
      </el-form-item>
      <el-form-item label="在职时间" prop="_filter_ge_beginTime">
        <date-picker :beginTime.sync="listQuery._filter_ge_beginTime" :endTime.sync="listQuery._filter_le_endTime" />
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
        {{ '历史从业人员' }}
        <em>{{listTableData.total?listTableData.total:0}}</em>
      </div>
      <div class="right">
        <!-- <el-button class="txt-btn" size="mini" type="text" icon="el-icon-plus" @click="onItemEdit()" v-permission="'FUNC_HOUSE_ADD'">添加</el-button>
        <el-button class="txt-btn" size="mini" type="text" icon="el-icon-delete" @click="onItemDelete" v-permission="'FUNC_HOUSE_DELETE'">删除</el-button> -->
      </div>
    </div>

    <!-- 表格模式 S -->
    <el-table
      ref="listTabel"
      :data="listTableData.rows"
      v-loading.body="listTableLoading"
      height="calc(100vh - 400px)"
      highlight-current-row
      @selection-change="onListChange"
    >
      <el-table-column type="selection" width="50" />
      <el-table-column label="序号" align="center" type="index" width="50"/>
      <el-table-column label="证件照" prop="imgShow" min-width="100" align="center" >
        <template slot-scope="scope">
          <suspension-menu :SuspensionData="scope.row" />
        </template>
      </el-table-column>
      <el-table-column label="姓名" prop="name" min-width="150" align="center" />
      <el-table-column label="证件号码" prop="identityNo" min-width="200" align="center" />
      <el-table-column label="联系方式" prop="mobile" min-width="150" align="center" />
      <el-table-column label="在职时间" prop="checkTime" min-width="180" align="center">
        <template slot-scope="scope">
          {{ `${scope.row.checkTime ? scope.row.checkTime.slice(0, 10) : ''} 至
              ${scope.row.moveTime ? scope.row.moveTime.slice(0, 10) : ''}` }}
        </template>
      </el-table-column>
      <el-table-column label="最后更新人员" prop="" min-width="150" align="center">
        <template slot-scope="scope">
          {{ `${scope.row.outLoginName}/${scope.row.outUserName}` }}
        </template>
      </el-table-column>
      <el-table-column label="最后更新时间" prop="moveTime" min-width="150" align="center" />
      <el-table-column fixed="right" width="80" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="onItemEdit(scope.row.id)">详情</el-button>
          <!-- <el-button size="mini" type="success" @click="isFormDialog = true">详情</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格模式 E -->

    <el-pagination @size-change="onListLimit" @current-change="onListPaging" :current-page="listQuery.pageNo" :page-size="listQuery.pageSize" :page-sizes="[15,30,50]" layout="total, sizes, prev, pager, next, jumper" :total="listTableData.total" />

    <label-form :is-open.sync="isFormDialog" :id.sync="personId" @complete="getTableList" readonly/>
  </div>
</template>

<script>
import { getEmployeesHisory } from '@/api/employees'
export default {
  components: {
    LabelForm: () => import("@/components/FaceLabelForm"),
  },
  props: {
    companyId: {
      type: Number
    }
  },
  data() {
    return {
      listIds: [],
      listQuery: {
        pageNo: 1,
        pageSize: 15,
        _filter_eq_companyId: null,
        _filter_like_name: null,
        _filter_like_identityNo: null,
        _filter_ge_beginTime: null,
        _filter_le_endTime: null,
      },
      listTableData: {},
      listTableLoading: false,

      isFormDialog: false,
      personId: null
    };
  },
  watch: {
    companyId: {
      handler(val) {
        this.listQuery._filter_eq_companyId = val
        this.onSearch()
      },
      immediate: true
    },
  },
  mounted() {
  },
  methods: {
    getTableList() {
      this.listTableLoading = true;
      getEmployeesHisory(this.listQuery)
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
      });
      this.getTableList();
    },
    // 列表参数重置
    onResetForm() {
      this.$refs.listForm.resetFields();
      this.listQuery._filter_le_endTime = null
      // this.getTableList();
    },
    // 更新列表选中
    onListChange(val) {
      this.listIds = val.map(item => item.id);
    },
    // 表单编辑
    onItemEdit(id) {
      this.personId = id || null;
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
  }
};
</script>
<style lang="scss" scoped>
/deep/ {
  .el-table__body-wrapper {
    overflow: auto;
  }
}
</style>