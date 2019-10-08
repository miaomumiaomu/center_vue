<template>
  <el-dialog :visible.sync="isFormDialogadd" class="body0" width="680px" :title="title" append-to-body>
    <div class="main" :style="waterBg">
      <!-- 表单筛选 -->
      <el-form class="common-table-form" ref="listForm" size="mini" :model="listQuery" :inline="true" @keyup.enter.native="onSearch" >
        <el-form-item prop="_filter_eq_keyword" label="关键字">
          <el-input @keyup.enter.native="onSearch" placeholder="姓名/证件号" v-model="listQuery._filter_eq_keyword" />
        </el-form-item>
        <el-form-item prop="_filter_eq_personTags" label="人员标签">
          <face-library-select v-model="listQuery._filter_eq_personTags" class="nowrap" placeholder="全部" @input="onSearch" clearable/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="onResetForm">重置</el-button>
        </el-form-item>
      </el-form>
      <!-- 表格模式 S -->
      <el-table ref="listTabel" :data="listTableData.rows" height="calc(100vh - 400px)" row-key="id" v-loading.body="listTableLoading" highlight-current-row @current-change="oneSelect">
        
        <el-table-column type="index" width="50" label="序号" />
        <el-table-column width="80" label="证件照" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.imgShow" class="pic">
          </template>
        </el-table-column>
        <el-table-column width="200" prop="name" label="姓名" align="center">
          <template slot-scope="scope">
            <div class="identity txt">
              <label>{{scope.row.name}}</label>
              <p>{{scope.row.identityNo}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column width="80" prop="age" label="年龄" align="center"></el-table-column>
        <el-table-column width="80" label="性别" align="center">
          <template slot-scope="scope">
            <div>{{scope.row.sex | commonFilter('comm_sex')}}</div>
          </template>
        </el-table-column>
        <el-table-column label="类别" min-width="110" align="center">
          <template slot-scope="scope">
            <!-- <div>111</div> -->
            <face-category-list :data="faceLibraryData" :type="0" :chosen="scope.row.personTags?scope.row.personTags.split(','):[]" />
          </template>
        </el-table-column>
      </el-table>
      <!-- 表格模式 E -->

      <el-pagination @size-change="onListLimit" @current-change="onListPaging" :current-page="listQuery.pageNo" :page-size="listQuery.pageSize" :page-sizes="[15,30,50]" layout="total, sizes, prev, pager, next, jumper" :total="listTableData.total" />
    </div>

    <div slot="footer">
      <el-button size="mini" type="primary" @click="onSubmit">确定</el-button>
      <el-button size="mini" @click="isFormDialogadd = false">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import moment from "moment";
import { getLabelList } from "@/api/faceLibrary";
import { mapState } from "vuex";

export default {
  props: {
    form: null,
    isOpen: {
      default: false,
      type: Boolean
    },
    title: [String]
  },
  data: () => ({
    isFormDialogadd: false,
    labelData: [],
    labelArr: [],
    updateData: [],
    // faceLibraryData: {},
    labelTypeData: [],
    manInfo: null, // 人员信息
    listSelect: [],
    listTableData: {},
    listQuery: {
      pageNo: 1,
      pageSize: 15,
      totalCount: null,
      _filter_eq_personTags: null,
      _filter_eq_keyword: null,
    },
    listTableLoading: false
  }),
  computed: {
    ...mapState({
      faceLibraryData: state => state.commonData.faceLibraryData,
      waterBg: state => state.user.waterBg, // 水印
    }),
    
  },
  watch: {
    isOpen(val) {
      this.isFormDialogadd = val;
    },
    isFormDialogadd(val) {
      this.$emit("update:isOpen", val);
    }
  },
  created() {
    this.$store.dispatch("commonData/getFaceLibraryData");
    this.getTableList();
  },
  methods: {
    oneSelect(val) {
      this.manInfo = val;
    },
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
      getLabelList(this.listQuery).then(res => {
          this.listTableData = res.data;
        })
        .finally(() => {
          this.listTableLoading = false;
        });
    },
    // getFaceLibrary() {
    //   getFaceLibraryList().then(res => {
    //     let json = {};
    //     res.data.map(item => {
    //       json[item.num] = {
    //         name: item.name,
    //         color: item.color,
    //         shortName: item.shortName
    //       };
    //     });
    //     this.faceLibraryData = json;
    //   });
    // },
    // 选择人员保存
    onSubmit() {
      this.isFormDialogadd = false;
      this.$emit("choseMan", this.manInfo);
    },
    // 列表参数重置
    onResetForm() {
      this.$refs.listForm.resetFields();
      this.getTableList();
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
}

</script>
<style lang="scss" scoped>
  .el-pagination {
    margin-top: 15px;
  }
  .pic{
    width: 60px;
  }
</style>