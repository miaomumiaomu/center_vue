<template>
  <el-col :span="span" class="address-menu">
    <div class="title">
      <b>警务辖区</b>
      <el-autocomplete v-model="search" :fetch-suggestions="querySearchAsync" @select="handleSelect" placeholder="警务区名称" clearable size="mini" popper-class="address-search" style="float: right;" suffix-icon="el-icon-search">
        <template slot-scope="{ item: { name, fullName } }">
          <div class="bar">
            <div class="name">{{ name }}</div>
            <div class="addr" :title="fullName">{{ fullName }}</div>
          </div>
        </template>
      </el-autocomplete>
    </div>
    <div class="menu-box border-tree">
      <el-tree ref="menuTree" :data="treeData" class="menu" highlight-current :filter-node-method="filterNode" 
      :props="prop" node-key="treeId" :default-expanded-keys="exprandIds" @node-expand="clicks">
        <div class="menu-item" slot-scope="{ node, data }" @click="onMenuClick(node, data)">
          <img :src="getImage(data)" class="item-logo">
          <span>{{ data.label }}</span>
          <img src="@/assets/focus.png" v-if="_key && data[_key] == 2">
          <img src="@/assets/key.png" v-if="_key && data[_key] == 3">
        </div>
      </el-tree>
    </div>
  </el-col>
</template>
<script>
import { policeAreasList, getPoliceAreas, getAreaLinkRoad, getRoadNumbers, addressSearch } from "@/api/Jurisdiction";
import { addrTree } from "@/api/standardAssets";

