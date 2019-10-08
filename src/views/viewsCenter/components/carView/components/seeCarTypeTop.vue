<template>
  <div class="see-car-type-top">
    <div class="top">
      <div class="title">车流类型统计</div>
    </div>
    <div ref="echart" class="echart"></div>
  </div>
</template>
<script>
import { getCarCollect } from "@/api/viewsCenter/carView";
import { debounce } from "@/utils";
export default {
  data() {
    return {
      data: [],
      
      colors: [
        [ '#387EC4', '#387EC4', '#2D5673', '#122442' ],
        ['#DA8C63', '#DA8C63', '#432412', '#A35D30']
      ],
      echart: null,
      option: {
        tooltip: {
          trigger: "item",
          formatter: "{b} : {c} ({d}%)"
        },
        series: [
          {
            type: "pie",
            radius: "60%",
            center: ["50%", "50%"],
            data: [],
          }
        ]
      }
    };
  },
  props: {
		code: Object,
		radioList: [String]
	},
	watch: {
    code() {
      this.getCarCollect()
		},
		radioList() {
			this.getCarCollect()
		}
  },
  mounted() {
    this.__resizeHanlder = debounce(() => {
      if (this.echart) {
        this.echart.resize();
      }
    }, 100);
    window.addEventListener("resize", this.__resizeHanlder);
    this.getCarCollect()
  },
  beforeDestroy() {
    if (!this.echart) {
      return;
    }
    window.removeEventListener("resize", this.__resizeHanlder);
    this.echart.dispose();
    this.echart = null;
  },
  methods: {
    getCarCollect() {
			let type = 0
			if (this.radioList === '7天') {
				type = 1
			} else if (this.radioList === '30天') {
				type = 2
			}
      getCarCollect({ ...this.code, type }).then(res => {
        let data = [
          { value: res.data.unCollect, name: "临时车" },
          { value: res.data.collected, name: "固定车" },
        ]
        this.initChart(data)
      })
    },
    initChart(data) {
      let dom = this.$refs.echart;
      this.echart = echarts.init(dom);
      data.forEach((item,index) => {
        this.handleData(item, ...this.colors[index])
      })
      this.option.series[0].data = data
      this.echart.setOption(this.option)
    },
    handleData(target, labelColor, labelLineColor, startColor, endColor) {
      target.label = {
        textStyle: {
          color: labelColor
        }
      },
      target.labelLine = {
        lineStyle: {
          color: labelLineColor
        },
        smooth: 0.2,
        length: 20,
        length2: 10
      },
      target.itemStyle =  {
        borderWidth: 4,
        borderColor: "#151D2D",
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: startColor },
            { offset: 1, color: endColor }
          ]
        }
      }
    },
  }
};
</script>
<style lang="scss" scoped>
.see-car-type-top {
  height: 31.3vh;
  background-color: rgba(21, 29, 45, 1);
  padding-top: 1.94vh;
  .top {
    margin-bottom: 0.83vh;
    margin-left: 1.9vw;
    .title {
      display: inline-block;
      font-size: 0.73vw;
      font-family: AlibabaPuHuiTiM;
      color: rgba(226, 233, 238, 1);
      line-height: 1.04vw;
      &::before {
        content: "";
        display: inline-block;
        width: 14.7px;
        height: 14.7px;
        background: url("../../../../../assets/views-center/house-view/top-logo.png");
        background-size: 100% 100%;
        margin-top: 2px;
        margin-right: 5px;
      }
    }
  }
  .echart{
    height: 27vh;
  }
}
</style>
