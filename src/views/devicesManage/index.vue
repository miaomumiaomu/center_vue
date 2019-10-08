<template>
  <div class="app-container">
    <el-row>
      <jurisdiction-menu @change="onMenuChange" :operating="false"/>

      <el-col :span="18" class="table-box">
        <!-- 表单筛选 -->
        <el-form class="common-table-form" ref="listForm" @submit.native.prevent :model="listQuery" :inline="true" @keyup.enter.native="onSearch" size="mini">
          <el-form-item prop="pageNo" class="m0" />
          <el-form-item prop="pageSize" class="m0" />
          <el-form-item label="关键字" prop="_filter_eq_keyword">
            <el-input @keyup.enter.native="onSearch" placeholder="设备名称/编码" v-model="listQuery._filter_eq_keyword"/>
          </el-form-item>
          <el-form-item prop="_filter_eq_deviceType" label="设备类型">
            <dict-select dict-name="device_type" v-model="listQuery._filter_eq_deviceType" />
          </el-form-item>
          <el-form-item prop="_filter_eq_communityId" label="所属小区">
            <communities-select v-model="listQuery._filter_eq_communityId" class="nowrap" :policeAreaCode="listQuery._filter_like_areaCode" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSearch">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="onResetForm">重置</el-button>
          </el-form-item>
        </el-form>

        <!-- 工具栏 v-permission="'FUNC_DEVICE_ADD'"-->
        <div class="common-tool">
          <div class="title" v-if="currentMenuData">
            {{currentMenuData.areaName}}
            <em v-if="listTableData.total">{{listTableData.total}}</em>
          </div>
          <div class="right">
            <el-button class="txt-btn" size="mini" type="text" icon="el-icon-plus" @click="onItemEdit()" v-permission="'FUNC_DEVICE_ADD'" >添加</el-button>
            <el-button class="txt-btn" size="mini" type="text" icon="el-icon-delete" @click="onItemDelete" v-permission="'FUNC_DEVICE_DELETE'">删除</el-button>
          </div>
        </div>

        <!-- 表格模式 S -->
        <el-table ref="listTabel" :data="listTableData.rows" height="calc(100vh - 255px)" v-loading.body="listTableLoading" highlight-current-row @selection-change="onListChange">
          <el-table-column type="selection" width="50" :selectable="isAble"/>
          <el-table-column type="index" label="序号" align="center" width="50" />
          <el-table-column align="center" label="设备名称">
            <template slot-scope="scope">
              <camera-video :mode="0" :deviceCode="scope.row.deviceCode" :deviceName="scope.row.name" :onLine="scope.row.onLine" :chanDpid="scope.row.chanDpid" />
            </template>
          </el-table-column>
          <el-table-column prop="code" label="设备代码" min-width="160" align="center" />
          <el-table-column prop="venderSn" label="硬件序列号" min-width="120" align="center" />
          <el-table-column label="品牌" align="center">
            <template slot-scope="{ row: { deviceManu } }">{{deviceManu | commonFilter('device_brand')}}</template>
          </el-table-column>
          <el-table-column prop="deviceType" label="设备类型" align="center" />
          <el-table-column label="设备来源" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.sourceType===1">社区</span>
              <span v-if="scope.row.sourceType===0">中心</span>
            </template>
          </el-table-column>
          <el-table-column prop="communityName" label="所属小区" min-width="120" align="center" />
          <el-table-column label="设备状态" align="center">
            <template slot-scope="scope">
              <device-state :value="scope.row.status" :id="scope.row.id" @complete="updateView" :disable="scope.row.sourceType ? true : false "/>
              <!-- <el-switch v-model="scope.row.status" :active-value="'正常'" :inactive-value="'异常'" /> -->
            </template>
          </el-table-column>
          <!-- <el-table-column prop="status" label="设备状态" align="center" /> -->
          <el-table-column fixed="right" label="操作" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="success" v-if="scope.row.sourceType===0" @click="onItemEdit(scope.row.id, false)" v-permission="'FUNC_DEVICE_UPDATE'">编辑</el-button>
              <el-button size="mini" type="success" v-else @click="onItemEdit(scope.row.id,true)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 表格模式 E -->
        <el-pagination @size-change="onListLimit" @current-change="onListPaging" :current-page="listQuery.pageNo" :page-size="listQuery.pageSize" :page-sizes="[15,30,50]" layout="total, sizes, prev, pager, next, jumper" :total="listTableData.total" />
      </el-col>
    </el-row>

    <!-- 设备表单 -->
    <devices-form :is-open.sync="isFormDialog" :id="devicesFormId" :isDisabled="isDisabled" :community="currentMenuData" :areaData="currentMenuData" @complete="updateView"/>
  </div>
</template>
<script>
import { getDevicesList, deleteDevices } from "@/api/devicesManage";
import { postChanList, getCheckOnline, getReqVideo } from "@/api/video";
import { mapGetters } from 'vuex';

export default {
  name: "devicesManage",
  components: {
    DevicesForm: () => import("./components/DevicesForm"),
    JurisdictionMenu: () => import("@/components/JurisdictionMenu"),
  },
  data() {
    return {
      currentMenuData: {},

      isFormDialog: false,
      devicesFormId: null,
      isDisabled: null,

      listIds: [],
      listQuery: {
        pageNo: 1,
        pageSize: 15,
        _filter_eq_communityId: null,
        _filter_eq_keyword: null,
        _filter_like_locationCode: null,
        _filter_like_areaCode: null,
      },
      listTableData: {},
      listTableLoading: false,

      // 视频
      chanListData: [],
      chan:[]
    };
  },
  created() {
    postChanList([]).then(res => {
      this.chanListData = res.data;
    })
  },
  mounted() {
    this.listQuery._filter_like_areaCode = this.userInfo.policeAreaCode
    this.currentMenuData.areaName = this.userInfo.policeAreaName
    this.getTableList()
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  watch: {
    currentMenuData(val) {
      // this.listQuery._filter_eq_communityId = val.id;
      this.getTableList();
    }
  },
  methods: {
    // 更新视图
    updateView() {
      this.getTableList();
    },
    // 获取表单数据
    getTableList() {
      this.listTableLoading = true;
      getDevicesList(this.listQuery)
        .then(res => {
          if (res.data.rows) {
            res.data.rows.forEach(item => {
              this.chanListData && this.chanListData.forEach(element => {
                if (element.deviceCode == item.code) {
                  this.$set(item, 'isReqVideo', true);
                  this.$set(item, 'chanDpid', element.chanDpid);
                  getCheckOnline(element.chanDpid).then(res => {
                    if (res.data.state == 1) {
                      this.$set(item, 'onLine', true);
                    };
                  })
                }
              });
            });
          } else {
            res.data.rows = []
          }

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
        pageSize: 15
      });
      this.getTableList();
    },
    // 菜单更新
    onMenuChange(status, data, node) {
      this.$refs.listForm.resetFields()
      this.listQuery._filter_like_areaCode = data.areaCode
      // this.addressName = data.label
      this.currentMenuData = { ...data }
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
    onItemEdit(id, isDisabled) {
      this.devicesFormId = id || null;
      this.isDisabled = isDisabled;
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
        deleteDevices({
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

    /* 分页处理 */
    onListPaging(val) {
      this.listQuery.pageNo = val;
      this.getTableList();
    },
    onListLimit(val) {
      this.listQuery.pageSize = val;
      this.getTableList();
    },
    /* 分页处理 */
    isAble(row, index) {
      if(row.sourceType === 0) {
        return true
      }else {
        return false
      }
    }
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
}
.table-box {
  .el-pagination {
    padding: 10px;
  }
}
</style>