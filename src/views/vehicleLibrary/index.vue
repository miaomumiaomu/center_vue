<template>
  <div class="app-container">
    <el-row>
      <!-- 左侧标签库管理 S -->
      <label-library ref="labelLibrary" @change="onMenuChange" />
      <!-- 左侧标签库管理 E -->
      <el-col :span="19" class="table-box">
        <!-- 表单筛选 -->
        <el-form class="common-table-form" ref="listForm" :model="listQuery" :inline="true" size="mini" @submit.native.prevent>
          <!-- <el-form-item prop="pageNo" class="m0" />
          <el-form-item prop="pageSize" class="m0" />
          <el-form-item prop="totalCount" class="m0" />-->
          <el-form-item label="关键字" prop="_filter_like_keyword">
            <el-input @keyup.enter.native="onSearch" placeholder="车牌号/姓名/证件号/手机号查询 " v-model="listQuery._filter_like_keyword" clearable size="mini" style="width: 230px" />
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
          <div class="title" v-if="currentMenuData">
            {{currentMenuData.name}}
            <em v-if="currentMenuData.count === 0 || currentMenuData.count">{{currentMenuData.count}}</em>
          </div>
          <div class="right">
            <el-button class="txt-btn" size="mini" type="text" icon="el-icon-plus" v-if="currentMenuData.num!=2" @click="onItemEdit()" v-permission="'FUNC_CAR_ADD'">添加</el-button>
            <el-button class="txt-btn" size="mini" type="text" icon="el-icon-delete" v-if="currentMenuData.num!=2" @click="onItemDelete()" v-permission="'FUNC_CAR_DELETE'">注销</el-button>
            <div class="separator"></div>
            <!-- <el-button class="txt-btn" size="mini" type="text" icon="el-icon-download">导入</el-button>
            <el-button class="txt-btn" size="mini" type="text" icon="el-icon-upload2">导出</el-button> -->
          </div>
        </div>

        <!-- 表格模式 S -->
        <el-table ref="listTabel" :data="listTableData.rows" v-loading.body="listTableLoading" height="calc(100% - 136px)" highlight-current-row @selection-change="onListChange">
          <el-table-column type="selection" width="30" align="right" />
          <el-table-column label="序号" align="center" type="index" width="50"/>
          <el-table-column width="120" prop="plateNumber" label="车牌号" align="center" />
          <el-table-column width="100" prop="vehicleBrand" label="车辆品牌" align="center" />
          <el-table-column width="80" label="车辆颜色" align="center">
            <template slot-scope="scope">
              <div :style="'background:' + scope.row.vehicleColor" class="bg"></div>
            </template>
          </el-table-column>
          <el-table-column width="100" prop="vehicleModel" label="车辆型号" align="center" />
          <el-table-column width="120" prop="vehicleType" label="车辆类型" align="center">
            <template slot-scope="scope">
              <div>{{scope.row.vehicleType | commonFilter('vehicle_type')}}</div>
            </template>
          </el-table-column>
          <el-table-column width="80" prop="newEnergy" label="新能源" align="center" />
          <el-table-column width="80" label="类别" align="center">
            <template slot-scope="scope">
              <face-category-list :data="carLibraryData" :type="0" :chosen="scope.row.libraryNums?scope.row.libraryNums.split(','):[]" />
            </template>
          </el-table-column>
          <el-table-column width="80" prop="name" label="车主姓名" align="center" />
          <el-table-column min-width="120" prop="identityNo" label="证件号码" align="center" />
          <el-table-column min-width="120" prop="phone" label="电话" align="center" />
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
import { getCarinfos, Editcarinfos, DeletecarInfos } from "@/api/carManage";

export default {
  name: "carLibrary",
  components: {
    LabeladdForm: () => import("./components/LabeladdForm"),
    LabelLibrary: () => import("./components/LabelLibrary")
  },
  data() {
    return {
      mode: 0, // 显示切换
      isAddFormDialog: false, // 控制表单显示
      labelFormId: null, // 当前id
      colorBrightness: colorBrightness, // 色彩亮度判断
      ids: [],
      formReadonly: false,
      currentMenuData: [],
      listIds: [],
      listQuery: {
        pageNo: 1,
        pageSize: 15,
        _filter_like_code: null,
        _filter_eq_num: null,
        _filter_like_keyword: null
      },
      listTableData: {},
      listTableLoading: false
    };
  },
  computed: {
    ...mapState({
      carLibraryData: state => state.commonData.carLibraryData
    })
  },
  created() {
    this.$store.dispatch("commonData/getCarLibraryData");
  },
  watch: {
    currentMenuData(val) {
      this.listQuery._filter_eq_num = val.num;
      this.onResetForm();
      this.getTableList();
    }
  },
  methods: {
    // 表格选中 数据
    select(selection) {
      this.listIds = selection.map(item => item.id);
    },
    // 更新页面数据
    updateView(val) {
      this.labelFormId = null;
      if(val) {
        this.$refs.labelLibrary.menuList();
      }else {
        this.onSearch();
      }
    },
    // 菜单更新
    onMenuChange(data) {
      this.currentMenuData = data;
    },
    // 获取表格数据
    getTableList() {
      this.listTableLoading = true;
      getCarinfos(this.listQuery)
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
        totalCount: null
      });
      this.getTableList();
    },
    // 列表参数重置
    onResetForm() {
      this.$refs.listForm.resetFields();
      this.getTableList();
    },
    // 更新列表选中
    onListChange(val) {
      this.listIds = val.map(item => item.id);
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
        DeletecarInfos({
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