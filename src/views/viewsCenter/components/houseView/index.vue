<template>
  <div class="tab-container">
    <div class="up">
      <data-show :code="code"></data-show>
      <house-rent :code="code"></house-rent>
      <long-time-no-see :code="code"></long-time-no-see>
    </div>
    <div class="bottom">
      <collection :code="code"></collection>
      <div class="bar">
        <house-type :code="code"></house-type>
        <house-distribution :code="code"></house-distribution>
      </div>
      <live-house-top :code="code"></live-house-top>
    </div>
  </div>
</template>

<script>
import longTimeNoSeeVue from './components/longTimeNoSee.vue';
export default {
  props: {
    areaType: [Number, String],
    areaCode: [String]
  },
  computed: {
    code() {
      if (this.areaType == 1) {
        return { policeAreaCode: this.areaCode }
      } else {
        return { communityCode: this.areaCode }
      }
    }
  },
  components: {
    // liveAreaTop: () => import('./components/liveAreaTop'),
    liveHouseTop: () => import('./components/liveHouseTop'),
    dataShow: () => import('./components/dataShow'),
    houseRent: () => import('./components/houseRent'),
    houseType: () => import('./components/houseType'),
    collection: () => import('./components/collection'),
    houseDistribution: () => import('./components/housingDistribution'),
    longTimeNoSee: () => import('./components/longTimeNoSee')
  },
  data() {
    return {};
  },
  methods: {
  }
};
</script>

<style lang="scss" scoped>
.up{
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.01vh;
}
.bottom{
  display: flex;
  justify-content: space-between;
  .bar{
    width: 43.17vw;
    height: 32.7vh;
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
