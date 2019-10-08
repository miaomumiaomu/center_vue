<template>
  <el-dialog :visible.sync="isFormDialog" title="所属小区地址" width="500px" append-to-body>
    <address-menu ref="addressMenu" :operating="false" @change="onMenuChange" :span="24" />
    <div slot="footer">
      <el-button type="primary" size="mini" @click="onSubmit">确定</el-button>
      <el-button size="mini" @click="isFormDialog=false">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: {
    isHouse: { //是否强制要求是房屋
      type: Boolean,
      default: false
    },
    houses: {
      type:Array
    }
  },
  data() {
    return {
      isFormDialog: false,
      data: {}, 
      node: null,
      labels: [],
    }
  },
  methods: {
    open() {
      this.isFormDialog = true
    },
    onMenuChange(status, data, node,labels) {
      this.data = data
      this.node = node
      this.labels = labels
    },
    onSubmit() {
      this.$emit('finish', this.data, this.labels)
      this.isFormDialog = false
    },
    //双击返回参数
    // dbClick() {
    //   this.onSubmit()
    // }
  },
  components: {
    AddressMenu: () => import("@/components/AddressMenu")
  },
}
</script>