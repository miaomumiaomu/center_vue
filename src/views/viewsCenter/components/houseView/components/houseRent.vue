<template>
  <div class="live-area-top">
    <div class="top">
      <div class="title">房屋出租情况分析</div>
      <div style="float: right;">
        <el-radio-group v-model="radioList" @change="checkboxChange" size="small">
          <el-radio-button label="30天"></el-radio-button>
          <el-radio-button label="6个月"></el-radio-button>
          <el-radio-button label="12个月"></el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <div class="table">
      <div class="line-list" ref="lineList"></div>
    </div>
  </div>
</template>
<script>
import { getHouseRent } from "@/api/viewsCenter/houseView";
import { debounce } from "@/utils";
export default {
  data() {
    return {
      echart: null,
      radioList: '30天',
      data: []
    };
  },
  props: {
    code: Object
	},
	watch: {
    code() {
      this.getHouseRent()
    }
  },
  methods: {
    getHouseRent() {
      let type = 1
			if (this.radioList === '6个月') {
				type = 2
			} else if (this.radioList === '12个月') {
				type = 3
			}
      getHouseRent({ ...this.code, type }).then(res => {
        let time = [], houseValueList = [],houseRentInList = [], houseRentOutList = []
        let houseValue = res.data.houseList.map(item => {
          time.push(item.name)
          houseValueList.push(item.value)
          return item.value
        })
        // let houseValueMax = Math.max.apply(null, houseValue)
        // let houseRentIn = res.data.rentInList.map(item => {
        //   houseRentInList.push(item.value)
        //   return item.value
        // })
        // let houseRentInMax = Math.max.apply(null, houseRentIn)
        // let houseRentOut = res.data.rentOutList.map(item => {
        //   houseRentOutList.push(item.value)
        //   return item.value
        // })
        // let houseRentOutMax = Math.max.apply(null, houseRentOut)
        // let houseRentMax = houseRentInMax > houseRentOutMax ? houseRentInMax : houseRentOutMax
        // let rightLine = Math.ceil(houseValueMax / 10) * 10
        // let leftLine = Math.ceil(houseRentMax / 10) * 10
        // var intervalLeft = leftLine / 5
        // var intervalRight = rightLine / 5
        let dom = this.$refs.lineList
        this.echart = echarts.init(dom)
        this.echart.setOption(this.getOption(time, houseValueList))
        // this.echart.setOption(this.getOption(leftLine, rightLine, intervalLeft, intervalRight, time, houseValueList, houseRentInList, houseRentOutList))
      })
    },
    checkboxChange() {
      this.getHouseRent()
    },
    getOption(time, houseValueList) {
      return {
        tooltip: {
          trigger: "axis",
        },
        legend: {
          bottom: 0,
					textStyle: {
						color: 'rgba(226,233,238,0.36)'
					}, 
          data: ["出租房屋"]
        },
        xAxis: {
          type: 'category',
          data: time,
          axisLabel: {
            color: '"#444A57',
          },
          axisLine: {
            onZero: true,
            onZeroAxisIndex: 3,
            lineStyle: {
              color: '#444A57',
              type: 'solid',
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: "{value}"
          },
          nameTextStyle: {
            color: 'rgba(226,233,238,0.36)',
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(255,255,255,0.2)'
            }
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(255,255,255,0.1)',
              type: "dotted"
            }
          }
        },
        series: [{
          name: '出租房屋',
          data: houseValueList,
          type: 'line',
          smooth: true,
          itemStyle: {
            color: '#2B5EAA'
          },
          lineStyle: {
            color: '#2B5EAA'
          },
          areaStyle: {
            normal: { 
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "rgba(26,69,155,.19)" },
                { offset: 1, color: "rgb(12,18,30)" }
              ])
            }
          },
        }]
      }
    },
    // getOption(leftLine, rightLine, intervalLeft, intervalRight, time, houseValueList, houseRentInList, houseRentOutList) {
    //   return {
    //     tooltip: {
    //       trigger: "axis",
    //     },
    //     legend: {
    //       bottom: 0,
		// 			textStyle: {
		// 				color: 'rgba(226,233,238,0.36)'
		// 			}, 
    //       data: ["流入租客", "流出租客", "出租房屋"]
    //     },
    //     xAxis: [
    //       {
    //         type: "category",
    //         data: time,
    //         axisLabel: {
		// 					color: '"#444A57',
		// 				},
		// 				axisLine: {
    //           onZero: true,
    //           onZeroAxisIndex: 3,
		// 					lineStyle: {
    //             color: '#444A57',
    //             type: 'solid',
		// 					}
    //         }
    //       }
		// 		],
    //     color: [
    //       new echarts.graphic.LinearGradient(0, 0, 0, 1, [ { offset: 0, color: "#4C5BA7" }, { offset: 1, color: "#4C5BA7" }]),
    //       new echarts.graphic.LinearGradient(0, 0, 0, 1, [ { offset: 0, color: "#16506D" }, { offset: 1, color: "#0E87B5" }])
    //     ],
    //     yAxis: [
    //       {
    //         type: "value",
    //         name: "人流量",
    //         min: 0,
    //         max: leftLine,
    //         interval: intervalLeft,
    //         axisLabel: {
    //           formatter: "{value}"
		// 				},
		// 				nameTextStyle: {
		// 					color: 'rgba(226,233,238,0.36)',
		// 				},
		// 				axisLine: {
		// 					lineStyle: {
		// 						color: 'rgba(255,255,255,0.2)'
		// 					}
    //         },
    //         splitLine: {
    //           lineStyle: {
    //             color: 'rgba(255,255,255,0.1)',
    //             type: "dotted"
    //           }
    //         }
    //       },
    //       {
    //         type: "value",
    //         name: "出租房屋数",
    //         min: 0,
    //         max: rightLine,
    //         interval: intervalRight,
    //         axisLabel: {
    //           formatter: "{value}"
		// 				},
		// 				nameTextStyle: {
		// 					color: 'rgba(226,233,238,0.36)',
		// 				},
		// 				axisLine: {
		// 					lineStyle: {
		// 						color: 'rgba(255,255,255,0.2)'
		// 					}
    //         },
    //         splitLine: {
    //           lineStyle: {
    //             color: 'rgba(255,255,255,0.1)',
    //             type: "dotted"
    //           }
    //         }
    //       }
    //     ],
    //     series: [
    //       {
    //         name: "流入租客",
    //         type: "bar",
    //         data: houseRentInList
    //       },
    //       {
    //         name: "流出租客",
    //         type: "bar",
    //         data: houseRentOutList
    //       },
    //       {
    //         name: "出租房屋",
    //         type: "line",
    //         yAxisIndex: 1,
    //         data: houseValueList,
    //         smooth: true,
    //         itemStyle: {
    //           color: '#2B5EAA'
    //         },
    //         lineStyle: {
    //           color: '#2B5EAA'
    //         },
    //         areaStyle: {
    //           normal: { 
    //             color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
    //               { offset: 0, color: "rgba(26,69,155,.19)" },
    //               { offset: 1, color: "rgb(12,18,30)" }
    //             ])
    //           }
    //         },
    //       }
    //     ]
    //   };
    // }
  },
  mounted() {
    this.__resizeHanlder = debounce(() => {
      if (this.echart) {
        this.echart.resize();
      }
    }, 100);
    window.addEventListener("resize", this.__resizeHanlder);
    this.getHouseRent()
  },
  beforeDestroy() {
    if (!this.echart) {
      return;
    }
    window.removeEventListener("resize", this.__resizeHanlder);
    this.echart.dispose();
    this.echart = null;
  },
};
</script>
<style lang="scss" scoped>
.live-area-top {
  width: 43.17vw;
  height: 43.3vh;
  background-color: rgba(21, 29, 45, 1);
  .top {
    margin: 2.12vh 2.55vw 0 1.19vw;
    margin-bottom: 0.83vh;
    .title {
      display: inline-block;
      font-size: 0.73vw;
      font-family: AlibabaPuHuiTiM;
      color: rgba(226, 233, 238, 1);
      line-height: 1.04vw;
      &::before {
        content: "";
        display: inline-block;
        width: 0.78vw;
        height: 0.78vw;
        background: url("../../../../../assets/views-center/house-view/top-logo.png");
        background-size: 100% 100%;
        margin-top: 2px;
        margin-right: 5px;
      }
    }
  }
	.line-list{
		height: 37vh;
	}
  /deep/ {
    .el-radio-button--small .el-radio-button__inner {
      padding: 4px 14px 4px 14px;
      border-left: 1px solid #35425E;
      font-size: 12px;
    }
    .el-radio-button__inner {
      background-color: #202C40;
      border-color: #35425E;
      color: #E2E9EE;
      border-radius: 0;
    }
    .el-radio-button__orig-radio:checked + .el-radio-button__inner {
      background-color: rgba(44,95,198,0.3);
      border-color: #0465C1;
      color: #E2E9EE;
      box-shadow: none;
    }
  }
}
</style>


