<template>
  <div class="data-show">
    <div class="car-show">
      <img src="@/assets/views-center/car-view/all-car.png" alt="">
      <div>
        <div class="title">总车辆</div>
        <div class="count">
          <iCountUp :startVal="0" :endVal="data.collected || 0" :decimals="0" :duration="2" :options="countUpOptions"/>
        </div>
      </div>
    </div>
    <div class="car-show-other">
      <img src="@/assets/views-center/car-view/all-car.png" alt="">
      <div class="one">
        <div class="title">今日感知车辆</div>
        <div class="count">
          <iCountUp :startVal="0" :endVal="data.todayFlow || 0" :decimals="0" :duration="2" :options="countUpOptions"/>
        </div>
      </div>
      <div class="two">
        <div>
          <div>临时车</div>
          <div>
            <iCountUp :startVal="0" :endVal="(data.todayFlow - data.todayFlowFix) || 0" :decimals="0" :duration="2" :options="countUpOptions"/>
          </div>
        </div>
        <div>
          <div>固定车</div>
          <div>
            <iCountUp :startVal="0" :endVal="data.todayFlowFix || 0" :decimals="0" :duration="2" :options="countUpOptions"/>
          </div>
        </div>
      </div>
    </div>
    <div class="car-show-other">
      <img src="@/assets/views-center/car-view/all-car.png" alt="">
      <div class="one">
        <div class="title">今日车流量</div>
        <div class="count">
          <iCountUp :startVal="0" :endVal="data.todaySnap || 0" :decimals="0" :duration="2" :options="countUpOptions"/>
        </div>
      </div>
      <div class="two">
        <div>
          <div>临时车</div>
          <div>
            <iCountUp :startVal="0" :endVal="(data.todaySnap - data.todaySnapfix) || 0" :decimals="0" :duration="2" :options="countUpOptions"/>
          </div>
        </div>
        <div>
          <div>固定车</div>
          <div>
            <iCountUp :startVal="0" :endVal=" data.todaySnapfix || 0" :decimals="0" :duration="2" :options="countUpOptions"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import iCountUp from "vue-countup-v2";
import { getCarCommon } from '@/api/viewsCenter/carView'
export default {
  data() {
    return {
      data: {},
      countUpOptions: {
        useEasing: true,
        useGrouping: true,
        separator: ",",
        decimal: "."
      },
    }
  },
  props: {
    code: Object
  },
  components: {
    iCountUp,
  },
  watch: {
    code() {
      this.getCarCommon()
    }
  },
  mounted() {
    this.getCarCommon()
  },
  methods: {
    getCarCommon() {
      getCarCommon({ ...this.code }).then(res => this.data = res.data)
    }
  }
}
</script>
<style lang="scss" scoped>
.data-show{
  height:10.18vh;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #151D2D;
  margin-bottom: 0.925vh;
  .car-show, .car-show-other{
    width: 30.2vw;
    height: 8.33vh;
    display: flex;
    align-items: center;
    background-color: #1B2435;
    img{
      height: 3.24vh;
      margin-left: 4.947vw;
    }
    > div{
      margin-left: 10.78vw;
      .title{
        font-size:16px;
        // font-family:AlibabaPuHuiTiM;
        color:rgba(153,157,165,1);
        line-height:21px;
      }
      .count{
        font-size:36px;
        // font-family:DINAlternate-Bold;
        font-weight:bold;
        color:rgba(255,255,255,1);
        line-height:45px;
      }
    }
  }
  .car-show-other{
    img{
      margin-left: 4.68vw;
    }
    .one{
      margin-left: 1.16vw;
    }
    .two{
      margin-left: 6.66vw;
      >div{
        display: flex;
        div:first-child{
          font-size:16px;
          // font-family:AlibabaPuHuiTiM;
          color:rgba(255,255,255,0.58);
          line-height:26px;
          margin-right: 8px;
        }
        div:nth-child(2){
          font-size:22px;
          // font-family:DINAlternate-Bold;
          font-weight:bold;
          color:rgba(255,255,255,1);
          line-height:26px;
          text-shadow:0px 2px 4px rgba(0,0,0,0.5);
        }
      }
    }
  }
  // background-color: #151D2D;
  // height: 31.11vh;
  // padding: 2.31vh 0.833vw 2.685vh;
  // .register-car, .see-car{
  //   display: table;
  //   width: 100%;
  //   height: 11.85vh;
  //   table-layout: fixed;
  //   background-color: #1B2435;
  //   > div{
  //     display: table-cell;
  //     vertical-align: middle;
  //     img{
  //       height: 2.5vh;
  //       margin-left: 1.25vw;
  //     }
  //   }
  //   div + div{
  //     display: table-cell;
  //     vertical-align: middle;
  //     > div{
  //       font-size:1.667vh;
  //       color:rgba(255,255,255,0.5828);
  //     }
  //     strong{
  //       font-size:3.518vh;
  //       color: white;
  //     }
  //   }
  // }
  // .see-car{
  //     margin-top: 2.5vh;
  //   }
}
</style>
