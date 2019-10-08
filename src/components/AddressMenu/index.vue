<template>
  <el-col :span="span" class="address-menu">
    <div class="title">
      <b>地址</b>
      <el-input placeholder="街道/街路巷" v-model="search" suffix-icon="el-icon-search" size="mini" class="address-search"></el-input>
    </div>
    <div class="menu-box border-tree">
      <el-tree ref="menuTree" class="menu" highlight-current :load="nodeLoading" lazy :filter-node-method="filterNode" :props="props1" node-key="id">
        <div class="menu-item" :class="{sel:currentRow.id == data.id}" slot-scope="{ node, data }" @click="onMenuClick(node, data)">
          <img :src="getImage(data)" class="item-logo" v-if="data.type != -1">
          <span>{{ data.label }}</span>
          <div class="more" v-if="operating">
            <el-button type="text" size="mini" style="display:content" v-if="data.buildType !== 3 "  v-permission="'FUNC_MENU_ADD'"><i class="el-icon-circle-plus" @click.stop="onCommand('add', node, data)" /></el-button>
            <em />
            <el-button type="text" size="mini" v-permission="'FUNC_MENU_DELETE'" v-if="node.level > 1"> <i class="el-icon-circle-close" @click.stop="onCommand('del', node, data)" /></el-button>
            <em/>
            <el-dropdown placement='bottom' @command="(val) => handleTopCommand(data, node, val)" v-if="node.level == 1">
              <el-button type="text" size="mini" style="display:content"><i class="el-icon-sort"/></el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="item" v-for="item in 2" :key="item">{{item == 1 ? '地址导入': '地址导出' }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown placement='bottom' @command="(val) => handleCommand(data, node, val)" v-if="permissionCheck(data, 'able')">
              <el-button type="text" size="mini" style="display:content"><i class="el-icon-upload"/></el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="item" v-for="item in dropdownData" :key="item">{{item == 'netLoad' ? '网络获取': '文件上传' }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </el-tree>
    </div>
    <el-dialog :visible.sync="fileDialog" append-to-body width="auto">
      <el-upload drag action="" :http-request='uploadFileMethod' :file-list ="file">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
      <div slot="footer">
        <el-button type="primary" size="mini" @click="upload">确定</el-button>
        <el-button size="mini" @click="fileDialog = false">取消</el-button>
      </div>
    </el-dialog>
  </el-col>
</template>
<script>
import {
  queryStreet,
  addrTree,
  deleteLocations,
  startAddrLocalize,
  startAddrLocalizeFile,
  getAddressExport,
  postAddressImport
} from "@/api/standardAssets";
import axios from 'axios'

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
    }
  },
  data: () => ({
    currentRow: {},
    node: null,
    ids: [],
    labels: [],
    search: '',
    props1: {
      isLeaf: 'leaf'
    },
    fileDialog: false,
    file: [],
    uploadType: null, //文件上传类型，0为根节点上传，1为路或门牌号
    addressId: null, //文件上传用的id
    permission: [ //上传权限配置
      //code判断是否是该地区，able是能显示上传的节点, type: 上传方式
      { name: '福建', code: '350', able: [{ type: 1 }, { type: 2, buildType: 2 }], type: ['netLoad', 'fileLoad'] },
      { name: '莱州', code: '370683000000', able: [{ type: 2, buildType: 0 }], type:[ 'netLoad', 'fileLoad'] },
    ],
    permissionIndex: null
  }),
  computed: {
    dropdownData() {
      if (this.permissionIndex === null || this.permissionIndex === -1) {
        return []
      }
      return this.permission[this.permissionIndex].type
    }
  },
  watch: {
    search(val) {
      this.$refs.menuTree.filter(val)
    },
    fileDialog(val) {
      if (!val) {
        this.file = []
      }
    }
  },
  methods: {
    getImage(data) {
      let { type, buildType } = data
      if (type == 1) {
        return require('@/assets/theme-dark/road.png')
      } else if (type === 2) {
        return buildType == 3 ? require('@/assets/theme-dark/room.png') : require('@/assets/theme-dark/number.png')
      }
    },
    onMenuClick(node, row) {
      this.node = node
      //清空之前的node详细名称
      this.labels = []
      //获取标准地址详细名称
      this.getDetail(node)
      this.$emit('change', 'edit', row, node, this.labels)
      this.$nextTick(item => {
        node.expanded = true
      })
    },
    filterNode(value, data, node) {
      if (!value) return true;
      if  (data.label.includes(value)) {
        let expandMethod = function(node) {
          if (node.level > 0) {
            node.parent.expanded = true
            expandMethod(node.parent)
          }
        }
        this.$nextTick(() => {
          expandMethod(node)
        })
        return true
      }
      return false
    },

    /* 表单处理 */
    onCommand(command, node, data) {
      if (command == "del") {
        this.$confirm(`确定删除【${data.label}】？`, "提示", {
          cancelButtonText: "取消",
          confirmButtonText: "确定",
          confirmButtonClass: "el-button--mini",
          cancelButtonClass: "el-button--mini fr",
          type: "warning"
        }).then(() => {
          deleteLocations(data.id).then(res => {
            let isSuccess = res.status == 200;
            // 提示
            this.$notify({
              title: "提示",
              message: isSuccess ? "删除成功" : res.message,
              type: isSuccess ? "success" : "error",
              duration: 2000
            });
            let childNodes = node.parent.childNodes
            childNodes.splice(this.getIndex(childNodes, data), 1)
            if (data.type === 0) {
              this.$emit('delCallBack', data.code)
            }
          })
        });
      }
      if (command == "add") {
        this.node = node
        let { label, lng, lat, fromType, id: parentId, type: parentType, buildType: parentBuildType } = data
        let min = 2 //最低级的类型type
        let type = fromType == '0' ? Number(parentType) + 1 > min ? min : Number(parentType) + 1 : 1
        this.$emit('change', 'add', { label, parentId, parentType , lng, lat, type, parentBuildType }, node)
      }
    },
                                            
    /* 表单处理 */
    //tree加载方法
    nodeLoading(node, resolve) {
      if (!node.level) {
        let _this = this
        let isFirst = true
        let loadChildNodes = function(data) {
          _this.$refs.menuTree.updateKeyChildren(data.id, data.children)
          if (isFirst) {
            node.childNodes[0].expanded = true
            isFirst = false
          }
        }
        queryStreet().then(res => {
          resolve(res.data)
          _this.$nextTick(() => {
            loadChildNodes(res.data[0])
          })
        })
      }else {
        let districtId = node.data.id
        let type = node.data.type
        addrTree({ districtId, type }).then(res => {
          if(res.data.length && res.data[0].type == 2) {
            res.data.forEach(item => {
              if (item.buildType === 3) {
                this.$set(item, 'leaf', true)
              }
            })
          }
          resolve(res.data)
        })
      }
    },
    addNode() {
      let districtId = this.node.data.id
      let data = this.node.data
      let type = data.type
      let childNodes = this.node.childNodes
      addrTree({ districtId, type }).then(res => {
        this.$set(this.node, 'childNodes', [])
        this.$nextTick(() => {
          this.$set(data, 'children', res.data)
          this.node.expanded = true
        })
      })
    },
    saveNode(res) {
      res.data.label = res.data.name
      this.$set(this.node, 'data', res.data)
    },
    getIndex(arr, data) {
      let index = 0
      arr.find(item => {
        if (item.data === data) {
          return true
        } else {
          index ++
          return false
        }
      })
      return index
    },
    getDetail(node) {
      this.labels.unshift(node.data.label)
      if (node.level === 1) return 
      this.getDetail(node.parent)
    },
    //根节点导入导出操作
    handleTopCommand(data, node, val) {
      if(val == 1) {
        this.fileDialog = true
        this.addressId = data.id
        this.uploadType = 0
      } else {
        let code = data.code
        const ip = process.env.NODE_ENV === "development" ? process.env.IP : location.host;
        let url = `http://${ip}/api/addr/locations/getAddressExport?code=${code}`
        window.open(url)
      }
    },
    //导入导出操作
    handleCommand(data, node, val) {
      if(val === 'netLoad') {
        this.labels = []
        this.getDetail(node)
        startAddrLocalize({ locationId: data.id, locationAddr: this.labels.join('') }).then(res => {
          this.$notify({ title: '提示', message: '开始导入，请稍后刷新', type: 'success' })
        })
      } else {
        this.fileDialog = true
        this.addressId = data.id
        this.uploadType = 1
      }
    },
    uploadFileMethod(param) {
      this.file.push({ file: param.file, name: param.file.name })
    },
    upload() {
      let formData = new FormData();
      let fileObject = this.file[0].file
      formData.append("multipartFile", fileObject)
      if (this.uploadType) {
        startAddrLocalizeFile(this.addressId, formData).then(res => {
          this.$notify({ title: '提示', message: '开始导入，请稍后刷新', type: 'success' })
          this.fileDialog = false
        })
      } else {
        postAddressImport(this.addressId, formData).then(res => {
          this.$notify({ title: '提示', message: '开始导入，请稍后刷新', type: 'success' })
          this.fileDialog = false
        })
      }
    },
    //权限配置方法
    permissionCheck(data, directive) {
      // 初始化设置符合哪个规则
      if (this.permissionIndex === null) {
        let code = data.code
        this.permission.some((item, index) => {
          let length = item.code.length
          let currentCode = code.substr(0, length)
          if(item.code == currentCode) {
            this.permissionIndex = index
            return true
          } else {
            return false
          }
        })
        if (this.permissionIndex === null) {
          this.permissionIndex = -1
        }
      }
      //如果没有相关配置直接为false
      if (this.permissionIndex === -1) {
        return false
      } else {
        let index = this.permissionIndex
        let length = 0, objectLenth = 0
        return this.permission[index][directive].some((item) => {
          for( let i in item ) {
            if(item[i] == data[i]) {
              length ++
            }
          }
          if (length === Object.keys(item).length) {
            return true
          } else {
            return false
          }
        })
      }
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
      align-items: center;
      padding: 0 26px 0 6px;
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
    }
  }
}

*/deep/ .el-dropdown-menu__item {
  text-align: center;
}
</style>