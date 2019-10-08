<template>
  <div class="live-house-top">
		<div class="top">
			<div class="title">房屋租户人数 TOP10</div>
		</div>
		<div class="table">
			<el-table :data="tableData" height="24.55vh" :row-class-name="tableRowClassName" :row-style="{ cursor: 'pointer' }" @row-click="rowClick">
				<el-table-column type="index" width="50" label="排名" align="center"></el-table-column>
				<el-table-column prop="name" label="房屋信息" align="center"></el-table-column>
				<el-table-column prop="count" label="居住人数" align="center"></el-table-column>
			</el-table>
		</div>
		<house-form :is-open.sync="isFormDialog" :id="houseFormId" :isView="true"/>
	</div>
</template>
<script>
import { getRenterCountTop } from "@/api/viewsCenter/rentView"
export default {
	data() {
		return {
			tableData: [],
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
      this.getRenterCountTop()
    }
  },
	methods: {
		tableRowClassName({row, rowIndex}) {
			if (rowIndex % 2 === 0) {
				return 'warning-row';
			} else {
				return 'success-row';
			}
			return '';
		},
		getRenterCountTop() {
			getRenterCountTop({ top: 10, ...this.code }).then(res => {
				this.tableData = res.data
			})
		},
		rowClick(data) {
			this.isFormDialog = true
      this.houseFormId = data.id
		}
	},
	mounted() {
		this.getRenterCountTop()
	}
}
</script>
<style lang="scss" scoped>
.live-house-top{
  height: 100%;
  display: flex;
  flex-direction: column;
	background-color: rgba(21,29,45,1);
  padding: 16px 20px 20px;
	.top{
		margin-bottom: 1.48vh;
		.title{
			display: inline-block;
			font-size:0.73vw;
			font-family:AlibabaPuHuiTiM;
			color:rgba(226,233,238,1);
			line-height:1.04vw;
			letter-spacing: 0.56px;
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
	.table{
		flex: 1;
    display: flex;
    flex-direction: column;
		/deep/{
			.el-table{
				width: 100%;
				tr{
					background-color: transparent;
					padding: 0.83vh 0;
					th{
						background:linear-gradient(360deg,rgba(34,101,140,0.405) 0%,rgba(93,203,191,0.405) 100%);
						border-bottom: none;
            height: 3.51vh;
            font-size:0.73vw;
            font-family:AlibabaPuHuiTiR;
            color:rgba(226,233,238,1);
						letter-spacing: 0.56px;
					}
				}
				.warning-row {
					background:rgba(48,82,81,0.1796) !important;
					height: 3.51vh;
					td{
						border-bottom: none;
						padding: 0.83vh 0;
						font-size:0.78vw;
						font-family:AlibabaPuHuiTiM;
						color:rgba(226,233,238,1);
						letter-spacing: 0.6px;
					}
				}
				.success-row {
					background: rgba(27, 34, 49, 0.4841) !important;
					height: 3.51vh;
					td{
						border-bottom: none;
						padding: 0.83vh 0;
						font-size:0.78vw;
						font-family:AlibabaPuHuiTiM;
						color:rgba(226,233,238,1);
						letter-spacing: 0.6px;
					}
				}
			}
			.el-table--fit.el-table--enable-row-hover.el-table--enable-row-transition.el-table--medium::before{
				display: none;
			}
			.el-table--enable-row-hover .el-table__body tr:hover > td{
				background-color: transparent;
			}
		}
	}
}
</style>