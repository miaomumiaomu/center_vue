<template>
  <div class="dynamic-monitoring">
    <div class="today-face">
      <div class="title">今日人脸采集</div>
      <div class="face-bar">
        <div class="face-item">
          <div class="item">
            <div>采集总数</div>
            <strong>
              <iCountUp :startVal="0" :endVal="faceDataShow.collect || 0" :decimals="0" :duration="2" :options="countUpOptions" />
            </strong>
          </div>
        </div>
        <div class="face-item">
          <div class="item">
            <div>已登记</div>
            <strong class="standard">
              <iCountUp :startVal="0" :endVal="faceDataShow.todaySnapfix || 0" :decimals="0" :duration="2" :options="countUpOptions" />
            </strong>
          </div>
        </div>
        <div class="face-item">
          <div class="item" :style="{ borderRightWidth: 0 }">
            <div>未登记</div>
            <strong class="warn">
              <iCountUp :startVal="0" :endVal="(faceDataShow.collect - faceDataShow.todaySnapfix) || 0" :decimals="0" :duration="2" :options="countUpOptions" />
            </strong>
          </div>
        </div>
      </div>
      <div class="face-content">
        <transition-group  name="fade">
          <div class="item" :class="{ warn: item.warn }" v-for="(item, indexs) in faceList" :key="indexs" @click="faceDialogOpen(item)">
            <div class="image">
              <!-- <div class="logo">
                <div>进</div>
                <div></div>
              </div> -->
              <img :src="item.snapImgPath" alt="">
            </div>
            <div class="content">
              <div class="name">
                <span>{{item.personName}}</span>
                <template v-if="librarysState">
                  <div v-for="(it, index) in getLibrary(item)" :key="index" :style="{ backgroundColor: it.color }">{{it.shortName}}</div>
                </template>
              </div>
              <div class="community">{{item.address}}</div>
              <div class="time">{{item.collectTime}}</div>
            </div>
          </div>
        </transition-group>
      </div>
    </div>
    <div style="border-top: 1px solid rgb(151, 151, 151, 0.47); margin: 1.2vh 0;"></div>
    <div class="today-face">
      <div class="title">今日车辆采集</div>
      <div class="face-bar">
        <div class="face-item">
          <div class="item">
            <div>采集总数</div>
            <strong>
              <iCountUp :startVal="0" :endVal="carDataShow.carCollect || 0" :decimals="0" :duration="2" :options="countUpOptions" />
            </strong>
          </div>
        </div>
        <div class="face-item">
          <div class="item">
            <div>已登记</div>
            <strong class="standard">
              <iCountUp :startVal="0" :endVal="carDataShow.carRegist || 0" :decimals="0" :duration="2" :options="countUpOptions" />
            </strong>
          </div>
        </div>
        <div class="face-item">
          <div class="item" :style="{ borderRightWidth: 0 }">
            <div>未登记</div>
            <strong class="warn">
              <iCountUp :startVal="0" :endVal="(carDataShow.carCollect - carDataShow.carRegist) || 0" :decimals="0" :duration="2" :options="countUpOptions" />
            </strong>
          </div>
        </div>
      </div>
      <div class="face-content">
        <transition-group  name="fade">
          <div class="item" v-for="item in carList" :key="item.passTime" @click="carDialogOpen(item)">
            <div class="image">
              <!-- <div class="logo">
                <div>进</div>
                <div></div>
              </div> -->
              <img :src=" item.backgroundImage || item.plateImage" alt="">
            </div>
            <div class="content">
              <div class="name">
                <span>{{item.plateNumber}}</span>
                <template v-if="librarysState">
                  <div v-for="(it, index) in getCarLibrary(item)" :key="index" :style="{ backgroundColor: it.color }">{{it.shortName}}</div>
                </template>
              </div>
              <div class="community">{{item.communityName}}-{{item.deviceName}}</div>
              <div class="time">{{item.passTime}}</div>
            </div>
          </div>
        </transition-group>
      </div>
    </div>
    <photos-dialog ref="photosDialog"></photos-dialog>
    <car-photo-dialog ref="catPhotoDialog"></car-photo-dialog>
  </div>
