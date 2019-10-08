<template>
  <div class="content">
    <div v-if="visible">
      <div class="section-header">
        <img src="@/assets/views-center/tag.png" alt="">
        <span>单位信息</span>
      </div>
      <div class="unit-list-container">
        <img src="@/assets/data-views/left-arrow.png" alt="" @click="shiftList('left')">
        <div class="unit-list-transform">
          <div ref="list" class="unit-list" :style="{ transform: `translateX(${translateX}px)` }">
            <template v-for="(item, index) in unitList">
              <span :class="{ 'unit-single': true, 'unit-hover': hoverIndex === index }" :key="index" @click="changeUnit(index)">
                {{ item.name }}
              </span>
            </template>
          </div>
        </div>
        <img src="@/assets/data-views/right-arrow.png" alt="" @click="shiftList('right')">
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
            <span class="inner">{{ unitInfo.legalPersonName }}</span>
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
          <el-table-column prop="createTime" label="入职时间" align="center">
            <template slot-scope="scope">
              {{ scope.row.createTime ? scope.row.createTime.slice(0, 10) : '' }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="no-data" v-else>暂无数据</div>
  </div>
</template>

<script>
import { addrCompanyList } from "@/api/unitManage";
import { getEmployeesCurrent } from '@/api/employees'
export default {
  props: {
  },
  watch: {
  },
  computed: {
  },
  data() {
    return {
      visible: true,
      translateX: 0,
      hoverIndex: 0,

      filterType: '0',
      pageSize: 10,

      unitList: [],
      unitInfo: {},
      tableData: [],
    };
  },
  mounted() {
  },
  methods: {
    getData(id, code, init = false) {
      if (init) { 
        this.tableData = []
        this.unitInfo = {}
        this.translateX = 0
      }
      addrCompanyList({
        pageNo: 1,
        pageSize: 100,
        _filter_like_locationCode: code
      }).then(res => {
        if (res.status === 200) {
          if (res.data.rows) {
            this.unitList = res.data.rows
            this.unitInfo = res.data.rows[0]
            this.getEmployees(res.data.rows[0].id)
            this.visible = true
          } else {
            this.visible = false
          }
        }
      })
    },
    getEmployees(conpanyId) {
      getEmployeesCurrent({
        pageNo: 1,
        pageSize: 1000,
        _filter_eq_companyId: conpanyId,
      }).then(res => {
        res.status === 200 && (this.tableData = res.data.rows)
      })
    },
    shiftList(direction) {
      if (direction === 'left') {
        this.translateX += 300
        if (this.translateX > 0) {
          this.translateX = 0
        }
      } else {
        if (this.$refs.list.clientWidth < 736) { // 单位不够多
          return
        }
        this.translateX -= 300
        if (this.translateX < -(this.$refs.list.clientWidth - 736)) {
          this.translateX = -(this.$refs.list.clientWidth - 736)
        }
      }
    },
    changeUnit(index) {
      this.hoverIndex = index
      this.unitInfo = this.unitList[index]
      this.getEmployees(this.unitList[index].id)
    },
    tableRowClassName({row, rowIndex}) {
			if (rowIndex % 2 !== 0) {
				return 'warning-row';
			}
			return '';
		},
  }
};
</script>

<style lang="scss" scoped>
.content {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;
  padding: 17px 21px 13px;

  .unit-list-container {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    img {
      cursor: pointer;
    }
    .unit-list-transform {
      width: calc(100% - 50px);
      overflow: hidden;
      .unit-list {
        transition: transform .3s;
        color: rgba(107, 133, 166, 0.7729);
        width: fit-content;
        white-space: nowrap;
        .unit-single {
          margin-right: 23px;
          cursor: pointer;
        }
        .unit-hover {
          color: rgba(53, 126, 213, 1);
        }
      }
    }
  }

  .section-header {
    // padding: 24px 0 16px 25px;
    color: rgba(226, 233, 238, 0.8602);
    display: flex;
    align-items: center;
    margin-bottom: 8px;
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
    margin-bottom: 15px;
    padding-top: 16px;
    padding-bottom: 20px;
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

  .no-data {
    display: flex;
    justify-content: center;
    align-items: center;
    color: rgba(255, 255, 255, 0.8511);
    height: 100%;
  }
}
</style>
