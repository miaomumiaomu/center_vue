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
      chart: null
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
      let maxData = [], maxVal = 0, maxList = [], ageList = [];
      if (this.data.length > 0) {
        this.data.forEach(item => {
          const { name, value } = item;
          if (value > maxVal) maxVal = value;
          maxData.push({ name });
          ageList.push(value);
        });
        maxVal = Math.round(maxVal * 1.2);
        maxData = maxData.map(item => {
          item.max = maxVal;
          maxList.push(maxVal);
          return item;
        });
        let option = {
          radar: {
            indicator: maxData,
            axisLine: {
              lineStyle: {
                color: '#666666'
              }
            },
            splitLine: {
              lineStyle: {
                color: '#666666',
                type: 'dashed'
              }
            },
            splitArea: {
              areaStyle: {
                color: '#151D2D'
              }
            }
          },
          series: [
            {
              type: "radar",
              data: [
                {
                  name: "边界",
                  value: maxList,
                  lineStyle: {
                    color: "#666666"
                  },
                  itemStyle: {
                    color: "#666666"
                  },
                }, {
                  name: "年龄",
                  value: ageList,
                  areaStyle: {
                    color: "#FF8D29"
                  },
                  lineStyle: {
                    color: "#666666"
                  },
                  itemStyle: {
                    color: "#666666"
                  },
                }
              ]
            }
          ]
        };
        this.chart = echarts.init(this.$el);
        this.chart.setOption(option);
      }
    }
  }
};
</script>
