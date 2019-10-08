<template>
  <el-dialog :visible.sync="visible" title="详情" width="500px" v-if="visible">
    <el-form :model="form" ref="form" label-width="100px">
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="form.userName" readonly/>
      </el-form-item>
      <el-form-item label="操作时间" prop="createTime">
        <el-input v-model="form.createTime" readonly/>
      </el-form-item>
      <el-form-item label="方法名" prop="methodName">
        <el-input v-model="form.methodName" readonly type="textarea"/>
      </el-form-item>
      <el-form-item label="描述" prop="descrip">
        <el-input v-model="form.descrip" readonly/>
      </el-form-item>
      <el-form-item label="方法参数" prop="params">
        <el-input v-model="form.params" readonly type="textarea"/>
      </el-form-item>
      <el-form-item label="执行结果" prop="result">
        <el-input v-model="form.result" readonly type="textarea"/>
      </el-form-item>
      <el-form-item label="开始时间" prop="startTime">
        <el-input v-model="form.startTime" readonly/>
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime">
        <el-input v-model="form.endTime" readonly/>
      </el-form-item>
      <el-form-item label="耗时" prop="executeTime">
        <el-input :value="form.executeTime + ' ms'" readonly/>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="primary" size="mini" @click="visible = false">关闭</el-button>
    </div>
  </el-dialog>
</template>
<script>

export default {
  data() {
    return {
      visible: false,
      form: {}
    }
  },
  methods: {
    showDialog(row) {
      this.form = row
      this.visible = true
    }
  }
}

</script>
<style lang="scss" scoped>
</style>