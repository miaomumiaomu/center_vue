<template>
  <div :class="className" :style="{height: height, width: width}"></div>
</template>

<script>
require("echarts/theme/macarons"); // echarts theme
import { debounce } from "@/utils";

export default {
  props: {
    data: {
      type: [String,Number],
      default: 0
    },
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
    fontColor: {
      type: String,
      default: '#fff'
    },
    backgroundColor: {
      type: String,
      default: '#2A344B'
    }
  },
  data() {
    return {
      chart: null
    };
  },
  watch: {
    data(val) {
      this.initChart();
    }
  },
  mounted() {
    this.initChart();
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
      this.chart = echarts.init(this.$el);

      this.chart.setOption({
        tooltip: {
          show: false
        },
        // 前景色，背景色
        color: ["#cd3c3c", this.backgroundColor],
        series: [
          {
            type: "pie",
            radius: ["55%", "80%"],
            avoidLabelOverlap: false,
            hoverAnimation: false,
            label: {
              normal: {
                show: false,
                position: "center",
                textStyle: {
                  fontSize: 14,
                  fontWeight: "bold",
                  color: this.fontColor
                },
                formatter: "{c}%"
              }
            },
            data: [
              {
                value: this.data,
                label: {
                  normal: {
                    show: true
                  }
                }
              },
              {
                value: 100 - this.data
              }
            ]
          }
        ]
      });
    }
  }
};
</script>
