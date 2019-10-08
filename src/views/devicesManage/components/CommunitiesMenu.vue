<template>
  <el-col :span="5" class="communities-menu">
    <div class="title">
      <b>所属小区</b>
    </div>
    <div class="menu-box">
      <el-input size="mini" placeholder="输入关键字进行过滤" v-model="filterText" clearable />
      <el-tree ref="menuTree" class="menu" node-key="id" :data="menuData" :filter-node-method="filterNode">
        <div class="menu-item" slot-scope="{ node, data }" :class="{sel: currentRow.id == data.id}" @click="onUpdataMenu(data)">
          <span>{{data.name}}</span>
          <div class="total">{{data.count}}</div>
        </div>
      </el-tree>
    </div>
  </el-col>
</template>
<script>
import { getCommunitiesMenu } from "@/api/devicesManage";

export default {
  data: () => ({
    filterText: "",
    menuData: null,
    currentRow: {}
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
    menuList() {
      getCommunitiesMenu().then(res => {
        if (res.status == 200) {
          this.menuData = res.data;

          let row = this.menuData.find(item => item.id == this.currentRow.id);
          this.onUpdataMenu(row ? row : this.menuData[0]);
        }
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    onUpdataMenu(row) {
      this.currentRow = row;

      this.$emit("change", this.currentRow);
    }
  }
};
</script>
<style lang="scss" scoped>
.communities-menu {
  // background: #fafbfd;
  background: rgba(250,251,253, .5);
  border-right: 1px solid #e1e1e1;
  .title {
    overflow: hidden;
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
  .menu-box {
    height: calc(100% - 46px);
    padding: 0 6px;
    border-top: 1px solid #e1e1e1;
    .el-input {
      margin: 10px 0;
    }
  }
  .menu {
    background: transparent;
    height: calc(100% - 56px);
    overflow: hidden;
    overflow-y: auto;
    border-top: 1px solid #edeff3;
    font-size: 13px;
    color: #333;
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
</style>


