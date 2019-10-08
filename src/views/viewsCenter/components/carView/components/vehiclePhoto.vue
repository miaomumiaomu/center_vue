<template>
  <div class="vehicle-photo">
    <div class="top">
      <div style="float: right;">
        <el-radio-group v-model="radioList" @change="checkboxChange" size="small">
          <el-radio-button label="1天"></el-radio-button>
          <el-radio-button label="7天"></el-radio-button>
          <el-radio-button label="30天"></el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <div class="content">
      <div class="line-chart">
        <div class="title">车辆感知趋势统计</div>
        <line-area height="30vh" :data="this.lineData" :classify="['固定车', '临时车']"></line-area>
      </div>
      <div class="morning-see">
        <see-car-type-top :code="code" :radioList="radioList"></see-car-type-top>
      </div>
      <div class="today-see">
        <div class="title">整日频繁出入 TOP10</div>
        <el-row :gutter="14">
          <el-col :span="12" v-for="(item, index) in data" :key="index">
            <div class="content-bar" :style="{ background: getColor(index, 0), borderColor: getColor(index, 1), marginTop: index < 2 ? 0 : '1.57vh' }">
              <div class="tip">
                <div :style="{ backgroundColor: getColor(index, 2) }">{{item.count}}次</div>
                <div :style="{ borderRightColor: getColor(index, 2) }"></div>
              </div>
              <div class="image">
                <div class="logo">
                  <div :style="{ borderLeftColor: getColor(index, 2) }"></div>
                  <div>{{index + 1}}</div>
                </div>
                <img v-if="item.plateNumberImgUrl" :src="item.plateNumberImgUrl" alt="">
                <div v-else class="image-alt">暂无图片</div>
              </div>
              <div class="content-text">
                <div class="content-title">{{item.plateNumber}}</div>
                <div class="content-name">{{item.name}}</div>
                <div class="content-tel">{{item.telPhone}}</div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
		<!-- <div class="top">
			<div class="title">车辆抓拍次数 TOP15</div>
		</div>
    <div class="content">
      <el-row :gutter="14">
        <el-col :span="8" v-for="(item, index) in data" :key="index">
          <div class="content-bar" :style="{ background: getColor(index, 0), borderColor: getColor(index, 1), marginTop: index < 3 ? 0 : '1.57vh' }">
            <div class="tip">
              <div :style="{ backgroundColor: getColor(index, 2) }">{{item.count}}次</div>
              <div :style="{ borderRightColor: getColor(index, 2) }"></div>
            </div>
            <div class="image">
              <div class="logo">
                <div :style="{ borderLeftColor: getColor(index, 2) }"></div>
                <div>{{index + 1}}</div>
              </div>
              <img v-if="item.plateNumberImgUrl" :src="item.plateNumberImgUrl" alt="">
              <div v-else class="image-alt">暂无图片</div>
            </div>
            <div class="content-text">
              <div class="content-title">{{item.plateNumber}}</div>
              <div class="content-name">{{item.name}}</div>
              <div class="content-tel">{{item.telPhone}}</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div> -->
	</div>
