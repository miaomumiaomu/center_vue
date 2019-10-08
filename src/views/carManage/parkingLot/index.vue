<template>
  <div class="app-container">
    <!-- 表单筛选 -->
    <el-form class="form" ref="listForm" :inline="true" :model="listQuery" @submit.native.prevent>
      <el-form-item label="关键字" prop="_filter_like_keyword">
        <el-input
          size="mini"
          placeholder="停车场名称"
          @keyup.enter.native="onSearch"
          v-model="listQuery._filter_like_keyword"
        />
      </el-form-item>
      <el-form-item prop="_filter_eq_communityId" label="所属小区">
        <communities-select v-model="listQuery._filter_eq_communityId" class="nowrap" placeholder="全部" />
      </el-form-item>
      <el-form-item>
        <el-button size="mini" type="primary" @click="onSearch">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="mini" @click="onResetForm">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 工具栏 -->
    <div class="common-tool">
      <div class="title">
        停车场信息
        <em>{{listTableData.total?listTableData.total:0}}</em>
      </div>
      <div class="right">
        <el-button
          class="txt-btn"
          size="mini"
          type="text"
          icon="el-icon-plus"
          @click="onItemEdit()"
        >添加</el-button>
        <el-button
          class="txt-btn"
          size="mini"
          type="text"
          icon="el-icon-delete"
          @click="onItemDelete()"
        >删除</el-button>
      </div>
    </div>

    <el-table
      ref="listTabel"
      :data="listTableData.rows"
      height="calc(100vh - 255px)"
      v-loading.body="listTableLoading"
      highlight-current-row
      @selection-change="onListChange"
    >
      <el-table-column type="selection" align="center" width="45"/>
      <el-table-column type="index" label="序号" align="center" width="50"/>
      <el-table-column label="停车场名称" align="center" prop="name" min-width="100"/>
      <el-table-column label="经纬度" align="center">
        <template
          slot-scope="scope"
        >{{scope.row.lng&&scope.row.lat?scope.row.lng+'，'+scope.row.lat:''}}</template>
      </el-table-column>
      <el-table-column label="所属小区" align="center" prop="communityName" min-width="100px"/>
      <!-- <el-table-column label="实有单位编号" align="center" prop="communityCode" min-width="100px"/> -->
      <el-table-column fixed="right" min-width="70" align="center" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="onItemEdit(scope.row.id)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :page-sizes="[15,30,50]"
      :current-page="listQuery.pageNo"
      @current-change="onListPaging"
      :page-size="listQuery.pageSize"
      @size-change="onListLimit"
      layout="total,sizes,prev,pager,next,jumper"
      :total="listTableData.total"
    />

    <!-- 弹窗 -->
    <parking-lot-form :is-open.sync="isFormDialog" :id="parkFormId" @complete="onUpdateTable"/>
  </div>
</template>

<script>
import ParkingLotForm from "./components/ParkingLotForm";
import {
  getParkingLotList,
  deleteParkingLot
} from "@/api/carManage/parkingLot";

export default {
  name:'parkingLot',
  data() {
    return {
      listQuery: {
        pageNo: 1,
        pageSize: 15,
        _filter_like_keyword: ""
      },
      listTableLoading: false,
      listIds: [], //选中的id
      listTableData: {},
      isFormDialog: false,
      parkFormId: null
    };
  },
  components: {
    "parking-lot-form": ParkingLotForm
  },
  created() {
    this.getTableList();
  },
  methods: {
    getTableList() {
      getParkingLotList(this.listQuery).then(res => {
        this.listTableData = res.data;
      });
    },
    onSearch() {
      this.listQuery.pageNo = 1;
      this.getTableList();
    },
    onResetForm() {
      this.$refs.listForm.resetFields();
      this.getTableList();
    },
    onListChange(val) {
      this.listIds = val.map(item => item.id);
    },
    onListLimit(val) {
      this.listQuery.pageSize = val;
      this.listQuery.pageNo = 1;
      this.getTableList();
    },
    onListPaging(val) {
      this.listQuery.pageNo = val;
      this.getTableList();
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

      this.$confirm("此操作将永久删除，是否继续？", "提示", {
        cancelButtonText: "取消",
        cancelButtonClass: "el-button-mini fr",
        comfirmButtonText: "确认",
        comfirmButtonClass: "el-button-mini",
        type: "warning"
      }).then(() => {
        deleteParkingLot({ ids: this.listIds }).then(res => {
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
    onItemEdit(id) {
      this.parkFormId = id || null;
      this.$nextTick(() => {
        this.isFormDialog = true;
      });
    },
    onUpdateTable() {
      this.getTableList();
    }
  }
};
</script>

<style lang="scss" scoped>
.app-container,
.main {
  position: relative;
  height: 100%;
  & > .el-col {
    height: 100%;
  }
  .m0 {
    margin: 0;
  }
  .form {
    background: #fafbfd;
    height: 46px;
    line-height: 46px;
    overflow: hidden;
    font-size: 0;
    margin-left: 12px;
    & > * {
      margin-right: 6px;
    }
    span {
      display: inline-block;
      padding: 0 2px 0 10px;
      text-align: right;
      font-size: 13px;
      color: #3f4041;
    }
    /deep/ .el-input--medium .el-input__inner{
      height: 26px;
      line-height: 26px;
    }
    .el-input {
      width: 180px;
    }
    .el-button {
      margin-left: 0;
    }
    /deep/ {
      .el-form-item--medium .el-form-item__content {
        line-height: 46px;
      }
    }
  }
  .el-pagination {
    padding: 10px 12px;
  }
}
</style>
