<template>
  <div class="line-box">
    <div class="face">
      <div class="title">
        <div class="circle"></div>
        <span>近7天人脸预警统计</span> 
      </div>
      <div class="chartsBox" style="height:123px">
        <TopLineCharts :data="peopleLine" />
      </div>
    </div>
    <div class="car">
      <div class="title">
        <div class="circle"></div>
        <span>近7天车辆预警统计</span> 
      </div>
      <div class="chartsBox" style="height:123px">
        <BottomLineCharts :data="carLine" />
      </div>
    </div>
  </div>
</template>

<script>
import {
  getFaceAlarmStatistics,
  getCarAlarmStatistics
} from "@/api/dataViews";
import moment from "moment";

export default {
  components: {
    TopLineCharts: () => import("./TopLineCharts"),
    BottomLineCharts: () => import("./BottomLineCharts"),
  },
  data() {
    return {
      peopleLine:{},
      carLine:{}
    }
  },
  created() {
    this.initData();
    clearInterval(this.timer);
    this.timer = setInterval(()=>{
      this.initData();
    },300000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    initData() {
      const { id } = this.$store.getters.userInfo;
      // 人脸预警
      getFaceAlarmStatistics(id).then(res=>{
        // let _time = res.data.map(item=>
        //   this.moment(item.date,"YYYY-MM-DD").format("MM月DD日")
        // ).reverse();
        // this.$set(this.peopleLine,"time",_time);
        // let _data = res.data.map(item=>item.count).reverse();
        // this.$set(this.peopleLine,"data",_data);
        // this.$set(this.peopleLine,"color",'#54A3FC');
        for (let item of res.data) {
          item.date = moment(item.date).format('MM月DD日')
        }
        this.peopleLine = res.data
      })
      // 车辆预警
      getCarAlarmStatistics(id).then(res=>{
        // let _time = res.data.map(item=>
        //   this.moment(item.date,"YYYY-MM-DD").format("MM月DD日")
        // ).reverse();
        // this.$set(this.carLine,"time",_time);
        // let _data = res.data.map(item=>item.alarmCount).reverse();
        // this.$set(this.carLine,"data",_data);
        // this.$set(this.carLine,"color",'#84A4F9')
        for (let item of res.data) {
          item.date = moment(item.date).format('MM月DD日')
        }
        this.carLine = res.data
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.line-box {
  padding-left: 20px;
  padding-right: 18px;
  .face {
    margin-bottom: 20px;
  }
  .title {
    font-size: 12px;
    color: rgba(150, 165, 180, 1);
    margin-bottom: 10px;
    .circle {
      height: 8px;
      width: 8px;
      border-radius: 100%;
      background-color: rgba(170, 43, 43, 1);
      display: inline-block;
    }
  }
}
</style>
