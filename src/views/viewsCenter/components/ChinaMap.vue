<template>
  <div :class="className" :style="{height: height, width: width}"></div>
</template>

<script>
import "@/utils/china";
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
    total: {
      type: Number,
      default: 2500
    }
  },
  data() {
    return {
      chart: null,
      geoCoordMap: {
        "安徽": [117.17, 31.52],
        "澳门": [113.50, 22.20],
        "北京": [116.24, 39.55],
        "福建": [119.18, 26.05],
        "甘肃": [103.51, 36.04],
        "广东": [113.14, 23.08],
        "广西": [108.19, 22.48],
        "贵州": [106.42, 26.35],
        "海南": [110.20, 20.02],
        "河北": [114.30, 38.02],
        "河南": [113.40, 34.46],
        "黑龙江": [126.36, 45.44],
        "湖北": [114.17, 30.35],
        "湖南": [112.59, 28.12],
        "吉林": [125.19, 43.54],
        "江苏": [118.46, 32.03],
        "江西": [115.55, 28.40],
        "辽宁": [123.25, 41.48],
        "内蒙古": [111.41, 40.48],
        "宁夏": [106.16, 38.27],
        "青海": [101.48, 36.38],
        "山东": [117.00, 36.40],
        "山西": [112.33, 37.54],
        "陕西": [108.57, 34.17],
        "上海": [121.29, 31.14],
        "四川": [104.04, 30.40],
        "台湾": [121.30, 25.03],
        "天津": [117.12, 39.02],
        "西藏": [91.08, 29.39],
        "香港": [114.10, 22.20],
        "新疆": [87.36, 43.45],
        "云南": [102.42, 25.04],
        "浙江": [120.10, 30.16],
        "重庆": [106.33, 29.35]
      }
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
    },
    total: {
      handler(val) {
        this.$nextTick(() => {
          this.initChart();
        })
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
          show: false
        },
        geo: {
          roam: false,
          map: 'china',
          // left: 'right',
          left: '18%',
          itemStyle: {
            normal: {
              areaColor: 'rgba(5, 52, 102, 0.8606)',
              color: 'rgba(5, 52, 102, 0.8606)'
            }
          },
          regions: [{
            name: '南海诸岛',
            itemStyle: {
              normal: {
                opacity: 0,
              }
            }
          }],
        },
        visualMap: {
          min: 0,
          max: this.total,
          right: 11,
          bottom: 14,
          itemWidth: 16,
          itemHeight: 67,
          text: [(Math.round(this.total * 1.2)).toString(), '0'],
          // calculable : true,
          show: true,
          textStyle: {
            color: '#85A8C1'
          },
          inRange: {
            color: [
              'rgba(5, 52, 102, 0.8606)',
              'rgba(36, 162, 225, 0.8606)',
              'rgba(130, 222, 255, 0.8606)',
              'rgba(248, 221, 125, 0.8606)',
              'rgba(255, 159, 127, 0.8606)',
              'rgba(173, 8, 38, 0.8606)',
            ]
          },
        },
        //配置属性
        series: [
          {
            name: '总数',
            type: 'map',
            geoIndex: 0,
            mapType: 'china',
            roam: false,
            zoom: 1.2,
            data: this.convertData(this.data, this.geoCoordMap),
            // 标记
            symbol: 'none',
            selectedMode: 'single',
            label: {
              emphasis: {
                show: false
              }
            },
          }
        ]
      };
      this.chart = echarts.init(this.$el);
      this.chart.setOption(option);
    },
    convertData(data, geoLocale) {
      let res = [];
      for (let key in geoLocale) {
        let temp = data.find(item => (item.name.includes(key)));
        if (temp) {
          res.push({ name: key, value: geoLocale[key].concat(temp.value) });
        }
      }
      return res;
    }
  }
};
</script>
