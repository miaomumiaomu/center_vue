<template>
  <el-col :span="5" class="model-menu">
    <div class="title">
      <b>模型菜单</b>
      <el-button size="mini" @click="openForm()" v-permission="'FUNC_MODEL_ADD'">新增模型</el-button>
    </div>
    <el-tree ref="menuTree" class="menu" node-key="id" :data="menuData">
      <div class="menu-item" slot-scope="{ node, data }" :class="{sel: currentRow.id == data.id}" @click="onUpdataMenu(data)">
        <el-dropdown @command="onCommand($event, data)" class="more" placement="bottom-start">
          <div class="icon">
            <svg-icon icon-class="more" />
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="upd" v-permission="'FUNC_MODEL_UPDATE'">编辑</el-dropdown-item>
            <el-dropdown-item command="del" v-permission="'FUNC_MODEL_DELETE'">删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <span>{{data.name}}</span>
      </div>
    </el-tree>

    <!-- 编辑模型弹层 S -->
    <el-dialog :title="form.id?'编辑模型':'新增模型'" class="form-layer" :visible.sync="isFormDialog" width="450px">
      <el-form :model="form" :rules="rules" ref="form" label-width="140px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入编码" :disabled="form.id ? true : false"  />
        </el-form-item>
        <el-form-item label="维度" prop="dimension">
          <el-input v-model="form.dimension" placeholder="请输入维度" />
        </el-form-item>
        <el-form-item label="权重" prop="weight">
          <el-input v-model="form.weight" placeholder="请输入权重" />
        </el-form-item>
        <el-form-item label="搜索IP" prop="searchIp">
          <el-input v-model="form.searchIp" placeholder="请输入搜索IP" />
        </el-form-item>
        <el-form-item label="搜索端口" prop="searchPort">
          <el-input v-model="form.searchPort" placeholder="请输入搜索端口" />
        </el-form-item>
        <el-form-item label="搜索阈值" prop="searchThreshold">
          <el-input v-model="form.searchThreshold" placeholder="请输入搜索阈值" />
        </el-form-item>
        <el-form-item label="确认阈值" prop="confirmThreshold">
          <el-input v-model="form.confirmThreshold" placeholder="请输入确认阈值" />
        </el-form-item>
        <el-form-item label="分割点阈值" prop="segmentThreshold">
          <el-input v-model="form.segmentThreshold" placeholder="请输入分割点阈值" />
        </el-form-item>
        <el-form-item label="Rank下限" prop="searchMin">
          <el-input v-model="form.searchMin" placeholder="请输入Rank下限" />
        </el-form-item>
        <el-form-item label="Rank上限" prop="searchMax">
          <el-input v-model="form.searchMax" placeholder="请输入Rank上限" />
        </el-form-item>
        <el-form-item label="Rank提权" prop="searchTh">
          <el-input v-model="form.searchTh" placeholder="请输入Rank提权" />
        </el-form-item>
        <el-form-item label="Rank不相似阈值" prop="unLikeThreshold">
          <el-input v-model="form.unLikeThreshold" placeholder="请输入Rank不相似阈值" />
        </el-form-item>
        <el-form-item label="Rank确认阈值" prop="confirmThreshold1" >
          <el-input v-model="form.confirmThreshold1" placeholder="请输入Rank确认阈值" />
        </el-form-item>
        <el-form-item label="状态" prop="isEnabled" class="m0">
          <el-switch v-model="form.isEnabled" :active-value="1" :inactive-value="0" active-text="启用" inactive-text="禁用" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="onSubmit()">确 定</el-button>
        <el-button size="mini" @click="isFormDialog = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 编辑模型弹层 E -->
  </el-col>
</template>
<script>
import { formValidate } from "@/utils";
import {
  getModelMenu,
  postModel,
  deleteModel,
  putModel,
  getModel
} from "@/api/modelConfig";

