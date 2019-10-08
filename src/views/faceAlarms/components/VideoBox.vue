<template>
  <video-player class="vjs-custom-skin" ref="videoPlayer" :options="playerOptions" />
</template>

<script>
import { videoPlayer } from 'vue-video-player';
import 'videojs-contrib-hls'


export default {
  props: {
    videoUrl: { type: String, default: null },
  },
  data() {
    return {
      isVideoDialog: false,
      playerOptions: {
        autoplay: true, // 自动播放
        controls: true, // 是否显示控制栏
        preload: 'auto',
        loop: false, //导致视频一结束就重新开始。
        sources: [
          {
            withCredentials: false,
            type: 'application/x-mpegURL',
            src: '',
          },
          ],
        width: document.documentElement.clientWidth,
        height: 312,
        notSupportedMessage: '此视频暂无法播放，请稍后再试',
        controlBar: { // 配置控制栏
          timeDivider: false, // 时间分割线
          durationDisplay: false, // 总时间
          progressControl: true, // 进度条
          customControlSpacer: true, // 未知
          fullscreenToggle: true // 全屏
        },
      },
    };
  },
  watch: {
    videoUrl: {
      handler(val) {
        val && this.playVideo();
      },
      immediate: true
    }
  },
  methods: {
    playVideo() {
      this.playerOptions.sources[0].src = this.videoUrl;
    },
    onClose() {
      this.$refs.videoPlayer.player && this.$refs.videoPlayer.player.pause();
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
</style>
