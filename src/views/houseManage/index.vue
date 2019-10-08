<template>
  <div class="house-manage app-container">
    <el-row>
      <!-- 左侧地址菜单 S -->
      <jurisdiction-addr-menu @change="onMenuChange" _key="houseManageFlag"/>
      <!-- 左侧地址菜单 E -->

      <el-col :span="18" class="table-box">
        <!-- 表单筛选 -->
        <el-form 
          class="common-table-form"
          ref="listForm"
          label-width="70px"
          :model="listQuery"
          :inline="true"
          @submit.native.prevent size="mini"
        >
          <el-form-item prop="pageNo" class="m0" />
          <el-form-item prop="pageSize" class="m0" />
          <el-form-item prop="totalCount" class="m0" />
          <el-form-item label="房屋名称" prop="_filter_like_name">
            <el-input @keyup.enter.native="onSearch" v-model="listQuery._filter_like_name" clearable />
          </el-form-item>
          <el-form-item label="所属小区" prop="_filter_eq_communityId">
            <communities-select v-model="listQuery._filter_eq_communityId" :policeAreaCode="listQuery._filter_like_policeAreaCode"  class="nowrap" clearable/>
          </el-form-item>
          <el-form-item label="房屋分类" prop="_filter_eq_manageLevel">
            <dict-select dict-name="house_manage_level" v-model="listQuery._filter_eq_manageLevel"/>
          </el-form-item>
          <el-form-item label="使用形式" prop="_filter_eq_usageType">
            <dict-select dict-name="house_use_type" v-model="listQuery._filter_eq_usageType"/>
          </el-form-item>
          <el-form-item label="住户人数" prop="">
            <div class="generation">
              <el-input v-model="listQuery._filter_ge_startPersonCount" class="generation-input"></el-input>
              <div> - </div>
              <el-input v-model="listQuery._filter_le_endPersonCount" class="generation-input"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="房屋用途" prop="_filter_eq_purposeType">
            <dict-select dict-name="house_use" v-model="listQuery._filter_eq_purposeType"/>
          </el-form-item>
          <el-form-item label="业主姓名" prop="_filter_like_ownerName">
            <el-input @keyup.enter.native="onSearch" v-model="listQuery._filter_like_ownerName" clearable />
          </el-form-item>
          <el-form-item label="证件号码" prop="_filter_like_ownerIdentityNo">
            <el-input @keyup.enter.native="onSearch" v-model="listQuery._filter_like_ownerIdentityNo" clearable />
          </el-form-item>
          <el-form-item label="车辆关联" prop="_filter_eq_ownCarCount">
            <el-select v-model="listQuery._filter_eq_ownCarCount" placeholder="请选择" clearable>
              <el-option label="拥有车辆" value="1"></el-option>
              <el-option label="没有车辆" value="0"></el-option>
            </el-select>
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
            {{addressName}}
            <em>{{listTableData.total?listTableData.total:0}}</em>
          </div>
          <div class="right">
            <!-- <el-button class="txt-btn" size="mini" type="text" icon="el-icon-plus" @click="onItemEdit()" v-permission="'FUNC_HOUSE_ADD'">添加</el-button>
            <el-button class="txt-btn" size="mini" type="text" icon="el-icon-delete" @click="onItemDelete" v-permission="'FUNC_HOUSE_DELETE'">删除</el-button> -->
          </div>
        </div>

        <!-- 表格模式 S -->
        <el-table
          ref="listTabel"
          :data="listTableData.rows"
          v-loading.body="listTableLoading"
          height="100%"
          highlight-current-row
          @selection-change="onListChange"
        >
          <el-table-column type="selection" width="50" />
          <el-table-column label="序号" align="center" type="index" width="50"/>
          <el-table-column prop="name" label="房屋名称" min-width="110" align="center" />
          <el-table-column prop="communityName" label="所属小区" min-width="100" align="center" />
          <el-table-column prop="fullName" label="房屋地址" min-width="170" align="center" />
          <el-table-column prop="policeAreaName" label="所属辖区" min-width="80" align="center" />
          <el-table-column prop="manageLevel" label="房屋分类" min-width="80" align="center">
            <template slot-scope="{ row: { manageLevel } }">{{ manageLevel | commonFilter('house_manage_level') }}</template>
          </el-table-column>
          <el-table-column prop="usageType" label="使用形式" min-width="80" align="center">
            <template slot-scope="{ row: { usageType } }">{{ usageType | commonFilter('house_use_type') }}</template>
          </el-table-column>
          <el-table-column prop="purposeType" label="房屋用途" min-width="80" align="center">
            <template slot-scope="{ row: { purposeType } }">{{ purposeType | commonFilter('house_use') }}</template>
          </el-table-column>
          <el-table-column prop="ownerName" label="业主姓名" width="80" align="center" />
          <el-table-column prop="ownerIdentityNo" label="证件号码" width="150" align="center" />
          <el-table-column label="车辆数量" width="80" align="center">
            <template slot-scope="{row}">
              <div @click="carListOpen(row)" style="color: #409EFF; cursor: pointer;">{{row.ownCarCount}}</div>
            </template>
          </el-table-column>
          <el-table-column label="住户人数" width="80" align="center">
            <template slot-scope="{row}">
              <div @click="personListOpen(row)" style="color: #409EFF; cursor: pointer;">{{row.personCount}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="" label="最后更新人员" width="100" align="center" />
          <el-table-column prop="" label="最后更新时间" width="100" align="center" />
          <el-table-column fixed="right" width="70" label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="success" @click="onItemEdit(scope.row.id)" v-permission="'FUNC_HOUSE_UPDATE'">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 表格模式 E -->

        <el-pagination @size-change="onListLimit" @current-change="onListPaging" :current-page="listQuery.pageNo" :page-size="listQuery.pageSize" :page-sizes="[15,30,50]" layout="total, sizes, prev, pager, next, jumper" :total="listTableData.total" />
      </el-col>
    </el-row>

    <!-- 房屋表单 -->
    <house-form ref="houseForm" :is-open.sync="isFormDialog" :id="houseFormId" :data="currentMenuData" @complete="updateView" :nodeData="nodeData"/>
    <history-person :isOpen.sync="personOpen" :houseInfo="houseInfo"></history-person>
    <history-car :isOpen.sync="carOpen" :houseInfo="houseInfo"></history-car>
  </div>
</template>
<script>
import {
  getRegionTree,
  getHouseList,
  deleteHouse
} from "@/api/houseManage";
import { mapState } from "vuex";

export default {
  components: {
    HouseForm: () => import("./components/HouseForm"),
    JurisdictionAddrMenu: () => import("@/components/JurisdictionAddrMenu"),
    HistoryPerson: () => import('./components/historyPerson'),
    historyCar: () => import('./components/historyCar')
  },
  data() {
    return {
      cascaderIndex: [],
      cascaderOptions: [],
      cascaderProps: {
        value: "id"
      },

      currentMenuData: null,
      listIds: [],
      houseInfo: {},
      carOpen: false,
      personOpen: false,
      listQuery: {
        pageNo: 1,
        pageSize: 15,
        totalCount: null,
        _filter_like_locationCode: null,
        _filter_like_policeAreaCode: null,
        _filter_like_name: null,
        _filter_eq_communityId: null,
        _filter_like_policeAreaCode: null,
        _filter_eq_manageLevel: null,
        _filter_eq_usageType: null,
        _filter_eq_purposeType: null,
        _filter_like_ownerName: null,
        _filter_like_ownerIdentityNo: null,
        _filter_eq_ownCarCount: null,
        _filter_ge_startPersonCount: null,
        _filter_le_endPersonCount: null,
      },
      listTableData: {},
      listTableLoading: false,

      isFormDialog: false,
      houseFormId: null,
      addressName: null,
      nodeData: {}, //树节点的数据
    };
  },
  computed: {
    ...mapState({
      userInfo: state=> state.user.userInfo,
    })
  },
  methods: {
    init() {
      this.getRegionData();
    },
    updateView() {
      this.getTableList();
    },
    onMenuChange(status, data, node, labels) {
      this.$refs.listForm.resetFields()
      if (data.areaCode) {
        this.listQuery._filter_like_locationCode = data.code
        this.listQuery._filter_like_policeAreaCode = data.areaCode
      } else {
        this.listQuery._filter_like_locationCode = null
        this.listQuery._filter_like_policeAreaCode = data.code
      }
      this.addressName = labels
      this.nodeData = {...data, labels }
      this.getTableList()
    },
    getTableList() {
      this.listTableLoading = true;
      getHouseList(this.listQuery)
        .then(res => {
          this.listTableData = res.data;
        })
        .finally(() => {
          this.listTableLoading = false;
        });
    },
    // 查询
    onSearch() {
      this.listQuery = Object.assign(this.listQuery, {
        pageNo: 1,
        pageSize: 15,
        totalCount: null
      });
      this.getTableList();
    },
    // 列表参数重置
    onResetForm() {
      this.$refs.listForm.resetFields();
      this.$set(this.listQuery, '_filter_ge_startPersonCount', null)
      this.$set(this.listQuery, '_filter_le_endPersonCount', null)
      // this.getTableList();
    },
    // 更新列表选中
    onListChange(val) {
      this.listIds = val.map(item => item.id);
    },
    // 表单编辑
    onItemEdit(id) {
      this.houseFormId = id || null;
      this.$nextTick(() => {
        this.isFormDialog = true;
      });
    },
    // 批量删除
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
        deleteHouse({
          ids: this.listIds
        }).then(res => {
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
    //打开住户列表
    personListOpen(data) {
      this.houseInfo = data
      this.personOpen = true
    },

    //打开车辆列表
    carListOpen(data) {
      this.houseInfo = data
      this.carOpen = true
    },
    
    /* 分页处理 */
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
    /* 分页处理 */
    getDictionary() {
      getDictionary('house_type').then(res => {
        this.listData = res.data;
      });
    },
  },
  mounted() {
    this.listQuery._filter_like_policeAreaCode = this.userInfo.policeAreaCode
    this.addressName = this.userInfo.policeAreaName
    this.getTableList()
  }
};
</script>
<style lang="scss" scoped>
.house-manage {
  height: 100%;
  .generation{
    display: flex;
    justify-content: space-between;
    align-items: center;
    .generation-input{
      width: 36px;
      padding: 0 3px;
      /deep/ .el-input__inner{
        padding: 0 3px;
      }
    }
  }

  .expand-form {
    display: flex;
    justify-content: space-between;
    /deep/ .el-form-item {
      margin-bottom: 0px;
    }
  }

  .region {
    height: 46px;
    line-height: 26px;
    padding: 10px 0;
    overflow: hidden;
    font-size: 0;
    label {
      display: inline-block;
      padding: 0 2px 0 10px;
      text-align: right;
      font-size: 13px;
      font-weight: normal;
      color: #3f4041;
    }
    .el-cascader {
      width: 420px;
    }
  }

  .el-row {
    height: 100%;
    .el-col {
      height: 100%;
    }
  }

  .el-pagination {
    padding: 10px;
  }

  .table-box {
    display: flex;
    flex-direction: column;
    .form {
      background: #fafbfd;
      height: 46px;
      line-height: 46px;
      padding: 0 12px;
      font-size: 0;
      .el-form-item {
        height: auto;
        line-height: 100%;
        margin: 4px 6px 0 0;
      }
    }
    .el-button {
      margin-left: 0;
    }
    .el-pagination {
      padding: 10px;
    }
  }
}
</style>