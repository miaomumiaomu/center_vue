<template>
  <div class="responsible-select">
    <div class="responsible-box" @click="isResponsibleDialog = true">
      <div class="tags" v-if="updateData.length">
        <el-tag v-for="(item,index) in updateData" :key="index" size="small" disable-transitions closable @close="onClose(index)">
          {{item.name}}
        </el-tag>
      </div>
      <div class="placeholder" v-else>请选择负责人</div>
    </div>

    <el-dialog title="选择负责人" class="responsible-layer body0" :visible.sync="isResponsibleDialog" width="560px" append-to-body>
      <el-row>
        <el-col :span="12" class="left-box">
          <el-tree class="filter-menu" show-checkbox :data="treeData" @check="onTreeChange" node-key="id" :expand-on-click-node="false" ref="tree" default-expand-all>
            <div class="menu-item" slot-scope="{ node, data }">
              <svg-icon icon-class="folder" />
              <span>{{data.name}}</span>
            </div>
          </el-tree>
        </el-col>
        <el-col :span="12" class="right-box">
          <div class="title">已选择了{{treelArr.length}}个负责人</div>
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
import { getUserList } from "@/api/userManage";

export default {
  props: {
    value: {
      type: Array
    }
  },
  data: () => ({
    isResponsibleDialog: false,
    treeData: [],
    treelArr: [],
    updateData: []
  }),
  watch: {
    value(val) {
      this.updateData = val;
      this.updateTree();
    },
    updateData(val) {
      this.$emit("input", val);
    },
    isResponsibleDialog(val) {
      if (val) {
        this.updateTree();
        this.init();
      }
    }
  },
  methods: {
    async init() {
      await getUserList({
        pageNo: 1,
        pageSize: 999999
      }).then(res => {
        let _treeData = new Array();
        res.data.items.forEach(element => {
          if(element.enable) {
            _treeData.push(element)
          }else {
            return
          }
        });
        this.treeData = _treeData;
      });
    },
    updateTree() {
      this.$nextTick(() => {
        if (this.$refs.tree) {
          this.$refs.tree.setCheckedKeys(this.updateData.map(item => item.id));
          this.onTreeChange();
        }
      });
    },
    onTreeChange(row) {
      this.treelArr = this.$refs.tree.getCheckedNodes();
    },
    onClose(index) {
      this.updateData.splice(index, 1);
    },
    onDeleteRow(index) {
      this.treelArr.splice(index, 1);

      this.$refs.tree.setCheckedKeys(this.treelArr.map(item => item.id));
      
    },
    onSubmit() {
      this.updateData = this.treelArr.map(item => {
        return {
          id: item.id,
          name: item.name
        };
      });
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
    }
    .el-tag {
      float: left;
      margin: 3px 0 3px 6px;
    }
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