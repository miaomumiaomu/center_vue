<template>
  <el-dialog :visible.sync="isFormDialogadd" width="1380px" title="车辆列表" append-to-body  :before-close="onclose">
    <div class="main">
      <!-- 表单筛选 -->
      <div class="history-title">
        <span>{{houseInfo.fullName}}</span>
        <el-button-group>
          <el-button :type="mode == 0 ? 'primary' : 'info'" @click="dataChange(0)" size="mini">
            当前关联车辆
          </el-button>
          <el-button :type="mode == 1 ? 'primary' : 'info'" @click="dataChange(1)" size="mini">
            历史关联车辆
          </el-button>
        </el-button-group>
      </div>
      <el-form class="common-table-form" ref="listForm" size="mini" :model="listQuery" :inline="true" @keyup.enter.native="onSearch" style="padding: 0;">
        <el-form-item prop="_filter_like_plateNumber" label="车牌号">
          <el-input placeholder="车牌号" v-model="listQuery._filter_like_plateNumber" />
        </el-form-item>
        <el-form-item prop="_filter_like_name" label="姓名">
          <el-input placeholder="姓名" v-model="listQuery._filter_like_name" />
        </el-form-item>
        <el-form-item prop="_filter_like_identityNo" label="证件号码">
          <el-input placeholder="证件号码" v-model="listQuery._filter_like_identityNo" />
        </el-form-item>
        <el-form-item prop="_filter_ge_beginTime" label="登记时间">
          <el-date-picker v-model="listQuery._filter_ge_beginTime" type="date" value-format="yyyyMMdd" placeholder="登记时间"/>
        </el-form-item>
        <el-form-item prop="_filter_le_endTime" label="移除时间" v-if="mode">
          <el-date-picker v-model="listQuery._filter_le_endTime" type="date" value-format="yyyyMMdd" placeholder="移除时间"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="onResetForm">重置</el-button>
        </el-form-item>
      </el-form>
      <!-- 工具栏 -->
      <div class="common-tool">
        <div class="title">
          {{ '登记车辆' }}
          <em>{{listTableData.total?listTableData.total:0}}</em>
        </div>
        <div class="right" v-if="!mode">
          <label-select ref="labelSelect" @complete="carSelect" style="display: inline-block;" :listShow="false" title="车辆选择" :handleWay="houseLinkCar"></label-select>
          <el-button class="txt-btn" size="mini" type="text" icon="el-icon-plus" @click="onItemEdit()">手动添加</el-button>
          <el-button class="txt-btn" size="mini" type="text" icon="el-icon-delete" @click="onItemDelete" v-permission="'FUNC_HOUSE_DELETE'">删除</el-button>
        </div>
      </div>
      <!-- 表格模式 S -->
      <el-table ref="listTabel" :data="listTableData.rows" height="calc(100vh - 400px)" v-loading.body="listTableLoading" highlight-current-row @selection-change="onListChange">
        <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="序号" align="center" type="index" width="50"/>
          <el-table-column width="120" prop="plateNumber" label="车牌号" align="center" />
          <el-table-column width="120" prop="vehicleType" label="车辆类型" align="center">
            <template slot-scope="scope">
              <div>{{scope.row.vehicleType | commonFilter('vehicle_type')}}</div>
            </template>
          </el-table-column>
          <el-table-column width="80" label="新能源" align="center">
            <template slot-scope="{row: {newEnergy}}">{{newEnergy ? '是' : '否'}}</template>
          </el-table-column>
          <el-table-column width="80" label="类别" align="center">
            <template slot-scope="scope">
              <face-category-list :data="carLibraryData" :type="0" :chosen="scope.row.libraryNums?scope.row.libraryNums.split(','):[]" />
            </template>
          </el-table-column>
          <el-table-column width="80" prop="name" label="车主姓名" align="center" />
          <el-table-column min-width="120" prop="identityNo" label="证件号码" align="center" />
          <el-table-column min-width="120" prop="phone" label="联系方式" align="center" />
          <el-table-column min-width="120" label="登记时间" align="center">
            <template slot-scope="{ row }">
              <div v-if="mode">
                {{row.checkTime}} 
                <div>-</div>
                {{row.moveTime}}</div>
              <div v-else>{{row.checkTime}}</div>
            </template>
          </el-table-column>
        <el-table-column width="140" label="操作" align="center">
          <template slot-scope="{ row }">
            <el-button size="mini" type="success" @click="onItemEdit(row, true)" v-permission="'FUNC_HOUSE_UPDATE'">详情</el-button>
            <el-button size="mini" type="success" @click="onItemEdit(row, false)" v-if="!mode" v-permission="'FUNC_HOUSE_UPDATE'">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 表格模式 E -->

      <el-pagination @size-change="onListLimit" @current-change="onListPaging" :current-page="listQuery.pageNo" :page-size="listQuery.pageSize" :page-sizes="[15,30,50]" layout="total, sizes, prev, pager, next, jumper" :total="listTableData.total" />
    </div>

    <div slot="footer">
      <el-button size="mini" @click="onclose">关闭</el-button>
    </div>

    <!-- 车辆选择 -->
    <labeladd-Form ref="labeladd" :is-open.sync="isAddFormDialog" :id="carId" @complete="addCarRel" :readonly="formReadonly"/>
  </el-dialog>
