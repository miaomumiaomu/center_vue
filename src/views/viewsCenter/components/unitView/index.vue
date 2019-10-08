<template>
  <div class="tab-container">
    <top-data-show :code="code"></top-data-show>
    <el-row :gutter="16" style="margin-top: 12px;">
      <el-col :span="6">
        <el-row>
          <el-col style="margin-bottom: 1.389vh;height: 32.1vh;">
            <community-industry-type :code="code"></community-industry-type>
          </el-col>
          <el-col style="height: 32.1vh;">
            <community-type-statis :code="code"></community-type-statis>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="18">
        <unit-list :code="code"></unit-list>
      </el-col>
    </el-row>
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
  data() {
    return {};
  },
  methods: {
  },
  components: {
    communityTypeStatis: () => import('./components/communityTypeStatis'),
    communityIndustryType: () => import('./components/communityIndustryType'),
    topDataShow: () => import('./components/topDataShow'),
    unitList: () => import('./components/unitList')
  }
};
</script>

<style lang="scss" scoped>
/deep/{
	::-webkit-scrollbar-thumb {
  border: 2px solid #1E2638;
	}
	::-webkit-scrollbar-track {
		background-color: #11151F;
	}
}
</style>
