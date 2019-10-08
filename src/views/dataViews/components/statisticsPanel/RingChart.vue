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
    anotherColor: {
      type: Boolean,
      default: false
    }
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
      const colorList1 = [['#2C7B61', '#183939'], ['#0D6A78', '#123342'], ['#084166', '#0F6091'], ['#2C4083', '#1A2A47'], ['#2E66A7', '#1E3C5F'], ['#282332', '#64333A']];
      const colorList2 = [['#0B5884', '#074163'], ['#15212F', '#0C437C'], ['#343160', '#15212F'], ['#003246', '#006482'], ['#003232', '#00645A'], ['#3E291E', '#6D4425']];
        const len = this.data.length;
        const total = len > 0 ? this.data.reduce((prev, next) => {
          const temp = typeof(prev.value) !== 'undefined' ? prev.value : prev;
          return temp + next.value;
        }) : 0;
        // 处理排名前5的项目
        const top5List = this.data.slice(0, 5);
        let personTypeList = top5List.map(item => {
          item.icon = "circle";
          return item;
        });
        // 处理其他项目
        const otherList = this.data.slice(5);
        if (otherList.length > 0) {
          let otherTotal = otherList.reduce((prev, current) => {
            const temp = typeof(current.value) !== 'undefined' ? current.value : 0;
            return prev + temp
          }, 0);
          personTypeList.push({ name: '更多', value: otherTotal, icon: 'circle', children: otherList });
        }
        let option = {
          tooltip: {
            trigger: "item",
            formatter: (params) => {
              const { name, value, children } = params.data || {};
              let result = `${name}: ${value} (${Math.round(total === 0 ? 0 : value / total * 100)}%)`;
              if (children) {
                let tempArr = children.map(item => {
                  return `${item.name}: ${item.value} (${Math.round(total === 0 ? 0 : item.value / total * 100)}%)`;
                });
                result = tempArr.join('<br />');
              }
              return result;
            }
          },
          legend: {
            orient: "vertical",
            right: 25,
            top: "middle",
            data: personTypeList,
            textStyle: {
              color: "rgba(226, 233, 238, 0.68)"
            },
            formatter: name => {
              let result = personTypeList.find(item => item.name === name);
              if (result) {
                return `${result.name.length > 2 ? result.name.slice(0, 2) + '...' : result.name } ${Math.round(total === 0 ? 0 : result.value / total * 100)}%`;
              } else {
                return "";
              }
            }
          },
          series: [
            {
              type: "pie",
              center: ["35%", "50%"],
              radius: ["40%", "70%"],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                  position: "center"
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              itemStyle: {
                borderWidth: 3,
                borderColor: '#0F151E'
              },
              data: personTypeList
            }
          ]
        };
        // 处理圆环颜色
        if (this.anotherColor) {
          option.color = colorList2.map(item => this.handleColor(...item));
        } else {
          option.color = colorList1.map(item => this.handleColor(...item));
        }
        this.chart = echarts.init(this.$el);
        this.chart.setOption(option);
    },
    handleColor(c1, c2) {
      return {
        type: "linear",
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          {
            offset: 0,
            color: c1
          },
          {
            offset: 1,
            color: c2
          }
        ]
      };
    }
  }
};
</script>
