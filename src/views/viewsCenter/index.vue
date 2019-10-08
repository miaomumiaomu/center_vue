<template>
  <div class="app-container">
    <h1 ref="header">数据中心</h1>
    <div class="content">
      <div class="area-select">
        <img src="@/assets/views-center/locale.png" alt="locale" />
        <span>区域</span>
        <area-tree @change="handleAreaSelect" />
      </div>
      <el-tabs v-model="activeName" type="card" @tab-click="handleTabclick">
        <el-tab-pane label="人口统计" name="population">
          <population-view :areaType="areaType" :areaCode="areaCode" v-if="flag === 'population'" />
        </el-tab-pane>
        <el-tab-pane label="房屋统计" name="house">
          <house-view :areaType="areaType" :areaCode="areaCode" v-if="flag === 'house'" />
        </el-tab-pane>
        <el-tab-pane label="出租屋统计" name="rental">
          <rental-view :areaType="areaType" :areaCode="areaCode" v-if="flag === 'rental'" />
        </el-tab-pane>
        <el-tab-pane label="单位统计" name="unit">
          <unit-view :areaType="areaType" :areaCode="areaCode" v-if="flag === 'unit'" />
        </el-tab-pane>
        <el-tab-pane label="车辆统计" name="car">
          <car-view :areaType="areaType" :areaCode="areaCode" v-if="flag === 'car'" />
        </el-tab-pane>
        <!-- <el-tab-pane label="设备统计" name="device">
          <device-view :areaType="areaType" :areaCode="areaCode" v-if="flag === 'device'" />
        </el-tab-pane> -->
        <el-tab-pane label="前科重点人员" name="focused">
          <focused-view :areaType="areaType" :areaCode="areaCode" v-if="flag === 'focused'" />
        </el-tab-pane>
        <el-tab-pane label="访客统计" name="visitor">
          <visitor-view :areaType="areaType" :areaCode="areaCode" v-if="flag === 'visitor'" />
        </el-tab-pane>
      </el-tabs>
    </div>
    <footer ref="footer">
      <img src="@/assets/views-center/logo.png" alt="logo" />
    </footer>
  </div>
</template>

<script>
import { debounce } from "@/utils";
export default {
  name: "viewsCenter",
  components: {
    AreaTree: () => import("./components/AreaTree/"),
    PopulationView: () => import("./components/populationView/"),
    HouseView: () => import("./components/houseView/"),
    RentalView: () => import('./components/rentalView/'),
    UnitView: () => import("./components/unitView/"),
    CarView: () => import("./components/carView/"),
    DeviceView: () => import("./components/deviceView/"),
    FocusedView: () => import("./components/focusedView/"),
    VisitorView: () => import("./components/visitorView/")
  },
  data() {
    return {
      activeName: "population",
      areaType: "1",
      areaCode: "",
      flag: "population"
    };
  },
  mounted() {
    document.title = '数据中心 - AiTensor'
    this.resizeHanlder = debounce(() => {
      this.handleFrameZoom();
    }, 100);
    window.addEventListener("resize", this.resizeHanlder);
    this.resizeHanlder();
  },
  methods: {
    handleFrameZoom() {
      let _zoom = this.$el.clientWidth / 1920;
      this.$refs.header.style.transform = `scale(${_zoom})`;
      this.$refs.footer.style.transform = `scale(${_zoom})`;
    },
    handleAreaSelect(val) {
      const [type = 1, code = ""] = val.split(",");
      this.areaType = type;
      this.areaCode = code;
    },
    handleTabclick(val) {
      this.flag = val.name;
    }
  }
};
</script>

<style lang="scss" scoped>
.app-container {
  height: 100%;
  background-color: #09090c;
  background-image: url("~@/assets/views-center/bg.png");
  background-size: 100% 100%;
  background-position: center center;
  background-repeat: no-repeat;
  h1 {
    margin: 0;
    text-align: center;
    color: #c5c8dc;
    font-size: 3.18vh;
    padding-top: 1.06vh;
  }
  .content {
    position: relative;
    padding: 4.24vh 2.86vw;
    .area-select {
      position: absolute;
      right: 2.86vw;
      top: 4.24vh;
      z-index: 666;
      > img {
        width: 1.144vw;
        vertical-align: middle;
      }
      > span {
        font-size: 0.832vw;
        color: #68859e;
        vertical-align: middle;
        margin-right: 4px;
      }
    }
  }
  footer {
    width: 100%;
    position: absolute;
    bottom: 1.484vh;
    left: 0;
    text-align: center;
    z-index: 999;
    img {
      width: 15.582vh;
    }
  }
  /deep/ {
    .tab-container {
      border-top: 4px solid transparent;
    }
    .el-tabs--card > .el-tabs__header {
      border-bottom: none;
      margin: 0;
      .el-tabs__nav {
        border: none;
      }
      .el-tabs__item {
        width: 6.875vw;
        height: 2.184vw;
        line-height: 2.184vw;
        text-align: center;
        background-color: #052146;
        color: #6b85a6;
        font-size: 0.832vw;
        border-width: 0;
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
      }
      .el-tabs__item::after {
        content: "";
        width: 1.04vw;
        height: 2.09vw;
        position: absolute;
        right: -0.988vw;
        top: 0.104vw;
        background-image: url("~@/assets/views-center/triangle.png");
      }
      .el-tabs__item.is-active {
        background-color: #0245b6;
        color: #fff;
        z-index: 20 !important;
      }
      .el-tabs__item.is-active::after {
        content: "";
        width: 1.04vw;
        height: 2.09vw;
        position: absolute;
        right: -0.988vw;
        top: 0.104vw;
        background-image: url("~@/assets/views-center/triangle-hl.png");
      }
      #tab-house {
        position: relative;
        left: 0.52vw;
        z-index: 15;
      }
      #tab-rental{
        position: relative;
        left: 1.04vw;
        z-index: 14;
      }
      #tab-unit {
        position: relative;
        left: 1.56vw;
        z-index: 14;
      }
      #tab-car {
        position: relative;
        left: 2.08vw;
        z-index: 13;
      }
      #tab-focused {
        position: relative;
        left: 2.6vw;
        z-index: 12;
      }
      #tab-visitor {
        position: relative;
        left: 3.12vw;
        z-index: 11;
      }
      // #tab-visitor { // 因原设备统计暂时注释 后面的#往前推移
      //   position: relative;
      //   left: 3.12vw;
      //   z-index: 10;
      // }
    }
  }
}
</style>
