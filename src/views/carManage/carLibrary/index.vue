<template>
  <div class="app-container">
    <el-row>
      <!-- 左侧标签库管理 S -->
      <jurisdiction-addr-menu @change="onMenuChange" />
      <!-- <label-library ref="labelLibrary" @change="onMenuChange" /> -->
      <!-- 左侧标签库管理 E -->
      <el-col :span="18" class="table-box">
        <!-- 表单筛选 -->
        <el-form
          class="common-table-form"
          ref="listForm"
          label-width="70px"
          :model="listQuery"
          :inline="true"
          size="mini"
          @submit.native.prevent
        >
          <!-- <el-form-item prop="pageNo" class="m0" />
          <el-form-item prop="pageSize" class="m0" />
          <el-form-item prop="totalCount" class="m0" />-->
          <el-form-item label="车牌号" prop="_filter_like_plateNumber">
            <el-input @keyup.enter.native="onSearch" v-model="listQuery._filter_like_plateNumber" clearable size="mini" />
          </el-form-item>
          <el-form-item label="车辆类型" prop="_filter_eq_vehicleType">
            <dict-select dict-name="vehicle_type" v-model="listQuery._filter_eq_vehicleType" />
            <!-- <el-input @keyup.enter.native="onSearch" v-model="listQuery._filter_eq_vehicleType" clearable size="mini" /> -->
          </el-form-item>
          <el-form-item label="新能源" prop="_filter_eq_newEnergy">
            <el-select v-model="listQuery._filter_eq_newEnergy" placeholder="请选择" clearable>
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="0"></el-option>
            </el-select>
            <!-- <el-input @keyup.enter.native="onSearch" v-model="listQuery._filter_eq_newEnergy" clearable size="mini" /> -->
          </el-form-item>
          <el-form-item label="车辆类别" prop="_filter_eq_libraryNums">
            <!-- <el-input @keyup.enter.native="onSearch" v-model="listQuery._filter_eq_libraryNums" clearable size="mini" /> -->
            <el-select v-model="listQuery._filter_eq_libraryNums" placeholder="请选择" clearable>
              <el-option
                v-for="key in Object.keys(carLibraryData)"
                :key="key"
                :label="carLibraryData[key].name"
                :value="key">
              </el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="房号" prop="_filter_like_houseName">
            <el-input @keyup.enter.native="onSearch" v-model="listQuery._filter_like_houseName" clearable size="mini" />
          </el-form-item> -->
          <el-form-item label="所属小区" prop="_filter_eq_communityId">
            <communities-select v-model="listQuery._filter_eq_communityId" clearable/>
            <!-- <el-input @keyup.enter.native="onSearch" v-model="listQuery._filter_eq_communityId" clearable size="mini" /> -->
          </el-form-item>
          <!-- <el-form-item label="辖　　区" prop="_filter_like_policeAreaCode">
            <jurisdiction-person-search v-model="listQuery._filter_like_policeAreaCode"></jurisdiction-person-search>
          </el-form-item> -->
          <el-form-item label="车主姓名" prop="_filter_like_ownerName">
            <el-input @keyup.enter.native="onSearch" v-model="listQuery._filter_like_ownerName" clearable size="mini" />
          </el-form-item>
          <el-form-item label="证件号码" prop="_filter_like_ownerIdNo">
            <el-input @keyup.enter.native="onSearch" v-model="listQuery._filter_like_ownerIdNo" clearable size="mini" />
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
            {{ fullAddressName }}
            <em v-if="listTableData.total === 0 || listTableData.total">{{ listTableData.total }}</em>
          </div>
          <div class="right">
            <el-button class="txt-btn" size="mini" type="text" icon="el-icon-plus" @click="onItemEdit()" v-permission="'FUNC_CAR_ADD'">添加</el-button>
            <el-button class="txt-btn" size="mini" type="text" icon="el-icon-delete"  @click="onItemDelete()" v-permission="'FUNC_CAR_DELETE'">删除</el-button>
            <div class="separator"></div>
            <!-- <el-button class="txt-btn" size="mini" type="text" icon="el-icon-download">导入</el-button>
            <el-button class="txt-btn" size="mini" type="text" icon="el-icon-upload2">导出</el-button> -->
          </div>
        </div>

        <!-- 表格模式 S -->
        <el-table
          ref="listTabel"
          :data="listTableData.rows"
          v-loading.body="listTableLoading"
          highlight-current-row
          height="100%"
          @selection-change="onListChange"
        >
          <el-table-column type="selection" width="30" align="right" />
          <el-table-column label="序号" align="center" type="index" width="50"/>
          <el-table-column width="100" prop="plateNumber" label="车牌号" align="center" />
          <el-table-column width="120" prop="vehicleType" label="车辆类型" align="center">
            <template slot-scope="scope">
              <div>{{scope.row.vehicleType | commonFilter('vehicle_type')}}</div>
            </template>
          </el-table-column>
          <el-table-column width="80" prop="newEnergy" label="新能源" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.newEnergy == 0 ? '否' : '是' }}</div>
            </template>
          </el-table-column>
          <el-table-column width="80" label="类别" align="center">
            <template slot-scope="scope">
              <face-category-list :data="carLibraryData" :type="0" :chosen="scope.row.libraryNums?scope.row.libraryNums.split(','):[]" />
            </template>
          </el-table-column>
          <el-table-column width="80" prop="communityName" label="所属小区" align="center" />
          <el-table-column width="200" prop="fullName" label="所属房屋" align="center" />
          <el-table-column width="80" prop="policeAreaName" label="所属辖区" align="center" />
          <el-table-column width="80" prop="ownerName" label="车主姓名" align="center" />
          <el-table-column min-width="120" prop="ownerIdentityNo" label="证件号码" align="center" />
          <el-table-column min-width="120" prop="ownerPhone" label="电话" align="center" />
          <el-table-column fixed="right" width="90" label="操作" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="success" @click="onItemEdit(scope.row.id)" v-permission="'FUNC_CAR_UPDATE'">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 表格模式 E -->
        <el-pagination @size-change="onListLimit" @current-change="onListPaging" :current-page="listQuery.pageNo" :page-size="listQuery.pageSize" :page-sizes="[15,30,50]" layout="total, sizes, prev, pager, next, jumper" :total="listTableData.total" />
      </el-col>
    </el-row>

    <labeladd-Form ref="labeladd" :is-open.sync="isAddFormDialog" :id="labelFormId" @complete="getTableList" />
  </div>
