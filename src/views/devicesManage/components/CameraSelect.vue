<template>
  <div class="responsible-select">
    <div class="mask" v-if="disabled">请先输入路由上限，再选择摄像头</div>
    <div class="responsible-box" @click="isResponsibleDialog = true">
      <!-- <div v-if="cameraType === 0"> -->
        <div class="tags" v-if="updateData.length > 0">
          <el-tag
            v-for="(item,index) in updateData"
            :key="index"
            size="small"
            disable-transitions
            closable
            @close="onClose(index, item)"
          >{{item.name}}</el-tag>
        </div>
        <div class="placeholder" v-else>请选择摄像头</div>
      </div>
      <!-- <div v-else>
        <div class="tags" v-if="updateData">
          <el-tag
            size="small"
            disable-transitions
            closable
            @close="onClose(0, 1)"
          >{{updateData.length > 0 ? updateData[0].name : chan.name}}</el-tag>
        </div>
        <div class="placeholder" v-else>请选择摄像头</div>
      </div> -->
    <!-- </div> -->

    <el-dialog
      title="选择摄像头"
      class="responsible-layer body0"
      :visible.sync="isResponsibleDialog"
      width="560px"
      append-to-body
    >
      <el-row>
        <el-col :span="12" >
          <el-tree
            class="filter-menu"
            show-checkbox
            :data="treeData" :props="defaultProps"
            @check="onTreeChange"
            node-key="id"
            :expand-on-click-node="false"
            ref="tree" 
            default-expand-all check-strictly
          >
          <div class="tree-item" :class="{'disable-checkbox': data.children}" slot-scope="{ node, data }">
            <span>{{ data.name }}</span>
          </div>
          </el-tree>
        </el-col>
        <el-col :span="12" class="right-box">
          <div class="title">已选择了{{treelArr.length}}个摄像头</div>
          <div class="item" v-for="(item,index) in treelArr" :key="index">
            <span>{{item.name}}</span>
            <i class="el-icon-error close" @click="onDeleteRow(index)"></i>
          </div>
        </el-col>
      </el-row>
      <div slot="footer">
        <el-button size="mini" type="primary" @click="onSubmit">确定</el-button>
        <el-button size="mini" @click="isResponsibleDialog = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getAddrSnapDeviceTree } from "@/api/devicesManage";

export default {
  props: {
    value: {
      type: Array
    },
    maxRoutes:null,
    disabled:true,
    chan: Object,
    getcameraType: Number, //获取摄像头列表
    cameraType: Number 
  },
  data: () => ({
    isResponsibleDialog: false,
    treeData: [],
    treelArr: [],
    updateData: [],
    defaultProps: {
      children: 'children',
      label: 'name'
    }
  }),
  watch: {
    value: {
      handler(val){
        if(this.chan && this.chan.cameras) {
          this.updateData = this.chan.cameras
        }else if(this.value){
          this.updateData = this.value
        }
      this.updateTree();
      },
      immediate:true
    },
    updateData(val) {
      if (val.length>this.maxRoutes) {
          this.$emit("input", val.slice(0,this.maxRoutes));
        }else{
          this.$emit("input", val);
        }
    },
    isResponsibleDialog(val) {
      if (val) {
        this.init();
        this.updateTree();
      }
    },
    maxRoutes:{
      handler(val){
        if (this.updateData && this.updateData.length>val) {
          this.updateData = this.updateData.slice(0,val);
        }
      },
      immediate:true
    }
  },
  methods: {
    async init() {
      await getAddrSnapDeviceTree({deviceCameraType: this.getcameraType}).then(res => {
        this.treeData = res.data;
      });
    },
    updateTree() {
      if (this.updateData) {
        this.$nextTick(() => {
        if (this.$refs.tree) {
          this.$refs.tree.setCheckedKeys(this.updateData.map(item => item.id));
          this.onTreeChange();
        }
      });
      }
    },
    onTreeChange(row) {
      this.treelArr = this.$refs.tree.getCheckedNodes();
    },
    onClose(index, item) {
      this.updateData.splice(index, 1);
      if(Object.keys(this.chan).length > 0) {
        this.$emit("complete", item, 0) // 选择设备后  删除设备  传0
      }
    },
    onDeleteRow(index) {
      this.treelArr.splice(index, 1);

      this.$refs.tree.setCheckedKeys(this.treelArr.map(item => item.id));

    },
    onSubmit() {
      if (this.treelArr.length>this.maxRoutes) {
        this.$notify({
          title:'提示',
          dangerouslyUseHTMLString: true,
          message:`请勿超过当前路数上限 <b>${this.maxRoutes}</b>`,
          type:'warning',
          duration:2000
        });
        return
      }
      this.updateData = this.treelArr.map(item => {
        return {
          deviceId: item.id,
          name:item.name
        };
      });
      if(this.chan) {
        let obj = { chanDpid: this.chan.dpid ? this.chan.dpid : this.chan.chanDpid, chanIndex: this.chan.index }
        let _obj = Object.assign({}, this.updateData[0], obj);  
        this.$emit("complete", _obj, 1)  // 选择设备后  要提交 传1
      }
      this.isResponsibleDialog = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.responsible-select {
  width: 100%;
  .responsible-box {
    background-color: #fff;
    background-image: none;
    width: 100%;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    cursor: pointer;
    .placeholder {
      padding: 0 15px;
      height: 36px;
      line-height: 36px;
      color: #c0c4cc;
    }
    .tags {
      padding: 3px 6px 3px 0;
      overflow: hidden;
      height: 36px;
    }
    .el-tag {
      float: left;
      margin: 3px 0 3px 6px;
    }
  }
  .mask{
    width: 100%;
    background-color: #f5f7fa;
    z-index: 999;
    height: 38px;
    position: absolute;
    /* overflow: hidden; */
    color: #c0c4cc;
    padding: 0 15px;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    cursor: no-drop;
  }
}

.responsible-layer {
  .el-row {
    display: flex;
    height: 50vh;
  }
  .el-col {
    height: 100%;
    overflow: auto;
  }
  .left-box {
    border-right: 1px solid #e5e5e5;
  }
  .right-box {
    padding: 20px;
    font-size: 13px;
    .title {
      margin-bottom: 10px;
      color: #999;
    }
    .item {
      line-height: 30px;
      color: #333;
    }
    .close {
      float: right;
      margin-top: 6px;
      font-size: 18px;
      color: #cfd0d3;
    }
  }
  .filter-menu {
    padding: 10px 10px 10px 0;
  }
  .menu-item {
    display: inline-block;
    height: 100%;
    line-height: 36px;
    vertical-align: top;
    font-size: 13px;
    color: #333;
    .svg-icon {
      display: inline-block;
      height: 100%;
      margin-right: 4px;
      vertical-align: top;
      font-size: 20px;
      color: #0fa0ff;
    }
  }
}
</style>