export default {
  props: {
    span: {
      type: Number,
      default: 6
    },
    markCode: {
      type: String, 
      default: null
    },
    policeAreaId: [Number, String],
    policeAreaCode: String,
    _key: String
  },
  data: () => ({
    treeData: [],
    node: null,
    labels: [],
    search: '',
    forbidden: false,
    oldSearchVal: '', //上次搜索的值
    parents: [], //搜素父节点的id
    searchId: null, //搜索id
    isfinish: true, //搜索是否结束
    prop: {
      isLeaf: 'leaf',
    },
  }),
  watch: {
    search(val, oldVal) {
      if (oldVal !== val &&!val) {
        this.$refs.menuTree.filter(val)
      }
    }
  },
  computed: {
    exprandIds() {
      if (!this.treeData.length) {
        return 
      }
      return [this.treeData[0].treeId]
    }
  },
  mounted() {
    this.policeAreasList()
  },
  methods: {
    getImage(data) {
      let { dataType, buildType } = data
      if (dataType == 1) {
        return require('@/assets/theme-dark/road.png')
      } else if (dataType > 1) {
        return buildType == 3 ? require('@/assets/theme-dark/room.png') : require('@/assets/theme-dark/number.png')
      }
      return require('@/assets/theme-dark/police-area.png')
    },
    onMenuClick(node, row) {
      // window.event.stopPropagation()
      this.node = node
      //清空之前的node详细名称
      this.labels = []
      //获取标准地址详细名称
      this.getDetail(node)
      //点击辖区叶子节点时
      if (!row.dataType) {
        if (!row.children.length || this.parents.length) {
          this.getAreaLinkRoad(row.id, row.code, row.id, row.treeId)
        }
      } else if (row.dataType === 1) {
        if (!row.children || this.parents.length) {
          this.getRoadNumbers(row, row.areaCode, row.areaId, row.treeId)
        }
      } else if (row.dataType >= 2) {
        if (!row.children || this.parents.length) {
          this.addrTree(row)
        }
      }
      if (this.isfinish) {
        this.$emit('change', 'update', row, node, this.labels.join(''))
      }
      this.$nextTick(() => {
        node.expanded = true
        //叶子节点去掉三角号
        if (!node.childNodes.length) {
          this.$set(node, 'isLeaf', true)
        }
      })
    },
    addressSearch(keywords, cb, top) {
      addressSearch({ keywords, top }).then(res => {
        cb(res.data)
      })
    },
    //树搜索
    querySearchAsync(val, cb) {
      if (!val) {
        cb([])
        return
      }
      this.addressSearch(val, cb)
    },
    handleSelect(val) {
      let node = this.$refs.menuTree.getNode(`area_${val.policeAreaId}`)
      this.parents = []
      this.searchId = null
      if (node) {
        this.search = val.name
        this.isfinish = false
        this.parents = val.parentIds.split('/')
        this.searchId = val.id
        this.onMenuClick(node, node.data)
      } else {
        this.$notify({ title: "错误", message: "没找到对应辖区", type: "error", duration: 1000 });
      }
    },
    filterNode(value, data, node) {
      if (!value) return true;
      if  (data.id == value) {
        return true
      }
      return false
    },
    searchMethod(data) {
      if (this.parents.length > 1) {
        let obj = data.find(item => {
          let index = this.parents.indexOf(item.locationId ? item.locationId.toString() : item.id.toString())
          if (index !== -1) {
            this.parents.splice(0, index)
            this.$nextTick(() => {
              let node = this.$refs.menuTree.getNode(this.parents[0])
              if (node) {
                this.onMenuClick(node, node.data)
              }
            })
            return true
          }
        })
        if (!obj) {
          this.isfinish = true
          this.parents = []
          this.$refs.menuTree.filter(this.searchId)
        }
      } else if (this.parents.length === 1) {
        this.isfinish = true
        this.parents = []
        this.$refs.menuTree.filter(this.searchId)
      }
    },
    getDetail(node) {
      this.labels.unshift(node.data.label)
      if (node.level === 1) return 
      this.getDetail(node.parent)
    },
    //查询警务区
    policeAreasList() {
      let { policeAreaId, policeAreaCode } = this
      policeAreasList({ policeAreaId, policeAreaCode }).then(res => {
        let tree = [], leafs = [] 
        //数据结构调整，以标准地址为模板
        let func = (data, aims) => {
          data.forEach(item => {
            let { areaCode: code, areaName: label, areaType: type, id } = item
            //dataType 0代表辖区树，1代表辖区关联的路，2代表路关联的门牌号， 3代表门牌号之后的标准地址.treeId树的索引,辖区是area_加id，地址是id
            let newData = { code, label, type, id, children: [], leaf: false, treeId: `area_${id}` }
            aims.push(newData)
            if (item.children) {
              func(item.children, newData.children)
            } else {
              //放入叶子节点数组
              this.$set(newData, 'dataType', 0)
              leafs.push({ treeId: `area_${id}` })
            }
          })
        }
        func(res.data, tree)
        this.treeData = tree
        this.setLeaf(leafs)
      })
    },
    //  查询警务区关联的路
    getAreaLinkRoad(policeAreaId, areaCode, areaId, treeId) {
      getAreaLinkRoad({ policeAreaId }).then(res => {
        let tree = []
        this.DataChange(res.data, tree, 1, areaCode, areaId)
        this.$refs.menuTree.updateKeyChildren(treeId, tree)
        this.setLeaf(tree)
        //搜索的时候
        this.searchMethod(res.data)
      })
    },
    //查询警务区对应路关联的门牌
    getRoadNumbers(row, areaCode, areaId, treeId) {
      getRoadNumbers({ policeRoadId: row.relevanceId }).then(res => {
        let tree = []
        this.DataChange(res.data, tree, 2, areaCode, areaId)
        this.$refs.menuTree.updateKeyChildren(treeId, tree)
        this.setLeaf(tree)
        this.searchMethod(res.data)
      })
    },
    addrTree(data) {
      let districtId = data.id
      let type = data.type
      addrTree({ districtId, type }).then(res => {
        res.data.forEach(item => {
          item.dataType = 3
          item.areaCode = data.areaCode
          item.areaId = data.areaId
          item.leaf = false
          item.treeId = item.id
        })
        this.$refs.menuTree.updateKeyChildren(data.treeId, res.data)
        this.setLeaf(res.data)
        this.searchMethod(res.data)
      })
    },
    DataChange(data, aims, type, areaCode, areaId) {
      data.forEach(item => {
        let { id: relevanceId, policeAreaId } = item
        item.location.label = item.location.name
        delete item.location.name
        let newData = { ...item.location, relevanceId, policeAreaId, dataType: type, areaCode, areaId, treeId: item.locationId }
        aims.push(newData)
      })
    },
    reset() {
      this.policeAreasList()
    },
    setLeaf(leafs) {
      this.$nextTick(() => {
        leafs.forEach(item => {
          if (item.type == 2 && item.buildType == 3) {
            return 
          }
          let node = this.$refs.menuTree.getNode(item.treeId)
          this.$set(node, 'isLeaf', false) 
        })
      })
    },
    clicks(data, node) {
      this.onMenuClick(node, data)
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
      width: 150px;
      float: right;
    }
  }
  .menu-box {
    height: calc(100% - 46px);
    padding: 0 6px;
    border-top: 1px solid #e1e1e1;
    clear: right;
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
.address-search {
  .bar{
    line-height: normal;
    padding: 7px;
    .name {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .addr {
      font-size: 12px;
      color: #b4b4b4;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .highlighted .addr {
      color: #ddd;
    }
  }
}

*/deep/ .el-dropdown-menu__item {
  text-align: center;
}
</style>