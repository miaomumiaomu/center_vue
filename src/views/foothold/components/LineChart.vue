<template>
  <div :class="className" :style="{height: height, width: width}"></div>
</template>

<script>
import moment from "moment";
require("echarts/theme/macarons"); // echarts theme
import { debounce } from "@/utils";

export default {
  props: {
    className: {
      type: String,
      default: "chart"
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "100%"
    },
    data: [Array, Object]
  },
  data() {
    return {
      chart: null,
      lineData: null,
      colorData: {
        color: "#3267F4",
        linearGradient: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0.6, color: "#3267F4" },
          { offset: 0.6, color: "#3267F4" }
        ])
      }
    };
  },
  watch: {
    data: {
      handler(val) {
        if (val) {
          this.lineData = JSON.parse(JSON.stringify(val));
          this.$nextTick(() => {
            this.initChart();
          });
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.__resizeHanlder = debounce(() => {
      if (this.chart) {
        this.chart.resize();
      }
    }, 100);
    window.addEventListener("resize", this.__resizeHanlder);
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    window.removeEventListener("resize", this.__resizeHanlder);
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      let option = {
        tooltip: {
          trigger: "axis"
        },
        grid: {
          top: "24px",
          right: "5%",
          bottom: "1%",
          left: "1%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          // boundaryGap: false,
          data: this.lineData.time
        },
        yAxis: {
          type: "value",
          // axisLine: {
          //   lineStyle: {
          //     color: "rgba(255,255,255,0.2)"
          //   }
          // },
          // splitLine: {
          //   lineStyle: {
          //     color: "rgba(255,255,255,0.2)"
          //   }
          // }
        },
        series: {
          name: this.lineData.name,
          type: "line",
          itemStyle: { color: this.colorData.color },
          areaStyle: {
            color: this.colorData.linearGradient
          },
          smooth: true,
          data: this.lineData.data
        }
      };

      this.chart = echarts.init(this.$el);
      this.chart.setOption(option);
    }
  }
};
</script>
