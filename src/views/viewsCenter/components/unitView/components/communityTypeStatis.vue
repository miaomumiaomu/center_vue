<template>
  <div class="live-area-top">
		<div class="top">
			<div class="title">单位类型统计</div>
		</div>
		<div class="table">
      <ring-chart height="28.4vh" :data="data" anotherColor></ring-chart>
		</div>
	</div>
</template>
<script>
import{ getCommunityTypeStatis } from '@/api/viewsCenter/unitView'
export default {
	data() {
		return {
			data: [],
		}
	},
	props: {
    code: Object
	},
  components: {
    ringChart: () => import('../../RingChart')
	},
	watch: {
    code() {
      this.getCommunityTypeStatis()
    }
  },
	mounted() {
		this.getCommunityTypeStatis()
	},
	methods: {
		getCommunityTypeStatis() {
			getCommunityTypeStatis({ ...this.code }).then(res => {
				this.data = res.data
			})
		}
	}
}
</script>
<style lang="scss" scoped>
.live-area-top{
	height: 100%;
	background-color: rgba(21,29,45,1);
	padding: 1.94vh 0 2.13vh 0;
	.top{
		margin-bottom: 0.83vh;
		margin-left: 1.9vw;
		.title{
			display: inline-block;
			font-size:0.73vw;
			font-family:AlibabaPuHuiTiM;
			color:rgba(226,233,238,1);
			line-height:1.04vw;
			&::before{
				content: '';
				display: inline-block;
				width: 14.7px;
				height: 14.7px;
				background: url('../../../../../assets/views-center/house-view/top-logo.png');
				background-size: 100% 100%;
				margin-top: 2px;
				margin-right: 5px;
			}
		}
	}
}
</style>
