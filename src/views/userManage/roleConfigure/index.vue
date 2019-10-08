<template>
  <div class="user-configure">
    <!-- 表单筛选 -->
    <el-form class="common-table-form" ref="listForm" :model="listQuery" :inline="true" @submit.native.prevent size="mini">
      <el-form-item prop="pageNo" class="m0" />
      <el-form-item prop="pageSize" class="m0" />
      <el-form-item prop="totalCount" class="m0" />
      <el-form-item label="关键字" prop="_filter_eq_name">
        <el-input @keyup.enter.native="onSearch" placeholder="编码/名称" v-model="listQuery._filter_eq_name" clearable />
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
        角色管理
        <em v-if="listTableData.totalCount">{{listTableData.totalCount}}</em>
      </div>
      <div class="right">
        <el-button class="txt-btn" size="mini" type="text" icon="el-icon-plus" @click="onItemEdit()" v-permission="'FUNC_ROLE_ADD'">添加</el-button>
        <el-button class="txt-btn" size="mini" type="text" icon="el-icon-delete" @click="onItemDelete" v-permission="'FUNC_ROLE_DELETE'">删除</el-button>
      </div>
    </div>

    <!-- 表格模式 S -->
    <el-table ref="listTabel" :data="listTableData.items" height="calc(100% - 136px)" v-loading.body="listTableLoading" highlight-current-row @selection-change="onListChange">
      <el-table-column type="selection" width="50" />
      <el-table-column label="序号" align="center" type="index" width="50"/>
      <el-table-column prop="name" label="名称" align="center" />
      <el-table-column prop="code" label="编码" align="center" />
      <el-table-column fixed="right" width="100" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="onItemEdit(scope.row.id)" v-permission="'FUNC_ROLE_UPDATE'">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格模式 E -->

    <el-pagination @size-change="onListLimit" @current-change="onListPaging" :current-page="listQuery.pageNo" :page-size="listQuery.pageSize" :page-sizes="[15,30,50]" layout="total, sizes, prev, pager, next, jumper" :total="listTableData.totalCount" />

    <!-- 编辑角色弹层 S -->
    <el-dialog :title="form.id?'编辑角色':'新增角色'" class="form-layer" :visible.sync="isFormDialog" width="400px">
      <el-form :model="form" :rules="rules" ref="form" label-width="80px">
        <el-form-item prop="id" class="m0" />
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入编码" />
        </el-form-item>
        <el-form-item label="权限分配" prop="resourceIds" class="m0">
          <el-input v-model="form.resourceIds[0]" style="display: none"></el-input>
          <el-button type="primary" plain @click="$refs.permissionAssignment.open(form.resourceIds)">选择权限</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="onSubmit()">确 定</el-button>
        <el-button size="mini" @click="isFormDialog = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 编辑角色弹层 E -->

    <permission-assignment ref="permissionAssignment" @complete="onResourceChange" />
  </div>
</template>
<script>
import {
  getRoleList,
  postRole,
  deleteRole,
  putRole,
  getRole
} from "@/api/userManage";
import { getDictionary } from "@/api/common";

export default {
  components: {
    PermissionAssignment: () => import("./components/PermissionAssignment")
  },
  data() {
    return {
      sexData: {},

      listIds: [],
      listQuery: {
        pageNo: 1,
        pageSize: 15,
        totalCount: null,
        _filter_eq_name: null
      },
      listTableData: {},
      listTableLoading: false,

      isFormDialog: false,
      form: {
        id: null,
        name: null,
        code: null,
        resourceIds: []
      },
      rules: {
        name: { required: true, message: "名称不能为空" },
        code: { required: true, message: "编码不能为空" },
        resourceIds: { required:true,message:"权限不能为空" }
      }
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      getDictionary("comm_sex").then(res => {
        let json = {};
        res.data.map(item => {
          json[item.value] = item.label;
        });

        this.sexData = json;
      });
      this.getTableList();
    },
    // 获取表单数据
    getTableList() {
      this.listTableLoading = true;
      getRoleList(this.listQuery)
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
      this.getTableList();
    },
    // 更新列表选中
    onListChange(val) {
      this.listIds = val.map(item => item.id);
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
        deleteRole({
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
            this.onSearch();
          }
        });
      });
    },

    /* 分页处理 */
    onListPaging(val) {
      this.listQuery.pageNo = val;
      this.listQuery.totalCount = this.listTableData.totalCount;
      this.getTableList();
    },
    onListLimit(val) {
      this.listQuery.pageSize = val;
      this.listQuery.totalCount = this.listTableData.totalCount;
      this.getTableList();
    },
    /* 分页处理 */

    /* 表单处理 */
    // 表单编辑
    onItemEdit(id) {
      this.isFormDialog = true;
      this.$nextTick(() => {
        this.$refs.form && this.$refs.form.resetFields();

        if (id) {
          getRole(id).then(res => {
            this.form = res.data;
          });
        }
      });
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (!valid) return;

        let api = this.form.id ? putRole : postRole;
        let request = null;

        let form = JSON.parse(JSON.stringify(this.form));
        if (!form.password) {
          form.password = form.mobile;
        }

        // 通用处理
        eval(`(request = api(${JSON.stringify(form)}))`);
        request.then(res => {
          let isSuccess = res.status === 200;
          // 提示处理
          this.$notify({
            title: isSuccess ? "成功" : "失败",
            message: isSuccess
              ? this.form.id
                ? "修改成功"
                : "新增成功"
              : res.message,
            type: isSuccess ? "success" : "error",
            duration: 2000
          });

          if (isSuccess) {
            this.onSearch();
            this.isFormDialog = false;
          }
        });
      });
    },
    onResourceChange(ids) {
      this.form.resourceIds = ids;
    }
    /* 表单处理 */
  }
};
</script>
<style lang="scss" scoped>
.user-configure {
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
