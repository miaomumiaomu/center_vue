<template>
  <div class="app-container">
    <!-- 表单筛选 -->
    <el-form class="common-table-form" ref="listForm" :model="listQuery" :inline="true" @keyup.enter.native="onSearch" size="mini">
      <el-form-item label="关键字" prop="_filter_like_plateNumber">
        <el-input @keyup.enter.native="onSearch" placeholder="车牌号" v-model="listQuery._filter_like_plateNumber" />
      </el-form-item>
      <el-form-item label="实有设备" prop="_filter_in_deviceId_intarr">
        <device-select ref="deviceSelect" @change="deviceChange" :deviceCameraType="0"></device-select>
      </el-form-item>
      <el-form-item label="时间" prop="_filter_ge_passTime_date">
        <date-picker :beginTime.sync="listQuery._filter_ge_passTime_date" :endTime.sync="listQuery._filter_le_passTime_date" />
      </el-form-item>
      <el-form-item label="辖区" prop="_filter_like_policeAreaCode">
        <div style="width: 178px;height: 26px;">
          <jurisdiction-person-search @change="getjurisdiction" ref="jurisdictionPersonSearch"></jurisdiction-person-search>
        </div>
      </el-form-item>
      <el-form-item prop="_filter_le_passTime_date" />
      <el-form-item>
        <el-button type="primary" @click="onSearch">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="onResetForm">重置</el-button>
      </el-form-item>
      <el-form-item class="right transition">
        <div>
          <el-button-group class="switch">
            <el-button :type="mode===0?'primary':'info'" @click="mode=0" size="mini">
              <svg-icon icon-class="category" />
            </el-button>
            <el-button :type="mode===1?'primary':'info'" @click="mode=1" size="mini">
              <svg-icon icon-class="images" />
            </el-button>
          </el-button-group>
        </div>
      </el-form-item>
    </el-form>

    <!-- 工具栏 -->
    <div class="common-tool">
      <div class="title">
        车辆抓拍记录
        <em v-if="listTableData.total">{{listTableData.total}}</em>
      </div>
      <!-- <div class="right"> -->
      <!-- <el-button
          class="txt-btn"
          size="mini"
          type="text"
          icon="el-icon-delete"
          @click="onItemDelete()"
        >删除</el-button> -->
      <!-- <el-button
          class="txt-btn"
          size="mini"
          type="text"
          icon="el-icon-upload"
          @click="onItemOutput()"
        >导出</el-button>-->
      <!-- </div> -->
    </div>

    <!-- 表格模式 S -->
    <el-table v-show="mode === 0" ref="listTabel" :data="listTableData.rows" :height="tableHeight" v-loading.body="listTableLoading" highlight-current-row @selection-change="onSelectChange">
      <!-- <el-table-column align="center" type="selection"/> -->
      <el-table-column label="序号" align="center" type="index" />
      <el-table-column width="100" label="抓拍照片" align="center" prop="plateImage">
        <template slot-scope="scope">
          <img-show width="48px" txt="暂无头像" :img-src="scope.row.plateImage" class="image" />
        </template>
      </el-table-column>
      <el-table-column prop="plateNumber" label="车牌号" width="120" align="center" />
      <el-table-column min-width="80" prop="passTime" align="center" label="时间" />
      <el-table-column min-width="80" prop="createTime" align="center" label="入库时间" />
      <el-table-column min-width="80" prop="gateName" align="center" label="采集设备" />
      <el-table-column align="center" prop="policeAreaName" label="辖区" min-width="100px" />
      <el-table-column fixed="right" min-width="100" align="center" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="onLookPicture(scope.row.backgroundImage ? scope.row.backgroundImage : scope.row.plateImage)">查看背景</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 卡片模式 S -->
    <div class="card-list" v-show="mode == 1">
      <div class="item" v-for="item in listTableData.rows" :key="item.id" @click="$refs.listTabel.toggleRowSelection(item)">
        <div class="pic">
          <img :src="item.plateImage">
          <div class="mask">{{item.passTime}}</div>
        </div>
        <div class="box">
          <div class="txt">
            <svg-icon icon-class="carManage" />
            <b class="name">{{item.plateNumber}}</b>
            <!-- <el-checkbox :value="listIds.includes(item.id)"/>:class="{sel:listIds.includes(item.id)}" -->
          </div>
          <div class="txt">
            <svg-icon icon-class="locale" />
            <label>{{item.policeAreaName}}</label>
          </div>
          <div class="txt">
            <svg-icon icon-class="gateway" />
            <label>{{item.gateName}}</label>
          </div>
          <div class="btns">
            <el-button size="mini" @click.stop="onLookPicture(item.backgroundImage ? item.backgroundImage : item.plateImage)">查看大图</el-button>
          </div>
        </div>
      </div>
    </div>
    <!-- 卡片模式 E -->
    <!-- 页码 -->
    <el-pagination @size-change="onListLimit" @current-change="onListPaging" :current-page.sync="listQuery.pageNo" :page-size="listQuery.pageSize" :page-sizes="[15,30,50]" layout="total, sizes, prev, pager, next, jumper" :total="listTableData.total" />

    <!-- 图片弹窗 -->
    <el-dialog title="背景大图" :visible.sync="isLookDialog">
      <img :src="rowBgImg" class="w100">
    </el-dialog>
  </div>
