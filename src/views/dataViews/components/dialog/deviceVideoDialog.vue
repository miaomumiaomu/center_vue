<template>
  <div class="device-video-dialog">
    <div class="photos">
      <div class="title">{{deviceData.communityName}}-{{deviceData.name}}</div>
      <div class="info">
        <div>
          <span>设备地址:</span>
          <span>{{deviceData.fullName}}</span>
        </div>
        <div>
          <span>设备类型:</span>
          <span>{{deviceData.deviceType}}</span>
        </div>
      </div>
      <div class="car-content">
        <div class="video-or-photo">
          <div v-if="isVideo">
            <canvas ref="canvas" class="canvas" width='674' height="377"/>
            <svg-icon class-name='zoom-icon' icon-class="full-screen" @click.native="setFullScreen"/>
            <div v-if="loading" class="loading">
              <i class="el-icon-loading"></i>
            </div>
          </div>
          <div v-else class="image">暂无视频</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getVideoConfig } from "@/api/video";
export default {
  data() {
    return {
      isVideo: false,
      chanDpid: null,
      test: null,
      videoConfig: null,
      chanDpid: null,
      loading: false,
      deviceData: {}
    }
  },
  watch: {
    isOpen(val) {
      if (!val) {
        this.close()
      } else {
        this.open()
      }
    },
  },
  props: {
    chanListData: [Array],
    isOpen: Boolean,
  },
  methods: {
    open(deviceData) {
      this.deviceData = deviceData
      let obj = this.chanListData.find(item => deviceData.code === item.deviceCode)
      if (obj) {
        this.isVideo = true
        this.chanDpid = obj.chanDpid
        this.playOnlineVideo()
      } else {
        this.isVideo = false
      }
    },
    // 实时视频播放
    playOnlineVideo() {
      this.$nextTick(() => {
        this.loading = true
        getVideoConfig().then(res => {
          this.loading = false
          this.videoConfig = res.data
          this.test = SLPlayer({
            canvas: this.$refs.canvas,
            serverIp: res.data.serverIp,
            serverPort: res.data.serverH5Port,
            serverUser: res.data.serverUser,
            serverPasswd: res.data.serverPasswd,
            onStart: () => { console.log('成功') },
            onError: (code, msg) => { console.log('失败代码：' + code + '，' + msg) }
          }).then(res => {
            res.start(this.chanDpid, 2)
          });
        })
      })
    },
    close() {
      if (this.isVideo && this.test) {
        this.test.stop();
        this.test = null;
      }
    },
    setFullScreen() {
      this.close()
      let dialog = document.getElementsByClassName('full-screen')[0]
      let canvas = document.getElementById('full-screen-canvas')
      dialog.style.display = 'block'
      this.test = SLPlayer({
        canvas: canvas,
        serverIp: this.videoConfig.serverIp,
        serverPort: this.videoConfig.serverH5Port,
        serverUser: this.videoConfig.serverUser,
        serverPasswd: this.videoConfig.serverPasswd,
        onStart: () => { console.log('成功') },
        onError: (code, msg) => { console.log('失败代码：' + code + '，' + msg) }
      }).then(res => {
        res.start(this.chanDpid, 2)
      });
    },
  },
}
</script>
<style lang="scss" scoped>
.device-video-dialog{
  .photos{
    width: 760px;
    height: 520px;
    background: url('../../../../assets/data-views/car-photo-bg.png');
    background-size: 105% 120%;
    background-position: 50% 6%;
    .title{
      position: absolute;
      top: 15px;
      left: 50%;
      transform: translateX(-50%);
      font-size:17px;
      // font-family:AlibabaPuHuiTiR;
      color:rgba(255,255,255,1);
      line-height:25px;
    }
    .info{
      width: 660px;
      position: absolute;
      top: 60px;
      left: 32px;
      color: white;
      div{
        display: inline-block;
        margin-right: 59px;
      }
      span{
        font-size:12px;
        // font-family:AlibabaPuHuiTiR;
        color:rgba(107,133,166,1);
        line-height:17px;
      }
      span:nth-child(2n){
        font-size:14px;
        // font-family:AlibabaPuHuiTiR;
        color:rgba(255,255,255,1);
        line-height:20px;
      }
    }
    .car-content{
      display: flex;
      position: absolute;
      top: 88px;
      left: 32px;
      width: 696px;
      height: 400px;
      border:1px solid rgba(14,79,141,0.35);
      .video-or-photo{
        width: 674px;
        height: 377px;
        position: relative;
        margin: 11px auto;
        .zoom-icon{
          position: absolute;
          bottom: 15px;
          right: 15px;
          color: white;
          font-size: 20px;
          cursor: pointer;
        }
        .image{
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
        }
        .canvas{
          width: 100%;
          height: 100%;
        }
        .loading{
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
        }
      }
    }
  }
}
</style>