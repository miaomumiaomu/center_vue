<template>
  <div class="app-container">
    <!-- 表单筛选 -->
    <el-form
      class="common-table-form"
      ref="listForm"
      :model="listQuery"
      :inline="true"
      @keyup.enter.native="onSearch"
      size="mini"
    >
      <el-form-item prop="pageNo" class="m0"/>
      <el-form-item prop="pageSize" class="m0"/>
      <el-form-item prop="totalCount" class="m0"/>
      <el-form-item prop="_filter_le_collectTime_date" class="m0"/>
      <el-form-item prop="_filter_like_personName" label="关键字">
        <el-input v-model="listQuery._filter_like_personName" placeholder="姓名"/>
      </el-form-item>
      <el-form-item prop="_filter_ge_collectTime_date" label="时间">
        <date-picker :beginTime.sync="listQuery._filter_ge_collectTime_date" :endTime.sync="listQuery._filter_le_collectTime_date" />
      </el-form-item>
      <el-form-item prop="_filter_in_libraryNumArr_intarr" label="类别">
        <face-library-select
          v-model="listQuery._filter_in_libraryNumArr_intarr"
          class="nowrap"
          placeholder="全部"
        />
        <!--  multiple collapse-tags -->
      </el-form-item>
      <el-form-item prop="_filter_eq_communityId_long" label="实有单位">
        <communities-select
          v-model="listQuery._filter_eq_communityId_long"
          class="nowrap"
          placeholder="全部"
        />
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
        人脸抓拍
        <em v-if="listTableData.total">{{listTableData.total}}</em>
      </div>
      <div class="right">
        <el-button-group class="switch">
          <el-button :type="mode===0?'primary':'info'" @click="mode=0" size="mini">
            <svg-icon icon-class="category"/>
          </el-button>
          <el-button :type="mode===1?'primary':'info'" @click="mode=1" size="mini">
            <svg-icon icon-class="images"/>
          </el-button>
        </el-button-group>
      </div>
    </div>

    <!-- 表格模式 S -->
    <el-table
      v-if="mode==0"
      :data="listTableData.rows"
      height="calc(100vh - 255px)"
      v-loading.body="listTableLoading"
      highlight-current-row
    >
      <el-table-column align="center" type="index" label="序号" width="50px" />
      <el-table-column align="center" width="80" label="照片">
        <template slot-scope="scope">
          <img class="pic" :src="scope.row.snapImgPath">
        </template>
      </el-table-column>
      <el-table-column width="180px" prop="name" label="姓名/证件号">
        <template slot-scope="scope">
          <div class="identity">
            <label>{{scope.row.personName}}</label>
            <p>{{scope.row.identityNo}}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="communityName" label="实有单位"/>
      <el-table-column align="center" width="80" label="相似度">
        <template slot-scope="scope">{{scope.row.similarity |percentage}}%</template>
      </el-table-column>
      <el-table-column align="center" label="类别" width="110px">
        <template slot-scope="scope">
          <face-category-list
            :data="faceLibraryData"
            :type="0"
            :chosen="scope.row.personTags?scope.row.personTags.split(','):[]"
          />
        </template>
      </el-table-column>
      <el-table-column align="center" prop="deviceName" label="采集设备"/>
      <el-table-column align="center" prop="collectTime" label="抓拍时间"/>
      <el-table-column fixed="right" align="center" min-width="60" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="info" :disabled="scope.row.bgImgPath ? false : true" @click="onLookPicture(scope.row.bgImgPath)">背景</el-button>
          <!-- <el-button size="mini" type="success" @click="onDetails(scope.row.labelId)">底库资料</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格模式 E -->
    <!-- 卡片模式 S -->
    <div class="card-list" v-show="mode == 1">
      <div class="item" v-for="item in listTableData.rows" :key="item.id">
        <div class="pic">
          <img :src="item.snapImgPath">
          <face-category-list
            :data="faceLibraryData"
            :type="1"
            :chosen="item.personTags?item.personTags.split(','):[]"
          />
          <div class="mask">
            {{item.imgTimeShow}}
            <span>{{item.similarity | percentage}}%</span>
          </div>
        </div>
        <div class="box">
          <div class="txt">
            <svg-icon icon-class="user"/>
            <b class="name">{{item.personName}}</b>
          </div>
          <div class="txt">
            <svg-icon icon-class="credentials"/>
            <label>{{item.identityNo}}</label>
          </div>
          <div class="txt">
            <svg-icon icon-class="locale"/>
            <label>{{item.communityName}}</label>
          </div>
          <div class="btns">
            <el-button size="mini" :disabled="item.bgImgPath ? false :true" @click.stop="onLookPicture(item.bgImgPath)">背景</el-button>
          </div>
        </div>
      </div>
    </div>
    <!-- 卡片模式 E -->
    <el-pagination
      @size-change="onListLimit"
      @current-change="onListPaging"
      :current-page.sync="listQuery.pageNo"
      :page-sizes="[15,30,50]"
      :page-size="listQuery.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="listTableData.total"
    />

    <!-- 图片弹窗 -->
    <el-dialog title="背景大图" :visible.sync="isBgDialog">
      <img :src="rowBgImg" class="w100">
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { singlePickerOptions } from "@/utils";
import { getSnappingList } from "@/api/faceSnapping";

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
        totalCount: null,
        _filter_ge_collectTime_date: null,
        _filter_le_collectTime_date: null,
        _filter_like_identityNo: null,
        _filter_eq_communityId_long: null,
        _filter_in_libraryNumArr_intarr: null,
        _filter_like_personName: null
      },
      listTableData: {},
      listTableLoading: false,
    };
  },
  created() {
    this.getTableList();
    this.$store.dispatch("commonData/getFaceLibraryData");
  },
  computed: {
    ...mapState({
      faceLibraryData: state => state.commonData.faceLibraryData
    })
  },
  activated() {
    if (this.$route.params.data) {
        this.listQuery._filter_like_personName = this.$route.params.data;
      }
      this.$nextTick(()=>{
        this.getTableList();
      })
  },
  methods: {
    getTableList() {
      getSnappingList(this.listQuery)
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
    }
  }
};
</script>
<style lang="scss" scoped>
.app-container {
  height: 100%;

  .common-table-form {
    .el-input {
      width: 100px;
    }
    .el-select {
      width: 110px;
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
      margin: 0 auto;
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
</style>