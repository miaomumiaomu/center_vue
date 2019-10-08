<template slot-scope="scope">
  <div>
    <div v-if="mode===0">
      <el-button type="text" @click="isVideoDialog = true" v-if="onLine">
        <svg-icon icon-class="camera"></svg-icon>
        {{deviceName}}
      </el-button>
      <span v-else>{{deviceName}}</span>
    </div>
    <label class="color" style="margin-left:10px" v-if="mode===2 && onLine">
        <svg-icon icon-class="camera"></svg-icon>
      <a @click="isVideoDialog = true">实时视频</a>
    </label>
    <div v-if="mode==1">
      <label class="color" style="" v-if="onLine">
        <svg-icon icon-class="camera"></svg-icon>
        <a @click="isVideoDialog = true">{{deviceName}}</a>
      </label>
      <label v-else>{{deviceName}}</label>
    </div>

    <!-- 视频弹窗 -->
    <video-play :is-open.sync="isVideoDialog" :type='0' :deviceName="deviceName" :chanDpid="chanDpid" />
  </div>

</template>

<script>
import { getCheckOnline, getReqVideo, } from "@/api/video";

export default {
  props: {
    deviceCode: {
      type: [String, Number],
      default: null
    },
    deviceName: null,
    onLine: Boolean,
    mode: 0,
    chanDpid: String,
  },
  data() {
    return {
      // 实时视频
      // videoData: null,
      isVideoDialog: false,
      // videoDialogType: null, //0为实时视频，1为抓拍视频，
      state: null,
    }
  },
  methods: {
    // 实时视频
    onVideo() {
      this.isVideoDialog = true;
    }
  },
}
</script>
<style lang="scss" scoped>
.color {
  color: #409eff;
  display: inline-block;
  width: 70px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.el-button {
  white-space: inherit;
}
</style>
