<template>
  <el-popover placement="bottom" trigger="click" v-model="visible" popper-class="area-selector">
    <el-input v-model="areaName" slot="reference" placeholder="请选择区域名称" readonly suffix-icon="el-icon-arrow-down"></el-input>
    <!-- 辖区弹窗 -->
    <vue-tree :tree-data="treeData" v-model="ids" :options="options" @handle="handleSelect" />
  </el-popover>
</template>

<script>
import { getAreaTree } from "@/api/viewsCenter/population";
export default {
  components: {
    VueTree: () => import("./VueTree")
  },
  data() {
    return {
      visible: false,
      areaName: '',
      ids: [4],
      options: {
        label: "name",
        checkbox: false,
        checkedOpen: true,
        folderBold: false,
        idsWithParent: false,
        depthOpen: 0,
        openIcon: "el-icon-arrow-right",
        closeIcon: "el-icon-arrow-down"
      },
      treeData: []
    };
  },
  mounted() {
    this.policeAreasList();
  },
  watch: {
    areaName(val) {
      if (val == '') {
        this.$emit('change', null);
      }
    }
  },
  methods: {
    policeAreasList() {
      getAreaTree().then(res => {
        const { data = [] } = res;
        this.treeData = data;
        let rootNode = data.length > 0 ? data[0] : {};
        this.areaName = rootNode.name;
        this.$emit('change', `${rootNode.type},${rootNode.code}`);
      });
    },
    handleSelect(item) {
      const { type, code, name } = item;
      this.areaName = name;
      this.$emit('change', `${type},${code}`);
      this.visible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
  .el-input {
    width: 146px;
    font-size: 13px;
  }
  /deep/ {
    .el-input--medium {
      .el-input__inner {
        height: 30px;
        line-height: 30px;
        background-color: #1A263D;
        color: #68859E;
        border: none;
      }
      .el-input__icon {
        line-height: 30px;
      }
    }
  }
</style>
