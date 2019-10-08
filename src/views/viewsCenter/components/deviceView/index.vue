<template>
  <div class="tab-container">
    <div class="left">
      <div class="left-top">
        <div class="header-num">
          <div class="tag">
            <img src="@/assets/views-center/device-total.png" alt="" class="img-total">
            <div class="num-container">
              <p>设备总数</p>
              <strong class="num-color-green">{{ deviceTotal.total }}</strong>
            </div>
          </div>
          <div class="tag">
            <img src="@/assets/views-center/device-online.png" alt="" class="img-online">
            <div class="num-container">
              <p>在线设备</p>
              <strong class="num-color-blue">{{ deviceTotal.onTotal }}</strong>
            </div>
          </div>
          <div class="tag">
            <img src="@/assets/views-center/device-offline.png" alt="" class="img-offline">
            <div class="num-container">
              <p>离线设备</p>
              <strong class="num-color-yellow">{{ deviceTotal.offTotal }}</strong>
            </div>
          </div>
        </div>
        <div class="pie-container">
          <div class="section-header">
            <img src="@/assets/views-center/tag.png" alt="">
            <span>设备状态统计</span>
          </div>
          <div class="section-content">
            <pie-chart :data="pieData" />
          </div>
        </div>
      </div>
      <div class="left-bottom">
        <div class="section-header">
          <img src="@/assets/views-center/tag.png" alt="">
          <span>设备类型统计</span>
        </div>
        <div class="section-content">
          <bar-chart :data="barData" />
        </div>
      </div>
    </div>
    <div class="right">
      <div class="section-header">
        <img src="@/assets/views-center/tag.png" alt="">
        <span>设备列表</span>
      </div>
      <div class="deviceType-container">
        <div class="inner-container">
          <div class="inner-container-left" :style="{ height: showFlag ? '26px' : 'auto' }">
            <template v-for="(item, index) in deviceType">
              <div :class="{ deviceType: true, deviceTypeFocus: item.deviceTypeName === filterDeviceType }" :key="index" @click="handleTypeChange(item)">
                <span>{{ item.deviceTypeName }}</span>
                <span>{{ item.count }}</span>
              </div>
            </template>
          </div>
          <img :src="deviceImg" alt="" @click="showAllDeviceType">
        </div>
        <div>
          <el-radio-group v-model="filterDeviceStatus" @change="handleStatusChange" size="small" >
            <el-radio-button :label="-1">全部</el-radio-button>
            <el-radio-button :label="1">在线</el-radio-button>
            <el-radio-button :label="0">离线</el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <div class="deviceList-container" @scroll="onScrollToPage">
        <template v-for="(item, index) in deviceList">
          <div :class="{'deviceCard': true, 'offline-deviceCard': item.onlineStatus !== 1}" :key="index">
            <div :class="{'card-header': true, 'offline-card-header': item.onlineStatus !== 1}">
              <span class="device-name">{{ item.name }}</span>
              <div :class="{'device-status': true, 'offline-device-status': item.onlineStatus !== 1}">{{ item.onlineStatus === 1 ? '在线' : '离线' }}</div>
            </div>
            <div :class="{'card-content': true, 'offline-card-content': item.onlineStatus !== 1}">
              <div class="device-detail">
                <div class="flex-center">
                  <img src="@/assets/views-center/device-camera.png" alt="">
                  <span>{{ item.deviceTypeName }}</span>
                </div>
                <div class="flex-center">
                  <img src="@/assets/views-center/device-place.png" alt="">
                  <span>{{ item.communityName }}</span>
                </div>
              </div>
              <img v-if="item.onlineStatus === 1" src="@/assets/views-center/device-playVideo.png" alt="" class="video-class">
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
import {
  getDeviceTotal,
  getDeviceStatus,
  getDeviceType,
  getDeviceSubType,
  getDeviceList
} from '@/api/viewsCenter/deviceView.js'
export default {
  components: {
    BarChart: () => import("../BarChart"),
    PieChart: () => import("./PieChart"),
  },
  props: {
    areaType: { // 1为辖区 2为项目 只能传其一
      type: String,
      default: ""
    },
    areaCode: {
      type: String,
      default: ""
    }
  },
  watch: {
    areaCode(val) {
      this.$nextTick(() => {
        this.filterParams.pageSize = 20
        this.getData()
      })
    }
  },
  data() {
    return {
      pieChart: null,
      filterParams: {pageNo: 1, pageSize: 20},
      filterDeviceType: '全部设备',
      filterDeviceStatus: -1,
      showFlag: true,
      deviceImg: require('@/assets/views-center/device-close.png'),

      // 字典字段
      dicMaping: [
        { key: 1, value: 'box_subType', name: '智能盒子' },
        { key: 2, value: 'deviceCamera_type', name: '摄像头' },
        { key: 3, value: 'access_subType', name: '门禁机' },
        { key: 4, value: 'visitor_subType', name: '访客机' }
      ],
      deviceDic: [],

      // 数据列表
      deviceTotal: {
        total: 0,
        offTotal: 0,
        onTotal: 0
      },
      deviceType: [],
      deviceList: [],
      barData: [],
      pieData: []
    }
  },
  mounted() {
    this.getData()

    // 构造设备子类型字典 后端给编码前端构造字典并转换为中文
    this.dicMaping.forEach(item => {
      let subDic = {}
      subDic = JSON.parse(localStorage.getItem(item.value))
      for(let key of Object.keys(subDic)) {
        this.deviceDic.push({ key: item.key, subKey: key, value: subDic[key] })
      }
    })
  },
  
  methods: {
    getData () {
      let params = {}
      params = this.getCodeParam(params)
      getDeviceTotal(params).then(res => {
        if(res.status === 200) {
          this.deviceTotal = res.data
        }
      })
      getDeviceStatus(params).then(res => {
        if(res.status === 200) {
          this.pieData = res.data
        }
      })
      getDeviceType(params).then(res => {
        if(res.status === 200) {
          this.barData = res.data
        }
      })
      getDeviceSubType(params).then(res => {
        if(res.status === 200) {
          this.deviceType = this.addDicName(res.data)
          this.addAlldeviceTotal(this.deviceType)
        }
      })
      this.fetchDevicesList()
    },
    fetchDevicesList(params = {}) { // 查询设备列表
      this.getCodeParamFilter(this.filterParams)
      Object.assign(this.filterParams, params)
      getDeviceList(this.filterParams).then(res => {
        if(res.status === 200) {
          this.deviceList = []
          this.deviceList = this.addDicName(res.data.rows)
        }
      })
    },

    /* 适配后端要求 start */
    getCodeParam(params) { // 添加辖区、项目字段 二取一
      if (this.areaType == 1) {
        params.policeAreaCode = this.areaCode;
        params.communityCode = null;
      } else if (this.areaType == 2) {
        params.policeAreaCode = null;
        params.communityCode = this.areaCode;
      }
      return params
    },
    getCodeParamFilter(params) { // 添加_fllter 辖区、项目字段 二取一
      if (this.areaType == 1) {
        params._filter_like_policeAreaCode = this.areaCode;
        params._filter_like_communityCode = null;
      } else if (this.areaType == 2) {
        params._filter_like_policeAreaCode = null;
        params._filter_like_communityCode = this.areaCode;
      }
      return params
    },
    addDicName(array) { // 添加字典中文名
      if (!array) return []
      array.forEach(obj => {
        for(let item of this.deviceDic) {
          if (obj.deviceType == item.key && obj.deviceSubType == item.subKey) {
            obj.deviceTypeName = item.value
            break
          }
        }
      })
      return array
    },
    addAlldeviceTotal(array) { // 计算并添加全部设备选项及数量
      let obj = { deviceType: null, deviceSubType: null, count: 0, deviceTypeName: '全部设备' }
      array.forEach(item => {
        obj.count += item.count
      })
      this.deviceType.unshift(obj)
    },
    /* 适配后端要求 end */

    handleTypeChange(item) {
      this.filterDeviceType = item.deviceTypeName
      this.fetchDevicesList({_filter_eq_deviceType: item.deviceType, _filter_eq_deviceSubType: item.deviceSubType})
    },
    handleStatusChange(val) {
      if (val == '-1') {
        val = null
      }
      this.fetchDevicesList({_filter_eq_onlineStatus: val})
    },
    onScrollToPage(e) {
      const taskListElem = e.currentTarget;
      const listHeight = taskListElem.clientHeight;
      if (taskListElem.scrollHeight - taskListElem.scrollTop <= listHeight) {
        this.filterParams.pageSize += 10
        this.fetchDevicesList()
      }
    },
    showAllDeviceType() {
      this.showFlag = !this.showFlag
      this.deviceImg = this.showFlag ? require('@/assets/views-center/device-close.png') : require('@/assets/views-center/device-open.png')
    },
  }
};
</script>

