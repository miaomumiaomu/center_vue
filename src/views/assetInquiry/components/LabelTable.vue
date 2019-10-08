<template>
  <div class="label-table">
    <!-- 表单筛选 -->
    <el-form
      class="common-table-form"
      ref="listForm"
      :model="listQuery"
      label-width="70px"
      :inline="true"
      @submit.native.prevent
      size="mini"
    >
      <el-form-item prop="_filter_like_name" label="姓　　名">
        <el-input v-model="listQuery._filter_like_name" clearable @keyup.enter.native="onSearch"></el-input>
      </el-form-item>
      <el-form-item prop="_filter_like_identity" label="证件号码">
        <el-input v-model="listQuery._filter_like_identity" clearable @keyup.enter.native="onSearch"></el-input>
      </el-form-item>
      <el-form-item prop="_filter_like_mobile" label="联系方式">
        <el-input v-model="listQuery._filter_like_mobile" clearable @keyup.enter.native="onSearch"></el-input>
      </el-form-item>
      <el-form-item prop="_filter_eq_personTags" label="人员类别">
        <face-library-select v-model="listQuery._filter_eq_personTags" multiple clearable collapse-tags placeholder="请选择" />
      </el-form-item>
      <el-form-item prop="ages" label="年龄段">
        <div class="generation">
          <el-input v-model="listQuery._filter_ge_startAge" class="generation-input"></el-input>
          <div> - </div>
          <el-input v-model="listQuery._filter_le_endAge" class="generation-input"></el-input>
        </div>
      </el-form-item>
      <el-form-item prop="_filter_eq_sex" label="性　　别">
        <dict-select v-model="listQuery._filter_eq_sex" dict-name="comm_sex" />
      </el-form-item>
      <el-form-item prop="_filter_eq_communityId" label="所属小区">
        <communities-select v-model="listQuery._filter_eq_communityId" class="nowrap" clearable/>
      </el-form-item>
      <el-form-item prop="_filter_eq_type" label="住户类型">
        <dict-select v-model="listQuery._filter_eq_type" dict-name="label_type" />
      </el-form-item>
      <!-- <el-form-item prop="_filter_like_policeAreaCode" label="所属辖区" >
        <jurisdiction-person-search v-model="listQuery._filter_like_policeAreaCode"></jurisdiction-person-search>
      </el-form-item> -->
      <!-- <el-form-item prop="cars" label="车辆数量" style="margin-right: 10px !important">
        <div class="generation">
          <el-input v-model="listQuery._filter_eq_startCarCount" class="generation-input"></el-input>
          <div> - </div>
          <el-input v-model="listQuery._filter_eq_endCarCount" class="generation-input"></el-input>
        </div>
      </el-form-item> -->
      <el-form-item prop="_filter_eq_ownCarCount" label="车辆关联">
        <el-select v-model="listQuery._filter_eq_ownCarCount" placeholder="请选择" clearable>
          <el-option label="拥有车辆" value="1"></el-option>
          <el-option label="没有车辆" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="_filter_eq_isHistory" label="居住状态">
        <el-select v-model="listQuery._filter_eq_isHistory" placeholder="请选择" clearable>
          <el-option label="现居" value="0"></el-option>
          <el-option label="搬离" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="onResetForm">重置</el-button>
      </el-form-item>
    </el-form>

    <div class="common-tool">
      <div class="title">
        {{ fullAddressName }}
        <em>{{ `${ realPerson }人 / ${listTableData.total}条记录` }}</em>
      </div>
      <div class="right">
        <el-button class="txt-btn" type="text" size="mini" icon="el-icon-plus" @click="onItemEdit()">添加</el-button>
        <el-button class="txt-btn" size="mini" type="text" icon="el-icon-delete" @click="onItemDelete">删除</el-button>
      </div>
    </div>
    <!-- 表格模式 S -->
    <el-table
      ref="listTabel"
      :data="listTableData.rows"
      v-loading.body="listTableLoading"
      height="100%"
      highlight-current-row
      @selection-change="onListChange"
    >
      <el-table-column type="selection" width="40" />
      <el-table-column label="序号" type="index" align="center"/>
      <el-table-column label="证件照" align="center" width="80">
        <template slot-scope="scope">
          <suspension-menu :SuspensionData="scope.row" />
        </template>
      </el-table-column>
      <el-table-column label="姓名" prop="name" align="center" width="100"/>
      <!-- <el-table-column min-width="100" label="证件类型" align="center">
        <template slot-scope="{ row: { certificateType } }">{{ certificateType | commonFilter('document_types') }}</template>
      </el-table-column> -->
      <el-table-column label="证件号码" prop="identityNo" align="center" width="150" />
      <el-table-column label="联系方式" prop="mobile" align="center" width="120" />>
      <el-table-column label="类别" align="center" width="100">
        <template slot-scope="scope">
          <face-category-list
            :data="faceLibraryData"
            :type="0"
            :chosen="scope.row.personTags?scope.row.personTags.split(','):[]"
          />
        </template>
      </el-table-column>
      <el-table-column label="性别" prop="sex" align="center" width="50" />
      <el-table-column label="年龄" prop="age" align="center" width="50" />
      <el-table-column label="所属小区" prop="communityName" align="center" width="80" />
      <el-table-column label="住户类型" prop="userType" align="center" width="80">
        <!-- <template slot-scope="{ row: { type } }">{{type | commonFilter('label_type')}}</template> -->
      </el-table-column>
      <el-table-column label="居住地址" prop="houseName" align="center" min-width="140"/>
      <el-table-column label="车辆数量" prop="ownCarCount" align="center" width="80"/>
      <el-table-column label="所属派出所" prop="" align="center" width="100"/>
      <el-table-column label="最后更新人员" prop="" align="center" width="100"/>
      <el-table-column label="最后更新时间" prop="" align="center" width="100"/>
      <el-table-column label="操作" fixed="right" align="center" width="130">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="onItemEdit(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="success" @click="openCarDetail(scope.row)">车辆</el-button>
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
      :total="listTableData.total"
    />
    <!-- 底库详情弹窗 -->

    <label-form :is-open.sync="isDetailsForm" :id.sync="personId" @complete="getTableList" isRealPerson/>

    <car-dialog ref="carDialog"></car-dialog>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { getFaceLibraryList } from "@/api/common";
