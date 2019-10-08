<template>
  <el-col :span="span" class="address-menu">
    <div class="title">
      <b>警务辖区</b>
      <el-input placeholder="警务区名称" v-model="search" suffix-icon="el-icon-search" size="mini" class="address-search"></el-input>
    </div>
    <div class="menu-box border-tree">
      <el-tree ref="menuTree" :data="treeData" class="menu" highlight-current :filter-node-method="filterNode" 
      :props="props" node-key="id" :default-expanded-keys="exprandIds" >
        <div class="menu-item" slot-scope="{ node, data }" @click="onMenuClick(node, data)" @dblclick="dbClick">
          <span>{{ data.areaName }}</span>
          <div class="more" v-if="operating">
            <el-button type="text" size="mini" style="display:content"><i class="el-icon-circle-plus" @click.stop="onCommand('add', node, data)" /></el-button>
            <em />
            <el-button type="text" size="mini" v-permission="'FUNC_MENU_DELETE'" v-if="node.level > 1"> <i class="el-icon-circle-close" @click.stop="onCommand('del', node, data)" /></el-button>
          </div>
        </div>
      </el-tree>
    </div>
  </el-col>
</template>
<script>
import { policeAreasList, getPoliceAreas } from "@/api/Jurisdiction";

export default {
  props: {  
    operating: { //是否显示新增删除按钮_
      type: Boolean,
      default: true
    },
    span: {
      type: Number,
      default: 6
    },
    isDetail: { //是否返回详细数据
      type:Boolean,
      default: false
    },
  },
  data: () => ({
    treeData: [],
    node: null,
    labels: [],
    search: '',
    props: {
      isLeaf: 'leaf',
    },
  }),
  watch: {
    search(val) {
      this.$refs.menuTree.filter(val)
    }
  },
  computed: {
    exprandIds() {
      if (!this.treeData.length) {
        return 
      }
      return [this.treeData[0].id]
    }
  },
  mounted() {
    this.policeAreasList()
  },
  methods: {
    onMenuClick(node, row) {
      this.node = node
      if (this.operating) {
        getPoliceAreas(row.id).then(res => {
          this.$emit('change', 'edit', res.data, node)
        })
      } else {
        this.$emit('change', 'edit', row, node)
      }
      this.$nextTick(() => {
        node.expanded = true
      })
    },
    filterNode(value, data, node) {
      if (!value) return true;
      if  (data.areaName.includes(value)) {
        return true
      }
      return false
    },

    /* 表单处理 */
    onCommand(command, node, data) {
      // if (command == "del") {
      //   this.$confirm(`确定删除【${data.label}】？`, "提示", {
      //     cancelButtonText: "取消",
      //     confirmButtonText: "确定",
      //     confirmButtonClass: "el-button--mini",
      //     cancelButtonClass: "el-button--mini fr",
      //     type: "warning"
      //   }).then(() => {
      //     deleteLocations(data.id).then(res => {
      //       let isSuccess = res.status == 200;
      //       // 提示
      //       this.$notify({
      //         title: "提示",
      //         message: isSuccess ? "删除成功" : res.message,
      //         type: isSuccess ? "success" : "error",
      //         duration: 2000
      //       });
      //       let childNodes = node.parent.childNodes
      //       childNodes.splice(this.getIndex(childNodes, data), 1)
      //       if (data.type === 0) {
      //         this.$emit('delCallBack', data.code)
      //       }
      //     })
      //   });
      // }
      if (command == "add") {
        this.node = node
        let { lng, lat } = data
        let label = data.areaName
        let parentId = data.id
        let parentType = data.areaType
        let rangeList = []
        this.$emit('change', 'add', { label, parentId, parentType, lng, lat, rangeList }, node)
      }
    },
    addNode() {
      this.policeAreasList()
    },
    saveNode() {
      this.policeAreasList()
    },
    // getIndex(arr, data) {
    //   let index = 0
    //   arr.find(item => {
    //     if (item.data === data) {
    //       return true
    //     } else {
    //       index ++
    //       return false
    //     }
    //   })
    //   return index
    // },
    policeAreasList() {
      policeAreasList().then(res => {
        this.treeData = res.data
      })
    },
    //双击回调函数
    dbClick() {
      this.$emit('dbClick')
    }
  }
};
</script>
<style lang="scss" scoped>
.address-menu {
  position: relative;
  background: #fafbfd;
  border-right: 1px solid #e1e1e1;
  .title {
    height: 46px;
    line-height: 46px;
    padding: 0 10px 0 16px;
    font-size: 14px;
    color: #333;
    .address-search {
      width: 200px;
      float: right;
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
      // &.sel {
      //   background: #d5e6f9;
      // }
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
      // .el-tree-node__children {
      //   padding-left: 8px !important;
      // }
    }
  }
}

*/deep/ .el-dropdown-menu__item {
  text-align: center;
}
</style>