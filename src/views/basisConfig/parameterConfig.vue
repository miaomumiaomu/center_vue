<template>
  <div class="parameter-config">
    <!-- 表单筛选 -->
    <el-form class="common-table-form" ref="listForm" :model="listQuery" :inline="true" @submit.native.prevent  size="mini">
      <el-form-item prop="pageNo" class="m0" />
      <el-form-item prop="pageSize" class="m0" />
      <el-form-item prop="totalCount" class="m0" />
      <el-form-item label="关键字" prop="_filter_eq_keyword">
        <el-input v-model="listQuery._filter_eq_keyword" placeholder="名称/值" clearable  @keyup.enter.native="getTableList"/>
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
        人脸参数配置
        <em>{{listTableData.total?listTableData.total:0}}</em>
      </div>
      <div class="right">
        <el-button class="txt-btn" size="mini" type="text" icon="el-icon-plus" @click="onItemEdit()" v-permission="'FUNC_PARAM_ADD'">添加</el-button>
        <el-button class="txt-btn" size="mini" type="text" icon="el-icon-delete" @click="onClearAll" v-permission="'FUNC_CACHE_BATCHDELETE'">批量清理</el-button>
      </div>
    </div>
    <el-table :data="listTableData.rows" height="calc(100% - 136px)" highlight-current-row v-loading.body="listTableLoading" @selection-change="onListChange">
      <el-table-column type="selection" width="50" />
      <el-table-column label="序号" align="center" type="index" width="50"/>
      <el-table-column align="center" prop="name" label="名称" />
      <el-table-column align="center" prop="value" label="值" />
      <el-table-column prop="description" label="描述" />
      <el-table-column fixed="right" width="150" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="onItemEdit(scope.row.id)" v-permission="'FUNC_PARAM_UPDATE'">编辑</el-button>
          <el-button size="mini" type="primary" @click="onLookCheck(scope.row.name)" v-permission="'FUNC_CACHE_INFO'">查看缓存</el-button>
          <el-button size="mini" type="warning" @click="onClearCache(scope.row.name)" v-permission="'FUNC_CACHE_DELETE'">清理缓存</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="onListLimit" @current-change="onListPaging" :current-page="listQuery.pageNo" :page-size="listQuery.pageSize" :page-sizes="[15,30,50]" layout="total, sizes, prev, pager, next, jumper" :total="listTableData.total" />

    <!-- 配置编辑 -->
    <el-dialog :title="form.id?'编辑':'添加'" :visible.sync="isFormDialog" width="500px">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="配置名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入配置名称" :readonly="form.id" />
        </el-form-item>
        <el-form-item label="配置值" prop="value">
          <el-input v-model="form.value" placeholder="请输入配置值" />
        </el-form-item>
        <el-form-item label="配置描述" prop="description" class="m0">
          <el-input v-model="form.description" placeholder="请输入配置描述" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="mini" type="primary" @click="onSubmit">保 存</el-button>
        <el-button size="mini" @click="isFormDialog = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import {
  getParameterList,
  postParameter,
  getParameter,
  putParameter,
  deleteParameterCache,
  deleteParameterAllCache,
  getParameterCacheValue
} from "@/api/basisConfig/parameterConfig";
export default {
  data() {
    return {
      listTableData: {},
      listTableLoading: false,
      listQuery: {
        pageNo: 1,
        pageSize: 15,
        totalCount: null,
        _filter_eq_keyword: null
      },
      listIds: [],

      isFormDialog: false,
      form: {
        name: null,
        value: null,
        description: null
      },
      rules: {
        name: [
          { required: true, message: "请输入配置名称" },
          { min: 3, max: 155, message: "长度在 3 到 155 个字符" }
        ]
      }
    };
  },
  methods: {
    init() {
      this.getTableList();
    },
    getTableList() {
      this.listTableLoading = true;
      getParameterList(this.listQuery)
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
    // 重置按钮
    onResetForm() {
      this.$refs.listForm.resetFields();
      this.getTableList();
    },
    // 更新列表选中
    onListChange(val) {
      this.listIds = val.map(item => item.id);
    },
    // 清除缓存
    onClearCache(val) {
      deleteParameterCache(val).then(res => {
        let isSuccess = res.status === 200;

        this.$notify({
          title: isSuccess ? "成功" : "失败",
          message: isSuccess ? "清除成功" : "清除失败",
          type: isSuccess ? "success" : "error",
          duration: 2000
        });
      });
    },
    // 批量清理缓存
    onClearAll() {
      if (!this.listIds.length) {
        this.$notify({
          title: "提示",
          message: "请选择需要清理的数据",
          type: "warning",
          duration: 2000
        });
        return;
      }

      deleteParameterAllCache({
        ids: this.listIds
      }).then(res => {
        let isSuccess = res.status === 200;
        this.$notify({
          title: isSuccess ? "成功" : "失败",
          message: isSuccess ? "清理成功" : res.message,
          type: isSuccess ? "success" : "error",
          duration: 2000
        });
      });
    },
    // 查看缓存
    onLookCheck(val) {
      getParameterCacheValue(val).then(res => {
        let isSuccess = res.status === 200;

        if (!isSuccess) {
          this.$notify({
            title: "失败",
            message: res.message,
            type: "error",
            duration: 2000
          });
          return;
        }

        this.$alert(`当前缓存值为：${res.data.data}`, "提示");
      });
    },
    // 表单编辑处理
    onItemEdit(id) {
      this.form.id = id || null;

      if (this.form.id) {
        getParameter(this.form.id).then(res => {
          if (res.status == 200) {
            this.isFormDialog = true;
            this.$nextTick(() => {
              this.$refs.form && this.$refs.form.resetFields();
              this.form = res.data;
            });
          }
        });
      } else {
        this.isFormDialog = true;
        this.$nextTick(() => {
          this.$refs.form && this.$refs.form.resetFields();
        });
      }
    },
    // 表单提交
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (!valid) return;

        if (this.form.id) {
          putParameter(this.form).then(res => {
            let isSuccess = res.status === 200;
            // 提示处理
            this.$notify({
              title: isSuccess ? "成功" : "失败",
              message: isSuccess ? "保存成功" : res.message,
              type: isSuccess ? "success" : "error",
              duration: 2000
            });

            if (isSuccess) {
              this.isFormDialog = false;
              this.onResetForm();
            }
          });
        } else {
          // 新增
          postParameter(this.form).then(res => {
            let isSuccess = res.status === 200;
            // 提示处理
            this.$notify({
              title: isSuccess ? "成功" : "失败",
              message: isSuccess ? "新增成功" : res.message,
              type: isSuccess ? "success" : "error",
              duration: 2000
            });

            if (isSuccess) {
              this.isFormDialog = false;
              this.onResetForm();
            }
          });
        }
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
    }
    /* 分页处理 */
  }
};
</script>
<style lang="scss" scoped>
.parameter-config {
  height: 100%;
  .el-table {
    .el-button {
      margin: 2px 0;
    }
  }
  .el-pagination {
    padding: 10px;
  }
}
</style>