</template>
<script>
import { getTrackDynamicAnalysis, getCarDynamicAnalysis } from '@/api/dataViews/dynamicPanel'
import { getPersonCategories, getPersonLibrarys } from "@/api/faceLibrary";
import { getTagTypeList, getTagById } from '@/api/libTagsManage'
import { getcarLibraries } from "@/api/carManage";
import { getPassRecordsList } from "@/api/passRecord";
import { getCarPassRecordsList } from "@/api/carManage/carSnap";
import { getRefresh } from '@/api/common';
import { postChanList } from "@/api/video";
import iCountUp from "vue-countup-v2";
export default {
  name: "dynamicMonitoring",
  data() {
    return {
      faceDataShow: {},
      carDataShow: {},
      faceList: [],
      carList: [],
      libraryNums: [],
      carLibraryNums: [],
      librarysState: false,
      interval: null,
      token: null,
      chanListData: null,
      ip: process.env.NODE_ENV === "development" ? process.env.IP : location.host,
      countUpOptions: {
        useEasing: true,
        useGrouping: true,
        separator: ",",
        decimal: "."
      },
      pageSize: 15
    }
  },
  props: {
    policeAreaCode: [String],
    communityCode: [String]
  },
  components: {
    iCountUp,
    photosDialog: () => import('./photosDialog'),
    carPhotoDialog: () => import('./carDialog'),
  },
  destroyed() {
    clearInterval(this.interval)
  },
  mounted() {
    this.interval = setInterval(() => {
      getRefresh().then(res => {
        this.$store.dispatch("getTokenRefresh", res.data.token)
        this.token = res.data.token
      })
    }, 1800 * 1000)
    this.initSnapData()
    this.getPassRecordsList()
    this.getCarPassRecordsList()
    this.getTagTypeList()
    this.getcarLibraries()
    this.getTrackDynamicAnalysis()
    this.getCarDynamicAnalysis()
    this.postChanList()
  },
  methods: {
    //数据视窗动态分析人脸采集
    getTrackDynamicAnalysis() {
      getTrackDynamicAnalysis({ communityCode: this.communityCode }).then(res => {
        this.faceDataShow = res.data
      })
    },
    //数据视窗动态分析车辆采集
    getCarDynamicAnalysis() {
      getCarDynamicAnalysis({ communityCode: this.communityCode }).then(res => {
        this.carDataShow = res.data
      })
    },
    getPassRecordsList() {
      getPassRecordsList({ pageNo: 1, pageSize: this.pageSize, _filter_eq_communityCode: this.communityCode, _filter_ge_collectTime_date: this.moment({hour: 0, minute: 0, seconds: 0}).format("YYYYMMDDHHmmss")}).then(res => {
        this.faceList = res.data.rows
      })
    },
    getCarPassRecordsList() {
      getCarPassRecordsList({ pageNo: 1, pageSize: this.pageSize, _filter_eq_communityCode: this.communityCode, _filter_ge_passTime_date: this.moment({hour: 0, minute: 0, seconds: 0}).format("YYYYMMDDHHmmss")}).then(res => {
        this.carList = res.data.rows
      })
    },
    getTagTypeList() {
      getTagTypeList().then(res => {
        this.$nextTick(() => {
          this.libraryNums = res.data
          let func = (val) => {
            return getTagById({ categoryId: val.id }).then(result => {
              val.children = result.data
            })
          }
          Promise.all(res.data.map(item => func(item))).then(res => {
            this.librarysState = true
          })
        })
      })
    },
    getcarLibraries() {
      getcarLibraries().then(res => {
        this.carLibraryNums = res.data
      })
    },
    getLibrary(data) {
      if(!this.librarysState || !data.personTags) {
        return
      }
      data.logo = []
      let arr = null
      arr = data.personTags.map(items => {
        let obj = null
        
        //改成管理级别判断是否重点
        this.libraryNums.find(item => {
          obj = item.children.find(i => {
            if (i.id == items) {
              data.logo.push(i)
              //重点人员
              if (item.managerType) {
                this.$set(data, 'warn', true)
              }
              return true
            }
            return false
          })
          if (obj) {
            return true
          }
        })

        return obj
      })
      arr = arr.filter(item => item != undefined)
      return arr
    },
    getCarLibrary(data) {
      let arr = null
      data.libraryNums ? arr = data.libraryNums.split(',') : arr = ['1']
      arr = arr.map(items => {
        return this.carLibraryNums.find(item => item.num == items)
      })
      return arr
    },
    //获取拾联通道摄像头配置列表
    postChanList() {
      postChanList([]).then(res => {
        this.chanListData = res.data;
      })
    },
    faceDialogOpen(data) {
      this.$refs.photosDialog.open(data, this.chanListData)
    },
    carDialogOpen(data) {
      this.$refs.catPhotoDialog.open(data, this.chanListData)
    },
    // 通用初始WebSocket
    initWebSocket(webSocketKey, destroyKey, url, callback) {
      let webSocket = (this[webSocketKey] = new WebSocket(url));
      let destroy = this[destroyKey];

      //打开事件
      webSocket.onopen = () => {
        console.log("webSocket 已打开");
      };
      //获得消息事件
      webSocket.onmessage = msg => {
        try {
          let _data = JSON.parse(msg.data);
          if(_data.code === '8') {
            webSocket.send('0,2,' + this.communityCode)
          }
          callback && callback(_data);
        } catch (err) {}
      };
      //关闭事件
      webSocket.onclose = () => {
        console.log("Socket已关闭");
        if (destroy) {
          webSocket = null;
          setTimeout(() => {
            this.initWebSocket(webSocket, url, callback);
          }, 1000);
        }
      };
      //发生了错误事件
      webSocket.onerror = () => {
        console.log("Socket发生了错误");
      };
      return webSocket;
    },
    // 抓拍推送初始化
    initSnapData() {
      const { token } = this.$store.getters;
      this.initWebSocket(
        "snapWebSocket",
        "isDestroySnap",
        `ws://${this.ip}/websocket/${token}`,
        data => {
          this.socketDetail(data)
        }
      )
    },
    //socket处理函数
    socketDetail(val) {
      let { code, data } = val
      if (['0'].includes(code)) {
        data.address = `${data.communityName}-${data.deviceName}`
        data.collectTime = data.imgTime
        delete data.imgTime
        this.faceList.unshift(data)
        if(this.faceList.length > this.pageSize) {
          this.faceList.pop()
        }
      } else if (['2'].includes(code)) {
        this.carList.unshift(data)
        if(this.carList.length > this.pageSize) {
          this.carList.pop()
        }
      }else if (code === '9') {
        if (this.faceDataShow.collect !== data.trackCollect || this.faceDataShow.todaySnapfix !== data.trackRegist) {
          this.faceDataShow.collect = data.trackCollect
          this.faceDataShow.todaySnapfix = data.trackRegist
        }
      } else if (code === '10') {
        if (this.carDataShow.collected !== data.carCollect || this.carDataShow.todaySnapfix !== data.carRegist) {
          this.carDataShow.collected = data.carCollect
          this.carDataShow.todaySnapfix = data.carRegist
        }
      }
    },
  }
}
</script>
<style lang="scss" scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.dynamic-monitoring{
  .today-face {
    margin-bottom: 1.296vh;
    .title {
      display: inline-block;
      font-size:1.296vh;
      // font-family:PingFangSC-Medium;
      font-weight:500;
      color:rgba(255,255,255,1);
      line-height: 1.85vh;
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
    .face-bar{
      display: flex;
      background:rgba(21,39,62,0.57);
      border:1px solid rgba(49,75,126,1);
      .face-item{
        flex: 1;
        display: flex;
        align-items: center;
        padding: 1.2vh 0 1.01vh;
        .item{
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          border-right: 1px solid rgba($color: #979797, $alpha: 0.57);
          div:first-child{
            font-size:1.296vh;
            // font-family:AlibabaPuHuiTiM;
            color:rgba(255,255,255,0.58);
            line-height:2.03vh;
            letter-spacing: 0.27px;
          }
          strong{
            font-size:2.2vh;
            // font-family:DINAlternate-Bold;
            color:#4B9798;
            line-height:3.24vh;
          }
          .standard{
            color: #4092C8;
          }
          .warn{
            color: #A6663B;
          }
        }
      }
    }
    .face-content{
      width: 100%;
      height: 30.46vh;
      overflow: auto;
      margin-top: 0.55vh;
      &::-webkit-scrollbar { width: 0 !important }
      .warn{
        background:rgba(95,26,26,0.56);
        border:1px solid rgba(189,54,54,0.56);
      }
      .item{
        display: flex;
        height: 8.05vh;
        margin-bottom: 0.37vh;
        align-items: center;
        cursor: pointer;
        .image{
          margin-left: 5px;
          position: relative;
          .logo{
            position: absolute;
            top: 0;
            left: 0;
            div:first-child{
              width: 21px;
              height: 1.66vh;
              float: left;
              background-color: red;
              font-size: 1.11vh;
              line-height: 1.66vh;
              text-align: center;
              color: #FFFFFF;
            }
            div + div{
              float: left;
              border-top: 1.66vh solid red;
              border-right: 0.46vh solid transparent;
            }
          }
          img, .image-alt{
            width: 7vh;
            height: 7vh;
            float: left;
            background-size: contain;
          }
          .image-alt{
            background-color: white;
          }
        }
        .content{
          margin-left: 12px;
          .name{
            display: flex;
            align-items: center;
            margin-bottom: 0.55vh;
            span{
              max-width: 100px;
              display: inline-block;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              font-size:1.66vh;
              // font-family:AlibabaPuHuiTiR;
              color:rgba(226,233,238,1);
              line-height:2.31vh;
            }
            div{
              display: inline-block;
              width: 2.03vh;
              height: 2.03vh;
              text-align: center;
              margin-left: 7px;
              border-radius: 50%;
              font-size:1.01vh;
              border:1px solid rgba(82,112,170,1);
              // font-family:AlibabaPuHuiTiR;
              color:rgba(226,233,238,1);
              line-height:2.03vh;
            }
          }
          .community{
            width: 160px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            font-size:1.2vh;
            // font-family:AlibabaPuHuiTiR;
            color:rgba(155,162,171,1);
            line-height:1.85vh;
            letter-spacing: 2px;
            margin-bottom: 2px;
            &::before{
              content: '';
              display: inline-block;
              width: 1.2vh;
              height: 1.296vh;
              background: url('../../../../../assets/views-center/house-view/location.png');
              background-size: 100% 100%;
              margin-right: 0.26vw;
            }
          }
          .time{
            font-size:1.2vh;
            // font-family:AlibabaPuHuiTiR;
            color:rgba(155,162,171,1);
            line-height:1.85vh;
            letter-spacing: 2px;
            &::before{
              content: '';
              display: inline-block;
              width: 1.01vh;
              height: 1.01vh;
              background: url('../../../../../assets/views-center/house-view/time.png');
              background-size: 100% 100%;
              margin-right: 0.26vw;
            }
          }
        }
      }
    }
  }
}
</style>
