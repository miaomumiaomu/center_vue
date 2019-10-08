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
    colorIndex: {
      type: Number,
      default: 0
    },
    tooltipFormatter: {
      type: String,
      default: null
    },
    data: [Array, Object]
  },
  data() {
    return {
      chart: null,
      barData: {
        name: [],
        data: []
      },
      colorData: [
        {
          linearGradient: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#3389d0" },
            { offset: 1, color: "#335db5" }
          ])
        },
        {
          linearGradient: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#428A89" },
            { offset: 1, color: "#22536E" }
          ])
        }
      ]
    };
  },
  watch: {
    data: {
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
      this.barData = {
        name: [],
        data: []
      }
      this.data.forEach(item => {
        this.barData.name.push(item.name);
        this.barData.data.push(item.value);
      });
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
        series: {
          type: "bar",
          itemStyle: {
            normal: { color: this.colorData[this.colorIndex].linearGradient }
          },
          barWidth: "50%",
          data: this.barData.data
        }
      };
      if (this.barData.name) {
        if (this.barData.name.map(item => item.includes("("))) {
          option.xAxis.data = this.barData.name.map(item => item.split("(")[0]);
        } else {
          option.xAxis.data = this.barData.name;
        }
      }

      this.chart = echarts.init(this.$el);
      this.chart.setOption(option);
    }
  }
};
</script>
