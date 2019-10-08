<template>
  <el-dialog :visible.sync="isFormDialog" :title="name" width="500px" append-to-body>
    <jurisdiction-menu :operating="false" @change="onMenuChange" :span="24" @dbClick="dbClick"/>
    <div slot="footer">
      <el-button type="primary" size="mini" @click="onSubmit">确定</el-button>
      <el-button size="mini" @click="isFormDialog=false">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      isFormDialog: false,
      data: {}, 
      node: null,
    }
  }, 
  components: {
    JurisdictionMenu: () => import("@/components/JurisdictionMenu"),
  },
  props: {
    name:{
      type: String,
      default: '警务区树'
    },
    limit: {
      type: Boolean, 
      default: false
    }
  },
  methods: {
    open(data) {
      this.isFormDialog = true
    },
    onMenuChange(status, data, node) {
      this.data = data
      this.node = node
    },
    onSubmit() {
      if (this.data.children && this.limit) {
        this.$message.warning("请选择最底级的辖区")
        return
      }
      let labels = []
      this.getDetail(this.node, labels)
      labels = labels.join('')
      this.$emit('finish', this.data, labels)
      this.isFormDialog = false
    },
    // 双击返回参数
    dbClick() {
      this.onSubmit()
    }, 
    getDetail(node, labels) {
      labels.unshift(node.data.areaName)
      if (node.level === 1) return 
      this.getDetail(node.parent, labels)
    },
  }
}
</script>
