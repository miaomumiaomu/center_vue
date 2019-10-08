<template>
  <div :class="className" :id="id" :style="{height:height,width:width, overflow:'visible'}"></div>
</template>

<script>
export default {
  props: {
    CharData: {},
    id: {
      type: String,
      default: 'chart'
    },
    className: {
      type: String,
      default: "chart"
    },
    width: {
      type: String,
      default: "26vw"
    },
    height: {
      type: String,
      default: "64vh"
    },
    name: {
      require: true,
    }
  },
  data() {
    return {
      chart: null
    };
  },
  mounted() {
    this.initChart()
    this.chart = null
  },
  watch: {
    CharData: 'initChart'
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id));
      let echartData = this.CharData;
      let Time = new Array;
      if (echartData) {
        echartData.forEach((element,index) => {
        if (element.value === 0) {
            delete echartData[index]
            return;
          }else {
            Time.push(element.name)
            return;
          }
        });
      }
      this.chart.setOption({
        title: {
          text: this.name,
          // subtext: "虚构数据",
          left: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "在 {b}  : 出现了 {c} 次</br> 概率为 {d}%"
        },
        legend: {
          // orient: 'vertical',
          // top: 'middle',
          bottom: 10,
          left: "center",
          data: Time,
        },
        series: [
          { 
            type: "pie",
            radius: "65%",
            center: ["50%", "50%"],
            selectedMode: "single",
            data: echartData,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      });
    }
  }
};
</script>
<style lang="scss" scoped>
</style>