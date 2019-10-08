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
    data: [Array, Object],
    colorData: {
      type: Array,
      default: () => []
    },
    title: [String],
    resize: [Number]
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
    },
    resize(val) {
      if (val) {
        this.resizeMethod()
      }
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
        title: {
          top: 0,
          left: 0,
          text: this.title,
          textStyle:{
            color: '#96A5B4',
            fontSize: 12
          }
        },
        legend: {
          data: this.lineData.name,
          icon: "rect",
          top: '0',
          right: '0',
          itemWidth: 11,
          itemHeight: 11,
          textStyle: {
            fontSize: 11,
            color: "#fff"
          },
          itemGap: 40
        },
        grid: {
          top: "20px",
          right: "3%",
          bottom: "5%",
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
          data: this.lineData.time
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
      option.series = this.lineData.data.map((item, index) => {
        return {
          name: this.lineData.name[index],
          type: "line",
          itemStyle: { color: this.colorData[index][0] },
          areaStyle: {
            color: this.getLinearGradient(this.colorData[index][1], this.colorData[index][2])
          },
          smooth: false,
          data: item
        };
      });

      this.chart = echarts.init(this.$el);
      this.chart.setOption(option);
    },
    getLinearGradient(color1, color2) {
      return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: color1 },
        { offset: 1, color: color2 }
      ])
    },
    resizeMethod() {
      this.chart.resize()
    }
  }
};
</script>
