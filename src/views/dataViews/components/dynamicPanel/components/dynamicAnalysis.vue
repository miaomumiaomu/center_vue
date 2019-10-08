<template>
  <div class="dynamic-analysis">
    <div class="today-statistics">
      <div class="title">今日数据统计</div>
      <el-row>
        <el-col :span="8" class="statistics-item">
          <div>人脸采集</div>
          <strong>{{personTodayAnalysis.personSnapCollect}}</strong>
        </el-col>
        <el-col :span="8" class="statistics-item">
          <div>人数统计</div>
          <strong>{{personTodayAnalysis.personCount}}</strong>
        </el-col>
        <el-col :span="8" class="statistics-item">
          <div>人员预警</div>
          <strong class="warn">{{personTodayAnalysis.personAlarm}}</strong>
        </el-col>
        <el-col :span="8" class="statistics-item">
          <div>车辆采集</div>
          <strong>{{carTodayAnalysis.carFlow}}</strong>
        </el-col>
        <el-col :span="8" class="statistics-item">
          <div>车数统计</div>
          <strong>{{carTodayAnalysis.carCount}}</strong>
        </el-col>
        <el-col :span="8" class="statistics-item">
          <div>车辆预警</div>
          <strong class="warn">{{carTodayAnalysis.carAlarm}}</strong>
        </el-col>
      </el-row>
    </div>
    <div v-if="!communityCode">
      <div>
        <div class="title">24小时人脸统计</div>
        <line-area height="15.4vh" :data="personSnapLineData" :colorData="colorData[0]" :resize="resize" :key="1"></line-area>
        <line-area height="15.4vh" :data="personAlarmLineData" :colorData="colorData[1]" :resize="resize"></line-area>
      </div>
      <div>
        <div class="title">24小时车辆抓拍统计</div>
        <line-area  height="15.4vh" :data="carCollectLineData" :colorData="colorData[2]" :resize="resize" :key="2"></line-area>
        <line-area  height="15.4vh" :data="carAlarmLineData"  :colorData="colorData[3]" :resize="resize"></line-area>
      </div>
    </div>
    <div v-else>
      <div>
        <div class="title">24小时人脸统计</div>
        <line-area  height="18.4vh" :data="face" :colorData="colorData[0]" :resize="resize" :key="3"></line-area>
      </div>
      <div>
        <div class="title">24小时车辆抓拍统计</div>
        <line-area  height="18.4vh" :data="car" :colorData="colorData[2]" :resize="resize" :key="4"></line-area>
      </div>
      <div>
        <div class="title">24小时访客统计</div>
        <line-area  height="18.4vh" :data="visitorCommon" :colorData="colorData[2]" :resize="resize"></line-area>
      </div>
    </div>
  </div>
