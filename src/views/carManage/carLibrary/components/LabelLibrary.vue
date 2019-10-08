<template>
  <el-col :span="5" class="label-library">
    <div class="title">
      <b>车辆库</b>
      <el-button size="mini" @click="openFormDialog()" v-permission="'FUNC_CARLIBRARY_ADD'">新增车辆库</el-button>
    </div>
    <el-tree ref="menuTree" class="menu" node-key="id" :data="menuData">
      <div class="menu-item" slot-scope="{ node, data }" :class="{sel: currentRow.num == data.num}" @click="onUpdataMenu(data)">
        <el-dropdown @command="onCommand($event, data)" class="more" placement="bottom-start" v-if="!data.show">
          <div class="icon">
            <svg-icon icon-class="more" />
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="upd" v-permission="'FUNC_CARLIBRARY_UPDATE'">编辑</el-dropdown-item>
            <el-dropdown-item command="del" v-permission="'FUNC_CARLIBRARY_DELETE'">删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <svg-icon icon-class="carManage" v-if="data.show"/>
        <svg-icon icon-class="car" v-else/>
        <span>{{data.name}}</span>
        <div class="total" v-if="!data.children">{{data.count }}</div>
      </div>
    </el-tree>

    <!-- 编辑车辆库弹层 S -->
    <el-dialog :title="form.id?'编辑车辆库':'新增车辆库'" class="form-layer" :visible.sync="isFormDialog" width="400px">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px" :style="waterBg">
        <el-form-item label="车辆库名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入车辆库名称"></el-input>
        </el-form-item>
        <el-form-item label="标识颜色" prop="color">
          <el-color-picker v-model="form.color"></el-color-picker>
        </el-form-item>
        <el-form-item label="标识文字" prop="shortName">
          <el-input v-model="form.shortName" placeholder="请输入标识文字"></el-input>
        </el-form-item>
        <el-form-item label="语音顺序" prop="voiceTempletIndex">
          <el-input v-model="form.voiceTempletIndex" placeholder="请输入语音顺序"></el-input>
        </el-form-item>
        <el-form-item label="语音模板" prop="voiceTempletId">
          <el-input v-model="form.voiceTempletId" placeholder="请输入语音模板"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" resize="none" :autosize="{ minRows: 3 }" placeholder="请输入备注信息" v-model="form.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="onUpdate()">确 定</el-button>
        <el-button size="mini" @click="isFormDialog = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 编辑车辆库弹层 E -->
  </el-col>
</template>
<script>

import { getcarLibraries, DeletecarLibraries, AddcarLibraries, getEditcarLibraries, putcarLibraries } from "@/api/carManage";
import { mapState } from "vuex";

export default {
  name: "labelLibrary",
  data: () => ({
    menuData: null,
    currentRow: {},
    currentIndex: 0,

    // 表单弹窗
    isFormDialog: false,
    form: {
      name: null, //车辆库名称
      color: "#c7e09c",
      shortName: null, //标识文字
      voiceTempletIndex: null,  //语音顺序
      voiceTempletId: null,  //语音模板
      remark: null
    },
    rules: {
      name: { required: true, message: "车辆库名称不能为空" },
    }
  }),
  created() {
    this.menuList();
  },
  computed: {
    ...mapState({
      waterBg: state => state.user.waterBg, // 水印
    })
  },
  methods: {
    menuList() {
      getcarLibraries().then(res => {
        if (res.status == 200) {
          this.menuData = res.data;
          let sum = 0
          res.data.forEach(item => {
            sum += item.count
          })
          this.menuData.splice(0,0,{
            show:true,
            name:"全部车辆库",
            count: sum
          })
          let row = this.menuData.find(item => item.num == this.currentRow.num);
          this.onUpdataMenu(row ? row : this.menuData[0]);
        }
      });
    },
    onUpdataMenu(row) {
      this.currentRow = row;
      this.$emit("change", this.currentRow);
    },
    // 车辆库更多操作
    onCommand(command, data) {
      if (command == "del") {
        this.$confirm(`确定删除车辆库【${data.name}】？`, "提示", {
          cancelButtonText: "取消",
          confirmButtonText: "确定",
          confirmButtonClass: "el-button--mini",
          cancelButtonClass: "el-button--mini fr",
          type: "warning"
        }).then(() => {
          DeletecarLibraries(data.id).then(res => {
            let isSuccess = res.status === 200;
            // 提示处理
            this.$notify({
              title: isSuccess ? "成功" : "失败",
              message: isSuccess ? "删除成功" : res.message,
              type: isSuccess ? "success" : "error",
              duration: 2000
            });
            if (isSuccess) {
              this.currentIndex = 0;
              this.menuList();
            }
          });
        });
      }
      if (command == "upd") {
        getEditcarLibraries(data.id).then(res => {
          if (res.status == 200) {
            this.openFormDialog(res.data);
          }
        });
      }
    },
    openFormDialog(data) {
      this.isFormDialog = true;
      this.$nextTick(() => {
        this.form.id = null;
        this.$refs.form.resetFields();
        if (data) {
          this.form = data;
        }
      });
    },
    onUpdate() {
      this.$refs.form.validate(valid => {
        if (!valid) return;
        if (this.form.id) {
          // 修改标签库
          putcarLibraries(this.form).then(res => {
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
          AddcarLibraries(this.form).then(res => {
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
.label-library {
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

.voice-layer {
  .el-row {
    display: flex;
  }
  .el-pagination {
    padding: 10px;
  }
  ul {
    background: #fafbfd;
    height: 100%;
    border-right: 1px solid #e5e5e5;
  }
  li {
    line-height: 36px;
    padding: 0 10px 0 20px;
    border-bottom: 1px solid #edeff3;
    font-size: 14px;
    color: #333;
    &.sel {
      background: #0fa0ff;
      border-color: #0fa0ff;
      color: #fff;
    }
  }
}
</style>


