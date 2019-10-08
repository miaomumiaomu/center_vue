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
      areaNameStorage: '',
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
        const { code, name, lat, lng } = rootNode;
        this.areaName = name;
        this.$emit('change', { code: code, lat, lng });
      });
    },
    handleSelect(item) {
      const { lng, lat, name, code, type } = item;
      this.areaName = name;
      if (type == 2) {
        this.$emit('enterCommunity', { code: code, lat, lng, name });
      } else {
        this.$emit('change', { code: code, lat, lng });
      }
      this.visible = false;
    },
    setAreaTreeName(name) {
      this.areaNameStorage = this.areaName
      this.areaName = name
    },
    resetAreaTreeName() {
      this.areaName = this.areaNameStorage
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
      width: 14.84vh;
      .el-input__inner {
        height: 2.4vh;
        line-height: 2.4vh;
        font-size: 1.69vh;
        padding-right: 3.18vh !important;
        background-color: transparent;
        color: #377AB8;
        border: none;
        padding: 0;
      }
      .el-input__icon {
        line-height: 2.4vh;
        color: #377AB8;
      }
    }
  }
</style>
