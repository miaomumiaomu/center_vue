<template>
  <el-select v-model="data" placeholder="请选择设备" @change="selectChange" :style="'width: ' + width + ';'">
    <el-option v-for="item in selectData" :key="item.id" :label="item.name" :value="item.id"></el-option>
  </el-select>
</template>
<script>
import { getMapMarker } from "@/api/dataViews";
export default {
  data() {
    return {
      selectData: [],
      data: null,
    }
  },
  props: {
    deviceCameraType: {
      default: null
    },
    isAll: { //是否显示全部
      type: Boolean,
      default: true
    },
    width: {
      default: '100px'
    }
  },
  mounted() {
    getMapMarker().then(res => {
      this.selectData = res.data.filter(item => {
        if ( this.deviceCameraType !== null) {
          return item.type && item.deviceCameraType == this.deviceCameraType
        }
        return item.type && item.deviceCameraType != 3
      })
      if (this.isAll) {
        this.selectData.unshift({ id: null, name: '全部' })
      }
    })
  },
  methods: {
    selectChange(val) {
      this.$emit('change', val)
    },
    clear() {
      this.data = null
    }
  }
}
</script>