import { getPersonHousePageList, batchDeletePerson } from "@/api/assetInquiry";

export default {
  components: {
    carDialog: () => import('./carDialog'),
    LabelForm: () => import("@/components/FaceLabelForm"),
    JurisdictionPersonSearch: () => import("@/components/JurisdictionPersonSearch")
  },
  props: {
    data: Object,
    fullAddressName: String,
  },
  data: () => ({
    input: '',
    listQuery: {
      pageNo: 1,
      pageSize: 15,
      _filter_like_name: null,
      _filter_like_identity: null,
      _filter_like_mobile: null,
      _filter_eq_personTags: null,
      _filter_ge_startAge: null,
      _filter_le_endAge: null,
      _filter_eq_sex: null,
      _filter_eq_communityId: null,
      _filter_eq_type: null,
      _filter_like_policeAreaCode: null,
      _filter_eq_ownCarCount: null,
      _filter_eq_isHistory: '0',
    },
    listTableData: {},
    listTableLoading: false,
    listIds: [],
    isDetailsForm: false,
    personId: null,
    formReadonly: true,
    carDialogAble: false, //车辆弹窗控制
    realPerson: 0,
  }),
  watch: {
    data(val) {
      if (val.areaCode) {
        this.listQuery._filter_like_locationCode = val.code
        this.listQuery._filter_like_policeAreaCode = val.areaCode
      } else {
        this.listQuery._filter_like_locationCode = null
        this.listQuery._filter_like_policeAreaCode = val.code
      }
      this.getTableList();
    }
  },
  computed: {
    ...mapState({
      faceLibraryData: state => state.commonData.faceLibraryData,
      userInfo: state=> state.user.userInfo,
    })
  },
  methods: {
    // 获取表格数据
    getTableList() {
      this.listTableLoading = true;

      getPersonHousePageList({ ...this.listQuery })
        .then(res => {
          if (res.status === 200) {
            this.listTableData = res.data;
            this.realPerson = res.data.extData.dPersonCnt
          }
        })
        .finally(err => {
          this.listTableLoading = false;
        });
    },
    async onSearch() {
      this.listQuery = Object.assign(this.listQuery, {
        pageNo: 1,
        // pageSize: 15,
        totalCount: null,
      });
      this.getTableList();
    },

    onItemEdit(id) {
      this.personId = id || null
      this.$nextTick(() => {
        this.isDetailsForm = true;
      })
    },
    onItemDelete() {
      if (!this.listIds.length) {
        this.$notify({
          title: "提示",
          message: "请选择需要注销的数据",
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
        batchDeletePerson(this.listIds).then(res => {
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
        })
      })
    },

    // 列表选中
    onListChange(val) {
      this.listIds = val.map(item => {
        return {
          personId: item.id,
          locationId: item.locationId
        }
      });
    },
    // 列表参数重置
    onResetForm() {
      this.$refs.listForm.resetFields();
      this.$set(this.listQuery, '_filter_ge_startAge', null)
      this.$set(this.listQuery, '_filter_le_endAge', null)
      this.$set(this.listQuery, '_filter_in_libraryNums', null)
      // this.getTableList();
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
    //个人车辆弹窗
    openCarDetail(data) {
      this.$refs.carDialog.open(data)
    }
  },
  mounted() {
    this.$store.dispatch("commonData/getFaceLibraryData");
    this.listQuery._filter_like_policeAreaCode = this.userInfo.policeAreaCode
    this.getTableList()
  }
};
</script>
<style lang="scss" scoped>
.label-table {
  height: 100%;
  display: flex;
  flex-direction: column;
  .el-button {
    margin-left: 0;
  }
  .common-table-form {
    background: #fff;
  }
  .expand-form {
    display: flex;
    justify-content: space-between;
    /deep/ .el-form-item {
      margin-bottom: 0px;
    }
  }
  .generation{
    display: flex;
    justify-content: space-between;
    align-items: center;
    .generation-input{
      width: 36px;
      padding: 0 3px;
      /deep/ .el-input__inner{
        padding: 0 3px;
      }
    }
  }
  .el-pagination {
    padding: 10px;
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
}
</style>