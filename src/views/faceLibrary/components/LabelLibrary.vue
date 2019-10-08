<template>
  <el-col :span="5" class="label-library">
    <div class="title">
      <b>人员类别</b>
      <el-button size="mini" @click="onInitFeature()"  v-permission="'FUNC_PERSOR_INITFEATURE'" v-if="haveInit">初始化</el-button>
      <el-button size="mini" @click="openTypeDialog()" v-permission="'FUNC_PERSONLIBRARY_ADD'" style="margin-right: 5px;">新增</el-button>
    </div>
    <el-tree ref="menuTree" class="menu" node-key="id" :data="menuData" :default-expand-all="true">
      <div class="menu-item" slot-scope="{ node, data }" :class="{sel: currentRow.index == data.index}" @click="onUpdataMenu(data, node)">
        <el-dropdown @command="onCommand($event, data, node)" class="more" placement="bottom-start" v-if="!data.show">
          <div class="icon">
            <svg-icon icon-class="more" />
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="add" v-if="node.level == 1" v-permission="'FUNC_PERSONLIBRARY_UPDATE'">添加</el-dropdown-item>
            <el-dropdown-item command="detail" v-if="false" v-permission="'FUNC_PERSONLIBRARY_UPDATE'">详情</el-dropdown-item>
            <el-dropdown-item command="upd" v-permission="'FUNC_PERSONLIBRARY_UPDATE'">编辑</el-dropdown-item>
            <el-dropdown-item command="del" v-if="!data.adminFlag" v-permission="'FUNC_PERSONLIBRARY_DELETE'">删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <svg-icon icon-class="groupFill" v-if="data.show"/>
        <svg-icon icon-class="groups" v-else-if="node.level == 1" style="font-size: 19px;"/>
        <svg-icon icon-class="people" v-else/>
        
        
        <span>{{data.name}}</span>
        <div class="total" v-if="!data.children">{{data.personCount}}</div>
      </div>
    </el-tree>

    <!-- 添加类型 S -->
    <el-dialog :title="form.id?'编辑类型':'添加类型'" class="form-layer" :visible.sync="typeDialog" width="400px">
      <el-form :model="form" :rules="rules" ref="typeForm" label-width="100px" :style="waterBg">
        <el-form-item label="类型名称" prop="name" :rules="[{ required: true, message: '人员类型不能为空' }]">
          <el-input v-model="form.name" placeholder="请输入类型名称"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" resize="none" :autosize="{ minRows: 3 }" placeholder="请输入备注信息" v-model="form.remark"></el-input>
        </el-form-item>
        <el-form-item label="管理级别" prop="managerType">
          <dict-select dict-name="library_type" v-model="form.managerType" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="onTypeUpdate()">确 定</el-button>
        <el-button size="mini" @click="typeDialog = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 编辑人员库弹层 S -->
    <el-dialog :title="form.id?'编辑人员库':'新增人员库'" class="form-layer" :visible.sync="isFormDialog" width="400px">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px" :style="waterBg">
        <el-form-item label="所属类型" prop="categorieId">
           <el-select v-model="form.categorieId" placeholder="请选择">
            <el-option v-for="item in menuData" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="人员库名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入人员库名称"></el-input>
        </el-form-item>
        <el-form-item label="标识名称" prop="shortName">
          <el-input v-model="form.shortName" placeholder="最多输入两个汉字"></el-input>
        </el-form-item>
        <el-form-item label="标识颜色" prop="color">
          <el-color-picker v-model="form.color"></el-color-picker>
          <div class="tip">非重要人员建议不要使用红色</div>
        </el-form-item>
        <el-form-item label="搜索优先级" prop="searchPriority">
          <el-input v-model.number="form.searchPriority" placeholder="请填数字"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" resize="none" :autosize="{ minRows: 3 }" placeholder="请输入备注信息" v-model="form.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="onUpdate()">确 定</el-button>
        <el-button size="mini" @click="isFormDialog = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 编辑人员库弹层 E -->
  </el-col>
</template>
<script>
import {
  getPersonCategories,
  addPersonCategory,
  updatePersonCategory,
  delPersonCategory,
  getPersonCategory,
  getPersonLibrarys,
  postLabelLibrary,
  deleteLabelLibrary,
  putLabelLibrary,
  getLabelLibrary,
  getInitFeatures
} from "@/api/faceLibrary";
import { mapState } from "vuex";