<style lang="scss" scoped>
$bg-color: #151D2D;
.tab-container {
  height: 80vh;
  display: flex;
  flex-direction: row;

  @mixin section() {
    .section-header {
      padding: 20px 26px 0 26px;
      color: #E2E9EE;
      display: flex;
      align-items: flex-end;
      img {
        margin-right: 5px;
      }
      span {
        font-size: 14px;
      }
    }
    .section-content {
      height: calc(100% - 36px);
    }
  }

  .left {
    width: 40%;
    height: 100%;
    margin-right: 20px;
    .left-top {
      height: 50%;
      padding-bottom: 20px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      .header-num {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 40%;
        margin-right: 16px;
        background: $bg-color;
        .tag {
          background: #1B2435;
          height: 26%;
          width: 85%;
          color: white;
          font-size: 0.832vw;
          margin-bottom: 16px;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-around;
          .num-container {
            width: 40%;
          }
          .img-total {
            height: 1.51vw;
          }
          .img-online {
            height: 0.99vw;
          }
          .img-offline {
            height: 1.3vw;
          }
          p {
            font-size: 0.885vw;
            color:rgba(255,255,255,0.582);
          }
          $num-font-size: 1.77vw;
          .num-color-green {
            font-size: $num-font-size;
            color: #428C8D;
          }
          .num-color-blue {
            font-size: $num-font-size;
            color: #3887C1;
          }
          .num-color-yellow {
            font-size: $num-font-size;
            color: #9C5B34;
          }
        }
        div:last-child {
          margin-bottom: 0px;
        }
      }
      .pie-container {
        width: 60%;
        background: $bg-color;
        @include section;
      }
    }
    .left-bottom {
      background: $bg-color;
      height: 50%;
      @include section;
    }
  }

  .right {
    background: $bg-color;
    width: 60%;
    height: 100%;
    @include section;

    .deviceType-container {
      padding: 10px 2.344vw 14px 2.344vw;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      @media (max-width: 1460px) {  
        .inner-container {
          width: 35.6vw !important;
        }
      }  
      .inner-container {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        width: 38.6vw;
        padding-top: 4px;
        .inner-container-left {
          display: flex;
          flex-wrap: wrap;
          overflow: hidden;
          .deviceType {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            color: #6B85A6;
            font-size: 14px;
            margin-right: 1.28vw;
            padding-bottom: 10px;
            width: 96px;
            &:hover {
              cursor: pointer;
              color: #357ED5;
            }
          }
          .deviceTypeFocus {
            color: #357ED5;
          }
        }
      }
      img {
        cursor: pointer;
      }
    }
    .deviceList-container {
      overflow: auto;
      height: calc(100% - 90px);
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      align-content: flex-start;
      justify-content: flex-start;
      padding-left: 1.875vw;

      .deviceCard {
        display: flex;
        flex-direction: column;
        height: 6.25vw;
        width: 30.5%;
        background: #181E2F;
        border: 1px solid #314B7E;
        border-radius:4px;
        margin: 0 0.46875vw 0.9375vw 0.46875vw;
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.52vw 1.093vw 0.417vw 0.9375vw;
          background: linear-gradient(360deg,rgba(44,95,198,0.416) 0%,rgba(70,179,240,0.416) 100%);
          .device-name {
            color: white;
            font-size: 0.9375vw;
            max-width: 230px;
          }
          .device-status {
            padding: 0.208vw 0.4687vw 0.1562vw;
            border-radius: 2px;
            font-size: 12px;
            background: rgba(46,102,201,0.608);;
            color: rgba(226,233,238,0.73);
          }
          .offline-device-status {
            background: rgba(167,87,32,0.98);
          }
        }
        .offline-card-header {
          background: linear-gradient(360deg,rgba(255,118,90,0.2) 0%,rgba(250,136,40,0.2) 100%);
        }
        .card-content {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          height: 90px;
          .device-detail {
            display: flex;
            flex-direction: column;
            color: rgba(226,233,238,0.73);
            font-size: 0.833vw;
            margin-left: 0.9375vw;
            div:first-child {
              margin-bottom: 0.4167vw;
            }
            .flex-center {
              display: flex;
              align-items: center;
              img {
                margin-right: 7px;
              }
            }
          }
          .video-class {
            height: 1.25vw;
            margin-right: 1.5625vw;
          }
        }
        .offline-card-content {
          background: rgba(47,34,24,0.432);
        }
      }

      .offline-deviceCard {
        border:1px solid rgba(152,88,63,0.432);
      }
    }
  }

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
</style>
