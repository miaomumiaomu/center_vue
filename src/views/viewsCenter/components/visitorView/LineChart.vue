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
    data: [Array, Object]
  },
  data() {
    return {
      chart: null,
      lineData: null,
      colorData: [
        {
          color: "#5A86DD",
          linearGradient: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(26, 69, 155, .28)" },
            { offset: 1, color: "#0C121E" }
          ])
        }
      ]
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
          right: "6%",
          bottom: "3%",
          left: "3%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          axisLabel: {
            color: 'gray',
            fontSize: 12
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#282D37',
              type: 'dotted'
            }
          },
          data: this.lineData.map(item => { return item.name })
        },
        yAxis: {
          type: "value",
          boundaryGap: ['0', '20%'],
          axisLine: {
            lineStyle: {
              color: "rgba(255,255,255,0.2)"
            }
          },
          axisLabel: {
            color: 'gray',
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
        itemStyle: { color: '#5A86DD' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(26, 69, 155, .28)" },
            { offset: 1, color: "#0C121E" }
          ])
        },
        smooth: true,
        data: this.lineData.map(item => { return item.value })
      }

      this.chart = echarts.init(this.$el);
      this.chart.setOption(option);
    }
  }
};
</script>
