<template>
  <el-dialog :visible.sync="isFormDialog" :title="name" width="500px" append-to-body>
    <jurisdiction-addr-menu ref="jurisdictionAddrMenu" @change="onMenuChange" :span="24" :policeAreaId="policeAreaId" :policeAreaCode="policeAreaCode"/>
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
    JurisdictionAddrMenu: () => import("@/components/JurisdictionAddrMenu"),
  },
  props: {
    name:{
      type: String,
      default: '警务地址树'
    },
    policeAreaId: [Number, String],
    policeAreaCode: String,
    limit: [Object],
    warnText: [String]
  },
  methods: {
    open(data) {
      this.isFormDialog = true
      this.$nextTick(() => {
        this.$refs.jurisdictionAddrMenu.reset()
      })
    },
    onMenuChange(status, data, node) {
      console.log('选中的节点', data)
      this.data = data
      this.node = node
    },
    onSubmit() {
      if(this.limit) {
        let sumLength = 0, faceLength = 0
        for(let i in this.limit) {
          sumLength ++
          if (this.data[i]  >= this.limit[i]) {
            faceLength ++
          }
        }
        if (sumLength !== faceLength) {
          this.$notify({ title: '警告', message: this.warnText, type: 'warning' });
          return
        }
      }
      let labels = []
      this.getDetail(this.node, labels)
      labels = labels.join('')
      this.$emit('finish', this.data, labels)
      this.isFormDialog = false
    },
    getDetail(node, labels) {
      labels.unshift(node.data.label)
      if (node.level === 1) return 
      this.getDetail(node.parent, labels)
    },
  }
}
</script>
