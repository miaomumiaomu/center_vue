<template>
  <div class="app-container">
    <!-- 表单筛选 -->
    <el-form class="common-table-form" ref="listForm" :model="listQuery" :inline="true" @keyup.enter.native="onSearch" size="mini">
      <el-form-item prop="pageNo" class="m0" />
      <el-form-item prop="pageSize" class="m0" />
      <el-form-item prop="_filter_le_endTime" class="m0" />
      <el-form-item prop="_filter_like_keywords" label="关键字">
        <el-input v-model="listQuery._filter_like_keywords" placeholder="姓名/手机号" />
      </el-form-item>
      <el-form-item prop="_filter_ge_beginTime" label="时间">
        <date-picker :beginTime.sync="listQuery._filter_ge_beginTime" :endTime.sync="listQuery._filter_le_endTime" />
      </el-form-item>
      <el-form-item prop="_filter_eq_sendResult" label="发送状态">
        <el-select v-model="listQuery._filter_eq_sendResult" clearable>
          <el-option v-for="item in noteStateOption" :key="item.value" :value="item.value" :label="item.label" />
        </el-select>
      </el-form-item>
      <el-form-item prop="_filter_eq_fromType" label="短信类型">
        <el-select v-model="listQuery._filter_eq_fromType" clearable>
          <el-option v-for="item in noteTypeOption" :key="item.value" :value="item.value" :label="item.label" />
        </el-select>
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
        短信记录
        <em v-if="listTableData.total">{{listTableData.total}}</em>
      </div>
    </div>

    <!-- 表格模式 S -->
    <el-table :data="listTableData.rows" height="calc(100vh - 255px)" v-loading.body="listTableLoading" highlight-current-row>
      <el-table-column align="center" type="index" label="序号" />
      <el-table-column align="left" label="短信内容" min-width="200px" >
        <template slot-scope="scope">
          <span>{{ scope.row.sendContent}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="createTime" label="发送时间" />
      <el-table-column align="center" label="发送状态" width="100" >
        <template slot-scope="scope">
            <span v-if="scope.row.sendResult==='0'">成功</span>
            <span v-if="scope.row.sendResult==='1'">失败</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="短信类型">
        <template slot-scope="scope">
            <span v-if="scope.row.fromType===0">人脸预警</span>
            <span v-if="scope.row.fromType===1">车辆预警</span>
            <span v-if="scope.row.fromType===2">测试</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="发送方式">
        <template slot-scope="scope">
            <span v-if="scope.row.sendTypeItem===1">短信猫</span>
            <span v-if="scope.row.sendTypeItem===2">外网</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="acceptName" label="接收人姓名" min-width="90" />
      <el-table-column align="center" prop="acceptPhone" label="接收手机号" min-width="90" />
    </el-table>
    <!-- 表格模式 E -->

    <el-pagination @size-change="onListLimit" @current-change="onListPaging" :current-page.sync="listQuery.pageNo" :page-sizes="[15,30,50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="listTableData.total" />

  </div>
</template>
<script>
import { singlePickerOptions } from "@/utils";
import { getNoteRecordsList } from "@/api/noteRecords";

export default {
  name: "NoteRecords",
  data() {
    return {
      singlePickerOptions: singlePickerOptions,
      
      noteTypeOption:[
        {
          value:0,
          label:"人脸预警"
        },{
          value:1,
          label:"车辆预警"
        },{
          value:2,
          label:"测试"
        }
      ],
      noteStateOption:[
        {
          value:'0',
          label:"成功"
        },{
          value:'1',
          label:"失败"
        }
      ],

      listQuery: {
        pageNo: 1,
        pageSize: 15,
        _filter_ge_beginTime: null,
        _filter_le_endTime: null,
        _filter_eq_sendResult: null,
        _filter_like_keywords: null,
        _filter_eq_fromType:null
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
      getNoteRecordsList(this.listQuery)
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
  }
};
</script>
<style lang="scss" scoped>
.app-container {
  height: 100%;
  // @media screen and (max-width:1500px){
  //    height: 106%;
  // }
  .common-table-form {
    .el-input{
      width: 100px;
    }
    .el-select{
      width: 100px;
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
</style>