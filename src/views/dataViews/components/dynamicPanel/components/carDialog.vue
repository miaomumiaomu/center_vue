<template>
  <div class="car-photos-dialog" v-if="states" @click="dialogClick">
    <div class="photos">
      <div class="title">抓拍详情</div>
      <img src="@/assets/data-views/dialog-close.png" class="dialog-close" @click="close">
      <div class="info">
        <div>
          <span>抓拍车辆:</span>
          <span>{{data.plateNumber}}</span>
        </div>
        <div>
          <span>抓拍地点:</span>
          <span>{{data.communityName}}-{{data.deviceName}}</span>
        </div>
        <div>
          <span>抓拍时间:</span>
          <span>{{data.createTime}}</span>
        </div>
      </div>
      <div class="car-content">
        <div class="video-or-photo">
          <img v-if="data.backgroundImage" :src="data.backgroundImage" class="image"/>
          <no-image v-else></no-image>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { videoPlayer } from 'vue-video-player';
import 'videojs-contrib-hls';
import { getVideoConfig, getReqVideo, getPlayVideo } from "@/api/video";

export default {
  data() {
    return {
      states: false,
      data: {},
    }
  },
  methods: {
    open(data) {
      this.data = data
      this.states = true
    },
    close() {
      this.states = false
    },
    dialogClick(e) {
      if (e.target.className == 'car-photos-dialog') {
        this.states = false
      }
    }
  },
}
</script>
<style lang="scss" scoped>
@import "~@/styles/modules/video-js.css";
.car-photos-dialog{
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  .photos{
    width: 760px;
    height: 520px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: url('../../../../../assets/data-views/car-photo-bg.png');
    background-size: cover;
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
    .dialog-close{
      position: absolute;
      top: 30px;
      right: 42px;
      cursor: pointer;
    }
    .info{
      width: 660px;
      position: absolute;
      top: 60px;
      left: 50px;
      color: white;
      display: flex;
      justify-content: space-between;
      span {
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
      left: 50px;
      width: 660px;
      height: 400px;
      border:1px solid rgba(14,79,141,0.35);
      .video-or-photo{
        width: 638px;
        height: 377px;
        margin: 11px auto;
        .image{
          max-width: 638px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
        }
      }
    }
  }
}
</style>