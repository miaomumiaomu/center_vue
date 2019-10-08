<template>
  <div class="car-view">
    <data-show :code="code"></data-show>
    <vehicle-photo :code="code"></vehicle-photo>
    <div class="data-chart">
      <car-distribution :code="code"></car-distribution>
      <car-area :code="code"></car-area>
      <car-hot-device :code="code"></car-hot-device>
    </div>
    <!-- <el-row :gutter="21">
      <el-col :span="9">
        <el-row>
          <el-col>
            <el-row :gutter="16">
              <el-col :span="10">
                <data-show :code="code"></data-show>
              </el-col>
              <el-col :span="14">
                <see-car-type-top :code="code"></see-car-type-top>
              </el-col>
            </el-row>
          </el-col>
          <el-col style="margin-top: 1.85vh">
            <vehicle-access :code="code"></vehicle-access>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="15">
        <vehicle-photo :code="code"></vehicle-photo>
      </el-col>
    </el-row> -->
  </div>
</template>

<script>
export default {
  props: {
    areaType: [Number, String],
    areaCode: [String]
  },
  computed: {
    code() {
      let communityCode = null
      let policeAreaCode = null
      if (this.areaType == 1) {
        return { policeAreaCode: this.areaCode }
      } else {
        return { communityCode: this.areaCode }
      }
    }
  },
  components: {
    dataShow: () => import('./components/dataShow'),
    seeCarTypeTop: () => import('./components/seeCarTypeTop'),
    carDistribution: () => import('./components/carDistribution'),
    vehiclePhoto: () => import('./components/vehiclePhoto'),
    carHotDevice: () => import('./components/CarHotDevice'),
    carArea: () => import('./components/carArea')
  },
  data() {
    return {};
  },
  methods: {
  }
};
</script>

<style lang="scss" scoped>
.car-view{
  .data-chart{
    height: 27.7vh;
    display: flex;
    justify-content: space-between;
  }
}
/deep/{
	::-webkit-scrollbar-thumb {
  border: 2px solid #1E2638;
	}
	::-webkit-scrollbar-track {
		background-color: #11151F;
	}
}
</style>
