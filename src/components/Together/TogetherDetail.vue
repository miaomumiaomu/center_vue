<template>
  <el-dialog :visible.sync="isDetailDialog" class="body0" width="750px" title="同行详情" append-to-body>
    <div class="main">
      <!-- 表单筛选 -->
      <!-- <el-form class="common-table-form" ref="listForm" size="mini" :model="listQuery" :inline="true" @keyup.enter.native="onSearch">
        <el-form-item prop="_filter_eq_keyword" label="关键字">
          <el-input @keyup.enter.native="onSearch" placeholder="车牌号/姓名" v-model="listQuery._filter_eq_keyword" />
        </el-form-item>
        <el-form-item prop="_filter_eq_libraryNum" label="人脸库">
      <face-library-select v-model="listQuery._filter_eq_libraryNum" class="nowrap" placeholder="全部" @input="onSearch" />-->
      <!--  multiple collapse-tags -->
      <!-- </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="onResetForm">重置</el-button>
        </el-form-item>
      </el-form>-->
      <!-- 表格模式 S -->
      <el-table
        ref="listTabel"
        :data="listTableData"
        height="calc(100vh - 400px)"
        v-loading.body="listTableLoading"
        highlight-current-row
      >
        <el-table-column label="序号" align="center" type="index" width="50"/>
        <el-table-column align="center" label="抓拍照片" width="80">
          <template slot-scope="scope">
            <suspension-menu :SuspensionData="scope.row" />
          </template>
        </el-table-column>
        <el-table-column label="证件照片" align="center" width="80">
          <template slot-scope="scope">
            <img-show
              class="pic"
              width="48px"
              height="48px"
              text="暂无照片"
              :img-src="scope.row.identityImg"
            />
          </template>
        </el-table-column>
        <el-table-column align="center" prop="personName" label="姓名"/>
        <el-table-column prop="identityNo" min-width="150" label="同行人证件号" align="center"/>
        <el-table-column prop="collectTime" min-width="150" label="抓拍时间" align="center"/>
        <el-table-column fixed="right" width="100" align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              :disabled ="scope.row.bgImgPath ? false : true"
              @click="onDetails(scope.row)"
            >查看背景</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 表格模式 E -->
      <el-pagination
        @size-change="onListLimit"
        @current-change="onListPaging"
        :current-page="listQuery.pageNo"
        :page-size="listQuery.pageSize"
        :page-sizes="[15,30,50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="listTableData?listTableData.length:0"
      />
      <!-- 图片弹窗 -->
      <picture-viewer :isOpen.sync="isBgDialog" :bgImgInfo="bgImgInfo" />
    </div>
  </el-dialog>
</template>
<script>

export default {
  props: {
    id: null,
    form: null,
    isOpen: {
      default: false,
      type: Boolean
    },
    data: Array
  },

  data: () => ({
    isDetailDialog: false,

    listSelect: [],
    listTableData: {},
    listQuery: {
      pageNo: 1,
      pageSize: 15,
      _filter_eq_libraryNum: null,
      _filter_eq__filter_eq_keyword: null,
      _filter_eq_keyword: null
    },
    listTableLoading: false,
    isBgDialog: false,
    bgImgInfo: {}
  }),
  watch: {
    isOpen(val) {
      this.isDetailDialog = val;
    },
    isDetailDialog(val) {
      if (val) {
        if (this.data) {
          this.listTableData = this.data;
        } else {
          this.listTableData = null;
        }
      }
      this.$emit("update:isOpen", val);
    }
  },
  methods: {
    onSearch() {
      this.listQuery = Object.assign(this.listQuery, {
        pageNo: 1,
        pageSize: 15,
        totalCount: null
      });
      this.getTableList();
    },
    // 获取表格数据

    // 列表参数重置
    onResetForm() {
      this.$refs.listForm.resetFields();
      this.getTableList();
    },
    onDetails(data) {
      const { bgImgPath, snapImgPath, identityImg, similarity = 0 } = data;
      this.bgImgInfo = {
        rowBgImg: bgImgPath,
        snapImgPath,
        identityImgPath: identityImg,
        similarity: Math.floor(similarity * 100)
      };
      this.isBgDialog = true;
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
    }
  }
};
</script>
<style lang="scss" scoped>
.el-table {
  .identity {
    line-height: 140%;
    label {
      font-size: 14px;
    }
    p {
      color: #9da5af;
    }
  }
  .pic {
    display: inline-block;
    overflow: hidden;
    border-radius: 4px;
    vertical-align: top;
  }
  .bg-pic {
    display: inline-block;
    overflow: hidden;
    border-radius: 4px;
    vertical-align: top;
  }
  .el-button {
    margin: 2px 0;
  }
}

.el-pagination {
  padding: 10px;
}
</style>