<template>
  <el-dialog :visible.sync="isFormDialog" title="单位地址选择" width="500px" append-to-body>
    <el-tree ref="menuTree" :data="treeData" class="menu border-tree" highlight-current :filter-node-method="filterNode"
    @node-click="onMenuChange" node-key="id">
      <div class="menu-item" slot-scope="{ node, data }">
        <img :src="getImage(data)" class="item-logo">
        <span>{{ data.label }}</span>
      </div>
    </el-tree>
    <div slot="footer">
      <el-button type="primary" size="mini" @click="onSubmit">确定</el-button>
      <el-button size="mini" @click="isFormDialog=false">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>

import { getCommunityNumbers } from "@/api/unitManage";
import { addrTree } from "@/api/standardAssets";
export default {
  data() {
    return {
      isFormDialog: false,
      data: {}, 
      node: null,
      treeData: [],
    }
  },
  props: {
    id: {
      type: [Number, String],
      default: null
    },
    // isHouse: [Boolean]
  },
  methods: {
    open(data) {
      this.isFormDialog = true
      if(this.id === null || this.id === undefined) {
        this.treeData = []
        return
      }
      getCommunityNumbers(this.id).then(res => {
        this.treeData = [] //重新赋值避免导致树展开无数据
        this.$nextTick(() => {
          this.treeData = res.data.map(item => {
            this.$set(item.location, 'label', item.location.name)
            delete item.location.name
            return item.location
          })
          this.setLeaf(this.treeData)
        })
      })
    },
    getImage(data) {
      let { type, buildType } = data
      if (type == 1) {
        return require('@/assets/theme-dark/road.png')
      } else if (type === 2) {
        return buildType == 3 ? require('@/assets/theme-dark/room.png') : require('@/assets/theme-dark/number.png')
      }
    },
    onMenuChange(data, node) {
      this.data = data
      this.node = node
      let districtId = node.data.id
      let type = node.data.type
      if (data.children) {
        return
      }
      addrTree({ districtId, type }).then(res => {
        this.$set(data, 'children', res.data)
        this.setLeaf(data.children)
      })
    },
    onSubmit() {
      let { fullName } = this.data
      // if (this.isHouse && this.data.buildType !== 3) {
      //   this.$message.warning("请选择房屋")
      //   return
      // }
      this.$emit('finish', this.data, fullName)
      this.isFormDialog = false
    },
    setLeaf(leafs) {
      this.$nextTick(() => {
        leafs.forEach(item => {
          if (item.buildType === 3) {
            return 
          }
          let node = this.$refs.menuTree.getNode(item.id)
          this.$set(node, 'isLeaf', false) 
        })
      })
    },
    filterNode(value, data, node) {
      if (!value) return true;
      if  (data.areaName.includes(value)) {
        return true
      }
      return false
    },
  }
}
</script>
<style lang="scss" scoped>
.menu {
    background: transparent;
    overflow: hidden;
    overflow-y: auto;
    height: 100%;
    padding: 0 10px;
    border-top: 1px solid #edeff3;
    font-size: 13px;
    color: #333;
    .menu-item {
      display: flex;
      width: 100%;
      height: 100%;
      padding: 0 26px 0 6px;
      align-items: center;
      // &.sel {
      //   background: #d5e6f9;
      // }
      .item-logo{
        width: 15px;
        height: 15px;
        margin-right: 5px;
        margin-bottom: 3px;
      }
      span {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
  
    }
    /deep/ {
      // .el-tree-node.is-current {
      //   & > .el-tree-node__content {
      //     background-color: #d5e6f9;
      //   }
      // }
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
    }
  }
</style>

