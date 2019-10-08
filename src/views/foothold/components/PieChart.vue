<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
import moment from "moment";
require("echarts/theme/macarons");
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
      pieData: []
    };
  },
  watch: {
    data: {
      handler(val) {
        if (val) {
          this.pieData = JSON.parse(JSON.stringify(val));
          this.pieData.data = this.pieData.data.map(item => {
            return {
              name: item.name,
              value: item.value
            };
          });
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
      this.chart = echarts.init(this.$el);

      this.chart.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{a}<br/>{b}:{c}次({d}%)",
           position: function (pos, params, dom, rect, size) {
            var obj = {top: 60};
            obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
            return obj;
        }
        },
        // color: ["#658CF1", "#FED11C", "#35CF62"],
        series: [
          {
            name: this.pieData.name,
            type: "pie",
            radius: "60%",
            center: ["50%", "50%"],
            data: this.pieData.data,
            labelLine:{
              length:8,
              length2:6
            }
          }
        ]
      });
    }
  }
};
</script>