export default {
  name: "labelLibrary",
  data: () => ({
    menuData: null,
    currentRow: {},
    currentIndex: 0,

    // 表单弹窗
    isFormDialog: false,
    //类型弹窗
    typeDialog: false,
    form: {
      id: null,
      name: null,
      color: "#c7e09c",
      shortName: null,
      canDangleAfter: null,
      remark: null,
      searchPriority: null,
      categorieId: null,
    },
    rules: {
      categorieId: { required: true, message: "所属类型不能为空" },
      name: { required: true, message: "人员库名称不能为空" },
      managerType: { required: true, message: "请选择管理级别" }, 
      shortName: [
        { required: true, message: "标识名称不能为空" },
        { min: 1, max: 2, message: "最多输入两个汉字" }
      ],
      color: { required: true, message: "标识颜色不能为空" },
      searchPriority: [
        { required: true, message: "搜索优先级不能为空" },
        { type: 'number', message: "请输入数字" }
      ],
    }
  }),
  created() {
    this.menuList();
  },
  computed: {
    ...mapState({
      waterBg: state => state.user.waterBg, // 水印
    }),
    haveInit() {
      return location.hash.includes('personnel')
    }
  },
  methods: {
    menuList() {
      let isAll = null
      if(location.hash.includes('faceLibrary')) {
        isAll = 'all'
      }
      getPersonCategories({ isAll }).then(res => {
        if (res.status == 200) {
          this.menuData = []
          this.$nextTick(() => {
            this.menuData = res.data;
            res.data.forEach(item => {
              item.index = item.id
              getPersonLibrarys({ categorieId: item.id }).then(result => {
                result.data.forEach(it => {
                  it.index = `${item.id}-${it.id}`
                })
                this.$set(item, 'children', result.data)
              })
            })
            this.menuData.splice(0, 0, {
              show:true,
              name: "全部人员库"
            })
            let row = this.menuData.find(item => item.index == this.currentRow.index);
            this.onUpdataMenu(row ? row : this.menuData[0]);
          })
        }
      });

    },
    onUpdataMenu(row, node) {
      this.currentRow = row;

      this.$emit("change", this.currentRow);
      if (node) {
        this.$nextTick(() => {
          node.expanded = true
        })
      }
    },
    // 人员库更多操作
    onCommand(command, data, node) {
      if (node.level == 1) {
        if (command === "add") {
          this.openFormDialog({ categorieId: data.id });
        } else if (command === "upd") {
          getPersonCategory(data.id).then(res => {
            this.openTypeDialog(res.data)
          })
        } else if (command === 'del') {
          this.$confirm(`确定删除人员库【${data.name}】？`, "提示", {
            cancelButtonText: "取消",
            confirmButtonText: "确定",
            confirmButtonClass: "el-button--mini",
            cancelButtonClass: "el-button--mini fr",
            type: "warning"
          }).then(() => {
            delPersonCategory(data.id).then(res => {
              let isSuccess = res.status === 200;
              // 提示处理
              this.$notify({
                title: isSuccess ? "成功" : "失败",
                message: isSuccess ? "删除成功" : res.message,
                type: isSuccess ? "success" : "error",
                duration: 2000
              });

              if (isSuccess) {
                this.currentIndex = 0;
                this.menuList();
              }
            });
          });
        }
      } else {
        if (command == "del") {
          this.$confirm(`确定删除人员库【${data.name}】？`, "提示", {
            cancelButtonText: "取消",
            confirmButtonText: "确定",
            confirmButtonClass: "el-button--mini",
            cancelButtonClass: "el-button--mini fr",
            type: "warning"
          }).then(() => {
            deleteLabelLibrary(data.id).then(res => {
              let isSuccess = res.status === 200;
              // 提示处理
              this.$notify({
                title: isSuccess ? "成功" : "失败",
                message: isSuccess ? "删除成功" : res.message,
                type: isSuccess ? "success" : "error",
                duration: 2000
              });

              if (isSuccess) {
                this.currentIndex = 0;
                this.menuList();
              }
            });
          });
        }
        if (command == "upd") {
          getLabelLibrary(data.id).then(res => {
            if (res.status == 200) {
              this.openFormDialog(res.data);
            }
          });
        }
      }
    },
    openTypeDialog(data) {
      this.form = {}
      this.typeDialog = true;
      this.$nextTick(() => {
        this.$refs.typeForm.clearValidate()
        if (data) {
          this.form = { ...data };
        }
      });
    },
    openFormDialog(data) {
      this.form = {}
      this.isFormDialog = true;
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
        if (data) {
          this.form = { ...data };
        }
      });
    },
    // 初始化人员库
    onInitFeature(){
      getInitFeatures({needRedoFeature:1}).then(res=>{
        let isSuccess=res.status==200;

        this.$notify({
          title:'提示',
          message:isSuccess?'初始化成功':res.message,
          type:isSuccess?'success':'error',
          duration:2000
        })
      })
    },
    onTypeUpdate() {
      this.$refs.typeForm.validate(valid => {
        if (!valid) return;
        if (this.form.id) {
          // 修改标签库
          updatePersonCategory(this.form).then(res => {
            let isSuccess = res.status === 200;
            // 提示处理
            this.$notify({
              title: isSuccess ? "成功" : "失败",
              message: isSuccess ? "修改成功" : res.message,
              type: isSuccess ? "success" : "error",
              duration: 2000
            });

            this.menuList();
            this.typeDialog = false;
          });
        } else {
          // 添加标签库
          addPersonCategory(this.form).then(res => {
            let isSuccess = res.status === 200;
            // 提示处理
            this.$notify({
              title: isSuccess ? "成功" : "失败",
              message: isSuccess ? "新增成功" : res.message,
              type: isSuccess ? "success" : "error",
              duration: 2000
            });

            this.menuList();
            this.typeDialog = false;
          });
        }
      });
    },
    onUpdate() {
      this.$refs.form.validate(valid => {
        if (!valid) return;

        if (this.form.id) {
          // 修改标签库
          putLabelLibrary(this.form).then(res => {
            let isSuccess = res.status === 200;
            // 提示处理
            this.$notify({
              title: isSuccess ? "成功" : "失败",
              message: isSuccess ? "修改成功" : res.message,
              type: isSuccess ? "success" : "error",
              duration: 2000
            });

            this.menuList();
            this.isFormDialog = false;
          });
        } else {
          // 添加标签库
          postLabelLibrary(this.form).then(res => {
            let isSuccess = res.status === 200;
            // 提示处理
            this.$notify({
              title: isSuccess ? "成功" : "失败",
              message: isSuccess ? "新增成功" : res.message,
              type: isSuccess ? "success" : "error",
              duration: 2000
            });

            this.menuList();
            this.isFormDialog = false;
          });
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.label-library {
  // background: #fafbfd;
  // background: rgba(250,251,253, .5);
  border-right: 1px solid #e1e1e1;
  overflow: auto;
  .title {
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
  .menu {
    background: transparent;
    padding: 0 6px;
    border-top: 1px solid #e1e1e1;
    font-size: 13px;
    color: #333;
    overflow: auto;
    height: calc(100% - 46px);
    .menu-item:hover .more{
      visibility: visible;
    }
    .more {
      visibility: hidden;
      height: 100%;
      .icon {
        display: inline-block;
        height: 100%;
      }
      .svg-icon {
        margin-right: 2px !important;
      }
    }
    /deep/ {
      .el-tree-node__children {
        .el-icon-caret-right {
          display: none;
        }
        .menu-item {
          padding-left: 14px;
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

.form-layer {
  .el-color-picker {
    vertical-align: top;
  }
  .tip {
    line-height: 100%;
    margin-top: 6px;
    font-size: 12px;
    color: #aaa;
  }
}

.voice-layer {
  .el-row {
    display: flex;
  }
  .el-pagination {
    padding: 10px;
  }
  ul {
    background: #fafbfd;
    height: 100%;
    border-right: 1px solid #e5e5e5;
  }
  li {
    line-height: 36px;
    padding: 0 10px 0 20px;
    border-bottom: 1px solid #edeff3;
    font-size: 14px;
    color: #333;
    &.sel {
      background: #0fa0ff;
      border-color: #0fa0ff;
      color: #fff;
    }
  }
}
</style>


