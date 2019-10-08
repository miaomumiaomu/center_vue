<template>
  <el-col :span="5" class="code-menu">
    <div class="title">
      <b>编码配置</b>
      <el-button size="mini" @click="openFormDialog()" v-permission="'FUNC_CODE_ADD'">新增编码</el-button>
    </div>
    <el-tree ref="menuTree" class="menu" node-key="id" :data="menuData">
      <div class="menu-item" slot-scope="{ node, data }" :class="{sel: currentRow.id == data.id}" @click="onUpdataMenu(data)">
        <el-dropdown @command="onCommand($event, data)" class="more" placement="bottom-start">
          <div class="icon">
            <svg-icon icon-class="more" />
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="upd" v-permission="'FUNC_CODE_UPDATE'">编辑</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <span>{{data.sequenceType}}</span>
        <!-- <div class="total" v-if="!data.children">{{data.personCount}}</div> -->
      </div>
    </el-tree>

    <!-- 编辑编码弹层 S -->
    <el-dialog :title="form.id?'编辑编码':'新增编码'" class="form-layer" :visible.sync="isFormDialog" width="400px">
      <el-form :model="form" :rules="rules" ref="form" label-width="110px">
        <el-form-item label="类型名称" prop="sequenceType">
          <el-input v-model="form.sequenceType" placeholder="请输入类型名称"></el-input>
        </el-form-item>
        <el-form-item label="序列号长度" prop="sequenceLength">
          <el-input v-model.number="form.sequenceLength" placeholder="请输入序列号长度"></el-input>
        </el-form-item>
        <el-form-item label="序列号初始值" prop="initSequenceNo">
          <el-input v-model.number="form.initSequenceNo" placeholder="请输入序列号初始值"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="onSubmit()">确 定</el-button>
        <el-button size="mini" @click="isFormDialog = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 编辑编码弹层 E -->
  </el-col>
</template>
<script>
import { getCodeMenu, postCode, putCode, getCode } from "@/api/codeManage";

export default {
  data: () => ({
    menuData: null,
    currentRow: {},

    // 表单弹窗
    isFormDialog: false,
    form: {
      sequenceType: null,
      sequenceLength: null,
      initSequenceNo: null
    },
    rules: {
      sequenceType: { required: true, message: "类型名称不能为空" },
      sequenceLength: [
        { required: true, message: "序列号长度不能为空" },
        { type: "number", min: 0, message: "序列号长度为正整数" }
      ],
      initSequenceNo: [
        { required: true, message: "序列号初始值不能为空" },
        { type: "number", min: 0, message: "序列号初始值为正整数" }
      ]
    }
  }),
  created() {
    this.menuList();
  },
  methods: {
    menuList() {
      getCodeMenu().then(res => {
        if (res.status == 200) {
          this.menuData = res.data.rows;

          let row = this.menuData.find(item => item.id == this.currentRow.id);
          this.onUpdataMenu(row ? row : this.menuData[0]);
        }
      });
    },
    onUpdataMenu(row) {
      this.currentRow = row;

      this.$emit("change", this.currentRow);
    },
    // 编码更多操作
    onCommand(command, data) {
      if (command == "upd") {
        getCode(data.id).then(res => {
          if (res.status == 200) {
            this.openFormDialog(res.data);
          }
        });
      }
    },
    openFormDialog(data) {
      this.isFormDialog = true;
      this.$nextTick(() => {
        this.$refs.form.resetFields();
        if (data) {
          this.form = data;
        }
      });
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (!valid) return;

        if (this.form.id) {
          // 修改标签库
          putCode(this.form).then(res => {
            let isSuccess = res.status === 200;
            // 提示处理
            this.$notify({
              title: isSuccess ? "成功" : "失败",
              message: isSuccess ? "修改成功" : res.message,
              type: isSuccess ? "success" : "error",
              duration: 2000
            });

            this.menuList();
            this.isFormDialog = false;
          });
        } else {
          // 添加标签库
          postCode(this.form).then(res => {
            let isSuccess = res.status === 200;
            // 提示处理
            this.$notify({
              title: isSuccess ? "成功" : "失败",
              message: isSuccess ? "新增成功" : res.message,
              type: isSuccess ? "success" : "error",
              duration: 2000
            });

            this.menuList();
            this.isFormDialog = false;
          });
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.code-menu {
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


