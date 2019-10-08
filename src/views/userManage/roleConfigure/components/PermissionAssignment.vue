<template>
  <el-dialog title="权限分配" class="mlph-layer" :visible.sync="isDialog" width="400px" append-to-body>
    <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
    <el-tree ref="menuTree" class="filter-tree" node-key="id" :data="treeData" :filter-node-method="onFilterNode" @node-expand="onTreeExpand" @node-collapse="onTreeCollapse" :default-expanded-keys="treeExpandedKeys" show-checkbox default-expand-all check-strictly>
      <div class="tree-item" slot-scope="{ node, data }">
        <span>{{ data.name }}</span>
      </div>
    </el-tree>
    <div slot="footer">
      <el-button size="mini" type="primary" @click="onSubmit">确 定</el-button>
      <el-button size="mini" @click="isDialog = false">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getMenuTree } from "@/api/basisConfig/menuManage";

export default {
  data: () => ({
    isDialog: false,
    treeExpandedKeys: [],
    filterText: "",
    treeData: []
  }),
  watch: {
    filterText(val) {
      this.$refs.menuTree.filter(val);
    }
  },
  methods: {
    open(ids) {
      this.filterText = "";
      getMenuTree().then(res => {
        this.treeData = res.data;

        this.isDialog = true;

        this.$nextTick(() => {
          this.treeExpandedKeys = [];
          this.$refs.menuTree.setCheckedKeys([]);
          if (ids && ids.length) {
            this.treeExpandedKeys = ids;
            this.$refs.menuTree.setCheckedKeys(this.treeExpandedKeys);
          }
        });
      });
    },
    // 选择部门相关
    onFilterNode(value, data) {
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
    onSubmit() {
      let _arr = this.$refs.menuTree.getCheckedKeys();
      this.$emit("complete", _arr);
      this.isDialog = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.mlph-layer {
  .el-pagination {
    padding: 10px;
  }
  .el-form {
    padding: 10px;
    /deep/ .el-form-item {
      margin: 0;
    }
    .el-select,
    .el-input {
      width: 120px;
    }
  }
}
</style>