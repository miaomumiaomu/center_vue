<template>
  <div :id="id" class="point" ref="" :style="{width:width}"></div>
</template>

<script>
import { debounce } from "@/utils";

export default {
  props: {
    CharTableData: {},
    id: {
      type: String,
      default: "chart"
    },
    width: {
      type: String,
      default: "1200px"
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  mounted() {
    this.initChart();
    // this.chart = null;
    this.__resizePunch = debounce(() => {
      if (this.chart) {
        this.chart.resize();
      }
    }, 100);
    window.addEventListener("resize", this.__resizePunch);
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  watch: {
    CharTableData: 'initChart',
  },
  methods: {
    initChart() {
      let dom = document.getElementById(this.id)
      this.$nextTick(() => {
        this.chart = echarts.init(dom);
        let ShowData = this.CharTableData
        this.chart.setOption({
          tooltip: {
            position: "top",
            formatter: function (params) {
              return (
                " 在 " +
                ShowData.Name[params.value[1]] +
                "  " +
                ShowData.Time[params.value[0]] +
                " 出现了 " +
                params.value[2] +
                " 次 "
              );
            }
          },
          grid: {
            left: 20,
            bottom: 10,
            right: 30,
            containLabel: true
          },
          xAxis: {
            type: "category",
            data: ShowData.Time,
            boundaryGap: false,
            nameLocation: 'end',
            splitLine: {
              show: true,
              lineStyle: {
                color: "#999",
                type: "dashed"
              }
            },
            axisLine: {
              show: false
            }
          },
          yAxis: {
            type: "category",
            data: ShowData.Name,
            offset: 10,
            axisLine: {
              show: false
            }
          },
          series: [
            {
              name: "Punch Card",
              type: "scatter",
              symbolSize: function (val) {
                // 比例
                let temp = 32/29*val[2] + 72/29;
                // 约束
                if(val[2] > 0 && val[2] < 5) {
                  temp = 8;
                }else if(val[2] > 34){
                  temp = 40;
                }
                return temp;
              },
              data: ShowData.Count,
              animationDelay: function (idx) {
                return idx * 5;
              }
            }
          ]
        });
        this.chart.resize()
      })
      
    }
  }
};
</script>
<style lang="scss" scoped>
.point {
  width: 100%;
  margin-top: 20px;
  height: 600px;
  margin: 0 auto;
}
</style>