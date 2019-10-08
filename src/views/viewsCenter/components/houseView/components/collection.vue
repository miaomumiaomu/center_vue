<template>
  <div class="collection">
		<div class="top">
			<div class="title">采集情况分析</div>
		</div>
		<div class="table">
      <ring-chart height="25vh" :data="data" anotherColor></ring-chart>
		</div>
	</div>
</template>
<script>
import{ getHouseCollectt } from '@/api/viewsCenter/houseView'
export default {
	data() {
		return {
			data: [],
		}
	},
	components: {
    ringChart: () => import('../../RingChart')
	},
	props: {
    code: Object
	},
	watch: {
    code() {
      this.getHouseCollectt()
    }
  },
	mounted() {
		this.getHouseCollectt()
	},
	methods: {
		getHouseCollectt() {
			getHouseCollectt({ ...this.code }).then(res => {
				this.data = res.data
			})
		}
	}
}
</script>
<style lang="scss" scoped>
.collection{
	width: 20vw;
  height: 32.7vh;
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
				margin-right: 5px;
			}
		}
	}
}
</style>


