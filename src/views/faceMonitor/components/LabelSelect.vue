<template>
  <div>
    <el-button class="txt-btn" size="mini" type="text" icon="el-icon-plus" @click="isLabelDialog = true">选择人脸库成员</el-button>
    <div class="label-select" v-if="updateData.length > 0">
      <div class="pic-list">
        <template v-for="(item,index) in updateData">
          <div class="item" :key="index">
            <img :src="item.identityImgPath">
            <i class="el-icon-delete" @click="onDelete(item,index)"></i>
          </div>
        </template>
        <!-- <i class="el-icon-plus" @click="isLabelDialog = true"></i> -->
      </div>
  </div>
    <!-- 人员选择弹窗 -->
    <el-dialog title="选择布控个体" class="label-layer body0" :visible.sync="isLabelDialog" width="700px" append-to-body>
      <div class="main" :style="waterBg">
        <!-- 表单筛选 -->
        <el-form class="common-table-form" ref="listForm" size="mini" :model="listQuery" :inline="true" @keyup.enter.native="onSearch">
          <el-form-item prop="_filter_eq_keyword" label="关键字">
            <el-input @keyup.enter.native="onSearch" placeholder="姓名/证件号" v-model="listQuery._filter_eq_keyword" />
          </el-form-item>
          <el-form-item prop="_filter_eq_personTags" label="人脸库">
            <face-library-select v-model="listQuery._filter_eq_personTags" :filtrateNum="[2]" class="nowrap" placeholder="全部" @input="onSearch" /><!--  multiple collapse-tags -->
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSearch">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="onResetForm">重置</el-button>
          </el-form-item>
        </el-form>
        <!-- 表格模式 S -->
        <el-table ref="listTabel" :data="listTableData.rows" height="calc(100vh - 300px)" row-key="id" v-loading.body="listTableLoading" highlight-current-row @selection-change="onListChange">
          <el-table-column type="selection" width="50" reserve-selection />
          <el-table-column label="序号" align="center" type="index" width="60" />
          <el-table-column width="80" label="证件照" align="center">
            <template slot-scope="scope">
              <img :src="scope.row.imgShow" class="pic">
            </template>
          </el-table-column>
          <el-table-column width="180" prop="name" label="姓名/证件号">
            <template slot-scope="scope">
              <div class="identity txt">
                <label>{{scope.row.name}}</label>
                <p>{{scope.row.identityNo}}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="类别" min-width="110" align="center">
            <template slot-scope="scope">
              <face-category-list :data="faceLibraryData" :type="0" :chosen="scope.row.personTags?scope.row.personTags.split(','):[]" />
            </template>
          </el-table-column>
          <el-table-column width="80" label="性别" align="center">
            <template slot-scope="scope">
              <div>{{scope.row.sex | commonFilter('comm_sex')}}</div>
            </template>
          </el-table-column>
          <el-table-column width="80" prop="age" label="年龄" align="center"></el-table-column>
        </el-table>
        <!-- 表格模式 E -->

        <el-pagination @size-change="onListLimit" @current-change="onListPaging" :current-page="listQuery.pageNo" :page-size="listQuery.pageSize" :page-sizes="[15,30,50]" layout="total, sizes, prev, pager, next, jumper" :total="listTableData.total" />
      </div>

      <div slot="footer">
        <el-button size="mini" type="primary" @click="onSubmit">确定</el-button>
        <el-button size="mini" @click="isLabelDialog = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getFaceLibraryList } from "@/api/common";
import { getLabelList } from "@/api/faceLibrary";
import { mapState } from "vuex";

export default {
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    isLabelDialog: false,
    labelData: [],
    labelArr: [],
    updateData: [],

    labelTypeData: [],

    listSelect: [],
    listTableData: {},
    listQuery: {
      pageNo: 1,
      pageSize: 15,
      totalCount: null,
      _filter_eq_personTags: null,
      _filter_eq_keyword: null,
      _filter_nin_noLibraryNums: 2,
    },
    listTableLoading: false
  }),
  watch: {
    value(val) {
      this.updateData = val;
    },
    updateData(val) {
      this.$emit("input", val);
    },
    isLabelDialog(val) {
      if (val) {
        this.$nextTick(() => {
          this.onResetForm();
          this.$refs.listTabel.clearSelection();
        });
      }
    }
  },
  created() {
    this.getFaceLibrary();
  },
  computed: {
    ...mapState({
      waterBg: state => state.user.waterBg, // 人脸库标识
    })
  },
  methods: {
    onSearch() {
      this.listQuery = Object.assign(this.listQuery, {
        pageNo: 1,
        pageSize: 15,
        totalCount: null,
      });
      this.getTableList();
    },
    // 获取表格数据
    getTableList() {
      this.listTableLoading = true;
      getLabelList(this.listQuery)
        .then(res => {
          this.listTableData = res.data;
        })
        .finally(() => {
          this.listTableLoading = false;
        });
    },
    getFaceLibrary() {
      getFaceLibraryList().then(res => {
        let json = {};
        res.data.map(item => {
          json[item.num] = {
            name: item.name,
            color: item.color,
            shortName: item.shortName
          };
        });
        this.faceLibraryData = json;
      });
    },
    // 选择人员保存
    onSubmit() {
      let filterArr = this.updateData.map(item => item.id);
      let newArr = this.listSelect
        .filter(item => !filterArr.includes(item.id))
        .map(item => {
          return {
            id: item.id,
            name: item.name,
            identityImgPath: item.imgShow
          };
        });

      this.updateData = this.updateData.concat(newArr);
      this.isLabelDialog = false;
    },
    // 删除人员
    onDelete(row, index) {
      this.updateData.splice(index, 1);
    },
    // 列表参数重置
    onResetForm() {
      this.$refs.listForm.resetFields();
      this.getTableList();
    },
    // 更新列表选中
    onListChange(val) {
      this.listSelect = val;
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
.label-select {
  .pic-list {
    background: #f3f4f5;
    padding: 10px 10px 0;
    overflow: hidden;
    border-radius: 8px;
    border: 1px #e1e4e6 solid;
    .el-icon-plus {
      float: left;
      background-color: #fbfdff;
      width: 48px;
      height: 48px;
      line-height: 46px;
      margin-bottom: 10px;
      border: 1px dashed #c0ccda;
      border-radius: 6px;
      text-align: center;
      font-size: 26px;
      cursor: pointer;
    }
    .item {
      position: relative;
      float: left;
      width: 48px;
      height: 48px;
      margin: 0 10px 10px 0;
      overflow: hidden;
      border: 1px solid #c0ccda;
      border-radius: 6px;
      img {
        display: block;
        width: 100%;
        height: 100%;
      }
      .el-icon-delete {
        position: absolute;
        top: 0;
        left: 0;
        display: none;
        background: rgba(0, 0, 0, 0.5);
        width: 46px;
        height: 46px;
        line-height: 46px;
        text-align: center;
        font-size: 22px;
        color: #fff;
      }
      &:hover {
        .el-icon-delete {
          display: block;
        }
      }
    }
  }
}
.label-layer {
  .common-table-form {
    .el-select {
      width: 180px;
    }
    .el-input {
      width: 180px;
    }
  }
  .el-table {
    .pic {
      display: block;
      width: 50px;
      height: 62px;
      margin: 0 auto;
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
  }
  .el-pagination {
    padding: 10px;
  }
}
</style>