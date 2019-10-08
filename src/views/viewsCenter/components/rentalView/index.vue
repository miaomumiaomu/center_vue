<template>
  <div class="tab-container">
    <div class="row">
      <div class="col">
        <div class="top-panel">
          <div class="panel-bar">
            <img class="img" src="@/assets/views-center/house-view/building-sum.png" alt="">
            <div class="item-content">
              <div class="title">出租房总数</div>
              <strong class="count">
                <iCountUp :startVal="0" :endVal="rentHouseCnt || 0" :decimals="0" :duration="2" :options="countUpOptions" />
              </strong>
            </div>
          </div>
          <div class="panel-bar">
            <img class="img" src="@/assets/views-center/house-view/building-sum.png" alt="">
            <div class="item-content">
              <div class="title">租客总数</div>
              <strong class="count">
                <iCountUp :startVal="0" :endVal="total || 0" :decimals="0" :duration="2" :options="countUpOptions" />
              </strong>
            </div>
          </div>
          <div class="panel-bar">
            <img class="img" src="@/assets/views-center/house-view/building-sum.png" alt="">
            <div class="item-content">
              <div class="title">今日入住租客</div>
              <strong class="count">
                <iCountUp :startVal="0" :endVal="todayInPersonCnt || 0" :decimals="0" :duration="2" :options="countUpOptions" />
              </strong>
            </div>
          </div>
          <div class="panel-bar">
            <img class="img" src="@/assets/views-center/house-view/building-sum.png" alt="">
            <div class="item-content">
              <div class="title">今日入住租客</div>
              <strong class="count">
                <iCountUp :startVal="0" :endVal="todayOutPersonCnt || 0" :decimals="0" :duration="2" :options="countUpOptions" />
              </strong>
            </div>
          </div>
        </div>
      </div>
      <div class="middle-view">
        <div class="section nation-place">
          <div class="section-header">
            <div class="section-title">
              <img src="@/assets/views-center/tag.png" alt="tag">
              <span>租户籍贯分布</span>
            </div>
          </div>
          <div class="section-body">
            <china-map height="98%" :data="placeData" :total="total" />
            <div class="nation-table">
              <template v-for="(item, index) in placeData.slice(0, 10)">
                <div :key="index" class="table-row" :style="{ 'background': index % 2 === 0 ? 'rgba(33,44,71,0.4841)' : 'rgba(146,146,146,0.15)' }">
                  <div class="table-index">{{ index + 1 }}</div>
                  <div class="table-name">{{ item.name }}</div>
                  <div class="table-percent">
                    {{ (item.value/total * 100).toFixed(2) }}
                  </div>
                  <span style="transform: scale(0.7);">%</span>
                </div>
              </template>
            </div>
          </div>
        </div>
        <div class="section rent-status">
          <div class="section-header">
            <div class="section-title">
              <img src="@/assets/views-center/tag.png" alt="tag">
              <span>租客变动情况分析</span>
            </div>
            <div class="right-info">
              <el-radio-group v-model="timeRange" size="small" @change="handlePersonTop10Change">
                <el-radio-button :label="0">30天</el-radio-button>
                <el-radio-button :label="1">6个月</el-radio-button>
                <el-radio-button :label="2">12个月</el-radio-button>
              </el-radio-group>
            </div>
          </div>
          <div class="section-body">
            <db-bar-chart :barData="rentStatusData"></db-bar-chart>
          </div>
        </div>
        <div class="rent-top">
          <rent-top :code="code"></rent-top>
        </div>
      </div>
      <div class="bottom-view">
        <div class="section rent-age">
          <div class="section-header">
            <div class="section-title">
              <img src="@/assets/views-center/tag.png" alt="tag">
              <span>租户年龄分布</span>
            </div>
          </div>
          <div class="section-body">
            <bar-chart :data="ageDistributionData" :colorIndex="0" />
          </div>
        </div>
        <div class=" section rent-nation">
          <div class="section-header">
            <div class="section-title">
              <img src="@/assets/views-center/tag.png" alt="tag">
              <span>租户民族分布</span>
            </div>
          </div>
          <div class="section-body">
            <horizon-column :data="nativeData" color="#45ADED" />
          </div>
        </div>
        <div class="section rent-distribution">
          <div class="section-header">
            <div class="section-title">
              <img src="@/assets/views-center/tag.png" alt="tag">
              <span>租户分布统计</span>
            </div>
          </div>
          <div class="section-body">
            <bar-chart :data="distributionData" :colorIndex="1" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { 
  getRenterAge, 
  getRentHouseCommon, 
  getRenterNativePlace, 
  getRenterCountTop, 
  getRenterNationPlace, 
  getRenterDistribute 
} from "@/api/viewsCenter/rentView";
import { getHouseRent } from "@/api/viewsCenter/houseView";
import iCountUp from "vue-countup-v2";