</template>
<script>
import { mapState } from "vuex";
import { deleteLabel } from "@/api/faceLibrary";
import { colorBrightness } from "@/utils";
import { getRealCarinfos, Editcarinfos, DeletecarInfos } from "@/api/carManage";

export default {
  name: "carLibrary",
  components: {
    LabeladdForm: () => import("./components/LabeladdForm"),
    LabelLibrary: () => import("./components/LabelLibrary"),
    JurisdictionAddrMenu: () => import("@/components/JurisdictionAddrMenu"),
    JurisdictionPersonSearch: () => import("@/components/JurisdictionPersonSearch")
  },
  data() {
    return {
      mode: 0, // 显示切换
      isAddFormDialog: false, // 控制表单显示
      labelFormId: null, // 当前id
      colorBrightness: colorBrightness, // 色彩亮度判断
      ids: [],
      formReadonly: false,
      fullAddressName: '',
      listIds: [],
      listQuery: {
        pageNo: 1,
        pageSize: 15,
        _filter_like_locationCode: null,
        _filter_like_policeAreaCode: null,
        _filter_like_plateNumber: null,
        _filter_eq_vehicleType: null,
        _filter_eq_newEnergy: null,
        _filter_eq_libraryNums: null,
        _filter_eq_communityId: null,
        // _filter_like_houseName: null,
        _filter_like_ownerName: null,
        _filter_like_ownerIdNo: null,
      },
      listTableData: {},
      listTableLoading: false
    };
  },
  computed: {
    ...mapState({
      carLibraryData: state => state.commonData.carLibraryData,
      userInfo: state=> state.user.userInfo,
    })
  },
  created() {
    this.fullAddressName = this.userInfo.policeAreaName
    this.$store.dispatch("commonData/getCarLibraryData");
  },
  mounted() {
    this.listQuery._filter_like_policeAreaCode = this.userInfo.policeAreaCode
    this.getTableList()
  },
  methods: {
    // 表格选中 数据
    select(selection) {
      this.listIds = selection.map(item => item.id);
    },
    // 更新页面数据
    updateView(val) {
      this.labelFormId = null;
      this.onSearch();

      // if (val) {
      //   this.$refs.labelLibrary.menuList();
      // } else {
      //   this.onSearch();
      // }
    },
    // 菜单更新
    onMenuChange(status, data, node, labels) {
      if (data.areaId) {
        this.listQuery._filter_like_locationCode = data.code
        this.listQuery._filter_like_policeAreaCode = null
      } else {
        this.listQuery._filter_like_locationCode = null
        this.listQuery._filter_like_policeAreaCode = data.code
      }
      this.fullAddressName = labels;
      this.getTableList();
    },
    // 获取表格数据
    getTableList() {
      this.listTableLoading = true;
      getRealCarinfos(this.listQuery)
        .then(res => {
          if (res.status === 200) {
            this.listTableData = res.data;
          }
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
      });
      this.getTableList();
    },
    // 列表参数重置
    onResetForm() {
      this.$refs.listForm.resetFields();
      // this.getTableList();
    },
    // 更新列表选中
    onListChange(val) {
      this.listIds = val.map(item => {
        return {
          carId: item.id,
          locationId: item.locationId,
        }
      });
    },
    // 表单编辑
    onItemEdit(id) {
      this.labelFormId = id || null;
      this.$nextTick(() => {
        this.isAddFormDialog = true;
      });
    },
    // 车辆信息 批量删除
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
        DeletecarInfos(this.listIds).then(res => {
          let isSuccess = res.status === 200;
          this.$notify({
            title: isSuccess ? "成功" : "失败",
            message: isSuccess ? "删除成功" : res.message,
            type: isSuccess ? "success" : "error",
            duration: 2000
          });
          if (isSuccess) {
            this.updateView(true);
          }
        });
      });
    },

    /* 分页处理 */
    onListPaging(val) {
      this.listQuery.pageNo = val;
      // this.listQuery.totalCount = this.listTableData.total;
      this.getTableList();
    },
    onListLimit(val) {
      this.listQuery.pageSize = val;
      // this.listQuery.totalCount = this.listTableData.total;
      this.getTableList();
    }
    /* 分页处理 */
  }
};
</script>
<style lang="scss" scoped>
.app-container {
  position: relative;
  height: 100%;
  .el-row,
  .el-col {
    height: 100%;
  }
  .el-table {
    .pic {
      display: block;
      width: 50px;
      height: 62px;
      margin: 0 auto;
    }
  }
}
.table-box {
  display: flex;
  flex-direction: column;
  .el-button {
    margin-left: 0;
  }
  .el-pagination {
    padding: 10px;
  }
  .identity {
    line-height: 140%;
    label {
      font-size: 14px;
    }
    p {
      color: #9da5af;
    }
  }
  .label-item {
    display: inline-block;
    height: 22px;
    line-height: 18px;
    padding: 0 3px;
    margin: 0 4px 4px;
    text-align: center;
    border: 2px #fff solid;
    border-radius: 99px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    font-size: 12px;
    color: #fff;
  }
  .title {
    height: 38px;
  }
  .bg {
    width: 30px;
    height: 30px;
    margin: 0 auto;
  }
}
</style>