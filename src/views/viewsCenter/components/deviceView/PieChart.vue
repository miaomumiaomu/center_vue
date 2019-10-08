<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from "echarts";
import { debounce } from "@/utils";

export default {
  props: {
    className: {
      type: String,
      default: ""
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
      pieData: [
        { // 在线style配置
          // value: 306,
          // name:'在线',
          label: {
            color: '#387EC4',
            formatter: '{b}\n{d}%\n{c}个',
            position: 'outside'
          },
          labelLine: {
            lineStyle: { color: '#387EC4' }
          },
          itemStyle: {
            borderWidth: 10,
            borderColor: '#151D2D',
            color: {
              type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                {offset: 0, color: '#2D5673'},
                {offset: 0.5, color: '#1F4979'},
                {offset: 1, color: '#122442'}
              ],
            }
          }
        },
        { // 离线style配置
          // value:374,
          // name:'离线',
          label: {
            color: '#DA8C63',
            formatter: '{b}\n{d}%\n{c}个',
            position: 'outside',
            // formatter: '{b|{b}}\n{hr|}\n{c|{c}个}',
            // rich: {
            //   b: {
            //     padding: 4,
            //     color: '#DA8C63',
            //   },
            //   c: {
            //     padding: 4,
            //     color: '#DA8C63',
            //   },
            //   hr: {
            //     borderColor: '#DA8C63',
            //     width: '100%',
            //     borderWidth: 0.5,
            //     // padding: [0, 10, 0, 10],
            //     height: 0,
            //   }
            // }
          },
          labelLine: {
            lineStyle: { color: '#DA8C63' },
          },
          itemStyle: {
            borderWidth: 10,
            borderColor: '#151D2D',
            color: {
              type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                {offset: 0, color: 'rgba(67,36,18,0.8283)'},
                {offset: 0.5, color: 'rgba(120,72,44,0.8283)'},
                {offset: 1, color: 'rgba(163,93,48,0.8283)'}
              ],
            }
          }
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
      Object.assign(this.pieData[0], this.data[0])
      Object.assign(this.pieData[1], this.data[1])

      let option = {
        tooltip: {
          trigger: "item",
        },
        series: [
          { 
            type: "pie",
            radius: "65%",
            center: ["50%", "50%"],
            data: this.pieData
          }
        ]
      };

      this.chart = echarts.init(this.$el);
      this.chart.setOption(option);
    }
  }
};
</script>
