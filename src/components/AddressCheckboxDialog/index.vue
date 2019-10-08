<template>
  <el-dialog :visible.sync="isFormDialog" title="选择辖区范围" width="500px" append-to-body>
    <el-col :span="24" class="address-menu">
      <div class="title">
        <el-input placeholder="街道/街路巷" v-model="search" suffix-icon="el-icon-search" size="mini" class="address-search"></el-input>
      </div>
      <div class="menu-box border-tree">
        <el-tree ref="menuTree" class="menu" highlight-current :load="nodeLoading" lazy :filter-node-method="filterNode" :props="props"
        node-key="id">
          <div class="menu-item" slot-scope="{ node, data }" @click.prevent="onMenuClick(data, node)">
            <el-checkbox :indeterminate="data.isIndeter" v-model="data.checked" style="margin-right: 15px;" v-if="data.type == limitLevel" :disabled="data.disable"></el-checkbox>
            <img :src="getImage(data)" class="item-logo" v-if="data.type != -1 && data.label != '全部'">
            <span>{{ data.label }}</span>
          </div>
        </el-tree>
      </div>
    </el-col>
    <div slot="footer">
      <el-button type="primary" size="mini" @click="onSubmit">确定</el-button>
      <el-button size="mini" @click="cannel">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { queryStreet, addrTree } from "@/api/standardAssets";

export default {
  data: () => ({
    search: '',
    props: {
      isLeaf: 'leaf',
    },
    isFormDialog: false,
    checkedKey: [], //新选中的节点
    checkAll: [], //全部选中的节点
  }),
  props: {
    limitLevel: {
      default: null,//限制加载到某个层级
    },
    checkedData: { //传进来的数据
      type: Array,
      default: () => {
        return []
      }
    },
    disable: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    search(val) {
      this.$refs.menuTree.filter(val)
    }
  },
  methods: {
    open() {
      this.isFormDialog = true
      this.checkAll = this.checkedData.map(item => item.locationId)
      this.setChecked()
    },
    getImage(data) {
      let { type, buildType } = data
      if (type == 1) {
        return require('@/assets/theme-dark/road.png')
      } else if (type === 2) {
        return buildType == 3 ? require('@/assets/theme-dark/room.png') : require('@/assets/theme-dark/number.png')
      }
    },
    onMenuClick(row, node) {
      if (row.disable) {
        console.log(row.disable, '禁选退出')
        return //禁选直接退出
      } 
      if (row.type === this.limitLevel) {
        if (node.data.checked) {
          if (row.label === '全部') {
            //全不选
            this.$set(node.data, 'checked', false)
            node.parent.childNodes.forEach(item => {
              if (item.data.checked && !item.data.disable) {
                this.$set(item.data, 'checked', false)
                let index = this.checkedKey.indexOf(item.data.id)
                this.checkAll.splice(this.checkAll.indexOf(item.data.id), 1)
                this.checkedKey.splice(this.checkedKey.indexOf(item.data.id), 1)
              }
            })
          } else {
            this.$set(node.data, 'checked', false)
            this.checkedKey.splice(this.checkedKey.indexOf(row.id), 1)
            this.checkAll.splice(this.checkAll.indexOf(row.id), 1)
          }
        } else {
          //全选
          if (row.label === '全部') {
            this.$set(node.data, 'checked', true)
            node.parent.childNodes.forEach(item => {
              if (!item.data.checked && !item.data.disable) {
                this.$set(item.data, 'checked', true)
                this.checkAll.push(item.data.id)
                this.checkedKey.push(item.data.id)
              }
            })
          } else {
            this.$set(node.data, 'checked', true)
            this.checkedKey.push(row.id)
            this.checkAll.push(row.id)
          }
        }
      }
      this.$nextTick(item => {
        node.expanded = true
      })
    },
    filterNode(value, data, node) {
      if (!value) return true;
      if  (data.label.includes(value)) {
        this.$nextTick(() => {
          this.expandMethod(node)
        })
        return true
      }
      return false
    },
    expandMethod(node) {
      if (node.level > 0 && !node.parent.expanded) {
        node.parent.expanded = true
        this.expandMethod(node.parent)
      }
    },
    //tree加载方法
    nodeLoading(node, resolve) {
      if (!node.level) {
        let _this = this
        let isFirst = true
        let loadChildNodes = (data) => {
          data.children.forEach((item, index) => {
            if (item.children && item.children.length) {
              _this.$refs.menuTree.append(item, data.id)
              loadChildNodes(item)
            } else if(item.type === this.limitLevel) {
              if (!index) {
                _this.$refs.menuTree.append({ label: '全部', type: this.limitLevel, leaf: true }, data.id)
              }
              _this.$refs.menuTree.append(item, data.id)
              let node = this.$refs.menuTree.getNode(item.id) 
              this.$set(node, 'isLeaf', true)
            } else {
              _this.$refs.menuTree.append(item, data.id)
            }
            
          })
          //展开下一级
          if (isFirst) {
            node.childNodes[0].expanded = true
            this.setChecked()
            isFirst = false
          }
        }
        queryStreet().then(res => {
          resolve(res.data)
          _this.$nextTick(() => {
            loadChildNodes(res.data[0])
          })
        })
      } else {
        let districtId = node.data.id
        let type = node.data.type
        addrTree({ districtId, type }).then(res => {
          if (res.data.length && res.data[0].type === this.limitLevel) {
            res.data.unshift({ label: '全部', type: this.limitLevel })
          }
          res.data.forEach((item, index) => {
            if (item.type === this.limitLevel) {
              this.$set(item, 'leaf', true)
              this.setChecked()
            }
          })
          resolve(res.data)
        })
      }
    },
    onSubmit() {
      // console.log(this.checkedKey, this.checkAll)
      // return
      if (this.disable) {
        this.$emit('finish', this.checkedKey)
      } else {
        this.$emit('finish', this.checkAll)
      }
      this.cannel()
    },
    //给已选择的项加上选中标志
    setChecked() {
      if (!this.$refs.menuTree) {
        return
      }
      let arr = this.checkedData.map(item => item.locationId)
      arr.forEach(item => {
        this.$nextTick(() => {
          let node = this.$refs.menuTree.getNode(item)
          if (node) {
            this.$set(node.data, 'checked', true)
            if (this.disable) {
              this.$set(node.data, 'disable', true)
            }
          }
        })
      })
    },
    cannel() {
      //清空选中状态
      if (this.checkedKey.length || this.checkedData.length) {
        let id = this.checkedKey[0] || this.checkedData[0].locationId
        let node = this.$refs.menuTree.getNode(id)
        if (!node) {
          this.isFormDialog = false
          return
        }
        node.parent.parent.childNodes.forEach(items => {
          items.childNodes.forEach(item => {
            this.$set(item.data, 'checked', false)
            this.$set(item.data, 'disable', false) //设置为禁选
          })
        })
        this.checkedKey = []
      }
      this.isFormDialog = false
    },
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
      align-items: center;
      // &.sel {
      //   background: #d5e6f9;
      // }
      .item-logo{
        width: 15px;
        height: 15px;
        margin-right: 5px;
        margin-bottom: 6px;
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