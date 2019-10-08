<template>
  <div>
    <el-button class="txt-btn" size="mini" type="text" icon="el-icon-plus" @click="isLabelDialog = true">选择车辆库车辆</el-button>
    <div class="label-select" v-if="updateData.length > 0 && listShow">
      <div class="pic-list">
        <template v-for="(item,index) in updateData">
          <div class="item" :key="index">
            <div>{{item.plateNumber}}</div>
            <i class="el-icon-delete" @click="onDelete(item,index)"></i>
          </div>
        </template>
        <!-- <i class="el-icon-plus" @click="isLabelDialog = true"></i> -->
      </div>
    </div>
    <!-- 车辆选择弹窗 -->
    <el-dialog :title="title" class="label-layer body0" :visible.sync="isLabelDialog" width="700px" append-to-body>
      <div class="main">
        <!-- 表单筛选 -->
        <el-form class="common-table-form" ref="listForm" size="mini" :model="listQuery" :inline="true" @keyup.enter.native="onSearch">
          <el-form-item prop="_filter_eq_keyword" label="关键字">
            <el-input @keyup.enter.native="onSearch" placeholder="车牌号/姓名/证件号/手机号" v-model="listQuery._filter_eq_keyword" />
          </el-form-item>
          <el-form-item prop="_filter_eq_num" label="车辆库">
            <car-library-select v-model="listQuery._filter_eq_num" :filtrateNum="[2]" class="nowrap" placeholder="全部" />
            <!--  multiple collapse-tags -->
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
          <el-table-column align="center" type="selection" width="45" reserve-selection />
          <el-table-column label="序号" align="center" type="index"  width="50" />
          <el-table-column label="车牌号" align="center" prop="plateNumber" />
          <el-table-column label="品牌" align="center" prop="vehicleBrand" />
          <el-table-column label="姓名" align="center" prop="name" />
          <el-table-column label="证件号" align="center" prop="identityNo" />
          <el-table-column label="手机号" align="center" prop="phone" />
          <el-table-column label="类别" align="center">
            <template slot-scope="scope">
              <face-category-list :data="carLibraryData" :type="0" :chosen="scope.row.libraryNums?scope.row.libraryNums.split(','):[]" />
            </template>
          </el-table-column>
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
import { mapState } from 'vuex'
import { getFaceLibraryList } from "@/api/common";
import { getCarinfos } from "@/api/carManage";

export default {
  props: {
    value: {
      type: Array,
      default: () => []
    },
    listShow: {
      type: Boolean, 
      default: true
    },
    title: {
      type: String, 
      default: '选择布控车辆'
    },
    handleWay: null, //保存时处理额外方法
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
      _filter_eq_num: null,
      _filter_eq__filter_eq_keyword: null,
      _filter_eq_keyword: null,
      _filter_nin_noLibraryNums:2
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
        this.$store.dispatch("commonData/getCarLibraryData");
        this.$nextTick(() => {
          this.onResetForm();
          this.$refs.listTabel.clearSelection();
        });
      }
    }
  },
  computed: {
    ...mapState({
      carLibraryData: state => state.commonData.carLibraryData
    })
  },
  created() {
    this.getFaceLibrary();
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
    getTableList() {
      this.listTableLoading = true;
      getCarinfos(this.listQuery)
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
    // 选择车辆保存
    onSubmit() {
      let filterArr = this.updateData.map(item => item.id);
      let newArr = this.listSelect
        .filter(item => !filterArr.includes(item.id))
        .map(item => {
          return {
            id: item.id,
            name: item.name,
            plateNumber: item.plateNumber
          };
        });
      
      this.updateData = this.updateData.concat(newArr);
      if(this.handleWay) {
        let _this = this
        this.handleWay().then(res => {
          this.$emit('complete', this.updateData)
        this.isLabelDialog = false;
        })
      } else {
        this.isLabelDialog = false;
      }
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
    },
    //获取全部选中的carId
    getCarIds() {
      return this.updateData.map(item => item.id)
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
      width: 34px;
      height: 38px;
      line-height: 38px;
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
      padding: 0 8px;
      margin: 0 10px 10px 0;
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
        width: 100%;
        height: 100%;
        line-height: 37px;
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