</template>

<script>
import moment from "moment";
import { carInHouse, carInHouseHistory, saveCarHouseRel, deleteCarHouseRel } from "@/api/houseManage";
import { mapState } from "vuex";

export default {
  props: {
    houseInfo: Object,
    isOpen: {
      default: false,
      type: Boolean
    },
  },
  data: () => ({
    isFormDialogadd: false,
    isAddFormDialog: false,
    carId: null,
    listIds: [],
    formReadonly: false,
    listTableData: {},
    mode: 0,
    temp: [], //缓存当前的输入条件
    baseQuery: {
      pageNo: 1,
      pageSize: 15,
      totalCount: null,
    },
    listQuery: {
      pageNo: 1,
      pageSize: 15,
      totalCount: null,
    },
    listTableLoading: false,
  }),
  computed: {
    ...mapState({
      carLibraryData: state => state.commonData.carLibraryData,
      userInfo: state=> state.user.userInfo,
    }),
    
  },
  watch: {
    isOpen(val) {
      if (val) {
        this.isFormDialogadd = val;
        this.getTableList();
      }
    },
    isFormDialogadd(val) {
      this.$emit("update:isOpen", val);
    }
  },
  components: {
    LabelSelect: () => import("../../carManage/carControl/components/LabelSelect"),
    LabeladdForm: () => import('../../carManage/carLibrary/components/LabeladdForm')
  },
  created() {
    this.$store.dispatch("commonData/getCarLibraryData");
  },
  methods: {
    onSearch() {
      this.getTableList();
    },
    // 获取表格数据
    getTableList() {
      this.listTableLoading = true;
      let _filter_eq_locationId = this.houseInfo.belongId
      if (!this.mode) {
        carInHouse({ ...this.listQuery, _filter_eq_locationId }).then(res => {
          this.listTableData = res.data;
        }).finally(() => {
          this.listTableLoading = false;
        });
      } else {
        carInHouseHistory({ ...this.listQuery, _filter_eq_locationId }).then(res => {
          this.listTableData = res.data;
        }).finally(() => {
          this.listTableLoading = false;
        });
      }
    },
    onItemEdit(data = {}, bool = false) {
      this.formReadonly = bool
      this.carId = data.id
      //只有新增才有外部数据
      this.$nextTick(() => {
        this.isAddFormDialog = true
      })
    },
    onItemDelete() {
      if (!this.listIds.length) {
        this.$notify({
          title: "提示",
          message: "请选择需要删除的数据",
          type: "warning",
          duration: 2000
        });
        return;
      }

      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        confirmButtonClass: "el-button--mini",
        cancelButtonClass: "el-button--mini fr",
        type: "warning"
      }).then(() => {
        let arr = this.listIds.map(item => {
          return {carId: item, locationId: this.houseInfo.belongId}
        })
        deleteCarHouseRel(arr).then(res => {
          let isSuccess = res.status === 200;
          this.$notify({
            title: isSuccess ? "成功" : "失败",
            message: isSuccess ? "删除成功" : res.message,
            type: isSuccess ? "success" : "error",
            duration: 2000
          });
          if (isSuccess) {
            this.getTableList();
          }
        });
      });
    },
    //房屋关联车辆方法
    houseLinkCar() {
      let { loginName, name: userName } = this.userInfo
      let { belongId: locationId } = this.houseInfo
      let carIds = this.$refs.labelSelect.getCarIds()
      return saveCarHouseRel({ loginName, userName, locationId, carIds })
    },
    carSelect(data) {
      this.getTableList()
    },
    addCarRel(data) {
      let { loginName, name: userName } = this.userInfo
      let { belongId: locationId } = this.houseInfo
      let carIds = [data.id]
      saveCarHouseRel({ loginName, userName, locationId, carIds }).then(res => {
        this.getTableList()
      })
    },
    onSubmit() {
      this.isFormDialogadd = false;
    },
    // 列表参数重置
    onResetForm() {
      this.listQuery = { ...this.baseQuery }
      this.temp[this.mode] = { ...this.baseQuery }
      this.getTableList();
    },
    // 更新列表选中
    onListChange(val) {
      this.listIds = val.map(item => item.id);
    },
    onListPaging(val) {
      this.listQuery.pageNo = val;
      this.listQuery.totalCount = this.listTableData.total;
      this.getTableList();
    },
    onListLimit(val) {
      this.listQuery.pageSize = val;
      this.listQuery.totalCount = this.listTableData.total;
      this.getTableList();
    },
    dataChange(val) {
      let index = val ? 0 : 1
      this.mode = val
      this.temp[index] = { ...this.listQuery }
      this.listQuery = this.temp[val] ? { ...this.temp[val] } : { ...this.baseQuery }
      this.getTableList()
    },
    onclose() {
      this.mode = 0
      this.isFormDialogadd = false
    },
  }
}

</script>
<style lang="scss" scoped>
  .el-pagination {
    padding: 0;
    margin-top: 15px;
  }
  .pic{
    width: 60px;
  }
  .history-title{
    display: flex;
    justify-content: space-between;
    padding: 0 6px;
  }
  /deep/{
    .el-table__body-wrapper{
      overflow: auto;
    }
  }
</style>