const form = {
  name: null,
  code: null,
  dimension: null,
  weight: null,
  searchIp: null,
  searchPort: null,
  isEnabled: 1,
  searchThreshold: 0.7,
  confirmThreshold: 0.7,
  segmentThreshold: 0.7,
  searchMin: 0.7,
  searchMax: 0.7,
  searchTh: 0.7,
  unLikeThreshold: null,
  confirmThreshold1: null
};

export default {
  data: () => ({
    menuData: [],
    currentRow: {},

    // 表单弹窗
    isFormDialog: false,
    form: form,
    rules: {
      name: { required: true, message: "模型名称不能为空" },
      code: { required: true, message: "模型编码不能为空" },
      dimension: { required: true, message: "维度不能为空" },
      weight: [
        { required: true, message: "权重不能为空" },
        {
          min: 0,
          max: 1.001,
          toFixed: 3,
          tip: "权重范围为0-1之间",
          validator: formValidate.threshold
        }
      ],
      searchIp: [
        { required: true, message: "搜索IP不能为空" },
        { validator: formValidate.ip }
      ],
      searchPort: { required: true, message: "搜索端口不能为空" },
      searchThreshold: [
        { required: true, message: "搜索阈值不能为空" },
        {
          min: 0,
          max: 1.001,
          toFixed: 3,
          tip: "搜索阈值范围为0-1之间",
          validator: formValidate.threshold
        }
      ],
      confirmThreshold: [
        { required: true, message: "确认阈值不能为空" },
        {
          min: 0,
          max: 1.001,
          toFixed: 3,
          tip: "确认阈值范围为0-1之间",
          validator: formValidate.threshold
        }
      ],
      segmentThreshold: [
        { required: true, message: "分割点阈值不能为空" },
        {
          min: 0,
          max: 1.001,
          toFixed: 3,
          tip: "分割点阈值范围为0-1之间",
          validator: formValidate.threshold
        }
      ],
      searchMin: [
        { required: true, message: "Rank下限不能为空" },
        {
          min: 0,
          max: 1.001,
          toFixed: 3,
          tip: "Rank下限范围为0-1之间",
          validator: formValidate.threshold
        }
      ],
      searchMax: [
        { required: true, message: "Rank上限不能为空" },
        {
          min: 0,
          max: 1.001,
          toFixed: 3,
          tip: "Rank上限范围为0-1之间",
          validator: formValidate.threshold
        }
      ],
      searchTh: [
        { required: true, message: "Rank提权不能为空" },
        {
          min: 0,
          max: 1.001,
          toFixed: 3,
          tip: "Rank提权范围为0-1之间",
          validator: formValidate.threshold
        }
      ],
      unLikeThreshold: [
        { required: true, message: "Rank不相似阈值不能为空" },
        {
          min: 0,
          max: 1.001,
          toFixed: 3,
          tip: "Rank不相似阈值范围为0-1之间",
          validator: formValidate.threshold
        }
      ],
      confirmThreshold1: [
        { required: true, message: "Rank确认阈值不能为空" },
        {
          min: 0,
          max: 1.001,
          toFixed: 3,
          tip: "Rank确认阈值范围为0-1之间",
          validator: formValidate.threshold
        }
      ]
    }
  }),
  created() {
    this.menuList();
  },
  methods: {
    menuList() {
      getModelMenu().then(res => {
        if (res.status == 200) {
          this.menuData = res.data;

          let row = this.menuData.find(item => item.id == this.currentRow.id);
          this.onUpdataMenu(row ? row : this.menuData[0]);
        }
      });
    },
    onUpdataMenu(row) {
      this.currentRow = row;

      this.$emit("change", this.currentRow);
    },
    // 人脸库更多操作
    onCommand(command, data) {
      if (command == "del") {
        this.$confirm(`确定删除模型【${data.name}】？`, "提示", {
          cancelButtonText: "取消",
          confirmButtonText: "确定",
          confirmButtonClass: "el-button--mini",
          cancelButtonClass: "el-button--mini fr",
          type: "warning"
        }).then(() => {
          deleteModel(data.id).then(res => {
            let isSuccess = res.status === 200;
            // 提示处理
            this.$notify({
              title: isSuccess ? "成功" : "失败",
              message: isSuccess ? "删除成功" : res.message,
              type: isSuccess ? "success" : "error",
              duration: 2000
            });

            if (isSuccess) {
              this.menuList();
            }
          });
        });
      }
      if (command == "upd") {
        getModel(data.id).then(res => {
          if (res.status == 200) {
            this.openForm(res.data);
          }
        });
      }
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.form.id) {
            // 修改标签库
            putModel(this.form).then(res => {
              let isSuccess = res.status === 200;
              // 提示处理
              this.$notify({
                title: isSuccess ? "成功" : "失败",
                message: isSuccess ? "修改成功" : res.message,
                type: isSuccess ? "success" : "error",
                duration: 2000
              });

              if (isSuccess) {
                this.menuList();
                this.isFormDialog = false;
              }
            });
          } else {
            // 添加标签库
            postModel(this.form).then(res => {
              let isSuccess = res.status === 200;
              // 提示处理
              this.$notify({
                title: isSuccess ? "成功" : "失败",
                message: isSuccess ? "新增成功" : res.message,
                type: isSuccess ? "success" : "error",
                duration: 2000
              });

              if (isSuccess) {
                this.menuList();
                this.isFormDialog = false;
              }
            });
          }
        }
      });
    },
    openForm(newForm) {
      this.form = form;
      this.isFormDialog = true;

      this.$nextTick(() => {
        this.$refs.form && this.$refs.form.resetFields();
        if (newForm) {
          this.form = newForm;
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.model-menu {
  // background: #fafbfd;
  background: rgba(250,251,253, .5);
  border-right: 1px solid #e1e1e1;
  .title {
    height: 46px;
    line-height: 46px;
    padding: 0 10px 0 16px;
    font-size: 14px;
    color: #333;
    .el-button {
      float: right;
      margin-top: 10px;
    }
  }
  .menu {
    background: transparent;
    padding: 0 6px;
    border-top: 1px solid #e1e1e1;
    font-size: 13px;
    color: #333;
    .more {
      height: 100%;
      .icon {
        display: inline-block;
        height: 100%;
      }
      .svg-icon {
        margin-right: 2px !important;
      }
    }
    /deep/ {
      .el-tree-node__children {
        .el-icon-caret-right {
          display: none;
        }
        .menu-item {
          padding-left: 28px;
        }
      }
      .el-tree-node.is-current {
        & > .el-tree-node__content {
          background: transparent;
        }
      }
      .el-tree-node__content {
        height: 39px;
        line-height: 38px;
        border-bottom: 1px solid #edeff3;
        &:hover {
          background: #d5e6f9;
        }
      }
      .el-icon-caret-right {
        position: absolute;
        right: 0;
        top: 50%;
        margin: -15px 0 0;
        font-size: 16px;
      }
      .el-tree-node__content {
        position: relative;
        padding: 0 !important;
      }
      .menu-item {
        display: flex;
        flex: 1;
        width: 100%;
        height: 100%;
        padding: 0 6px;
        &.children {
          padding: 0 6px 0 16px;
        }
        &.sel {
          background: #d5e6f9;
        }
        span {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .svg-icon {
          display: inline-block;
          height: 100%;
          margin-right: 6px;
          vertical-align: top;
          font-size: 16px;
          color: #b5c0cd;
        }
        .total {
          margin: 0 6px;
          color: #878c8f;
        }
      }
    }
  }
}

.form-layer {
  .el-color-picker {
    vertical-align: top;
  }
  .tip {
    line-height: 100%;
    margin-top: 6px;
    font-size: 12px;
    color: #aaa;
  }
}
</style>