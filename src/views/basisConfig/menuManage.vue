<template>
  <el-row class="menu-manage">
    <el-col :span="10" class="menu-tree">
      <div class="title">
        <el-input placeholder="输入关键字进行过滤" v-model="filterText" prefix-icon="el-icon-search" size="mini" clearable>
          <el-button size="mini" slot="append" @click="onCommand('add', {})" v-permission="'FUNC_MENU_ADD'">
            <i class="el-icon-plus" />
          </el-button>
        </el-input>
      </div>
      <div class="menu-box">
        <el-tree ref="menuTree" class="menu" :data="menuData" :filter-node-method="filterNode" @node-expand="onTreeExpand" @node-collapse="onTreeCollapse" :default-expanded-keys="treeExpandedKeys" node-key="id" highlight-current :expand-on-click-node="false">
          <div class="menu-item" :class="{sel:currentRow.id == data.id}" slot-scope="{ node, data }" @click="onUpdataMenu(data)">
            <svg-icon icon-class="lock" v-if="data.type == 3" />
            <span>{{ data.name }}</span>
            <div class="more">
              <el-button type="text" size="mini" style="display:content" v-permission="'FUNC_MENU_ADD'" ><i class="el-icon-circle-plus" @click.stop="onCommand('add', data)" /></el-button>
              <em />
              <el-button type="text" size="mini" v-permission="'FUNC_MENU_DELETE'" ><i class="el-icon-circle-close" @click.stop="onCommand('del', data)" /></el-button>
            </div>
          </div>
        </el-tree>
      </div>
    </el-col>
    <el-col :span="14" class="menu-form">
      <!-- 菜单表单 S -->
      <el-form :model="form" :rules="rules" ref="form" label-width="80px">
        <el-form-item prop="id" class="m0" />
        <el-form-item prop="parentId" class="m0" />
        <el-form-item label="上级菜单" prop="parentName" v-if="form.parentName">
          <el-input v-model="form.parentName" readonly />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入编码" />
        </el-form-item>
        <el-form-item label="类型" prop="resourceType">
          <dict-select dict-name="authority_menu" v-model="form.resourceType" />
        </el-form-item>
        <el-form-item label="排序" prop="sortNo">
          <el-input v-model="form.sortNo" placeholder="请输入排序" />
        </el-form-item>
        <el-form-item label="图标" prop="icoName" v-if="form.resourceType != 3">
          <el-input v-model="form.icoName" placeholder="请输入图标" />
        </el-form-item>
        <el-form-item label="路由路径" prop="url" v-if="form.resourceType != 3">
          <el-input v-model="form.url" placeholder="请输入路由路径" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" v-permission="'FUNC_MENU_UPDATE'">保 存</el-button>
        </el-form-item>
      </el-form>
      <!-- 菜单表单 E -->
    </el-col>
  </el-row>
</template>
<script>
import {
  getMenuTree,
  postMenu,
  deleteMenu,
  putMenu,
  getMenu
} from "@/api/basisConfig/menuManage";

export default {
  data: () => ({
    filterText: "",
    menuData: [],
    treeExpandedKeys: [],
    historyExpandedKeys: [],
    currentRow: {},

    form: {
      id: null,
      code: null,
      name: null,
      url: null,
      icoName: null,
      resourceType: null,
      sortNo: 1,
      parentId: null,
      parentName: null
    },
    rules: {
      name: { required: true, message: "名称不能为空" },
      code: { required: true, message: "编码不能为空" },
      resourceType: { required: true, message: "类型不能为空" },
      sortNo: { required: true, message: "排序不能为空" }
    }
  }),
  watch: {
    filterText(val) {
      this.$refs.menuTree.filter(val);
    }
  },
  created() {
    this.menuList();
  },
  methods: {
    /* 树处理 */
    menuList() {
      getMenuTree().then(res => {
        if (res.status == 200) {
          this.menuData = res.data;
        }
      });
    },
    onUpdataMenu(row) {
      this.currentRow = row;

      getMenu(row.id).then(res => {
        this.form = res.data;
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    onTreeExpand(data) {
      if (!data) return;

      let index = this.treeExpandedKeys.indexOf(data.id);
      if (index < 0) {
        this.treeExpandedKeys.push(data.id);
      }
    },
    onTreeCollapse() {
      this.treeExpandedKeys = [];
    },
    /* 树处理 */

    /* 表单处理 */
    onCommand(command, data) {
      if (command == "del") {
        this.$confirm(`确定删除【${data.name}】？`, "提示", {
          cancelButtonText: "取消",
          confirmButtonText: "确定",
          confirmButtonClass: "el-button--mini",
          cancelButtonClass: "el-button--mini fr",
          type: "warning"
        }).then(() => {
          deleteMenu(data.id).then(res => {
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
              this.$refs.form && this.$refs.form.resetFields();

              if (currentRow.id == data.id) {
                this.currentRow = {};
              }
            }
          });
        });
      } else {
        this.$nextTick(() => {
          this.$refs.form && this.$refs.form.resetFields();

          if (command == "add") {
            this.$set(this.form, "parentId", data.id);
            this.$set(this.form, "parentName", data.name);
          }
        });
      }
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (!valid) return;

        let api = this.form.id ? putMenu : postMenu;
        let request = null;

        // 通用处理
        eval(`(request = api(${JSON.stringify(this.form)}))`);
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
            this.menuList();
            this.onTreeExpand({
              id: this.form.parentId
            });
          }
        });
      });
    }
    /* 表单处理 */
  }
};
</script>
<style lang="scss" scoped>
.menu-manage {
  height: 100%;
  .el-col {
    height: 100%;
  }
}

.menu-tree {
  position: relative;
  // background: #fafbfd;
  background: rgba(250,251,253, .5);
  border-right: 1px solid #e1e1e1;
  .title {
    height: 46px;
    line-height: 46px;
    padding: 0 10px;
    font-size: 14px;
    color: #333;
  }
  .menu {
    background: transparent;
    overflow: hidden;
    overflow-y: auto;
    height: calc(100% - 56px);
    padding: 0 10px;
    border-top: 1px solid #edeff3;
    font-size: 13px;
    color: #333;
    .menu-item {
      display: flex;
      width: 100%;
      height: 100%;
      padding: 0 26px 0 6px;
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
        margin-right: 4px;
        vertical-align: top;
        font-size: 16px;
        color: #666;
      }
      .more {
        i {
          height: 100%;
          line-height: 38px;
          padding: 0 4px;
          vertical-align: top;
          font-size: 16px;
          color: #666;
          cursor: pointer;
        }
        .el-button{
          display: contents !important;
        }
      }
    }
    /deep/ {
      .el-tree-node.is-current {
        & > .el-tree-node__content {
          background-color: #d5e6f9;
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
        height: 39px;
        line-height: 38px;
        padding: 0 !important;
        border-bottom: 1px solid #edeff3;
        &:hover {
          background: #d5e6f9;
        }
      }
      .el-tree-node__children {
        padding-left: 8px !important;
      }
    }
  }
}

.menu-form {
  padding-top: 20px;
  .el-form {
    width: 500px;
    margin: 0 auto;
  }
}
</style>