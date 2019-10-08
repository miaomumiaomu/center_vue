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
    index: {
      type: Number,
      default: 0
    },
    // 二级分类字段
    classify: {
      type: Array,
      default: () => []
    },
    data: [Array, Object]
  },
  data() {
    return {
      chart: null,
      lineData: null,
      colorData: [
        [{
          color: "#ADADAD",
          linearGradient: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(143, 143, 148, .16)" },
            { offset: 1, color: "rgb(30, 30, 30)" }
          ])
        }, {
          color: "#5A86DD",
          linearGradient: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(26, 69, 155, .28)" },
            { offset: 1, color: "#0C121E" }
          ])
        }],
        [{
          color: "#286E62",
          linearGradient: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(25, 66, 61, .24)" },
            { offset: 1, color: "#152732" }
          ])
        }, {
          color: "#895713",
          linearGradient: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(91, 63, 28, .33)" },
            { offset: 1, color: "#282E2E" }
          ])
        }]
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
          data: this.lineData.name,
          icon: "rect",
          top: "3%",
          right: "2%",
          itemWidth: 11,
          itemHeight: 11,
          textStyle: {
            fontSize: 11,
            color: "#fff"
          },
          itemGap: 40
        },
        grid: {
          top: "40px",
          right: "3%",
          bottom: "6px",
          left: "3%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          axisLabel: {
            color: "gray",
            fontSize: 12
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#282D37",
              type: "dotted"
            }
          },
          data: this.lineData.time
        },
        yAxis: {
          type: "value",
          boundaryGap: ["0", "20%"],
          axisLine: {
            lineStyle: {
              color: "rgba(255,255,255,0.2)"
            }
          },
          axisLabel: {
            color: "gray",
            fontSize: 12
          },
          splitLine: {
            lineStyle: {
              color: "#282D37",
              type: "dotted"
            }
          }
        }
      };
      option.series = this.lineData.data.map((item, index) => {
        return {
          name: this.lineData.name[index],
          type: "line",
          symbol: 'path://M 100, 100m -75, 0a75,75 0 1,0 150,0a75,75 0 1,0 -150,0',
          itemStyle: { color: this.colorData[this.index][index].color },
          areaStyle: {
            color: this.colorData[this.index][index].linearGradient
          },
          smooth: false,
          data: item
        };
      });
      // 特殊处理弹层
      if (this.classify.length === 2) {
        option.tooltip = {
        trigger: "axis",
        formatter: (params) => {
          let result = [];
          let [c1, c2] = this.classify;
          params.forEach(item => {
            const { seriesName, data: { value, addVal } } = item;
            let registed = `&nbsp;&nbsp;${c1}: ${addVal}`;
            let unregist = `&nbsp;&nbsp;${c2}: ${value - addVal}`;
            result = result.concat([seriesName, registed, unregist]);
          });
          return result.join('<br />');
        }
      };
      }

      this.chart = echarts.init(this.$el);
      this.chart.setOption(option);
    }
  }
};
</script>
