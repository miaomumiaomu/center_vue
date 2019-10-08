<template>
  <el-switch v-model="status" :active-value="1" :inactive-value="0" @change="getForm" :disabled="disable"/>
</template>

<script>
import { getDevices, putDevices } from "@/api/devicesManage";

export default {
  props: {
    id: {require:true},
    value: [String, Number],
    disable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      status: null,
      form: null
    }
  },
  created() {
    this.status = this.value;
  },
  watch: {
    value(val) {
      this.status = this.value;
    }
  },
  methods: {
    getForm(val) {
      getDevices(this.id).then(res => {
        if (res.status == 200) {
          this.form = res.data;
          this.updateForm(val);
        }
      });
    },
    updateForm(val) {
      this.form.status = val;
      putDevices(this.form).then(res => {

        let isSuccess = res.status === 200;
        this.$notify({
          title: '提示',
          message: isSuccess ? '修改成功' : '修改失败',
          type: isSuccess ? 'success' : 'error',
          duration: 2000
        });

        this.$emit('complete')
      })
    }
  },
}
</script>