<template>
  <div class="app-container">
    <el-row>
      <!-- 左侧模型菜单 S -->
      <model-menu ref="modelMenu" @change="onMenuChange" />
      <!-- 左侧模型菜单 E -->

      <el-col :span="19" class="right-box">
        <!-- 表单筛选 -->
        <el-form class="common-table-form" ref="listForm" :model="listQuery" :inline="true" @keyup.enter.native="onSearch" size="mini">
          <el-form-item prop="pageNo" class="m0" />
          <el-form-item prop="pageSize" class="m0" />
          <el-form-item prop="totalCount" class="m0" />
          <el-form-item prop="_filter_eq_libraryNum" label="人脸库">
            <face-library-select v-model="listQuery._filter_eq_libraryNum" placeholder="全部" clearable />
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
            库模型
            <em v-if="listTableData.total">{{listTableData.total}}</em>
          </div>
        </div>

        <!-- 表格模式 S -->
        <el-table :data="listTableData.rows" height="calc(100vh - 255px)" v-loading.body="listTableLoading" highlight-current-row>
          <el-table-column prop="libraryName" label="库名" align="center" />
          <el-table-column prop="modelCode" label="模型代码" align="center" />
          <el-table-column prop="searchIp" label="搜索IP" align="center" />
          <el-table-column prop="searchPort" label="搜索端口" align="center" />
          <el-table-column fixed="right" width="130" align="center" label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="success" @click="onItemEdit(scope.row.id)" v-permission="'FUNC_MODELLIBRARY_UPDATE'">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 表格模式 E -->

        <el-pagination @size-change="onListLimit" @current-change="onListPaging" :current-page.sync="listQuery.pageNo" :page-sizes="[15,30,50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="listTableData.total" />

        <!-- 编辑模型弹层 S -->
        <el-dialog :title="form.id?'编辑模型':'新增模型'" class="form-layer" :visible.sync="isFormDialog" width="400px">
          <el-form :model="form" :rules="rules" ref="form" label-width="100px">
            <el-form-item label="搜索IP" prop="searchIp">
              <el-input v-model="form.searchIp" placeholder="请输入搜索IP" />
            </el-form-item>
            <el-form-item label="搜索端口" prop="searchPort">
              <el-input v-model="form.searchPort" placeholder="请输入搜索端口" />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button size="mini" type="primary" @click="onSubmit()">确 定</el-button>
            <el-button size="mini" @click="isFormDialog = false">取 消</el-button>
          </div>
        </el-dialog>
        <!-- 编辑模型弹层 E -->
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { formValidate } from "@/utils";
import {
  getLibraryModelList,
  getLibraryModel,
  putLibraryModel
} from "@/api/modelConfig";

export default {
  name: "modelConfig",
  components: {
    ModelMenu: () => import("./components/ModelMenu")
  },
  data() {
    return {
      listQuery: {
        pageNo: 1,
        pageSize: 15,
        totalCount: null,
        _filter_eq_modelCode: null,
        _filter_eq_libraryNum: null
      },
      listTableData: {},
      listTableLoading: false,

      isFormDialog: false,
      form: {},
      rules: {
        searchIp: [
          { validator: formValidate.ip },
          { required: true, message: "搜索IP不能为空" }
        ],
        searchPort: { required: true, message: "搜索端口不能为空" }
      }
    };
  },
  methods: {
    // 菜单更新
    onMenuChange(data) {
      this.listQuery._filter_eq_modelCode = data.code;

      this.onResetForm();
    },
    getTableList() {
      getLibraryModelList(this.listQuery)
        .then(res => {
          if (res.status == 200) {
            this.listTableData = res.data;
          }
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
      this.getTableList();
    },
    // 分页更新
    onListLimit(val) {
      this.listQuery.pageSize = val;
      this.listQuery.totalCount = this.listTableData.total;
      this.getTableList();
    },
    // 分页更新
    onListPaging(val) {
      this.listQuery.pageNo = val;
      this.listQuery.totalCount = this.listTableData.total;
      this.getTableList();
    },
    // 库模型编辑
    onItemEdit(id) {
      getLibraryModel(id).then(res => {
        if (res.status == 200) {
          this.form = res.data;
          this.isFormDialog = true;
        }
      });
    },
    // 库模型保存
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (!valid) return;

        if (this.form.id) {
          // 修改标签库
          putLibraryModel(this.form).then(res => {
            let isSuccess = res.status === 200;
            // 提示处理
            this.$notify({
              title: isSuccess ? "成功" : "失败",
              message: isSuccess ? "修改成功" : res.message,
              type: isSuccess ? "success" : "error",
              duration: 2000
            });

            if (isSuccess) {
              this.getTableList();
              this.isFormDialog = false;
            }
          });
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.app-container {
  height: 100%;
  .el-row,
  .el-col {
    height: 100%;
  }
  .el-pagination {
    padding: 10px;
  }
}
</style>
