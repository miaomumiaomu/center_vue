<template>
  <div class="app-container">
    <el-form :inline="true" :model="listQuery" ref="listForm" size="mini" class="common-table-form"  @submit.native.prevent>
      <el-form-item label="警情名称" prop="_filter_like_name">
        <el-input v-model="listQuery._filter_like_name" @keyup.enter.native="onSearch" clearable/>
      </el-form-item>
      <el-form-item label="警情编号" prop="_filter_eq_code">
        <el-input v-model="listQuery._filter_eq_code" @keyup.enter.native="onSearch" clearable/>
      </el-form-item>
      <el-form-item label="警情类型" prop="_filter_eq_type">
        <dict-select v-model="listQuery._filter_eq_type" dict-name="police_case_type" />
      </el-form-item>
      <el-form-item label="警情状态" prop="_filter_eq_status">
        <dict-select v-model="listQuery._filter_eq_status" dict-name="police_case_status" />
      </el-form-item>
      <el-form-item label="时间" prop="_filter_ge_beginTime">
        <date-picker :beginTime.sync="listQuery._filter_ge_beginTime" :endTime.sync="listQuery._filter_le_endTime"
        valueFormat="yyyy-MM-dd HH:mm:ss" momentFormat="YYYY-MM-DD HH:mm:ss"/>
      </el-form-item>
      <el-form-item label="涉案人" prop="_filter_like_personName">
        <el-input v-model="listQuery._filter_like_personName" @keyup.enter.native="onSearch" clearable/>
      </el-form-item>
      <el-form-item label="证件号码" prop="_filter_eq_identifyNo">
        <el-input v-model="listQuery._filter_eq_identifyNo" @keyup.enter.native="onSearch" clearable/>
      </el-form-item>
      <el-form-item label="负责人" prop="_filter_like_userName">
        <el-input v-model="listQuery._filter_like_userName" @keyup.enter.native="onSearch" clearable/>
      </el-form-item>
      <el-form-item label="辖区" prop="_filter_like_policeAreaCode">
        <jurisdiction-person-search v-model="listQuery._filter_like_policeAreaCode"></jurisdiction-person-search>
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
        警情管理
        <em>{{ listData.total || 0 }}</em>
      </div>
      <div class="right">
        <el-button class="txt-btn" type="text" size="mini" icon="el-icon-plus" @click="onAdd">添加</el-button>
      </div>
    </div>

    <el-table height="636px" :data="listData.rows" highlight-current-row>
      <!-- <el-table-column type="selection" width="50" /> -->
      <el-table-column align="center" label="序号" width="50px" type="index" />
      <el-table-column align="center" label="警情名称" prop="name" />
      <el-table-column align="center" label="警情编号" prop="code" />
      <el-table-column align="center" label="警情类型" prop="type">
        <template slot-scope="scope">
          {{ scope.row.type | commonFilter('police_case_type') }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="涉案人员" prop="personCnt" />
      <el-table-column align="center" label="立案时间" prop="createTime" />
      <el-table-column align="center" label="最近更新" prop="updateTime" />
      <el-table-column align="center" label="负责人" prop="">
        <template slot-scope="scope">
          {{ scope.row.userArr ? scope.row.userArr.map(item => item.userName).join(',') : '' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="辖区" prop="policeAreaName" />
      <el-table-column align="center" label="警情状态" prop="status">
        <template slot-scope="scope">
          {{ scope.row.status | commonFilter('police_case_status') }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" fixed="right" width="200">
        <template slot-scope="scope">
          <el-button size="mini" @click="onDetail(scope.row.id)">详情</el-button>
          <el-button type="success" size="mini" @click="onEdit(scope.row.id)" v-if="judgePermit(scope.row)">编辑</el-button>
          <el-button type="success" size="mini" @click="onHandle(scope.row.id)" v-if="judgePermit(scope.row)">处理</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination @size-change="onListLimit" @current-change="onListPaging" :current-page="listQuery.pageNo" :page-size="listQuery.pageSize" :page-sizes="[15,30,50]" layout="total, sizes, prev, pager, next, jumper" :total="listData.total" />

    <add-form ref="addForm" @update="init"></add-form>

    <handle-form ref="handleForm" @update="init"></handle-form>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getPolicecaseList } from '@/api/warnManage'
export default {
  components: {
    AddForm: () => import("./components/addForm"),
    HandleForm: () => import("./components/handleForm"),
    JurisdictionPersonSearch: () => import("@/components/JurisdictionPersonSearch")
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  data() {
    return {
      listQuery: {
        pageNo: 1,
        pageSize: 15,
        _filter_like_name: null,
        _filter_eq_code: null,
        _filter_eq_type: null,
        _filter_eq_status: null,
        _filter_ge_beginTime: null,
        _filter_le_endTime: null,
        _filter_like_personName: null,
        _filter_eq_identifyNo: null,
        _filter_like_userName: null,
      },
      listData: [],
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      getPolicecaseList(this.listQuery).then(res => {
        if (res.status === 200) {
          this.listData = res.data
        }
      })
    },
    judgePermit(row) {
      if (!row.userArr) return false
      if (row.status == 0 && this.userInfo.manager == 1) return true
      if (row.status == 0 && row.userArr.map(item => item.userId).includes(this.userInfo.userId)) {
        return true
      }
      return false
    },
    onResetForm() {
      this.$refs.listForm.resetFields()
      this.listQuery._filter_le_endTime = null
    },
    onSearch() {
      this.listQuery.pageNo = 1
      this.init()
    },
    onListLimit(val) {
      this.listQuery.pageSize = val
      this.init()
    },
    onListPaging(val) {
      this.listQuery.pageNo = val
      this.init()
    },
    onAdd() {
      this.$refs.addForm.showDialog(null, '添加警情')
    },
    onDetail(id) {
      this.$refs.handleForm.showDialog(id, '警情详情', true)
    },
    onEdit(id) {
      this.$refs.addForm.showDialog(id, '编辑警情')
    },
    onHandle(id) {
      this.$refs.handleForm.showDialog(id, '警情处理')
    },
  }
};
</script>
<style lang="scss" scoped>
.app-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  .el-pagination {
    padding: 10px;
  }
}
</style>
