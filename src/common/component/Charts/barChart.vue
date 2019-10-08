<template>
  <div :id="id" class="bar"></div>
</template>

<script>
export default {
  props: {
    CharData:{},
    id: {
      type: String,
      default: "chart"
    }
  },
  data() {
    return {
      chart: null
    };
  },
  watch: {
    CharData: 'initChart'
  },
  mounted() {
    this.initChart();
    this.chart = null;
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id));
      var echartData = this.CharData;
      let Xhours = new Array();
      echartData.hours && echartData.hours.map(function(item) {
        Xhours.push(item + "点")
      })
      this.chart.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999"
            }
          }
        },
        // toolbox: {
        //   feature: {
        //     dataView: { show: true, readOnly: false },
        //     magicType: { show: true, type: ["line", "bar"] },
        //     restore: { show: true },
        //     saveAsImage: { show: true }
        //   }
        // },
        legend: {
          data: ["拜访", "受访"]
        },
        xAxis: [
          {
            type: "category",
            name: "拜访/受访",
            data: Xhours,
            axisPointer: {
              type: "shadow"
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "数量",
            min: 0,
            max: 30,
            interval: 5,
            axisLabel: {
              formatter: "{value} 人"
            }
          },
          // {
          //   type: "value",
          //   name: "受访",
          //   min: 0,
          //   max: 25,
          //   interval: 5,
          //   axisLabel: {
          //     formatter: "{value} 人"
          //   }
          // }
        ],
        series: [
          {
            name: "拜访",
            type: "bar",
            data: echartData.statisDatas
          },
          {
            name: "受访",
            type: "bar",
            data: echartData.statisDatased
          },
          // {
          //   name: "平均温度",
          //   type: "line",
          //   yAxisIndex: 1,
          //   data: [
          //     2.0,
          //     2.2,
          //     3.3,
          //     4.5,
          //     6.3,
          //     10.2,
          //     20.3,
          //     23.4,
          //     23.0,
          //     16.5,
          //     12.0,
          //     6.2
          //   ]
          // }
        ]
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.bar {
  margin-top: 20px;
  width: 1000px;
  height: 400px;
}
</style>