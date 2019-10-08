<template>
  <div class="app-container">
    <el-row>
      <code-menu ref="menu" @change="onMenuChange" />

      <el-col :span="19" class="table-box">
        <!-- 表单筛选 -->
        <el-form class="common-table-form" ref="listForm" :model="listQuery" :inline="true" @keyup.enter.native="onSearch" size="mini">
          <el-form-item prop="pageNo" class="m0" />
          <el-form-item prop="pageSize" class="m0" />
          <el-form-item prop="totalCount" class="m0" />
          <el-form-item label="关键字" prop="_filter_eq_keyword">
            <el-input @keyup.enter.native="onSearch" placeholder="编码前缀" v-model="listQuery._filter_eq_keyword" clearable />
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
          <div class="title" v-if="currentMenuData">
            {{currentMenuData.sequenceType}}
            <em>{{listTableData.total}}</em>
          </div>
        </div>

        <!-- 表格模式 S -->
        <el-table ref="listTabel" :data="listTableData.rows" height="calc(100vh - 255px)" v-loading.body="listTableLoading" highlight-current-row>
          <el-table-column type="index" width="50" label="序号" align="center" />
          <el-table-column prop="sequenceType" label="编码类型" align="center" />
          <el-table-column prop="prefix" label="编码前缀" align="center" />
          <el-table-column prop="sequenceNo" label="序列号" align="center" />
        </el-table>
        <!-- 表格模式 E -->

        <el-pagination @size-change="onListLimit" @current-change="onListPaging" :current-page="listQuery.pageNo" :page-size="listQuery.pageSize" :page-sizes="[15,30,50]" layout="total, sizes, prev, pager, next, jumper" :total="listTableData.total" />
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { getSequenceList } from "@/api/codeManage";

export default {
  name: "codeManage",
  components: {
    CodeMenu: () => import("./components/CodeMenu")
  },
  data() {
    return {
      currentMenuData: null,

      listQuery: {
        pageNo: 1,
        pageSize: 15,
        totalCount: null,
        _filter_eq_sequenceType: null,
        _filter_like_keyword: null
      },
      listTableData: {},
      listTableLoading: false
    };
  },
  watch: {
    currentMenuData(val) {
      this.listQuery._filter_eq_sequenceType = val.sequenceType;

      this.onResetForm();
    }
  },
  methods: {
    // 获取表单数据
    getTableList() {
      this.listTableLoading = true;
      getSequenceList(this.listQuery)
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
    // 菜单更新
    onMenuChange(data) {
      this.currentMenuData = data;
    },
    // 列表参数重置
    onResetForm() {
      this.$refs.listForm.resetFields();
      this.getTableList();
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
    }
    /* 分页处理 */
  }
};
</script>
<style lang="scss" scoped>
.app-container {
  position: relative;
  height: 100%;
  .el-row,
  .el-col {
    height: 100%;
  }
}
.table-box {
  .el-button {
    margin-left: 0;
  }
  .el-pagination {
    padding: 10px;
  }
}
</style>
