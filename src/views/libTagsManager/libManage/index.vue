<template>
  <div class="lib-manage">
    <!-- <el-form class="common-table-form" ref="listForm" :model="listQuery" :inline="true"  @keyup.enter.native="onSearch" size="mini">
      <el-form-item label="人员库名称" prop="_filter_like_name">
        <el-input v-model="listQuery._filter_like_name" clearable />
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" @click="onSearch">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="onResetForm">重置</el-button>
      </el-form-item>
    </el-form> -->

    <!-- 工具栏 -->
    <div class="common-tool">
      <div class="title">
        人员库管理
        <em>{{listTableData.length}}</em>
      </div>
      <div class="right">
        <el-button class="txt-btn" size="mini" type="text" icon="el-icon-plus" @click="onItemEdit()" v-permission="'FUNC_HOUSE_ADD'">添加</el-button>
        <el-button class="txt-btn" size="mini" type="text" icon="el-icon-delete" @click="onItemDelete" v-permission="'FUNC_HOUSE_DELETE'">删除</el-button>
      </div>
    </div>

    <!-- 表格模式 S -->
    <el-table ref="listTabel" :data="listTableData" v-loading.body="listTableLoading" height="100%" highlight-current-row @selection-change="onListChange">
      <el-table-column type="selection" width="50" />
      <el-table-column label="序号" align="center" type="index" width="50"/>
      <el-table-column prop="name" label="人员库名称" min-width="110" align="center" />
      <el-table-column prop="searchPriority" label="搜索优先级" min-width="110" align="center" />
      <el-table-column label="搜索阈值" min-width="110" align="center">
        <template slot-scope="{ row: { searchThreshold } }">{{searchThreshold ? (searchThreshold * 100).toString().slice(0, 3) + '%' : ''}}</template>
      </el-table-column>
      <el-table-column fixed="right" width="170" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="onItemEdit(scope.row, true)" v-permission="'FUNC_HOUSE_UPDATE'">查看</el-button>
          <el-button size="mini" type="success" @click="onItemEdit(scope.row)" v-permission="'FUNC_HOUSE_UPDATE'">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格模式 E -->

    <!-- 类型弹窗 -->
    <el-dialog :title="form.id?'编辑人员库':'添加人员库'" class="form-layer" ref="form" :visible.sync="isFormDialog" width="400px">
      <el-form :model="form" ref="form" label-width="100px" :rules="rules" :disabled="readonly">
        <el-form-item label="人员库名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入类型名称"></el-input>
        </el-form-item>
        <el-form-item label="搜索优先级" prop="searchPriority">
          <el-input v-model.number="form.searchPriority" placeholder="请填数字"></el-input>
        </el-form-item>
        <el-form-item label="搜索阈值" prop="searchThreshold">
          <el-input v-model.number="form.searchThreshold" placeholder="请输入0到1之间的数字"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" resize="none" :autosize="{ minRows: 3 }" placeholder="请输入备注信息" v-model="form.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <div v-if="!readonly">
          <el-button size="mini" type="primary" @click="onTypeUpdate()">确 定</el-button>
          <el-button size="mini" @click="isFormDialog = false">取 消</el-button>
        </div>
        <el-button v-else size="mini" @click="isFormDialog = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getLabelLibraryList, postLabelLibrary, deleteLabelLibrary, putLabelLibrary } from "@/api/faceLibrary";
import { messageTip } from "@/utils"

export default {
  data: () => {
    return {
      name: null,
      listTableData: [],
      listTableLoading: false,
      form: {},
      isFormDialog: false,
      readonly: false,
      listIds: [],
      rules: {
        name: { required: true, message: "人员库不能为空" },
        searchPriority: { required: true, type: 'number', message: '请输入数字' },
        searchThreshold: { type: "number", min: 0, max: 1, message: "请输入小于等于1的数字" },
      }
    }
  },
  mounted() {
    this.getTableList()
  },
  methods: {
    getTableList() {
      this.listTableLoading = true
      getLabelLibraryList().then(res => {
        this.listTableLoading = false
        this.listTableData = res.data
      })
    },
    onItemEdit(item, readonly) {
      this.readonly = readonly
      this.form = { ...item }
      this.isFormDialog = true
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
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

      this.$confirm(`确定删除这些人员库？`, "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        confirmButtonClass: "el-button--mini",
        cancelButtonClass: "el-button--mini fr",
        type: "warning"
      }).then(() => {
        deleteLabelLibrary({ ids: this.listIds }).then(res => {
          let isSuccess = res.status === 200;
          // 提示处理
          this.$notify({
            title: isSuccess ? "成功" : "失败",
            message: isSuccess ? "删除成功" : res.message,
            type: isSuccess ? "success" : "error",
            duration: 2000
          });
          if (isSuccess) {
            this.getTableList();
          }
        })
      })
    },
    onListChange(val) {
      this.listIds = val.map(item => item.id);
    },
    onTypeUpdate() {
      this.$refs.form.validate(valid => {
        if (!valid) return;
        if (this.form.id) {
          putLabelLibrary(this.form).then(res => {
            if (messageTip(res, '修改成功')) {
              this.isFormDialog = false
              this.getTableList()
            }
          })
        } else {
          postLabelLibrary(this.form).then(res => {
            if (messageTip(res, '新增成功')) {
              this.isFormDialog = false
              this.getTableList()
            }
          })
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.lib-manage{
  height: 100%;
  display: flex;
  flex-direction: column;
  .task-border-right {
    border-right: 1px solid gainsboro;
  }
  .el-pagination {
    padding: 10px;
  }
}
</style>