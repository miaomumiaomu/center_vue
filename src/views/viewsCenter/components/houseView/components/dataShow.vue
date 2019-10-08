<template>
  <div class="data-show">
    <div>
      <div class="table">
        <div class="td">
          <img class="img" src="@/assets/views-center/house-view/building-sum.png" alt="">
        </div>
        <div class="td">
          <div class="title1">门牌总数</div>
          <div class="title2">
            <iCountUp :startVal="0" :endVal="data.unitTotal || 0" :decimals="0" :duration="2" :options="countUpOptions" />
          </div>
        </div>
      </div>
      <div class="table" style="margin-top: 1.2vh;">
        <div class="td">
          <img class="img" src="@/assets/views-center/house-view/unit-sum.png" alt="">
        </div>
        <div class="td">
          <div class="title1">室号总数</div>
          <div class="title2">
            <iCountUp :startVal="0" :endVal="data.houseTotal || 0" :decimals="0" :duration="2" :options="countUpOptions"/>
          </div>
        </div>
      </div>
      <div class="house-type" style="margin-top: 1.2vh;">
        <div class="title">房屋分类</div>
        <div class="content">
          <div v-for="(item, index) of houseManageLevel" :key="index">
            <div>{{item.name}}</div>
            <div :style="{ color: index ? index == 1 ? '#3887C1' : '#428C8D' : '' }">{{item.value}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import{ getHouseCommon, getHouseManageLevel } from '@/api/viewsCenter/houseView'
import iCountUp from "vue-countup-v2";
export default {
  data() {
    return {
      data: {},
      houseManageLevel: [],
      countUpOptions: {
        useEasing: true,
        useGrouping: true,
        separator: ",",
        decimal: "."
      },
    }
  },
  components: {
    iCountUp,
  },
  props: {
    code: Object
	},
	watch: {
    code() {
      this.getHouseCommon()
      this.getHouseManageLevel()
    }
  },
  mounted() {
    this.getHouseCommon()
    this.getHouseManageLevel()
  },
  methods: {
    getHouseCommon() {
      getHouseCommon({ top: 10, ...this.code }).then(res => {
        this.data = res.data
      })
    },
    getHouseManageLevel() {
      getHouseManageLevel({ ...this.code }).then(res => {
        this.houseManageLevel = res.data
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.data-show{
  width: 20vw;
  height: 43.3vh;
  background:rgba(21,29,45,1);
  display: flex;
  justify-content: center;
  align-items: center;
  .table{
    display: table;
    table-layout: fixed;
    width: 17.08vw;
    height: 9.07vh;
    background:rgba(27,36,53,1);
    .td{
      display: table-cell;
      vertical-align: middle;
      .img{
        margin-left: 2.96vw;
        width: 1.822vw;
      }
      .title1{
        margin-left: 1.4vw;
        font-size: 1.48vh;
        // font-family:AlibabaPuHuiTiM;
        color:rgba(255,255,255,0.582);
        margin-bottom: 2px;
        letter-spacing: 0.3px;
      }
      .title2{
        margin-left: 1.4vw;
        font-size:3.24vh;
        font-family:DINAlternate-Bold;
        font-weight:bold;
        color:white;
        letter-spacing: 0.76px;
        line-height: 4.166vh;
      }
    }
  }
  .house-type{
    width: 17.08vw;
    height: 19.9vh;
    display: flex;
    flex-direction: column;
    background:rgba(27,36,53,1);
    .title{
      margin: 2.4vh 0 0 1.614vw;
			display: inline-block;
			font-size:1.296vh;
			font-family:AlibabaPuHuiTiM;
			color:rgba(226,233,238,1);
			line-height:1.04vw;
			&::before{
				content: '';
				display: inline-block;
				width: 0.78vw;
				height: 0.78vw;
				background: url('../../../../../assets/views-center/house-view/top-logo.png');
				background-size: 100% 100%;
				margin-top: 2px;
				margin-right: 5px;
			}
		}
    .content{
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
      > div{
        width: 100%;
        display: flex;
        div:first-child{
          margin-left: 2.8125vw;
          font-size:15px;
          // font-family:AlibabaPuHuiTiM;
          color:rgba(255,255,255,0.58);
          line-height:31px;
        }
        div + div{
          margin-left: 6.145vw;
          font-size:28px;
          // font-family:DINAlternate-Bold;
          font-weight:bold;
          color:rgba(182,103,48,1);
          line-height:31px;
          text-shadow:0px 2px 4px rgba(0,0,0,0.5);
        }
      }
    }
  }
}
</style>

