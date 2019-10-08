<template>
  <el-dialog title="用户详情" :visible.sync="visible" width="400px">
    <el-form :model="form" label-width="70px">
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="form.mobile" placeholder="请输入手机号" maxlength="11" readonly/>
      </el-form-item>
      <el-form-item label="账号" prop="loginName">
        <el-input maxlength="20" v-model="form.loginName" placeholder="请输入账号" readonly/>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name" placeholder="请输入姓名" readonly/>
      </el-form-item>
      <el-form-item label="昵称" prop="nickName">
        <el-input v-model="form.nickName" placeholder="请输入昵称" readonly/>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <dict-select dict-name="comm_sex" v-model="form.sex" disabled/>
      </el-form-item>
      <el-form-item label="角色" prop="roleIds">
        <el-select v-model="form.roleIds" placeholder="请选择" multiple style="width: 100%" disabled>
          <el-option v-for="item in roleData" :key="item.id" :label="item.name" :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="所属辖区" prop="policeAreaName">
        <el-input v-model="form.policeAreaName" placeholder="请选择所属辖区"  @focus="addressDialogOpen()" readonly/>
      </el-form-item>
      <el-form-item label="状态" prop="enable">
        <el-radio-group v-model="form.enable" disabled>
          <el-radio :label="0">禁用</el-radio>
          <el-radio :label="1">启用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="登录许可" prop="loginable">
        <el-radio-group v-model="form.loginable" disabled>
          <el-radio :label="0">禁止</el-radio>
          <el-radio :label="1">允许</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" type="primary" @click="visible = false">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>

import { getUser, getAllRole } from '@/api/userManage'
export default {
  data() {
    return {
      visible: false,
      roleData: [],
      form: {}
    }
  },
  mounted() {
    getAllRole().then(res => {
      this.roleData = res.data;
    })
  },
  methods: {
    showDialog(id) {
      getUser(id).then(res => {
        if (res.status === 200) {
          this.form = res.data
          this.visible = true
        }
      })
    }
  }
}

</script>
<style lang="scss" scoped>
</style>