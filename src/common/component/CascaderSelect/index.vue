<template>
  <el-cascader v-model="professionType" :options="data" :props="prop" :show-all-levels="false" @change="dataSelect"></el-cascader>
</template>
<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => []
    },
    keyCode: [String]
  },
  data() {
    return {
      professionType: [],
      status: false,
      prop: { value: 'code' },
      selectCode: ''
    }
  },
  watch: {
    keyCode(val) {
      if (val === this.selectCode) {
        this.selectCode = ''
        return 
      }
      this.professionType = []
      this.status = false
      this.getCodes(this.data)
    }
  },
  methods: {
    getCodes(data) {
      for(let i in data) {
        if (this.keyCode === data[i].code) {
          this.status = true
          this.professionType.unshift(data[i].code)
          return
        } else {
          if (data[i].children) {
            this.getCodes(data[i].children)
            if (this.status) {
              this.professionType.unshift(data[i].code)
              return 
            }
          }
        }
      }
    },
    dataSelect(val) {
      this.selectCode = val[val.length - 1]
      this.$emit('complete', val[val.length - 1])
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
