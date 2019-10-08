<template>
  <div class="app-container">
    <map-area ref="mapArea" :mode.sync="mode" :center="center" :communityData="communityData" @updateCommunityCode="handleUpdateCode" @setAreaTreeName="handleSetTreeName" :isScale="bottomScale" />
    <div class="abs bg"></div>
    <div class="header">
      <div class="left-sec">
        <img src="@/assets/views-center/locale2.png" alt="locale">
        <area-tree ref="areaTree" @change="handleAreaSelect" @enterCommunity="handleEnterCommunity" />
      </div>
      <h1 ref="header">综合大数据视窗</h1>
      <div class="right-sec">
        <span>{{time}}</span>
        <img src="@/assets/views-center/full-screen.png" alt="fullScreen" @click="requestFullScreen" @dblclick="quitFullScreen">
      </div>
    </div>
    <total-panel :policeAreaCode="policeAreaCode" :communityCode="communityCode" />
    <div class="shadow-sec top-shadow"></div>
    <div :hidden="rightScale && bottomScale" class="shadow-sec left-shadow"></div>
    <button v-if="mode === 2" class="back-btn" @click="handleBack">退出社区</button>
    <dynamic-panel :class="`dynamic${rightScale ? ' right-hide' : ''}`" :policeAreaCode="policeAreaCode" :communityCode="communityCode" @changeScaleState="toggleRightScale" />
    <div class="statistics-part">
      <div :class="`statistics-scale-btn ${bottomScale ? 'telescopic-up' : 'telescopic-down'}`" @click="toggleBottmScale">
        <i :class="`el-icon-arrow-${bottomScale ? 'up' : 'down'}`"></i>
      </div>
      <statistics-panel :class="`statistics${bottomScale ? ' bottom-hide' : ''}`" :policeAreaCode="policeAreaCode" :communityCode="communityCode" :isScale="bottomScale" />
    </div>
    <footer ref="footer">
      <img src="@/assets/views-center/bottom-board.png" alt="logo">
    </footer>
    <div id="full-screen-image" @click="imageClose">
      <img src="@/assets/data-views/dialog-close.png" class="image-close">
    </div>
    <div class="full-screen"  @click="canvasClose">
      <canvas id="full-screen-canvas"></canvas>
      <img src="@/assets/data-views/dialog-close.png" class="image-close">
    </div>
    
  </div>
</template>

<script>
import { debounce, createMap, formatDateTime } from "@/utils";
import { getCommunityByCode } from "@/api/dataViews/policeArea";

export default {
  name: "dataViews",
  components: {
    AreaTree: () => import("./components/AreaTree/"),
    MapArea: () => import("./components/mapArea/"),
    TotalPanel: () => import("./components/totalPanel/"),
    StatisticsPanel: () => import("./components/statisticsPanel/"),
    DynamicPanel: () => import("./components/dynamicPanel/")
  },
  data() {
    return {
      policeAreaCode: '',
      communityCode: '',
      time: '',
      center: null,
      mode: 1,
      communityData: [],
      rightScale: false,
      bottomScale: false
    };
  },
  mounted() {
    document.title = '综合视窗 - AiTensor';
    document.body.style.overflow = 'hidden';
    // 定时器
    this.timer = window.setInterval(() => {
      let now = new Date();
      this.time = formatDateTime(now);
    });
    // 处理窗口自适应
    window.addEventListener("resize", this.resizeHanlder);
    this.resizeHanlder();
  },
  beforeDestroy() {
    window.clearInterval(this.timer);
    window.removeEventListener("resize", this.resizeHanlder);
  },
  methods: {
    resizeHanlder() {
      debounce(() => {
        this.handleFrameZoom();
      }, 100)
    },
    handleFrameZoom() {
      let _zoom = this.$el.clientWidth / 1920;
      this.$refs.header.style.transform = `scale(${_zoom})`;
    },
    handleAreaSelect(obj) {
      const { code, lat, lng } = obj;
      this.policeAreaCode = code;
      this.mode = 1;
      this.center = { lat, lng };
      getCommunityByCode({ policeAreaCode: code }).then(res => {
        const { status, data = [] } = res;
        if (status === 200) {
          this.communityData = data;
        }
      });
    },
    // 返回上层
    handleBack() {
      this.mode = 1;
      this.communityCode = '';
      this.$refs.areaTree.resetAreaTreeName()
    },
    handleUpdateCode(code) {
      this.communityCode = code;
    },
    handleSetTreeName(name) {
      this.$refs.areaTree.setAreaTreeName(name)
    },
    handleEnterCommunity(obj) {
      this.handleBack()
      setTimeout(() => {
        this.$refs.mapArea.onCommunityShow(obj)
      }, 500)
    },
    toggleRightScale(state) {
      this.rightScale = state;
    },
    toggleBottmScale() {
      this.bottomScale = !this.bottomScale;
    },
    requestFullScreen() {
      const element = document.getElementsByClassName('app-container')[0];
      const requestMethod = element.requestFullScreen
        || element.webkitRequestFullScreen
        || element.mozRequestFullScreen
        || element.msRequestFullScreen;
      if (requestMethod) {
        requestMethod.call(element);
      } else if (typeof window.ActiveXObject !== "undefined") {
        const wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
          wscript.SendKeys("{F11}");
        }
      }
    },
    quitFullScreen() {
      const cfs = document.cancelFullScreen || document.webkitCancelFullScreen || document.mozCancelFullScreen || document.exitFullScreen;
      if (typeof cfs != "undefined" && cfs) {
        cfs.call(document);
        return;
      }
      if (typeof window.ActiveXObject != "undefined") {
        const wscript = new ActiveXObject("WScript.Shell");
        if (wscript != null) {
          wscript.SendKeys("{F11}");
        }
      }
    },
    //抓拍图片全屏关闭
    imageClose() {
      document.getElementById('full-screen-image').style.display = 'none';
    },
    canvasClose() {
      document.getElementsByClassName('full-screen')[0].style.display = 'none';
    },

  }
};
</script>

