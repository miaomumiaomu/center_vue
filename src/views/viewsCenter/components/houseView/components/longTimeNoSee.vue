<template>
  <div class="house-distribution">
		<div class="top">
			<div class="title">房屋长时间无人出入</div>
      <div class="time">超过10天</div>
      <div class="count">共{{data.length || 0}}条</div>
		</div>
		<div class="content-bar" ref="contentWheel" @mousewheel="wheel">
      <div class="content" v-for="(item, index) in data" :key="index" @click="itemClick(item)">
        <div class="content-title">
          <div>{{item.name}}</div>
          <div>{{item.count}}人</div>
        </div>
        <div class="content-item">
          <div>{{item.lastTime}}</div>
          <div>{{item.fullName}}</div>
        </div>
      </div>
    </div>
    <house-form :is-open.sync="isFormDialog" :id="houseFormId" :isView="true"/>
	</div>
</template>
<script>
import{ getHouseUnihabited } from '@/api/viewsCenter/houseView'
export default {
	data() {
		return {
      data: [],
      isFormDialog: false,
      houseFormId: null
		}
	},
	props: {
    code: Object
  },
  components: {
    HouseForm: () => import('@/views/houseManage/components/HouseForm')
  },
	watch: {
    code() {
      this.getHouseUnihabited()
    }
  },
	mounted() {
		this.getHouseUnihabited()
	},
	methods: {
		getHouseUnihabited() {
			getHouseUnihabited({ ...this.code }).then(res => {
        this.data = res.data
			})
    },
    wheel(e) {
      if(e.wheelDelta > 0) {
        return
      }
      if (this.loading) {
        return
      }
      let node = this.$refs.contentWheel
      if (node.clientHeight + node.scrollTop === node.scrollHeight) {
        if ((this.pageNo - 1) * 9 < this.total) {
          this.getHouseUnihabited()
        }
      }
    },
    itemClick(data) {
      this.isFormDialog = true
      this.houseFormId = data.id
    }
	}
}
</script>
<style lang="scss" scoped>
.house-distribution{
	width: 29.86vw;
  height: 43.3vh;
	background-color: rgba(21,29,45,1);
  padding: 2.03vh 1.51vw 1.48vh 1.4vw;
	.top{
		margin-bottom: 1.459vh;
		.title{
			display: inline-block;
			font-size:1.296vh;
			// font-family:AlibabaPuHuiTiM;
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
    .time{
      display: inline-block;
      width:2.96vw;
      height:2.03vh;
      background:rgba(44,95,198,0.3);
      border-radius:2px;
      border:1px solid rgba(4,101,193,1);
      font-size:1.11vh;
      text-align: center;
      // font-family:AlibabaPuHuiTiM;
      color:rgba(255,255,255,1);
      line-height:1.944vh;
    }
    .count{
      float: right;
      font-size:13px;
      // font-family:AlibabaPuHuiTiR;
      color:rgba(104,133,158,1);
      line-height:1.85vh;
      letter-spacing: 2px;
    }
	}
  .content-bar{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    height: 36.296vh;
    overflow-y: auto;
    .content{
      width:13vw;
      height:11.29vh;
      background:rgba(24,30,47,1);
      border-radius:4px;
      border:1px solid rgba(49,75,126,1);
      margin-bottom: 1.2vh;
      cursor: pointer;
      .content-title{
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 3.98vh;
        background:linear-gradient(360deg,#21396E 0%,#2C5B7E 100%);
        div:first-child{
          font-size:1.574vh;
          // font-family:AlibabaPuHuiTiM;
          color:rgba(255,255,255,1);
          letter-spacing: 0.76px;
          line-height:2.4vh;
          margin-left: 0.78vw;
        }
        div + div{
          width:2.18vw;
          height:1.85vh;
          background:rgba(46,102,201,0.6079);
          border-radius:2px;
          font-size:1.11vh;
          text-align: center;
          // font-family:AlibabaPuHuiTiM;
          color:rgba(226,233,238,1);
          line-height:1.85vh;
          letter-spacing: -0.24px;
          margin-right: 0.52vw;
        }

      }
      .content-item{
        padding: 0.833vh 0.4167vw 0.74vh 0.78vw;
        div:first-child{
          font-size:1.2vh;
          // font-family:AlibabaPuHuiTiR;
          color:rgba(226,233,238,0.73);
          line-height:1.85vh;
          letter-spacing: 2px;
          margin-bottom: 2px;
          &::before{
            content: '';
            display: inline-block;
            width: 1.01vh;
            height: 1.01vh;
            background: url('../../../../../assets/views-center/house-view/time.png');
            background-size: 100% 100%;
            margin-right: 0.26vw;
          }
        }
        div + div{
          font-size:1.2vh;
          // font-family:AlibabaPuHuiTiR;
          color:rgba(226,233,238,0.73);
          line-height:1.85vh;
          letter-spacing: 2px;
          &::before{
            content: '';
            display: inline-block;
            width: 1.2vh;
            height: 1.296vh;
            background: url('../../../../../assets/views-center/house-view/location.png');
            background-size: 100% 100%;
            margin-right: 0.26vw;
          }
        }
      }
    }
  }
}
</style>