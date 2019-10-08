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
    color: {
      type: String,
      default: '#45ADED'
    },
    data: [Array, Object]
  },
  data() {
    return {
      columnData: [],
      chart: null
    };
  },
  watch: {
    data: {
      handler(val) {
        this.columnData = JSON.parse(JSON.stringify(val));
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
      let xAxis = [], data = [];
      this.columnData.reverse().forEach(item => {
        if (item.value > 0) {
          xAxis.push(item.name);
          data.push(item.value);
        }
      });
      let option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        grid: {
          top: "6%",
          left: "2%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "value",
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
        yAxis: {
          type: "category",
          axisLabel: {
            color: 'gray',
            fontSize: 10
          },
          data: xAxis
        },
        series: [
          {
            type: "bar",
            barWidth: 10,
            itemStyle: {
              color: this.color
            },
            data
          }
        ]
      };
      this.chart = echarts.init(this.$el);
      this.chart.setOption(option);
    }
  }
};
</script>
