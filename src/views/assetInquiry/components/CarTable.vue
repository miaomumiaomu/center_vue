<template>
  <div class="label-table">
    <!-- 表单筛选 -->
    <el-form
      class="common-table-form"
      ref="listForm"
      :model="listQuery"
      :inline="true"
      @submit.native.prevent
      size="mini"
    >
      <el-form-item prop="_filter_like_keyword" label="关键字">
        <el-input
          @keyup.enter.native="onSearch"
          placeholder="车牌号/车主姓名/车主证件号"
          v-model="listQuery._filter_like_keyword"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="onResetForm">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格模式 S -->
    <el-table
      ref="listTabel"
      :data="listTableData.rows"
      height="calc(100% - 94px)"
      v-loading.body="listTableLoading"
      highlight-current-row
    >
      <el-table-column label="序号" type="index" align="center"/>
      <el-table-column label="车牌号" prop="plateNumber" align="center"/>
      <el-table-column label="车主姓名" prop="name" align="center"/>
      <el-table-column label="联系方式" prop="phone" align="center"/>
      <el-table-column label="车主证件号码" prop="identityNo" align="center" min-width="110"/>
      <el-table-column label="车主居住地址" prop="actualAddress" align="center" min-width="110"/>
      <el-table-column label="操作" fixed="right" min-width="175" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="onItemDetails(scope.row,0)">抓拍记录</el-button>
          <el-button size="mini" type="success" @click="onItemDetails(scope.row,1)">告警记录</el-button>
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
  </div>
</template>
<script>
import { getFaceLibraryList } from "@/api/common";
import { getCarInfoList } from "@/api/assetInquiry";

export default {
  props: {
    data: Object
  },
  data: () => ({
    listQuery: {
      pageNo: 1,
      pageSize: 15,
      _filter_like_code: null,
      _filter_like_keyword: null
    },
    listTableData: {},
    listTableLoading: false
  }),
  watch: {
    data(val) {
      if (val.code) {
        this.listQuery._filter_like_code = val.code;
        this.getTableList();
      }
    }
  },
  methods: {
    // 获取表格数据
    getTableList() {
      this.listTableLoading = true;

      getCarInfoList(this.listQuery)
        .then(res => {
          if (res.status === 200) {
            this.listTableData = res.data;
          }
        })
        .finally(err => {
          this.listTableLoading = false;
        });
    },
    onSearch() {
      if (!this.listQuery._filter_like_code) {
        this.$notify({
          title: "提示",
          message: "请选择社区",
          type: "warning",
          duration: 2000
        });
      } else {
        this.listQuery.pageNo = 1;
        this.getTableList();
      }
    },
    // 列表参数重置
    onResetForm() {
      this.$refs.listForm.resetFields();
      this.getTableList();
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

    // 人员详情
    onItemDetails(row, type) {
      if (type == 0) {
        this.$router.push({
          name: "carSnap",
          params: { data: row.plateNumber }
        });
      }
      if (type == 1) {
        this.$router.push({
          name: "carAlarm",
          params: { plateNumber: row.plateNumber }
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.label-table {
  height: 100%;
  .el-button {
    margin-left: 0;
  }
  .el-pagination {
    padding: 10px;
  }
  .common-table-form {
    background: #fff;
    .el-input.el-input--mini {
      width: 190px;
    }
  }
}
</style>