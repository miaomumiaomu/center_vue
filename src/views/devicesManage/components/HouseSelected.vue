<template>
  <el-dialog
    title="门牌楼号"
    class="mlph-layer"
    :visible.sync="isHouseDialog"
    width="400px"
    append-to-body
  >
    <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
    <el-tree
      ref="mlphTree"
      class="filter-tree"
      node-key="key"
      :data="treeData"
      show-checkbox
      check-strictly
      :filter-node-method="onFilterNode"
      @check-change="onTreeChange"
      :default-expanded-keys="treeExpandedKeys"
    >
      <div
        class="tree-item"
        :class="{'disable-checkbox': disableType.includes(data.type)}"
        slot-scope="{ node, data }"
      >
        <svg-icon icon-class="home" v-if="data.type == 6"/>
        <span>{{ data.label }}</span>
      </div>
    </el-tree>
    <div slot="footer">
      <el-button size="mini" type="primary" @click="onSubmit">确 定</el-button>
      <el-button size="mini" @click="isHouseDialog = false">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getHouseTree } from "@/api/devicesManage";

export default {
  props: {
    data: Object,
    disableType: {
      type: Array,
      default: () => []
    },
    filterType: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    isHouseDialog: false,
    treeExpandedKeys: [],
    filterText: "",
    treeData: []
  }),
  watch: {
    filterText(val) {
      this.$refs.mlphTree.filter(val);
    }
  },
  methods: {
    open(communityId, checkedKey) {
      this.filterText = "";
      getHouseTree(communityId).then(res => {
        this.treeData = res.data;
        this.isHouseDialog = true;

        this.$nextTick(() => {
          this.$refs.mlphTree.filter();
          this.treeExpandedKeys = [];
          this.$refs.mlphTree.setCheckedKeys([]);
          if (checkedKey) {
            this.treeExpandedKeys = [checkedKey];
            this.$refs.mlphTree.setCheckedKeys([checkedKey]);
          }
        });
      });
    },
    // 选择部门相关
    onFilterNode(value, data) {
      if (this.filterType.includes(data.type)) return false;

      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    onTreeChange(data, checked) {
      if (checked) {
        this.$refs.mlphTree.setCheckedKeys([]);
        this.$refs.mlphTree.setCheckedKeys([data.key]);
      }
    },
    onSubmit() {
      let _arr = this.$refs.mlphTree.getCheckedNodes();
      if (_arr.length) {
        this.$emit("complete", {
          id: _arr[0].id,
          key: _arr[0].key,
          type: _arr[0].type,
          name: _arr[0].label
        });
      } else {
        this.$emit("complete", {});
      }
      this.filterText = null;
      this.isHouseDialog = false;
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