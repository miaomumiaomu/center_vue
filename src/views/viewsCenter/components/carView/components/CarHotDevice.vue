<template>
  <div class="car-distribution">
		<div class="top">
			<div class="title">今日热点设备分析</div>
		</div>
		<div class="table">
      <bar-chart :data="data" height="20vh"/>
		</div>
	</div>
</template>
<script>
import{ getCarHotDevice } from '@/api/viewsCenter/carView'
export default {
	data() {
		return {
			data: [],
		}
	},
	components: {
    barChart: () => import('../../BarChart')
	},
	props: {
    code: Object
	},
	watch: {
    code() {
      this.getCarHotDevice()
    }
  },
	mounted() {
		this.getCarHotDevice()
	},
	methods: {
		getCarHotDevice() {
			getCarHotDevice({ ...this.code }).then(res => {
				this.data = res.data
			})
		}
	}
}
</script>
<style lang="scss" scoped>
.car-distribution{
	width: 31.25vw;
  height: 100%;
	background-color: rgba(21,29,45,1);
	.top{
		margin: 2.03vh 0 0.83vh 1.4vw;
		.title{
			display: inline-block;
			font-size:1.296vh;
			font-family:AlibabaPuHuiTiM;
			color:rgba(226,233,238,1);
			line-height:1.04vw;
			&::before{
				content: '';
				display: inline-block;
				width: 0.78vw;
				height: 0.78vw;
				background: url('../../../../../assets/views-center/house-view/top-logo.png');
				background-size: 100% 100%;
				margin-top: 2px;
				margin-right: 0.26vw;
			}
		}
	}
}
</style>