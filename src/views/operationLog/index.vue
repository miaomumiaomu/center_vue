<template>
  <div class="app-container">
    <el-form :inline="true" :model="listQuery" ref="listForm" size="mini" class="common-table-form"  @submit.native.prevent>
      <el-form-item label="关键字" prop="_filter_like_keywords">
        <el-input placeholder="用户名/方法名/描述" v-model="listQuery._filter_like_keywords" @keyup.enter.native="onSearch"/>
      </el-form-item>
      <!-- <el-form-item label="用户名" prop="_filter_like_userName">
        <el-input placeholder="请输入用户名" v-model="listQuery._filter_like_userName" @keyup.enter.native="onSearch"/>
      </el-form-item> -->
      <el-form-item label="时间" prop="_filter_ge_startTime_date">
        <date-picker :beginTime.sync="listQuery._filter_ge_startTime_date" :endTime.sync="listQuery._filter_le_startTime_date"
        valueFormat="yyyy-MM-dd HH:mm:ss" momentFormat="YYYY-MM-DD HH:mm:ss"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="onSearch">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="mini" @click="onResetForm">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="common-tool">
      <div class="title">
        操作日志
        <!-- <em>{{listData.total}}</em> -->
      </div>
      <div class="right">
        <!-- <el-button class="txt-btn" type="text" size="mini" icon="el-icon-plus" @click="onExport()" >导出</el-button> -->
      </div>
    </div>

    <el-table height="calc(100vh - 255px)" :data="listData.rows" highlight-current-row>
      <!-- <el-table-column type="selection" width="50" /> -->
      <el-table-column align="center" label="序号" width="50px" type="index" />
      <el-table-column align="center" label="操作时间" prop="createTime" />
      <el-table-column align="center" label="方法名" prop="methodName" />
      <el-table-column align="center" label="描述" prop="descrip" />
      <el-table-column align="center" label="用户名" prop="userName">
        <template slot-scope="scope">
          <el-button @click="onUserDetail(scope.row)" type="text" size="small">{{ scope.row.userName }}</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="ip地址" prop="ip" />
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="onLogDetail(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <log-dialog ref="logDialog"></log-dialog>

    <user-dialog ref="userDialog"></user-dialog>
    
    <el-pagination @size-change="onListLimit" @current-change="onListPaging" :current-page="listQuery.pageNo" :page-size="listQuery.pageSize" :page-sizes="[15,30,50]" layout="total, sizes, prev, pager, next, jumper" :total="listData.total" />
  </div>
</template>

<script>
import { getOperationLog } from '@/api/operationLog'
import { singlePickerOptions } from "@/utils";
export default {
  components: {
    LogDialog: () => import("./components/logDetailForm"),
    UserDialog: () => import("./components/userDetailForm")
  },
  data() {
    return {
      singlePickerOptions: singlePickerOptions,
      listQuery: {
        pageNo: 1,
        pageSize: 15,
        _filter_like_keywords: null,
        _filter_ge_startTime_date: null,
        _filter_le_startTime_date: null,
        type: null
      },
      listData: {
        rows: [],
        total: 0
      },
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      getOperationLog(this.listQuery).then(res => {
        if (res.status === 200) {
          this.listData = res.data
        }
      })
    },
    onResetForm() {
      this.$refs.listForm.resetFields()
      this.listQuery._filter_le_startTime_date = null
      this.init()
    },
    onSearch() {
      this.listQuery.pageNo = 1
      this.init()
    },
    onListLimit(val) {
      this.listQuery.pageSize = val
      this.init()
    },
    onListPaging(val) {
      this.listQuery.pageNo = val
      this.init()
    },
    onLogDetail(row) {
      this.$refs.logDialog.showDialog(row)
    },
    onUserDetail(row) {
      this.$refs.userDialog.showDialog(row.userId)
    },
  }
};
</script>
<style lang="scss" scoped>
.app-container {
  height: 100%;
  .el-pagination {
    padding: 10px;
  }
}
</style>
