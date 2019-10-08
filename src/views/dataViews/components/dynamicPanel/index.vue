<template>
  <section class="dynamic">
    <div class="tabs">
      <div class="tabs-tag" v-for="(item, index) in menus" :key="index" :class="{ 'current-tabs-tag': index == current }" @click="itemClick(index)">
        <div>{{ item.name }}</div>
        <div></div>
      </div>
      <div class="dynamic-scale-btn" @click="toggleRightScale">
        <i :class="`el-icon-arrow-${rightScale ? 'left' : 'right'}`"></i>
      </div>
    </div>
    <div class="tabs-content">
      <keep-alive :include="componentArr">
        <dynamic-analysis v-if="current == 0" :policeAreaCode = "policeAreaCode" :communityCode="communityCode" :resize="resize"></dynamic-analysis>
        <dynamic-monitoring v-else :policeAreaCode = "policeAreaCode" :communityCode="communityCode"></dynamic-monitoring>
      </keep-alive>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      current: 0,
      menus: [{ name: '动态分析' }],
      code: {},
      resize: 0,
      componentArr: ['dynamicAnalysis', 'dynamicMonitoring'],
      rightScale: false
    };
  },
  props: {
    policeAreaCode: [String],
    communityCode: [String]
  },
  watch: {
    communityCode(val) {
      if(val) {
        this.menus = [{ name: '动态分析' }, { name: '动态监控' }]
      } else {
        this.menus = [{ name: '动态分析' }]
        this.current = 0
        this.resize = Math.random() * 100 + 1
        this.componentArr.pop()
        setTimeout(() => {
          this.componentArr.push('dynamicMonitoring')
        }, 100)
      }
    }
  },
  components: {
    dynamicAnalysis: () => import('./components/dynamicAnalysis'),
    dynamicMonitoring: () => import('./components/dynamicMonitoring')
  },
  methods: {
    itemClick(index) {
      this.current = index
      if (!index) {
        this.resize = Math.random() * 100 + 1
      }
    },
    toggleRightScale() {
      this.rightScale = !this.rightScale;
      if (!this.rightScale) {
        setTimeout(() => {
          this.resize = Math.random() * 100 + 1
        }, 810)
      }
      this.$emit('changeScaleState', this.rightScale);
    }
  }
};
</script>

<style lang="scss" scoped>
.dynamic{
  position: relative;
  .tabs{
    position: absolute;
    top: 0;
    left: -30px;
    .tabs-tag{
      width: 30px;
      height: 100px;
      cursor: pointer;
      div:first-child{
        padding: 14px 9px 6px 9px;
        background-color: rgba(19,27,39,0.32);
        font-size:12px;
        font-family:AlibabaPuHuiTiM;
        color:rgba(255,255,255,0.8);
        line-height:17px;
      }
      div + div{
        border-right: 30px solid rgba(19,27,39,0.32);
        border-bottom: 12px solid transparent;
      }
    }
    .current-tabs-tag{
      div:first-child{
        background-color: rgba(7,75,138,0.32);
      }
      div + div{
        border-right: 30px solid rgba(7,75,138,0.32);
      }
    }
  }
  .tabs-content{
    padding: 21px 15px 0 23px;
  }
}
.dynamic-scale-btn {
  width: 29px;
  height: 26px;
  line-height: 26px;
  margin-top: 8px;
  background-color: #131E2A;
  border-radius: 2px;
  text-align: center;
  cursor: pointer;
  i {
    color: #fff;
    font-size: 15px;
  }
}
</style>
