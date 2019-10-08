<template>
  <div class="photos-dialog" v-if="states" @click="dialogClick">
    <div class="photos">
      <div class="title">抓拍详情</div>
      <img src="@/assets/data-views/dialog-close.png" class="dialog-close" @click="close">
      <div class="info">
        <div>
          <span>抓拍地点:</span>
          <span>{{data.address}}</span>
        </div>
        <div>
          <span>抓拍时间:</span>
          <span>{{data.collectTime}}</span>
        </div>
      </div>
      <div class="photos-content">
        <div class="user-info">
          <div>
            <div class="image">
              <img v-if="data.snapImgPath" :src="data.snapImgPath" alt="" class="image">
              <no-image v-else></no-image>
            </div>
            <div class="like">相似度 {{(data.similarity * 100).toString().slice(0, 5)}}%</div>
            <div class="image">
              <img v-if="data.personId" :src="`/api/person/personInfos/${data.personId}/img`" alt="" class="image">
              <no-image v-else></no-image>
            </div>
            <div class="name">{{data.personName}}
              <span class="logo" v-for="item of data.logo" :key="item.id" :style="{ backgroundColor: item.color }">{{item.shortName}}</span>
            </div>
            <div class="id-no">{{data.identityNo}}</div>
          </div>
        </div>
        <div class="video-or-photo">
          <video-player v-if="isVideo" class="vjs-custom-skin" ref="videoPlayer" :options="playerOptions" v-loading="isWaiting == 1" element-loading-background="rgba(0, 0, 0)" element-loading-text="视频正在请求中，请稍后..." />
          <div class="image" v-else>
            <croppa
              v-model="croppa"
              v-if="data.bgImgPath"
              :placeholder="'暂无图片'"
              :initial-image="data.bgImgPath"
              accept=".jpeg, .jpg, .png, .bmp"
              :width="635"
              :height="377"
              :quality="2"
              :zoom-speed="10"
              :disabled="false"
              :show-remove-button="false"
              initial-size="contain"
            >
              <div class="btn-group">
                <div class="icon-wrap" @click="setFullScreen">
                  <svg-icon class-name='zoom-icon' style="color:white;" icon-class="full-screen" />
                </div>
                <div class="icon-wrap" @click="_onChangeZoom(0)">
                  <svg-icon class-name='zoom-icon' icon-class="zoomUp" />
                </div>
                <div class="icon-wrap" @click="_onChangeZoom(1)">
                  <svg-icon class-name='zoom-icon' icon-class="zoomDown" />
                </div>
              </div>
            </croppa>
            <!-- <img v-if="data.bgImgPath" :src="data.bgImgPath" class="image"/> -->
            <no-image v-else></no-image>
          </div>
          
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
      playerOptions: {
        autoplay: true, // 自动播放
        controls: true, // 是否显示控制栏
        sourceOrder: true, // 
        sources: [
          {
            withCredentials: false,
            type: 'application/x-mpegURL',
            src: ''
          }],
        height: 377,
        notSupportedMessage: '此视频暂无法播放，请稍后再试',
        controlBar: { // 配置控制栏
          timeDivider: false, // 时间分割线
          durationDisplay: false, // 总时间
          progressControl: true, // 进度条
          customControlSpacer: true, // 未知
          fullscreenToggle: true // 全屏
        },
      },
      states: false,
      isWaiting: 0,
      data: {},
      isVideo: false,
      croppa: {}
    }
  },
  props: {
    chanListData: [Array],
  },
  methods: {
    open(data, chanListData) {
      let obj = chanListData.find(item => data.deviceCode === item.deviceCode)
      this.states = true
      this.data = data
      if (obj) {
        this.isVideo = true
        this.onReqVideo()
      } else {
        this.isVideo = false
      }
    },
    async onReqVideo() {
      this.isWaiting = 1;
      await this.init(false);
    },
    waitRequest() {
      setTimeout(()=> {
        this.init(true);
      }, 3000)
    },
    init(val) {
      getReqVideo(this.data.refObjId).then(res => {
        if (res.data.ret === -1) {
          this.$notify({
            title: "提示",
            dangerouslyUseHTMLString: true,
            message: '视频请求失败，请联系管理员',
            type: "error",
            duration: 5000
          });
          this.isWaiting = 0
        }else if(res.data.ret === 0 && res.data.url) {
          this.isWaiting = 1;
          // this.$emit('complete',true);
          this.waitRequest()
        }else if(res.data.ret === 1) {
          getPlayVideo(this.data.refObjId).then(res => {
            if (res.data.ret === 0 && res.data.url) {
              this.$set(this.data,"videoUrl",res.data.url);
              this.playerOptions.sources[0].src=this.data.videoUrl;
              this.isWaiting = 2;
            }
          })
        }
      })
    },
    close() {
      this.states = false
      if (this.isVideo) {
        this.$refs.videoPlayer.player && this.$refs.videoPlayer.player.pause();
        this.playerOptions.sources[0].src=null;
      }
    },
    dialogClick(e) {
      if (e.target.className == 'photos-dialog') {
        this.states = false
      }
    },
    _onChangeZoom(flag) {
      if (flag === 0) {
        this.croppa.scaleRatio += 0.1;
      } else {
        this.croppa.scaleRatio -= 0.1;
      }
    },
    setFullScreen() {
      let fullscreen = document.getElementById('full-screen-image')
      fullscreen.style.display = "block"
      fullscreen.style.backgroundImage = `url(${data.bgImgPath})`
    }
  },
}
</script>
<style lang="scss" scoped>
@import "~@/styles/modules/video-js.css";
.photos-dialog{
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  .photos{
    width: 935px;
    height: 520px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: url('../../../../../assets/data-views/photo-bg.png');
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
      top: 25px;
      right: 30px;
      cursor: pointer;
    }
    .info{
      position: absolute;
      top: 60px;
      left: 50px;
      color: white;
      div{
        display: inline-block;
        margin-right: 59px;
      }
      span:nth-child(2n + 1) {
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
    .photos-content{
      display: flex;
      position: absolute;
      top: 88px;
      left: 50px;
      width: 835px;
      height: 400px;
      border:1px solid rgba(14,79,141,0.35);
      .user-info{
        width: 175px;
        height: 100%;
        border-right: 1px solid rgba(14,79,141,0.35);
        display: flex;
        justify-content: center;
        align-items: center;
        .image{
          width: 144px;
          height: 138px;
        }
        .like{
          width:101px;
          height:20px;
          margin: 12px auto;
          background:rgba(184,55,55,1);
          border-radius:2px;
          text-align: center;
          font-size:13px;
          // font-family:AlibabaPuHuiTiM;
          color:rgba(255,255,255,1);
          line-height:20px;
        }
        .name{
          margin-top: 12px;
          font-size:13px;
          // font-family:AlibabaPuHuiTiR;
          color:rgba(255,255,255,1);
          line-height:20px;
          max-width: 144px;
        }
        .logo{
          width:18px;
          height:18px;
          display: inline-block;
          border-radius: 50%;
          text-align: center;
          background:rgba(22,78,171,1);
          border:1px solid rgba(82,112,170,1);
          font-size:9px;
          // font-family:AlibabaPuHuiTiR;
          color:rgba(226,233,238,1);
          line-height: 18px;
        }
        .id-no{
          font-size:13px;
          // font-family:AlibabaPuHuiTiR;
          color:rgba(255,255,255,1);
          line-height:18px;
        }
      }
      .video-or-photo{
        width: 635px;
        height: 377px;
        margin: 11px auto;
        overflow: hidden;
        position: relative;
        .image{
          width: 100%;
          height: 100%;
        }
        .croppa-container {
          position: relative;
          .btn-group {
            position: absolute;
            right: 14px;
            bottom: 14px;
            .icon-wrap {
              width: 55px;
              height: 30px;
              background-color: rgba(0, 0, 0, .46);
              border-radius: 4px;
              margin-top: 8px;
              text-align: center;
              line-height: 30px;
              cursor: pointer;
              .zoom-icon {
                display: inline-block;
                width: 20px;
                height: 26px;
                vertical-align: middle;
              }
            }
          }
        }
      }
    }
  }
  .full-screen-img{
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: black;
    img{
      max-width: 100%;
    }
  }
}
</style>