export default {
  props: {
    areaType: {
      type: String,
      default: "1"
    },
    areaCode: {
      type: String,
      default: ""
    }
  },
  components: {
    ChinaMap: () => import("../ChinaMap"),
    DbBarChart: () => import('../DbBarChart'),
    RentTop: () => import('./components/rentTop'),
    HorizonColumn: () => import("../HorizonColumn"),
    BarChart: () => import("../BarChart"),
    iCountUp
  },
  data() {
    return {
      placeData: [],
      rentHouseCnt: 0, 
      todayInPersonCnt: 0, 
      todayOutPersonCnt: 0,
      total: 0,
      timeRange: 0,
      rentStatusData: {},
      ageDistributionData: [],
      nativeData: [],
      distributionData: [],
      countUpOptions: {
        useEasing: true,
        useGrouping: true,
        separator: ",",
        decimal: "."
      },
    }
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
  watch: {
    areaCode: {
      handler(val) {
        this.$nextTick(() => {
          this.getData();
        });
      },
      immediate: true
    }
  },
  methods: {
    getData() {
      this.fetchRenterAge()
      this.fetchRentHouseCommon()
      this.fetchRenterNativePlace()
      this.fetchHouseRent()
      this.fetchRenterNationPlace()
      this.fetchRenterDistribute()
    },
    handlePersonTop10Change() {
      this.fetchHouseRent()
    },
    fetchRenterAge() {
      getRenterAge(this.code).then(res => {
        this.ageDistributionData = res.data
      })
    },
    fetchRentHouseCommon() {
      getRentHouseCommon(this.code).then(res => {
        let { rentHouseCnt, todayInPersonCnt, todayOutPersonCnt, rentPersonCnt } = res.data
        this.rentHouseCnt = rentHouseCnt
        this.todayInPersonCnt = todayInPersonCnt
        this.todayOutPersonCnt = todayOutPersonCnt
        this.total = rentPersonCnt
      })
    }, 
    fetchRenterNativePlace() {
      getRenterNativePlace(this.code).then(res => {
        const { status, data } = res;
        if (status === 200) {
          const result = data.map((item, index) => {
            item.index = index + 1;
            return item;
          });
          this.placeData = result;
        }
      })
    },

    //租客变动情况分析
    fetchHouseRent() {
      let type = 1
			if (this.timeRange === 1) {
				type = 2
			} else if (this.radioList === 2) {
				type = 3
			}
      getHouseRent({ ...this.code, type }).then(res => {
        let { rentInList, rentOutList } = res.data
        let time = [], rentInData = [], rentOutData = []

        rentInList.forEach(item => {
          time.push(item.name)
          rentInData.push(item.value)
        })

        rentOutList.forEach(item => {
          rentOutData.push(item.value)
        })
        this.rentStatusData = { time, name: ['流入租客', '流出租客'], data: [rentInData, rentOutData] }
      })
    },
    //租户民族分布
    fetchRenterNationPlace() {
      getRenterNationPlace(this.code).then(res => {
        res.data.find((item, index) => {
          if (item.name === '汉族') {
            res.data.splice(index, 1)
            return true
          }
          return false
        })
        this.nativeData = res.data
      })
    },
    fetchRenterDistribute() {
      getRenterDistribute(this.code).then(res => {
        this.distributionData = res.data
      })
    }

    
  },
}
</script>
<style lang="scss" scoped>
::-webkit-scrollbar-thumb {
  border: 2px solid #1E2638;
}
::-webkit-scrollbar-track {
  background-color: #11151F;
}
.tab-container{
  .top-panel{
    display: flex;
    justify-content: space-around;
    background-color: #151D2D;
    padding: 0 7.5px;
    .panel-bar{
      height: 8.5vh;
      flex: 1;
      display: flex;
      align-items: center;
      margin: 9px 7.5px;
      background-color: #1B2435;
      .img{
        margin-left: 2.5vw;
      }
      .item-content{
        display: inline-block;
        margin-left: 3.75vw;
        div{
          height:2.31vh;
          font-size:17px;
          color:rgba(255,255,255,0.58);
          line-height:2.31vh;
        }
        strong{
          height:4.4vh;
          font-size:33px;
          color:rgba(255,255,255,1);
          line-height:4.4vh;
        }
      }
    }
  }
  .middle-view{
    height: 36.8vh;
    margin-top: 12px;
    display: flex;
    .nation-place{
      width: 456px;
      height: 100%;
    }
    .rent-status{
      width: 763px;
      height: 100%;
      margin-left: 8px;
    }
    .rent-top{
      width: 560px;
      height: 100%;
      margin-left: 8px;
    }
  }
  .bottom-view{
    height: 28.7vh; 
    display: flex;
    margin-top: 7px;
    .rent-age{
      width: 456px;
      height: 100%;
    }
    .rent-nation{
      width: 763px;
      height: 100%;
      margin-left: 8px;
    }
    .rent-distribution{
      width: 560px;
      height: 100%;
      margin-left: 8px;
    }
  }
  .section {
    background-color: #151D2D;
    border-radius: 2px;
    display: flex;
    flex-direction: column;
    .section-header {
      padding: 16px 20px 0;
      overflow: hidden;
      .section-title {
        float: left;
        > img {
          width: 13px;
          vertical-align: middle;
          margin-right: 2px;
        }
        > span {
          font-size: 12px;
          color: #E2E9EE;
          vertical-align: middle;
        }
      }
      .right-info {
        float: right;
      }
    }
    .section-body {
      flex: 1;
      position: relative;
      overflow: hidden;
      .nation-table {
        position: absolute;
        left: 20px;
        top: 55px;
        font-size: 12px;
        width: 120px;
        height: 227px;
        color: #E2E9EE;
        .table-row {
          display: flex;
          align-items: center;
          height: 22px;
          font-family: AlibabaPuHuiTiM;
          .table-index {
            color: rgba(133,168,193,1);
            border-radius:1px;
            border:1px solid rgba(133,168,193,1);
            margin-right: 10px;
            padding: 1px 4px 0 4px;
            font-size: 12px;
            transform: scale(0.833);
          }
          .table-name {
            font-size: 12px;
            color: #E2E9EE;
            margin-right: 10px;
          }
        }
      }
    }
  }
  /deep/{
    .el-radio-button--small .el-radio-button__inner {
      padding: .2vw .78vw .1vw .78vw;
      border-left: 1px solid #35425E;
      font-size: .62vw;
    }
    .el-radio-button__inner {
      background-color: #202C40;
      border-color: #35425E;
      color: #E2E9EE;
      border-radius: 0;
    }
    .el-radio-button__orig-radio:checked + .el-radio-button__inner {
      background-color: rgba(44,95,198,0.3);
      border-color: #0465C1;
      color: #E2E9EE;
      box-shadow: none;
    }
  }
}
</style>