<style lang="scss" scoped>
  .app-container {
    height: 100%;
    background-color: #050A0F;
    position: relative;
    .abs {
      height: 100vh;
      position: absolute;
      top: 0;
      left: 0;
    }
    .bg {
      width: calc(100vw - 20px);
      background-image: url("~@/assets/views-center/bg2.png");
      background-size: 100% 95%;
      background-position: 50% 65%;
      background-repeat: no-repeat;
      margin: 0 10px;
      z-index: 700;
      pointer-events: none;
    }
    .header {
      position: relative;
      overflow: hidden;
      text-align: center;
      background-color: #050A0F;
      z-index: 668;
      .left-sec {
        position: absolute;
        top: 1.56vh;
        left: 0;
        padding-left: 20px;
        img {
          width: 2vh;
          position: relative;
          top: -1px;
          vertical-align: middle;
        }
      }
      h1 {
        display: inline-block;
        width: 20vw;
        height: 6.36vh;
        line-height: 6.36vh;
        margin: 0;
        text-align: center;
        color: #C5C8DC;
        font-size: 3vh;
        background-image: url("~@/assets/views-center/title-board.png");
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-position: center center;
      }
      .right-sec {
        position: absolute;
        top: 1.5vh;
        right: 0;
        color: rgba(255, 255, 255, .58);
        padding-right: 20px;
        span {
          font-size: 1.69vh;
          vertical-align: middle;
        }
        img {
          height: 2.3vh;
          margin-left: 4.24vh;
          vertical-align: middle;
          cursor: pointer;
        }
      }
    }
    .shadow-sec {
      position: absolute;
      top: 0;
      background-color: #050A0F;
      box-shadow: 0 0 8.32vw 3.64vw #050A0F;
      z-index: 666;
    }
    .top-shadow {
      width: calc(100vw - 20px);
      height: 20px;
      left: 20px;
    }
    .left-shadow {
      width: 20px;
      height: 100vh;
      left: 0;
    }
    .back-btn {
      width: 75px;
      height: 30px;
      position: absolute;
      top: 7.3vh;
      right: 418px;
      font-size: 14px;
      background-color: rgba(44, 95, 198, .3);
      color: #E2E9EE;
      border: 1px solid #0465C1;
      cursor: pointer;
      z-index: 666;
    }
    .dynamic {
      width: 340px;
      height: 91.5vh;
      position: absolute;
      top: 5vh;
      right: 20px;
      background-color: rgba(21, 28, 39, .85);
      z-index: 668;
      transition: all 0.8s;
    }
    .right-hide {
      width: 0;
    }
    .statistics-part {
      width: calc(100% - 390px);
      height: 464px;
      position: absolute;
      bottom: 3.5vh;
      left: 18px;
      overflow: hidden;
    }
    .statistics-scale-btn {
      width: 29px;
      height: 26px;
      position: absolute;
      left: 0;
      line-height: 26px;
      background-color: #131E2A;
      border-radius: 2px;
      text-align: center;
      z-index: 666;
      transition: all 0.8s;
      cursor: pointer;
      i {
        color: #fff;
        font-size: 15px;
      }
    }
    .telescopic-up {
      bottom: 3.8vh;
    }
    .telescopic-down {
      bottom: 235px;
    }
    .statistics {
      width: 100%;
      height: 234px;
      position: absolute;
      bottom: 0;
      left: 0;
      background-color: rgba(21, 28, 39, .85);
      z-index: 666;
      transition: all 0.8s;
    }
    .bottom-hide {
      bottom: -234px;
    }
    footer {
      width: 100%;
      position: absolute;
      bottom: 1.484vh;
      left: 0;
      text-align: center;
      z-index: 999;
      img {
        width: 15.8vw;
        height: 5.3vh;
        position: relative;
        left: .26vw;
      }
    }
    #full-screen-image{
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: rgba($color: #000000, $alpha: 0.8);
      display: none;
      z-index: 1000;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center center;
    }
    .full-screen{
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      display: none;
      z-index: 1000;
      #full-screen-canvas{
        width: 100vw;
        height: 100vh;
      }
    }
    .image-close{
      position: absolute;
      top: 20px;
      right: 20px;
      cursor: pointer;
    }
  }
</style>
