<template>
  <div class="app-container" >
    <el-form :inline="true" :model="listQuery" ref="listForm" size="mini" class="common-table-form"  @submit.native.prevent>
      <el-form-item label="关键字" prop="_filter_like_keyword">
        <el-input placeholder="请输入系统名称" v-model="listQuery._filter_like_keyword" @keyup.enter.native="onSearch"/>
      </el-form-item>
      <el-form-item label="小区" prop="_filter_eq_communityId">
        <communities-select v-model="listQuery._filter_eq_communityId" class="nowrap"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="onSearch">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="mini" @click="onResetForm">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="common-tool">
      <div class="title">
        应用管理
        <em>{{applicationData.total}}</em>
      </div>
      <div class="right">
        <el-button class="txt-btn" type="text" size="mini" icon="el-icon-plus" @click="onItemEdit()" v-permission="'FUNC_APPLICATION_ADD'">添加</el-button>
      </div>
    </div>

    <el-table height="calc(100vh - 255px)" :data="applicationData.rows" highlight-current-row @selection-change="onListChange">
      <el-table-column align="center" label="序号" width="50px" type="index" />
      <el-table-column align="center" label="系统名称" prop="appName" />
      <el-table-column align="center" label="系统类型">
        <template slot-scope="scope">
          <span>{{scope.row.appType | commonFilter('app_type')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="管辖小区" prop="communityName" />
      <!-- <el-table-column align="center" label="应用ID" prop="appKey" /> -->
      
      <el-table-column align="center" label="状态" prop="status">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status!==undefined" :type="scope.row.status==1?'primary':'danger'">
            <span v-if="scope.row.status==1">启用</span>
            <span v-if="scope.row.status==0">禁用</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="onItemEdit(scope.row.id)" v-permission="'FUNC_APPLICATION_UPDATE'">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑弹窗 -->
    <el-dialog :visible.sync="isFormDialog" :title="this.form.id?'编辑应用信息':'添加应用'" width="400px">
      <el-form :model="form" ref="form" :rules="rules" label-width="80px" :style="waterBg">
        <el-form-item label="系统名称" prop="appName">
          <el-input placeholder="请输入系统名称" v-model="form.appName" />
        </el-form-item>
        <el-form-item label="应用ID" prop="appKey">
          <el-input placeholder="请输入应用ID" v-model="form.appKey" />
        </el-form-item>
        <el-form-item label="应用秘钥" prop="appSecret">
          <el-input placeholder="请输入应用秘钥" v-model="form.appSecret" />
        </el-form-item>
        <el-form-item label="系统类型" prop="appType">
          <dict-select dict-name="app_type" v-model="form.appType" />
        </el-form-item>
        <el-form-item label="管辖小区" prop="communityIds" >
          <communities-select v-model="form.communityIds" placeholder="请选择所属小区" @finish="projectSelect" :multiple="true"/>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio v-model="form.status" :label="1">启用</el-radio>
          <el-radio v-model="form.status" :label="0" v-if="form.appType !==0">禁用</el-radio>
          <!-- <dict-select dict-name="enable_status" v-model="form.status" :disabled="form.appType==0"/> -->
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" size="mini" @click="onSubmit">确定</el-button>
        <el-button size="mini" @click="isFormDialog=false">取消</el-button>
      </div>
    </el-dialog>

    <el-pagination @size-change="onListLimit" @current-change="onListPaging" :current-page="listQuery.pageNo" :page-size="listQuery.pageSize" :page-sizes="[15,30,50]" layout="total, sizes, prev, pager, next, jumper" :total="applicationData.total" />
  </div>
</template>

<script>
import {
  getApplicationList,
  getApplication,
  deleteApplication,
  putApplication,
  postApplication
} from "@/api/applicationManage";
import { mapState } from "vuex";

export default {
  data() {
    return {
      form: {
        id: null,
        appName: null,
        communityIds: null,
        appSecret: null,
        appType: null,
        appKey: null,
        status: null,
        project: null,
      },
      rules: {
        appName: { required: true, message: "系统名称不能为空" },
        appKey: { required: true, message: "应用ID不能为空" },
        appSecret: { required: true, message: "应用秘钥不能为空" },
        appType: { required: true, message: "系统类型不能为空" },
        status: { required: true, message: "状态不能为空" },
        communityIds: { required: true, message: "所属小区不能为空" }
      },
      listQuery: {
        pageNo: 1,
        pageSize: 15,
        _filter_like_keyword: null,
        _filter_eq_communityId: null
      },
      applicationData: [],
      listIds: [],
      isFormDialog: false,
      
    };
  },
  created() {
    this.init();
  },
  computed: {
    ...mapState({
      waterBg: state => state.user.waterBg, // 水印
    })
  },
  methods: {
    init() {
      getApplicationList(this.listQuery).then(res => {
        this.applicationData = res.data;
      });
    },
    onListChange(val) {
      this.listIds = val.map(item => item.id);
    },
    onItemEdit(id) {
      this.form.id = id || null;
      this.isFormDialog = true;
      this.$nextTick(() => {
        this.$refs.form && this.$refs.form.resetFields();
      });

      if (this.form.id) {
        getApplication(this.form.id).then(res => {
          this.form = res.data;
        });
      }
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (!valid) return;

        if (this.form.id) {
          putApplication(this.form).then(res => {
            let isSuccess = res.status == 200;
            // 提示
            this.$notify({
              title: "提示",
              message: isSuccess ? "修改成功" : res.message,
              type: isSuccess ? "success" : "error",
              duration: 2000
            });
            if (isSuccess) {
              this.isFormDialog = false;
              this.onSearch();
            }
          });
        } else {
          postApplication(this.form).then(res => {
            let isSuccess = res.status == 200;
            // 提示信息
            this.$notify({
              title: "提示",
              message: isSuccess ? "成功" : res.message,
              type: isSuccess ? "success" : "error",
              duration: 2000
            });

            if (isSuccess) {
              this.isFormDialog = false;
              this.onSearch();
            }
          });
        }
      });
    },
    onResetForm() {
      this.$refs.listForm.resetFields();

      this.init();
    },
    onSearch() {
      this.listQuery.pageNo = 1;
      this.init();
    },
    onListLimit(val) {
      this.listQuery.pageSize = val;
      this.init();
    },
    onListPaging(val) {
      this.listQuery.pageNo = val;
      this.init();
    },
    //所属小区返回
    projectSelect(value) {
      console.log(value)
      this.$set(this.form, 'communityIds', value)
    },
  }
};
</script>


<style lang="scss" scoped>
.app-container {
  height: 100%;
  .el-pagination {
    padding: 10px;
  }
}
</style>
