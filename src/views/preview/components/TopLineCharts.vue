<template>
  <div :class="className" :style="{height: height, width: width}"></div>
</template>

<script>
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
    colorArray: {
      type: Array
    },
    data: [Array, Object]
  },
  data() {
    return {
      chart: null,
      lineData: null,
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
        textStyle: {
          color: "#fff"
        },
        legend: {
        },
        grid: {
          top: "5%",
          right: "0%",
          bottom: "3%",
          left: "0%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          axisLabel: {
            color: 'rgba(226, 233, 238, 0.5)',
            fontSize: 12
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#282D37',
              type: 'dotted'
            }
          },
          data: this.lineData.map(item => { return item.date })
        },
        yAxis: {
          type: "value",
          boundaryGap: ['0', '20%'],
          axisLine: {
            lineStyle: {
              color: "rgba(51, 64, 88, 0.7041)"
            }
          },
          axisLabel: {
            color: 'rgba(226, 233, 238, 0.5)',
            fontSize: 12
          },
          splitLine: {
            lineStyle: {
              color: '#282D37',
              type: 'dotted'
            }
          }
        }
      };
      option.series = {
        type: "line",
        symbol: 'path://M 100, 100m -75, 0a75,75 0 1,0 150,0a75,75 0 1,0 -150,0',
        itemStyle: { color: 'rgba(36, 105, 84, 1)' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(25, 66, 61, .5819)" },
            { offset: 1, color: "rgba(21, 39, 50, 1)" }
          ])
        },
        smooth: false,
        data: this.lineData.map(item => { return item.count })
      }

      this.chart = echarts.init(this.$el);
      this.chart.setOption(option);
    }
  }
};
</script>
