<template>
  <el-dialog :title="type==0?deviceName+' 实时视频':'抓拍视频 '" :visible.sync="isVideoDialog" width="800px" append-to-body :before-close="onClose" >
    <div class="info" v-if="videoData && type===1">
      <span>{{videoData.personName || videoData.name}}</span>
      <span>{{videoData.identityNo}}</span>
      <span>抓拍时间：{{videoData.collectTime||videoData.imgTime}}</span>
    </div>
    <!-- <video id="myvideo" :src="videoUrl" controls :poster="videoImg" autoplay width="100%" height="430px" v-if="videoData && type===1">
      your browser does not support the video tag
    </video> -->
    <!-- 抓拍视频 -->
    <video-player class="vjs-custom-skin" ref="videoPlayer" :options="playerOptions" v-loading="watting == 1" element-loading-background="rgba(0, 0, 0)" element-loading-text="视频正在请求中，请稍后..."  v-if="type===1"/>

    <!-- 实时视频 -->
    <canvas ref="canvas" width='760px' height="400px" v-if="type===0" />
    <div slot="footer">
      <el-button type="primary" size="mini" @click="onClose()">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { videoPlayer } from 'vue-video-player';
import 'videojs-contrib-hls';
import { getVideoConfig } from "@/api/video";


export default {
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    type: {
      type: Number, //弹窗类型，0为实时视频，1为抓拍视频
      default: 0
    },
    watting:null,
    deviceName: null,
    videoData: { type: Object, default: null },
    isAppend: { type: Boolean, default: false },
    chanDpid: null,
  },
  data() {
    return {
      isVideoDialog: false,
      videoImg: '',
      videoUrl: '',
      // "",
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
        height: 428,
        notSupportedMessage: '此视频暂无法播放，请稍后再试',
        controlBar: { // 配置控制栏
          timeDivider: false, // 时间分割线
          durationDisplay: false, // 总时间
          progressControl: true, // 进度条
          customControlSpacer: true, // 未知
          fullscreenToggle: true // 全屏
        },
      },
      chanId: null,
      test: null,
    };
  },
  watch: {
    isOpen(val) {
      this.isVideoDialog = val;
    },
    isVideoDialog(val) {
      if (val) {
        if (this.type === 1) {
          this.videoData && this.playVideo();
        } else {
          this.playOnlineVideo();
        }
      }
      this.$emit("update:isOpen", val);
    },
  },
  methods: {
    // 抓拍视频播放
    playVideo() {
      this.playerOptions.sources[0].src=this.videoData.videoUrl;
    },
    

    // 实时视频播放
    playOnlineVideo() {
      this.$nextTick(() => {
        getVideoConfig().then(res => {
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
    onClose() {
      this.isVideoDialog = false;
      if (this.type === 1) {
        this.$refs.videoPlayer.player && this.$refs.videoPlayer.player.pause();
        this.playerOptions.sources[0].src=null;
      } else {
        this.test.stop();
        this.test = null;
      }
    }
  },
};
</script>
<style lang="scss" scoped>
@import "~@/styles/modules/video-js.css";
</style>
<style lang="scss" scoped>
.info {
  span {
    display: inline-block;
    font-size: 15px;
    margin: 0 5px 5px 0;
  }
  span:last-child {
    float: right;
    margin-left: 0;
  }
}
canvas {
  width: 100%;
  height: 100%;
}
</style>
