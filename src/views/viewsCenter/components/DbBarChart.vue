<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons");
import { debounce } from "@/utils";

export default {
  props: {
    className: {
      type: String,
      default: "chart"
    },
    height: {
      type: String,
      default: "100%"
    },
    width: {
      type: String,
      default: "100%"
    },
    tooltipFormatter: {
      type: String,
      default: null
    },
    color: {
      type: Array,
      default: () => ["#4C5BA7", "#4C5BA7", "#16506D", "#0E87B5"]
    },
    barData: [Array, Object]
  },
  data() {
    return {
      chart: null,
    };
  },
  watch: {
    barData: {
      handler(val) {
        if (val) {
          this.$nextTick(() => {
            this.initChart();
          });
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.__resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize();
      }
    }, 100);
    window.addEventListener("resize", this.__resizeHandler);
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    window.removeEventListener("resize", this.__resizeHandler);
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            label: {
              show: true
            }
          },
          formatter: this.tooltipFormatter
        },
        textStyle: {
          color: "#fff"
        },
        grid: {
          top: "6%",
          right: "5%",
          bottom: "3%",
          left: "3%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          data: this.barData.time,
          axisLine: {
            lineStyle: {
              color: "#282D37"
            }
          },
          axisLabel: {
            color: 'gray',
            fontSize: 10
          }
        },
        yAxis: {
          type: "value",
          axisLine: {
            lineStyle: {
              color: "#282D37"
            }
          },
          axisLabel: {
            color: 'gray',
            fontSize: 10
          },
          splitLine: {
            lineStyle: {
              color: '#282D37',
              type: 'dotted'
            }
          }
        },
        color: [
          new echarts.graphic.LinearGradient(0, 0, 0, 1, [ { offset: 0, color: this.color[0] }, { offset: 1, color: this.color[1] }]),
          new echarts.graphic.LinearGradient(0, 0, 0, 1, [ { offset: 0, color: this.color[2] }, { offset: 1, color: this.color[3] }])
        ],
        series: [
          {
            name: this.barData.name && this.barData.name[0],
            type: "bar",
            data: this.barData.data && this.barData.data[0]
          },
          {
            name: this.barData.name && this.barData.name[1],
            type: "bar",
            data: this.barData.data && this.barData.data[1]
          },
        ]
      };

      this.chart = echarts.init(this.$el);
      this.chart.setOption(option);
    }
  }
};
</script>
