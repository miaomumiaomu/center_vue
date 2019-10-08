<template>
  <div v-if="visible" class="unit-detail-dialog">
    <div class="wrapper" @click="hanldeClose"></div>
    <div class="detail-dialog-container">
      <div class="title">{{ unitInfo.name }}</div>
      <img src="@/assets/data-views/dialog-close.png" alt="" class="close-img" @click="hanldeClose">
      <div class="content">
        <div class="section-header">
          <img src="@/assets/views-center/tag.png" alt="">
          <span>单位信息</span>
        </div>
        <div class="unit-info">
          <img :src="unitInfo.imgUrl" alt="">
          <div class="info">
            <div>
              <span class="pre">单位名称:</span>
              <span class="inner">{{ unitInfo.name }}</span>
            </div>
            <div>
              <span class="pre">单位类型:</span>
              <span class="inner">{{ unitInfo.compType | commonFilter('comp_type') }}</span>
            </div>
            <div>
              <span class="pre">证件号码:</span>
              <span class="inner">{{ unitInfo.legalPersonIdNo }}</span>
            </div>
          </div>
          <div class="right-info">
            <div>
              <span class="pre">行业类型:</span>
              <span class="inner">{{ unitInfo.industryType | commonFilter('industry_type') }}</span>
            </div>
            <div>
              <span class="pre">法人姓名:</span>
              <span class="inner">{{ unitInfo.legalPeronName }}</span>
            </div>
            <div>
              <span class="pre">手机号码:</span>
              <span class="inner">{{ unitInfo.legalPersonTel }}</span>
            </div>
          </div>
        </div>
        <div class="section-header">
          <img src="@/assets/views-center/tag.png" alt="">
          <span>从业人员</span>
        </div>
        <div>
          <el-table :data="tableData" height="308px" :row-class-name="tableRowClassName">
            <el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
            <el-table-column prop="" label="证件照" align="center">
              <template slot-scope="scope">
                <img :src="scope.row.imgShow" alt="">
              </template>
            </el-table-column>
            <el-table-column prop="name" label="姓名" align="center" width="115px"></el-table-column>
            <el-table-column prop="identityNo" label="证件号码" align="center"></el-table-column>
            <el-table-column prop="mobile" label="联系方式" align="center"></el-table-column>
            <el-table-column prop="" label="入职时间" align="center">
              <template slot-scope="scope">
                {{ scope.row.updateTime ? scope.row.updateTime.slice(0, 10) : '' }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAddrCompany } from '@/api/unitManage'
import { getEmployeesCurrent } from '@/api/employees'
export default {
  props: {
    unitId: {
      type: Number,
      default: null
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    unitId(val) {
      this.getData(val)
    }
  },
  data() {
    return {
      unitInfo: {},
      tableData: [],
    }
  },
  mounted() {
    document.body.appendChild(this.$el)
  },
  methods: {
    getData(id) {
      getAddrCompany(id).then(res => {
        res.status === 200 && (this.unitInfo = res.data)
      })
      getEmployeesCurrent({
        pageNo: 1,
        pageSize: 1000,
        _filter_eq_companyId: id,
      }).then(res => {
        res.status === 200 && (this.tableData = res.data.rows)
      })
    },
    tableRowClassName({row, rowIndex}) {
			if (rowIndex % 2 !== 0) {
				return 'warning-row';
			}
			return '';
		},
    hanldeClose() {
      this.$emit('update:visible', false)
    }
  }
};
</script>

<style lang="scss" scoped>
.unit-detail-dialog{
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9999;

  .wrapper {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: auto;
    background: #2a3340;
    opacity: 0.8;
    z-index: 999;
  }
  .detail-dialog-container {
    position: relative;
    width: 865px;
    height: 670px;
    top: 10%;
    margin: 0 auto;
    background: url("~@/assets/data-views/dialog-unit-detail.png") no-repeat center;
    padding: 18px 20px 22px;
    z-index: 1000;

    .title {
      color: white;
      font-size:18px;
      width: 196px;
      text-align: center;
      padding: 10px 0px;
      margin-bottom: 5px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .close-img {
      cursor: pointer;
      right: 40px;
      top: 35px;
      position: absolute;
    }

    .content {
      padding: 20px 20px;
      .section-header {
        // padding: 24px 0 16px 25px;
        color: rgba(226, 233, 238, 0.8602);
        display: flex;
        align-items: center;
        margin-bottom: 12px;
        img {
          margin-right: 5px;
        }
        span {
          font-size: 14px;
        }
      }
      .unit-info {
        display: flex;
        width:783px;
        height:152px;
        background: rgba(27, 37, 58, 0.4654);
        margin-bottom: 18px;
        padding-top: 18px;
        padding-bottom: 18px;
        padding-left: 39px;
        img {
          width:141px;
          height:116px;
          margin-right: 32px;
        }
        .info {
          width: 290px;
          padding-top: 6px;
          padding-bottom: 5px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          margin-right: 51px;
          .pre {
            font-size: 14px;
            color: rgba(107, 133, 166, 1);
          }
          .inner {
            color: rgba(255, 255, 255, 0.8511);
            font-size: 16px;
          }
        }
        .right-info {
          width: 200px;
          padding-top: 6px;
          padding-bottom: 5px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .pre {
            font-size: 14px;
            color: rgba(107, 133, 166, 1);
          }
          .inner {
            color: rgba(255, 255, 255, 0.8511);
            font-size: 16px;
          }
        }
      }
    }

    /deep/ {
      .el-table{
        img {
          width: 50px;
          height: 50px;
        }
        tr{
          background-color: transparent;
          th{
            background:linear-gradient(180deg,rgba(65,89,128,0.441) 0%,rgba(59,82,120,0.441) 100%);
            border-bottom: none;
            height: 34px;
            font-size: 14px;
            font-weight: bold;
            color:rgba(170,204,248,0.8371);
          }
          td {
            color:rgba(164,196,239,0.6238);
            border-bottom: none;
          }
        }
        .warning-row {
          background:rgba(60, 83, 121, 0.0964) !important;
        }
      }
      .el-table--enable-row-hover .el-table__body tr:hover > td {
        background-color: transparent;
      }
      .el-table--group::after, .el-table--border::after, .el-table::before {
        background-color: transparent;
      }
    }
  }
}
</style>
