<template>
  <div class="app-container">
    <!-- 表单筛选 -->
    <el-form class="common-table-form" ref="listQuery" :model="listQuery" :inline="true" @keyup.enter.native="onSearch" size="mini">
      <el-form-item prop="pageNo" class="m0" />
      <el-form-item prop="pageSize" class="m0" />
      <el-form-item prop="totalCount" class="m0" />
      <el-form-item label="文件状态" prop="_filter_like_exported">
        <el-select v-model="listQuery._filter_like_exported" placeholder="请选择" remote clearable>
          <el-option v-for="(item,index) in statusData" :key="index" :value="item.value" :label="item.label"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="onResetForm">重置</el-button>
      </el-form-item>
      <el-form-item class="fr">
        <el-button class="txt-btn" type="text"  @click="getTableList" icon="el-icon-refresh">刷新</el-button>
        <el-button class="txt-btn" size="mini" type="text" icon="el-icon-delete" @click="onItemDelete">删除</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格模式 S -->
    <el-table ref="listTabel" :data="listTableData.rows" height="calc(100vh - 209px)" highlight-current-row @selection-change="select">
      <el-table-column label="多选" align="right" type="selection" />
      <el-table-column label="序号" align="center" type="index" width="60" />
      <el-table-column prop="fileName" align="center" label="文件名称"  />
      <el-table-column prop="createTime" align="center" label="创建时间"  />
      <el-table-column fixed="right" align="center" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="onDownload(scope.row.downloadUrl)"  v-if="scope.row.exported" >{{scope.row.exported == 1 ? '下载' : '导出失败' }}</el-button>
          <el-button size="mini" type="warning" v-else disabled>导出中</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 页码 -->
    <el-pagination @size-change="onListLimit" @current-change="onListPaging" :current-page.sync="listQuery.pageNo" :page-sizes="[15,30,50]" layout="total, sizes, prev, pager, next, jumper" :total="listTableData.total" />

  </div>
</template>

<script>
import { getExcelList, delExcelList } from "@/api/exportRecord";

export default {
  name: "exportRecord",
  components: {

  },
  props: {

  },
  data() {
    return {
      listQuery: {
        pageNo: 1, //页码
        pageSize: 15, //页数
        _filter_like_exported: null,
      },
      listTableData: {},
      listIds: [],
      statusData: [
        { label: '导出中', value: 0 },
        { label: '可下载', value: 1 }
      ]
    };
  },
  created() {
    this.getTableList();
  },
  activated() {
    this.getTableList();
  },
  methods: {
    onSearch() {
      this.listQuery = Object.assign(this.listQuery, {
        pageNo: 1,
        pageSize: 15
      });
      this.getTableList();
    },
    getTableList() {
      getExcelList(this.listQuery).then( res => {
        if (res.status == 200) {
          this.listTableData = res.data;
        }
        console.log(this.listTableData)
      })
    },
    //重置
    onResetForm() {
      this.$refs.listQuery.resetFields();
      this.getTableList();
    },
    // 表格选中 数据
    select(selection) {
      this.listIds = selection.map(item => item.id);
    },
    //下载
    onDownload(url) {
      window.open(url)
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
        delExcelList({
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
  },
};
</script>