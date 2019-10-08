<template>
  <div class="display" :class="{margin:mode==1}">
    <!-- <el-button size="mini" type="primary" ref="Waiting" v-if="videoData.isReqVideo && videoData.shiLianCloudPlayFlag === undefined && isWaiting === 0" @click="onReqVideo">请求视频</el-button>
    <el-button size="mini" type="primary" ref="Waiting" v-else-if="videoData.shiLianCloudPlayFlag === 0" @click="onReqVideo">请求视频</el-button>
    <el-button size="mini" type="info" disabled v-else-if="isWaiting === 1">请求中...</el-button> -->
    <el-button size="mini" type="primary" v-if="videoData.isReqVideo || videoData.shiLianCloudPlayFlag === 1"  @click="onReqVideo">播放视频</el-button>
    <!-- 视频弹窗 -->
    <video-play :is-open.sync="isVideoDialog" ref="videoPlay" :videoData="videoData" :type="1" :watting="isWaiting" />
  </div>
</template>
<script>
import { getReqVideo, getPlayVideo } from "@/api/video";

export default {
  props:{
    videoData:null,
    row:{
      type:Object,
      default:null
    },
    page: null,
    mode:0
  },
  data() {
    return {
      isVideoDialog: false,
      isWaiting: 0, //0：初始化请求视频 1：请求中视频 2：该页面请求后  播放视频
      ischange: null
    }
  },
  watch: {
    page: function() {
      if(this.ischange != this.page) {
        this.isWaiting = 0
      }
    }
  },
  created() {
    this.ischange = this.page;
  },
  methods: {
    async onReqVideo() {
        this.isVideoDialog = true;
        this.isWaiting = 1;
        await this.init(false);
        if(this.isWaiting !== 2) {
          await this.waitRequest();
        }
      },
      
      waitRequest() {
        setTimeout(()=> {
          this.init(true);
        }, 3000)
      },

      init(val) {
        // this.$emit('complete',true);
        getReqVideo(this.videoData.refObjId).then(res => {
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
            if(val) {
              this.isWaiting = 0;
            }
          }else if(res.data.ret === 1) {
            getPlayVideo(this.videoData.refObjId).then(res => {
              if (res.data.ret === 0 && res.data.url) {
                this.$set(this.videoData,"videoUrl",res.data.url);
                this.$refs.videoPlay.playVideo();
                this.isWaiting = 2;
              }
            })
            // this.$emit('complete',false);
          }
        })
      },
      //提示框
      onmessage(mes, mesType) {
        this.$notify({
          title:"提示",
          dangerouslyUseHTMLString: true,
          message: mes,
          type: mesType,
          duration:5000
        })
      }
  },
}
</script>

<style lang="scss" scoped>
.display{
  display: inline-block;
}
.margin{
  margin-left: 15px
}
</style>