</template>
<script>
import{ getCarSnapTop, getCarSnap } from '@/api/viewsCenter/carView'
export default {
  data() {
    return {
      radioList: '1天',
      data: [],
      lineData: {
        data: []
      },
      chartData: {},
      //item数组中第一位是背景色，第二位是border颜色,第三位是三角形颜色
      colors: [
        ['rgba(46,30,30,0.49)', 'rgba(189,54,54,0.49)', '#D02B2B'],
        [ 'rgba(35,31,24,0.49)', 'rgba(189,105,54,0.49)', '#DB871D' ],
        [ 'rgba(29,25,18,0.49)', 'rgba(124,105,24,0.49)', '#B08C3F' ],
        [ 'rgba(18,24,37,1)', 'rgba(49,75,126,1)', '#2B406A' ]
      ]
    }
  },
  props: {
    code: Object
	},
	watch: {
    code() {
      this.init()
    }
  },
  components: {
    lineArea: () => import('../../LineArea'),
    seeCarTypeTop: () => import('./seeCarTypeTop'),
  },
  methods: {
    init() {
      this.getCarSnap()
      this.getCarSnapTop()
    },
    getColor(index, num) {
      if (index > 3) {
        return this.colors[3][num]
      } else {
        return this.colors[index][num]
      }
    },
    getCarSnap() {
			let type = 0
			let lineData = { time: [], name: ["感知车次统计", "感知车辆统计"], data: [[], []] }
			if (this.radioList === '7天') {
				type = 1
			} else if (this.radioList === '30天') {
				type = 2
			}
			getCarSnap({ ...this.code, type }).then(res => {
				let arr = []
				res.data.times.forEach(item => {
          if (!type) {
            item.name  = item.name.slice(9)
          }
					lineData.time.push(item.name)
					lineData.data[0].push({ value:item.value, addVal: item.addValue })
				})
				res.data.flows.forEach(item => {
					lineData.data[1].push({ value:item.value, addVal: item.addValue })
				})
				this.lineData = lineData
			})
		},
    getCarSnapTop() {
      let type = 0
			if (this.radioList === '7天') {
				type = 1
			} else if (this.radioList === '30天') {
				type = 2
      }
      getCarSnapTop({ ...this.code, type }).then(res => {
        this.data = res.data
      })
    },
    
    checkboxChange() {
      this.init()
    }
  },
	mounted() {
    this.init()
	}
}
</script>
<style lang="scss" scoped>
.vehicle-photo{
	height: 37.5vh;
  display: flex;
  flex-direction: column;
	background-color: rgba(21,29,45,1);
  margin-bottom: 0.925vh;
  .top{
    padding: 0.46vh 0.78vw 0 0;
    /deep/ {
      .el-radio-button--small .el-radio-button__inner {
        padding: 4px 14px 4px 14px;
        border-left: 1px solid #35425E;
        font-size: 12px;
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
  .content{
    flex: 1;
    clear: both;
    display: flex;
    justify-content: space-between;
    .content-bar{
      height: 9.25vh;
      display: flex;
      align-items: center;
      position: relative;
      background:#1E1E28;
      border: 1px solid #ffffff;
      .tip{
        position: absolute;
        top: 0;
        right: 0;
        > div:first-child{
          float: right;
          font-size:0.729vw;
          line-height:1.85vh;
          color: white;
          background-color: red;
          padding: 0.185vh 0.2vw;
        }
        div + div{
          float: right;
          border-right: 0.648vh solid red;
          border-bottom: 2.035vh solid transparent;
        }
      }
      .image{
        float: left;
        margin-left: 0.625vw;
        position: relative;
        .logo{
          position: absolute;
          top: 0;
          left: 0;
          > div{
            border-left: 2.22vh solid red;
            border-bottom: 2.22vh solid transparent;
          }
          div + div{
            border: none;
            position: absolute;
            top: 0;
            left: 2px;
            color: white;
            font-size: 0.572vw;
            line-height:1.48vh;
          }
        }
        img, .image-alt{
          width: 7.4vh;
          height: 5.55vh;
        }
        .image-alt{
          background-color: white;
        }
      }
      .content-text{
        margin-left: 0.52vw;
        .content-title{
          font-size: 2.03vh;
          color:rgba(205,211,224,1);
          line-height:3.05vh;
        }
        .content-name, .content-tel{
          font-size: 1.296vh;
          // font-family:AlibabaPuHuiTiR;
          color:rgba(226,233,238,0.73);
          margin-bottom: 1px;
          &::before{
            display: inline-block;
            width: 0.468vw;
            height: 0.468vw;
            background: url('../../../../../assets/views-center/unit-view/name.png');
            background-size: 100% 100%;
            margin-right: 0.2604vw;
            content: '';
          }
        }
        .content-name{
          margin-top: 1.02vh;
        }
        .content-tel::before{
          width: 0.5729vw;
          height: 0.5729vw;
          background: url('../../../../../assets/views-center/unit-view/phone.png');
          background-size: 100% 100%;
          margin-right: 0.208vw;
        }
      }
    }
    .title{
			display: inline-block;
			font-size:0.73vw;
			font-family:AlibabaPuHuiTiM;
			color:rgba(226,233,238,1);
			line-height:1.04vw;
      margin: 0 0 1.85vh 1.04vw;
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
    .line-chart{
      .title{
        margin-bottom: 0;
      }
      height: 100%;
      flex: 1;
    }
    .morning-see{
      height: 100%;
      flex: 1;
    }
    .today-see{
      height: 100%;
      flex: 1;
      .el-row{
        padding-left: 1.04vw;
        margin-right: 1.04vw;
        height: 29.6vh;
        overflow: auto;
      }
    }
  }
}
</style>