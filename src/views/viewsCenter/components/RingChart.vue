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
    // true表示切换第二种配色方案
    anotherColor: {
      type: Boolean,
      default: false
    },
    // true表示分成大小类
    isClassify: {
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
        let total = 0;
        if (len > 1) {
          total = this.data.reduce((prev, next) => {
            const temp = typeof(prev.value) !== 'undefined' ? prev.value : prev;
            return temp + next.value;
          });
        } else if (len === 1) {
          total = this.data[0].value;
        }
        let personTypeList = [];
        let tooltipOpt = {
          trigger: "item",
          formatter: (params) => {
            const { name, value, children } = params.data || {};
            let result = `${name}: ${value} (${(total === 0 ? 0 : value / total * 100).toFixed(2)}%)`;
            if (children) {
              let tempArr = children.map(item => {
                return `${item.name}: ${item.value} (${(total === 0 ? 0 : item.value / total * 100).toFixed(2)}%)`;
              });
              result = tempArr.join('<br />');
            }
            return `<div style="max-height: 100px; overflow: auto">${result}</div>`;
          }
        };
        // 分类处理
        if(this.isClassify) {
          personTypeList = this.data.map(item => {
            item.icon = "circle";
            return item;
          });
          tooltipOpt.enterable = true;
          tooltipOpt.position = ['45%', '5%'];
        } else {
          // 处理排名前5的项目
          const top5List = this.data.slice(0, 5);
          personTypeList = top5List.map(item => {
            item.icon = "circle";
            return item;
          });
          // 处理其他项目
          const otherList = this.data.slice(5);
          if (otherList.length > 0) {
            let otherTotal = otherList.reduce((prev, current) => {
              const temp = typeof(current.value) !== 'undefined' ? current.value : 0;
              return prev + temp;
            }, 0);
            personTypeList.push({ name: '更多', value: otherTotal, icon: 'circle', children: otherList });
          }
        }
        let option = {
          tooltip: tooltipOpt,
          legend: {
            itemWidth: 10,
            itemHeight: 10,
            orient: "vertical",
            right: 40,
            top: "middle",
            data: personTypeList,
            textStyle: {
              color: "#E2E9EE"
            },
            formatter: name => {
              let result = personTypeList.find(item => item.name === name);
              if (result) {
                return `${result.name} ${(total === 0 ? 0 : result.value / total * 100).toFixed(2)}%`;
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
        } else if (this.isClassify) {
          const len = this.data.length || 0;
          let shang = Math.floor(len / colorList1.length);
          const yv = len % colorList1.length;
          let result = [];
          while(shang) {
            result = result.concat(colorList1);
            shang--;
          }
          if (yv === 1) {
            result.push(colorList1[2]);
          } else {
            let temp = colorList1.slice(0, yv);
            result = result.concat(temp);
          }
          option.color = result.map(item => this.handleColor(...item));
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
