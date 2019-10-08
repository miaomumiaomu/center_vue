<template>
  <div class="app-container">
    <div class="header">
      <strong>标签类型</strong>
      <div class="pull-right">
        <span class="el-dropdown-link" @click="openTypeDialog">
          <i class="el-icon-plus"></i>添加类型
        </span>
      </div>
    </div>
    <!-- 表单筛选 -->
    <ul class="task-list">
      <li v-for="item in tagType" :class="currentTagType.id == item.id ? 'choose-item' : ''" @click="onItemDetails(item)" :key="item.id">
        <div class="item-header">
          <span>{{item.name}}</span>
        </div>
        <el-dropdown @command="(val) => onItemEdit(val, item)" v-if="item.id">
          <span class="el-dropdown-link">
            <i class="el-icon-more" :style="{color: '#2e2e2e'}"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="1">编辑</el-dropdown-item>
            <el-dropdown-item command="2">删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </li>
    </ul>
    <!-- 类型弹窗 -->
    <el-dialog :title="form.id?'编辑类型':'添加类型'" class="form-layer" :visible.sync="typeDialog" width="400px">
      <el-form :model="form" ref="typeForm" label-width="100px">
        <el-form-item label="类型名称" prop="name" :rules="[{ required: true, message: '人员类型不能为空' }]">
          <el-input v-model="form.name" placeholder="请输入类型名称"></el-input>
        </el-form-item>
        <el-form-item label="管理级别" prop="managerType" :rules="[{ required: true, message: '请选择管理级别' }]"> 
          <dict-select dict-name="library_type" v-model="form.managerType" :clearable="false"/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" resize="none" :autosize="{ minRows: 3 }" placeholder="请输入备注信息" v-model="form.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="onTypeUpdate()">确 定</el-button>
        <el-button size="mini" @click="typeDialog = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { getTagTypeList, tagTypeSaveOrUpdate, findTagType, delTagType } from "@/api/libTagsManage";

export default {
  components: {
  },
  data: () => ({
    listQuery: {},
    tagType: [],
    currentTagType: {},

    isFormDialog: false,
    typeDialog: false,
    form: {},

  }),
  created() {
    this.init();
  },
  methods: {
    init() {
      this.getTableList()
    },
    // 获取标签类型
    getTableList() {
      this.$emit('tagTypeListChange')
      getTagTypeList().then(res => {
        res.data.unshift({ name: '全部标签', id: null })
        this.tagType = res.data;
      });
    },
    // 任务编辑
    onItemEdit(val, data) {
      if (val == '1') {
        this.openTypeDialog(data)
      } else {
        this.$confirm(`确定删除人员库【${data.name}】？`, "提示", {
          cancelButtonText: "取消",
          confirmButtonText: "确定",
          confirmButtonClass: "el-button--mini",
          cancelButtonClass: "el-button--mini fr",
          type: "warning"
        }).then(() => {
          delTagType(data.id).then(res => {
            let isSuccess = res.status === 200;
            // 提示处理
            this.$notify({
              title: isSuccess ? "成功" : "失败",
              message: isSuccess ? "删除成功" : res.message,
              type: isSuccess ? "success" : "error",
              duration: 2000
            });
            if (isSuccess) {
              this.getTableList();
            }
          })
        })
      }
    },
    onItemDetails(data) {
      this.currentTagType = data
      this.$emit('tagTypeChange', data)
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
    onTypeUpdate() {
      this.$refs.typeForm.validate(valid => {
        if (!valid) return;
        tagTypeSaveOrUpdate(this.form).then(res => {
          this.getTableList()
          this.typeDialog = false
        })
      });
    },
  }
};
</script>
<style lang="scss" scoped>
.app-container {
  position: relative;
  height: 100%;
}

.header {
  padding: 12px;
  overflow: hidden;
  border-bottom: 1px solid rgba(20,25,42,1);
  strong {
    font-size: 18px;
  }
  .pull-right {
    float: right;
    line-height: 20px;
    cursor: pointer;
  }
}
/deep/ {
  .el-dropdown-link {
    color: #0fa0ff;
  }
}
.f-block {
  display: block;
}
.task-list {
  height: calc(100vh - 258px);
  overflow-y: auto;
  li {
    position: relative;
    border-bottom: 1px solid #0fa0ff;
    padding: 10px 30px;
    cursor: pointer;
    div.item-header {
      width: 100%;
      white-space: nowrap;
      span {
        display: inline-block;
        max-width: calc(100% - 50px);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 14px;
        color: #2e2e2e;
        vertical-align: middle;
      }
    }
    .el-dropdown {
      display: none;
      position: absolute;
      right: 10px;
      top: 50%;
      transform: rotate(90deg) translateX(-50%);
      font-size: 14px;
      color: #2e2e2e;
    }
  }
  li:last-of-type {
    border-bottom: none;
  }
  li:hover {
    background-color: gainsboro;
    .el-dropdown {
      display: inherit;
    }
  }
}
.choose-item {
  background-color: gainsboro;
}
</style>