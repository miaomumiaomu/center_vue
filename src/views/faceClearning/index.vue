<template>
  <div class="app-container">
    <!-- 表单筛选 -->
    <el-form class="common-table-form" ref="listForm" :model="listQuery" :inline="true" @keyup.enter.native="onSearch" size="mini">
      <el-form-item prop="pageNo" class="m0" />
      <el-form-item prop="pageSize" class="m0" />
      <el-form-item prop="_filter_le_endTime" class="m0" />
      <el-form-item prop="_filter_like_keyword" label="证件号">
        <el-input v-model="listQuery._filter_like_keyword" placeholder="证件号" />
      </el-form-item>
      <el-form-item prop="_filter_ge_beginTime" label="时间">
        <date-picker :beginTime.sync="listQuery._filter_ge_beginTime" :endTime.sync="listQuery._filter_le_endTime" />
      </el-form-item>
      <el-form-item prop="_filter_eq_communityId" label="所属小区">
        <communities-select v-model="listQuery._filter_eq_communityId" class="nowrap" placeholder="全部" />
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
        清洗数据
        <em v-if="listTableData.total">{{listTableData.total}}</em>
      </div>
      <div class="right">
        <el-button-group class="switch">
          <el-button :type="mode===0?'primary':'info'" @click="mode=0" size="mini">
            <svg-icon icon-class="category" />
          </el-button>
          <el-button :type="mode===1?'primary':'info'" @click="mode=1" size="mini">
            <svg-icon icon-class="images" />
          </el-button>
        </el-button-group>
      </div>
    </div>

    <!-- 表格模式 S -->
    <el-table v-if="mode==0" :data="listTableData.rows" height="calc(100vh - 255px)" v-loading.body="listTableLoading" highlight-current-row>
      <el-table-column align="center" type="index" label="序号" />
      <el-table-column align="center" width="80" label="抓拍照片">
        <template slot-scope="scope">
          <img-show class="pic" width="48px" height="48px" :img-src="scope.row.faceImgPath" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="抓拍背景">
        <template slot-scope="scope">
          <a @click="onLookPicture(scope.row.bgImgPath)" v-if="scope.row.bgImgPath">
            <img-show class="bg-pic" height="48px" width="auto" txt="暂无背景" :img-src="scope.row.bgImgPath"  />
          </a>
          <span v-else style="color:#9da5af">暂无背景</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="origIdentityNo" label="证件号" min-width="140px" >
        <template slot-scope="scope">
            <span v-if="scope.row.origIdentityNo">{{scope.row.origIdentityNo}}</span>
            <span v-else style="color:#9da5af">暂无证件号</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="communityName" label="实有单位" />
      <el-table-column align="center" prop="deviceName" label="设备" />
      <el-table-column align="center" label="经纬度">
        <template slot-scope="scope">
          <span>{{scope.row.lng+','+scope.row.lat}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="collectTime" label="抓拍时间" min-width="130" />
      <el-table-column align="center" prop="receiveTime" label="接收时间" min-width="130" />
      <el-table-column align="left" label="过滤原因">
        <template slot-scope="scope">
        <span v-if="scope.row.mismatchType==1">无法检测到人脸</span>
        <span v-if="scope.row.mismatchType==2">图片不清晰</span>
        <span v-if="scope.row.mismatchType==3">角度不达标</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格模式 E -->
    <!-- 卡片模式 S -->
    <div class="card-list" v-show="mode == 1">
      <div class="item" v-for="item in listTableData.rows" :key="item.id">
        <div class="pic">
          <img :src="item.faceImgPath">
          <div class="mask">
            {{item.collectTime}}
            <span>
              <a @click.stop="onLookPicture(item.bgImgPath)">查看背景</a>
            </span>
          </div>
        </div>
        <div class="box">
          <div class="txt">
            <svg-icon icon-class="credentials" />
            <label>{{item.origIdentityNo}}</label>
          </div>
          <div class="txt">
            <svg-icon icon-class="locale" />
            <label class="txt_over">{{item.communityName+' '+item.deviceName}}</label>
          </div>
          <div class="txt">
            <svg-icon icon-class="lng" />
            <label>{{item.lng+','+item.lat}}</label>
          </div>
          <div class="txt">
            <svg-icon icon-class="reason" />
            <label v-if="item.mismatchType==1">无法检测到人脸</label>
            <label v-if="item.mismatchType==2">图片不清晰</label>
            <label v-if="item.mismatchType==3">角度不达标</label>
          </div>
        </div>
      </div>
    </div>
    <!-- 卡片模式 E -->
    <el-pagination @size-change="onListLimit" @current-change="onListPaging" :current-page.sync="listQuery.pageNo" :page-sizes="[15,30,50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="listTableData.total" />

    <!-- 图片弹窗 -->
    <el-dialog title="背景大图" :visible.sync="isBgDialog">
      <img :src="rowBgImg" class="w100">
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { singlePickerOptions } from "@/utils";
import { getFaceClearning } from "@/api/faceSnapping";

export default {
  name: "faceSnapping",
  data() {
    return {
      mode: 0,
      singlePickerOptions: singlePickerOptions,

      isBgDialog: false, // 控制背景图显示
      rowBgImg: null,

      listQuery: {
        pageNo: 1,
        pageSize: 15,
        _filter_ge_beginTime: null,
        _filter_le_endTime: null,
        _filter_eq_communityId: null,
        _filter_like_keyword: null
      },
      listTableData: {},
      listTableLoading: false,

    };
  },
  created() {
    this.getTableList();
  },
  methods: {
    getTableList() {
      getFaceClearning(this.listQuery)
        .then(res => {
          if (res.status == 200) {
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
    // 分页更新
    onListLimit(val) {
      this.listQuery.pageSize = val;
      this.listQuery.totalCount = this.listTableData.total;
      this.getTableList();
    },
    // 分页更新
    onListPaging(val) {
      this.listQuery.pageNo = val;
      this.listQuery.totalCount = this.listTableData.total;
      this.getTableList();
    },
    // 查看大图
    onLookPicture(url) {
      this.rowBgImg = url;
      this.isBgDialog = true;
    },
  }
};
</script>
<style lang="scss" scoped>
.app-container {
  height: 100%;

  .common-table-form {
    .el-select{
      width: 120px;
    }
    .el-date-editor {
      width: 180px;
    }
  }
  .el-table {
    .pic {
      display: block;
      width: 48px;
      height: 48px;
      border-radius: 4px;
      overflow: hidden;
      margin: 0 auto;
    }
    .bg-pic {
      display: inline-block;
      overflow: hidden;
      border-radius: 4px;
      vertical-align: top;
    }
  }
  .el-pagination {
    padding: 10px;
  }
}

.card-list {
  height: calc(100vh - 255px);
  padding-bottom: 10px;
  overflow: auto;
  border-bottom: 1px #eee solid;
  .pic {
    position: relative;
    display: block;
    width: 170px;
    height: 170px;
    overflow: hidden;
    img {
      display: block;
      width: 170px;
      height: 170px;
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
      font-size: 12px;
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
      width: 170px;
      padding: 6px;
    }
    .txt {
      display: flex;
      width: 100%;
      height: 18px;
      line-height: 18px;
      .txt_over {
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
</style>