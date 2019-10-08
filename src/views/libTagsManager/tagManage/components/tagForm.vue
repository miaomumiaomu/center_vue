<template>
  <el-dialog :title="form.id?'编辑人脸标签':'添加人脸标签'" class="form-layer" :visible.sync="isFormDialog" width="440px">
    <el-form :model="form" :rules="rules" ref="form" label-width="120px" :disabled="readonly">
      <el-form-item label="所属类型" prop="categoryId">
        <el-select v-model="form.categoryId" placeholder="请选择">
          <el-option v-for="item in tagType" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标签名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入标识名称"></el-input>
      </el-form-item>
      <el-form-item label="标签颜色" prop="color">
        <el-color-picker v-model="form.color"></el-color-picker>
        <div class="tip">非重要人员建议不要使用红色</div>
      </el-form-item>
      <el-form-item label="标签文字" prop="shortName">
        <el-input v-model="form.shortName" placeholder="最多输入两个汉字"></el-input>
      </el-form-item>
      <el-form-item label="指定人脸库" prop="libraryId">
        <el-select v-model="form.libraryId" placeholder="请选择">
          <el-option v-for="item in library" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="居住房屋分类" prop="controlLevel">
        <el-radio-group v-model="form.controlLevel">
          <el-radio :label="1">正常</el-radio>
          <el-radio :label="2">关注</el-radio>
          <el-radio :label="3">重点</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- <el-form-item label="搜索优先级" prop="searchPriority">
        <el-input v-model.number="form.searchPriority" placeholder="请填数字"></el-input>
      </el-form-item> -->
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" resize="none" :autosize="{ minRows: 3 }" placeholder="请输入备注信息" v-model="form.remark"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <div v-if="!readonly">
        <el-button size="mini" type="primary" @click="onUpdate()">确 定</el-button>
        <el-button size="mini" @click="isFormDialog = false">取 消</el-button>
      </div>
      <el-button v-else size="mini" @click="isFormDialog = false">关 闭</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { tagSaveOrUpdate } from "@/api/libTagsManage";
import { mapState } from "vuex";

export default {
  name: "labelLibrary",
  data: () => ({

    // 表单弹窗
    isFormDialog: false,
    form: {
      id: null,
      name: null,
      color: "#c7e09c",
      shortName: null,
      canDangleAfter: null,
      remark: null,
      searchPriority: null,
      categoryId: null,
      controlLevel: null,
    },
    rules: {
      categoryId: { required: true, message: "所属类型不能为空" },
      name: { required: true, message: "人员库名称不能为空" },
      managerType: { required: true, message: "请选择管理级别" }, 
      shortName: [
        { required: true, message: "标识名称不能为空" },
        { min: 1, max: 2, message: "最多输入两个汉字" }
      ],
      color: { required: true, message: "标识颜色不能为空" },
      libraryId: { required: true, message: '请选择指定人脸库' }
      // searchPriority: [
      //   { required: true, message: "搜索优先级不能为空" },
      //   { type: 'number', message: "请输入数字" }
      // ],
    }
  }),
  props: {
    library: null,
    tagType: null,
    readonly: null
  },
  methods: {
    openFormDialog(data) {
      this.form = { controlLevel: 1 }
      this.isFormDialog = true;
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
        if (data.id) {
          this.form = { ...data };
        }
      });
    },
    onUpdate() {
      this.$refs.form.validate(valid => {
        if (!valid) return;

        tagSaveOrUpdate(this.form).then(res => {
          this.$emit('finish')
          this.isFormDialog = false
        })
      });
    }
  }
};
</script>