<template>
  <el-dialog :visible.sync="isFormDialogadd" width="1380px" title="住户列表" append-to-body :before-close="onclose">
    <div class="main">
      <!-- 表单筛选 -->
      <div class="history-title">
        <span>{{houseInfo.fullName}}</span>
        <el-button-group>
          <el-button :type="mode == 0 ? 'primary' : 'info'" @click="dataChange(0)" size="mini">
            当前住户
          </el-button>
          <el-button :type="mode == 1 ? 'primary' : 'info'" @click="dataChange(1)" size="mini">
            历史住户
          </el-button>
        </el-button-group>
      </div>
      <el-form class="common-table-form" ref="listForm" size="mini" :model="listQuery" :inline="true" @keyup.enter.native="onSearch" style="padding: 0;">
        <el-form-item prop="_filter_like_name" label="姓名">
          <el-input placeholder="姓名" v-model="listQuery._filter_like_name" />
        </el-form-item>
        <el-form-item prop="_filter_like_identityNo" label="证件号码">
          <el-input placeholder="证件号码" v-model="listQuery._filter_like_identityNo" />
        </el-form-item>
        <el-form-item prop="_filter_ge_beginTime" label="入住时间">
          <el-date-picker v-model="listQuery._filter_ge_beginTime" type="date" value-format="yyyyMMdd" placeholder="入住时间"/>
        </el-form-item>
        <el-form-item prop="_filter_le_endTime" label="搬离时间" v-if="mode">
          <el-date-picker v-model="listQuery._filter_le_endTime" type="date" value-format="yyyyMMdd" placeholder="搬离时间"/>
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
          {{ '居住' }}
          <em>{{listTableData.total?listTableData.total:0}}</em>
        </div>
        <div class="right" v-if="!mode">
          <el-button class="txt-btn" size="mini" type="text" icon="el-icon-plus" @click="onItemEdit()" v-permission="'FUNC_HOUSE_ADD'">添加</el-button>
          <el-button class="txt-btn" size="mini" type="text" icon="el-icon-delete" @click="onItemDelete" v-permission="'FUNC_HOUSE_DELETE'">删除</el-button>
        </div>
      </div>
      <!-- 表格模式 S -->
      <el-table ref="listTabel" :data="listTableData.rows" height="calc(100vh - 400px)" v-loading.body="listTableLoading" highlight-current-row @selection-change="onListChange">
        <el-table-column type="selection" width="50" />
        <el-table-column type="index" width="50" label="序号" />
        <el-table-column width="80" label="证件照" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.imgShow" class="pic">
          </template>
        </el-table-column>
        <el-table-column min-width="100" prop="name" label="姓名" align="center"></el-table-column>
        <el-table-column min-width="100" label="证件类型" align="center">
          <template slot-scope="{ row: { certificateType } }">{{ certificateType | commonFilter('document_types') }}</template>
        </el-table-column>
        <el-table-column min-width="180" prop="identityNo" label="证件号码" align="center"></el-table-column>
        <el-table-column min-width="120" prop="mobile" label="联系方式" align="center"></el-table-column>
        <el-table-column label="类别" min-width="60" align="center">
          <template slot-scope="scope">
            <face-category-list :data="faceLibraryData" :type="0" :chosen="scope.row.personTags?scope.row.personTags.split(','):[]" />
          </template>
        </el-table-column>
        <el-table-column width="60" prop="sex" label="性别" align="center">
        </el-table-column>
        <el-table-column width="60" prop="age" label="年龄" align="center"></el-table-column>
        <el-table-column width="80" prop="userType" label="住户类型" align="center"></el-table-column>
        <el-table-column width="150" :label="mode ? '在住时间' : '入住时间'" align="center">
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

    <label-form  ref="labelForm" :outData="outData" :is-open.sync="isDetailsForm" :id.sync="personId" :readonly="formReadonly" @complete="updateView"/>
  </el-dialog>
</template>

<script>
import moment from "moment";
import { personInHouse, personInHouseHistory, deletePersonHouseRel } from "@/api/houseManage";
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
    isDetailsForm: false,
    personId: null,
    outData: null,
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
      faceLibraryData: state => state.commonData.faceLibraryData,
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
    LabelForm: () => import("@/components/FaceLabelForm"),
  },
  created() {
    this.$store.dispatch("commonData/getFaceLibraryData");
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
        personInHouse({ ...this.listQuery, _filter_eq_locationId }).then(res => {
          this.listTableData = res.data;
        }).finally(() => {
          this.listTableLoading = false;
        });
      } else {
        personInHouseHistory({ ...this.listQuery, _filter_eq_locationId }).then(res => {
          this.listTableData = res.data;
        }).finally(() => {
          this.listTableLoading = false;
        });
      }
    },
    onItemEdit(data = {}, bool = false) {
      this.formReadonly = bool
      this.personId = data.id
      //只有新增才有外部数据
      if (!data.id) {
        let { locationCode, belongId: locationId, fullName: locationName, id:houseId, name: houseName } = this.houseInfo
        this.outData = { houses: [{ locationCode, locationId, locationName, houseId, houseName }] }
      } else {
        this.outData = null
      }
      this.$nextTick(() => {
        this.isDetailsForm = true
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
          return {personId: item, locationId: this.houseInfo.belongId}
        })
        deletePersonHouseRel(arr).then(res => {
          let isSuccess = res.status === 200;
          this.$notify({
            title: isSuccess ? "成功" : "失败",
            message: isSuccess ? "删除成功" : res.message,
            type: isSuccess ? "success" : "error",
            duration: 2000
          });

          if (isSuccess) {
            this.updateView();
          }
        });
      });
    },
    updateView() {
      this.getTableList()
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