</template>
<script>
import { getPersonTodayAnalysis, getCarTodayAnalysis, getAlarmAnaly, getCarAlarmAnaly, getVisitorFlow } from '@/api/dataViews/dynamicPanel'
import { getCarSnap } from "@/api/viewsCenter/carView"
import { getPersonSnap } from "@/api/viewsCenter/population";
export default {
  name: 'dynamicAnalysis',
  data() {
    return{
      colorData: [
        [['#979797', 'rgba(143, 143, 148, .16)', 'rgb(30, 30, 30)'], ['#307592','rgba(46,111,138, .28)', 'rgb(22,37,44)']],
        [['#246954', 'rgba(25,66,61, .39)', 'rgba(21,39,50, 1)'], ['#895713', 'rgba(91,63,28, .33)', 'rgba(40,46,46, 1)']],
        [['#979797', 'rgba(143, 143, 148, .16)', 'rgba(30, 30, 30, 1)'], ['#307592', 'rgba(46,111,138, .28)', 'rgba(22,37,44, 1)']],
        [['#85282A', 'rgba(66,25,25, .22)', 'rgba(21,39,50, 1)'], ['#4070B0', 'rgba(64,112,176, .13)', 'rgba(19,30,39, 1)']],
        // [['rgba(143, 143, 148, .16)', 'rgba(30, 30, 30, .16)'], ['rgba(46,111,138, .28)', 'rgba(22,37,44, .28)']],
      ],
      first: true, //阻止第一次communityCode空
      carTodayAnalysis: [],
      personTodayAnalysis: [],
      personSnapLineData: { data:[] },
      personAlarmLineData: { data:[] },
      carCollectLineData: { data:[] },
      carAlarmLineData: { data:[] },
      visitorCommon: { data: [] },
      face: { data: [] },
      car: { data: [] }
    }
  },
  props: {
    policeAreaCode: [String],
    communityCode: [String],
    resize: [Number]
  },
  watch: {
    policeAreaCode: {
      handler(val) {
        if (val) {
          this.init()
        }
      },
      immediate: true
    },
    communityCode: {
      handler(val) {
        if (this.first) {
          this.first = false
          return
        }
        this.init()
      },
      immediate: true
    },
  },
  methods: {
    init() {
      this.getPersonTodayAnalysis()
      this.getCarTodayAnalysis()
      Promise.all([this.getPersonSnap(), this.getAlarmAnaly(), this.getCarSnap(), this.getCarAlarmAnaly()]).then(res => {
        if (this.communityCode) {
          this.dataStats()
        }
      })
      if (this.communityCode) {
        this.getVisitorFlow()
      }
    },
    getPersonTodayAnalysis() {
      getPersonTodayAnalysis({ ...this.getCode() }).then(res => {
        this.personTodayAnalysis = res.data
      })
    },
    getCarTodayAnalysis() {
      getCarTodayAnalysis({ ...this.getCode() }).then(res => {
        this.carTodayAnalysis = res.data
      })
    },
    getPersonSnap() {
      return getPersonSnap({ ...this.getCode(), type: 0 }).then(res => {
        let time = [], data = []
        res.data.flows.forEach(item => {
          time.push(item.name.slice(9))
          data.push(item.value)
        })
        this.personSnapLineData = Object.assign({}, { time,name: ['人脸采集'], data: [data] })
      })
    },
    getAlarmAnaly() {
      return getAlarmAnaly({ ...this.getCode() }).then(res => {
        let time = [], data = []
        res.data.forEach(item => {
          time.push(item.name.slice(9))
          data.push(item.value)
        })
        this.personAlarmLineData = Object.assign({}, { time,name: ['人脸预警'], data: [data] })
      })
    },
    getCarSnap() {
      return getCarSnap({ ...this.getCode(), type: 0 }).then(res => {
        let time = [], data = []
        res.data.flows.forEach(item => {
          time.push(item.name.slice(9))
          data.push(item.value)
        })
        this.carCollectLineData = Object.assign({}, { time,name: ['车辆采集'], data: [data] })
      })
    },
    getCarAlarmAnaly() {
      return getCarAlarmAnaly({ ...this.getCode() }).then(res => {
        let time = [], data = []
        res.data.forEach(item => {
          time.push(item.name.slice(9))
          data.push(item.value)
        })
        this.carAlarmLineData = Object.assign({}, { time,name: ['车辆预警'], data: [data] })
      })
    },
    getVisitorFlow() {
      getVisitorFlow({ ...this.getCode(), type: 0 }).then(res => {
        let time = [], data = []
        res.data.forEach(item => {
          time.push(item.name.slice(9))
          data.push(item.value)
        })
        this.visitorCommon = Object.assign({}, { time,name: ['访客人数'], data: [data] })
      })
    },
    getCode() {
      if(this.communityCode) {
        return { communityCode: this.communityCode }
      }
      return { policeAreaCode: this.policeAreaCode }
    },
    dataStats() {
      let { time:faceTime, name: faceName, data: faceData } = this.personSnapLineData
      let { name: faceAlarmName, data: faceAlarmData } = this.personAlarmLineData
      this.face = Object.assign({}, { time: faceTime,name: [faceName[0], faceAlarmName[0]], data: [faceData[0], faceAlarmData[0]] })
      let { time:carTime, name: carName, data: carData } = this.carCollectLineData
      let { name: carAlarmName, data: carAlarmData } = this.carAlarmLineData
      this.car = Object.assign({}, { time: carTime,name: [carName[0], carAlarmName[0]], data: [carData[0], carAlarmData[0]] })
    }
  },
  components: {
    LineArea: () => import('./LineArea')
  }
}
</script>
<style lang="scss" scoped>
.dynamic-analysis{
  .title {
    display: inline-block;
    font-size:1.296vh;
    // font-family:PingFangSC-Medium;
    font-weight:500;
    color:rgba(255,255,255,1);
    line-height:1.85vh;
    margin-bottom: 0.83vh;
    &::before {
      content: "";
      display: inline-block;
      width: 1.36vh;
      height: 1.36vh;
      background: url("../../../../../assets/views-center/house-view/top-logo.png");
      background-size: 100% 100%;
      margin-right: 5px;
    }
  }
  .today-statistics {
    margin-bottom: 1.296vh;
    .statistics-item{
      margin-bottom: 1.66vh;
      div:first-child{
        margin-bottom: 2px;
        font-size:1.296vh;
        // font-family:AlibabaPuHuiTiM;
        color:rgba(255,255,255,0.58);
        line-height:1.85vh;
      }
      strong{
        font-size:2.77vh;
        font-family:DINAlternate-Bold;
        color:rgba(64,146,200,1);
        line-height:3.24vh;
      }
      .warn{
        color: #D11F1F;
      }
    }
  }
}

</style>