</template>
<script>
import { singlePickerOptions } from "@/utils";
import {
  getCarPassRecordsList,
  deleteCarPassRecords
} from "@/api/carManage/carSnap";
import { mapState } from "vuex";

export default {
  name: "carSnap",
  data: () => ({
    searchInfo: null,
    listQuery: {
      pageNo: 1, //页码
      pageSize: 15, //页数
      _filter_like_plateNumber: "", //搜索车牌号0
      _filter_ge_passTime_date: null, //开始时间
      _filter_le_passTime_date: null, //结束时间
      _filter_like_policeAreaCode: null, //辖区
    },
    //左右视窗切换
    mode: 0,
    //查看大图片
    rowBgImg: null,
    //详情窗口
    isLookDialog: false,
    //数据加载状态
    listTableLoading: false,
    //选中 删除 或 导出 的数据
    listIds: [],
    //工具栏 表单  数据
    listTableData: {},
    singlePickerOptions: singlePickerOptions,
    tableHeight: '200px',
  }),
  components: {
    JurisdictionPersonSearch: () => import("@/components/JurisdictionPersonSearch")
  },
  computed: {
    ...mapState({
      userInfo: state=> state.user.userInfo,
    })
  },
  created() {
    this.listQuery._filter_like_policeAreaCode = this.userInfo.policeAreaCode
    this.getTableList();
  },
  watch: {
    $route(val) {
      if (val.name == "carSnap" && val.params) {
        this.listQuery._filter_like_plateNumber = val.params.data;
        this.getTableList();
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = `calc(100vh - ${ this.$refs.listForm.$el.clientHeight + 209 }px)`
    })
  },
  methods: {
    getTableList() {
      if (this.$route.params.data) {
        this.listQuery._filter_like_plateNumber = this.$route.params.data;
      }
      getCarPassRecordsList(this.listQuery).then(res => {
        this.listTableData = res.data;
      });
    },

    //查询
    onSearch() {
      this.listQuery.pageNo = 1;
      this.getTableList();
    },
    //重置
    onResetForm() {
      this.$refs.listForm.resetFields();
      this.$refs.deviceSelect.clear()
      this.$refs.jurisdictionPersonSearch.clear()
      this.getTableList();
    },
    //删除
    onItemDelete(id) {
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
        deleteCarPassRecords({ ids: this.listIds }).then(res => {
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

    //导出(后续)
    // onItemOutput() {
    //   if (!this.listIds.length) {
    //     this.$notify({
    //       title: "提示",
    //       message: "请选择需要导出的数据",
    //       type: "warning",
    //       duration: 2000
    //     });
    //     return;
    //   }
    //   this.$confirm("此操作将导出数据, 是否继续?", "提示", {
    //     cancelButtonText: "取消",
    //     confirmButtonText: "确定",
    //     confirmButtonClass: "el-button--mini",
    //     cancelButtonClass: "el-button--mini fr",
    //     type: "success"
    //   }).then(() => {
    //     console.log(this.listIds,"1");

    //   });
    // },

    // 表格选中 数据
    onSelectChange(val) {
      this.listIds = val.map(item => item.id);
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

    // 查看大图
    onLookPicture(url) {
      console.log(url)
      this.rowBgImg = url;
      this.isLookDialog = true;
    },
    deviceChange(val) {
      console.log(val)
      this.$set(this.listQuery, '_filter_in_deviceId_intarr', val)
    },
    getjurisdiction(val) {
      console.log(val)
      this.listQuery._filter_like_policeAreaCode = val
    }
  },
  
};
</script>

<style lang="scss" scoped>
.app-container {
  position: relative;
  height: 100%;
  .w100 {
    width: 100%;
  }
  .right {
    float: right;
  }
  .transition {
    margin-right: 4px !important;
  }
  .image {
    margin: 0 auto;
  }
  .el-pagination {
    padding: 10px;
  }
  .card-list {
    height: calc(100vh - 255px);
    padding-bottom: 10px;
    overflow: auto;
    border-bottom: 1px #eee solid;
    .pic {
      position: relative;
      display: block;
      width: 160px;
      height: 160px;
      overflow: hidden;
      img {
        display: block;
        width: 160px;
        height: 160px;
      }
    }
    .mask {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.4);
      line-height: 18px;
      padding: 0 4px;
      font-size: 12px;
      color: #fff;
      span {
        float: right;
        font-size: 14px;
        font-weight: bold;
        color: #ffc600;
      }
    }
    .item {
      float: left;
      margin: 10px 0 0 10px;
      overflow: hidden;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      border: 1px solid transparent;
      &.sel {
        border-color: #0fa0ff;
      }
      b {
        font-size: 14px;
        color: #333;
      }
      label {
        font-size: 12px;
        color: #9da5af;
      }
      .box {
        width: 160px;
        padding: 6px;
      }
      .txt {
        display: flex;
        width: 100%;
        height: 18px;
        line-height: 18px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        .name {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .svg-icon {
        display: inline-block;
        height: 100%;
        margin-right: 4px;
        vertical-align: top;
        color: #b5c0cd;
      }
      .btns {
        display: flex;
        margin-top: 4px;
        .el-button {
          flex: 1;
          margin-left: 0;
        }
      }
      .el-checkbox {
        float: right;
        margin-left: 4px;
        pointer-events: none;
      }
    }
  }
}
</style>