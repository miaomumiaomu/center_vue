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
    data: [Array, Object]
  },
  data() {
    return {
      chart: null,
      colorArray: [
        {
          top: 'rgba(70, 179, 240, 0.677)',
          bottom: 'rgba(12, 34, 55, 0.677)'
        },
        {
          top: 'rgba(60, 146, 127, 0.8517)',
          bottom: 'rgba(12, 38, 34, 0.852)'
        },
        {
          top: 'rgba(189, 134, 60, 0.73)',
          bottom: 'rgba(46, 29, 6, 0.73)'
        },
        {
          top: 'rgba(76, 84, 174, 0.73)',
          bottom: 'rgba(13, 17, 54, 0.73)'
        },
        {
          top: 'rgba(50, 167, 186, 0.73)',
          bottom: 'rgba(19, 44, 51, 0.73)'
        },
        {
          top: 'rgba(174, 161, 76, 0.73)',
          bottom: 'rgba(32, 30, 14, 0.73)'
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
      let option = {
        tooltip: {
          axisPointer: {
            type: "shadow"
          }
        },
        textStyle: {
          color: "rgba(226,233,238,0.511)"
        },
        grid: {
          top: "15%",
          right: "9%",
          bottom: "3%",
          left: "9%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          axisTick: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: "rgba(60, 65, 70, 1)"
            }
          },
          axisLabel: {
            color: 'rgba(226, 233, 238, 0.511)',
            fontSize: 10
          },
          data: this.data.map(item => { return item.name })
        },
        yAxis: {
          type: "value",
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: 'rgba(226, 233, 238, 0.511)',
            fontSize: 10
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(60, 65, 70, 0.492)',
              type: 'dotted'
            }
          }
        },
        series: {
          type: "bar",
          itemStyle: {
            normal: {
              color: (params) => {
                let num = this.colorArray.length;
                return {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0,
                    color: this.colorArray[params.dataIndex % num].top
                  }, {
                    offset: 1,
                    color: this.colorArray[params.dataIndex % num].bottom
                  }],
                }
              },
            }
          },
          barWidth: "50%",
          data: this.data.map(item => { return item.value })
        }
      };

      this.chart = echarts.init(this.$el);
      this.chart.setOption(option);
    }
  }
};
</script>
