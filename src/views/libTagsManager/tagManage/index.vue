<template>
  <div class="app-container">
    <el-row>
      <el-col :span="4" class="task-border-right">
        <tag-type @tagTypeChange="tagTypeChange" @tagTypeListChange="tagTypeListChange"></tag-type>
      </el-col>

      <el-col :span="20" class="table-box">
        <el-form class="common-table-form" ref="listForm" :model="listQuery" :inline="true"  @keyup.enter.native="onSearch" size="mini">
          <el-form-item label="标签名称" prop="_filter_like_name">
            <el-input v-model="listQuery._filter_like_name" clearable />
          </el-form-item>
          <el-form-item label="指定人脸库" prop="_filter_eq_libraryId">
            <el-select v-model="listQuery._filter_eq_libraryId" placeholder="请选择">
              <el-option v-for="item in library" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="居住房屋分类" prop="_filter_eq_controlLevel">
            <dict-select dict-name="house_manage_level" v-model="listQuery._filter_eq_controlLevel"/>
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
            {{currentTagType.name}}
            <em>{{listTableData.total?listTableData.total:0}}</em>
          </div>
          <div class="right">
            <el-button class="txt-btn" size="mini" type="text" icon="el-icon-plus" @click="onItemEdit()" v-permission="'FUNC_HOUSE_ADD'">添加</el-button>
            <el-button class="txt-btn" size="mini" type="text" icon="el-icon-delete" @click="onItemDelete" v-permission="'FUNC_HOUSE_DELETE'">删除</el-button>
          </div>
        </div>

        <!-- 表格模式 S -->
        <el-table ref="listTabel" :data="listTableData.rows" v-loading.body="listTableLoading" height="100%" highlight-current-row @selection-change="onListChange">
          <el-table-column type="selection" width="50" />
          <el-table-column label="序号" align="center" type="index" width="50"/>
          <el-table-column prop="name" label="标签名称" min-width="110" align="center" />
          <el-table-column label="标签类型" min-width="100" align="center">
            <template slot-scope="{ row: { categoryId } }">
              {{ getName(tagType, 'id', categoryId, 'name') }}
            </template>
          </el-table-column>
          <el-table-column prop="fullName" label="标签颜色/文字" min-width="170" align="center">
            <template slot-scope="{ row: {id} }">
              <face-category-list :data="faceLibraryData" :type="0" :chosen="id ? [ id + '' ] : []" />
            </template>
          </el-table-column>
          <el-table-column label="指定人脸库" min-width="80" align="center">
            <template slot-scope="{ row: { libraryId } }">
              {{ getName(library, 'id', libraryId, 'name') }}
            </template>
          </el-table-column>
          <el-table-column label="居住房屋分类" min-width="80" align="center">
            <template slot-scope="{ row: { controlLevel } }">{{ controlLevel + '' | commonFilter('house_manage_level') }}</template>
          </el-table-column>
          <el-table-column fixed="right" width="170" label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="success" @click="onItemEdit(scope.row, true)" v-permission="'FUNC_HOUSE_UPDATE'">查看</el-button>
              <el-button size="mini" type="success" @click="onItemEdit(scope.row)" v-permission="'FUNC_HOUSE_UPDATE'">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 表格模式 E -->

        <el-pagination @size-change="onListLimit" @current-change="onListPaging" :current-page="listQuery.pageNo" :page-size="listQuery.pageSize" :page-sizes="[15,30,50]" layout="total, sizes, prev, pager, next, jumper" :total="listTableData.total" />
      </el-col>
    </el-row>

    <!-- 编辑表单 -->
    <tag-form ref="tagForm" @finish="finish" :library="library" :tagType="tagType" :readonly="readonly"></tag-form>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { getTagTypeList, tagTypeSaveOrUpdate, getTagList, tagSaveOrUpdate, delTag } from "@/api/libTagsManage";
import { getLabelLibraryList } from "@/api/faceLibrary";

export default {
  components: {
    tagType: () => import('./components/tagType'),
    tagForm: () => import('./components/tagForm')
  },
  data: () => ({
    personId: '',
    listQuery: {
      pageNo: 1,
      pageSize: 15,
      totalCount: null,
      _filter_like_name: null,
      _filter_eq_libraryId: null,
      _filter_eq_controlLevel: null
    },

    library: [],
    tagType: [],
    currentTagType: {},
    listTableData: {},
    listTableLoading: false,
    readonly: false, //是否只读
    listIds: []

  }),
  created() {
    //获取人员库
    getLabelLibraryList().then(res => {
      this.library = res.data
    })
    //获取标签类型
    getTagTypeList().then(res => {
      this.tagType = res.data;
    });
    this.getTableList();
    this.$store.dispatch("commonData/getFaceLibraryData");
  },
  computed: {
    ...mapState({
      faceLibraryData: state => state.commonData.faceLibraryData
    })
  },
  methods: {
    getTableList(data) {
      let _filter_eq_categoryId = this.currentTagType.id || null
      getTagList({ ...this.listQuery, _filter_eq_categoryId }).then(res => {
        this.listTableData = res.data
      })
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
    tagTypeChange(data) {
      this.currentTagType = data
      this.getTableList()
    },
    tagTypeListChange() {
      //获取标签类型
      getTagTypeList().then(res => {
        this.tagType = res.data;
      });
    },
    onResetForm() {
      this.$refs.listForm.resetFields();
      this.getTableList();
    },
    onListChange(val) {
      this.listIds = val.map(item => item.id);
    },
     // 分页更新
    onListLimit(val) {
      this.listQuery.pageNo = 1;
      this.listQuery.pageSize = val;
      this.getTableList();
    },
    // 分页更新
    onListPaging(val) {
      this.listQuery.pageNo = val;
      this.getTableList();
    },
    // 任务编辑
    onItemEdit(item, readonly) {
      let data = { ...item }
      this.readonly = readonly || false
      this.$nextTick(() => {
        this.$refs.tagForm.openFormDialog(data)
      });
    },
    onItemDelete() {
      if (!this.listIds.length) {
        this.$notify({
          title: "提示",
          message: "请选择需要删除的数据",
          type: "warning",
          duration: 2000
        });
        return;
      }
      
      this.$confirm(`确定删除这些标签？`, "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        confirmButtonClass: "el-button--mini",
        cancelButtonClass: "el-button--mini fr",
        type: "warning"
      }).then(() => {
        delTag({ ids: this.listIds }).then(res => {
          let isSuccess = res.status === 200;
          // 提示处理
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
    getName(data, key, value, name) {
      let val = data.find(item => item[key] == value)
      return val ? val[name] : ''
    },
    finish() {
      this.getTableList()
      this.$store.dispatch("commonData/getFaceLibraryData");
    }
  }
};
</script>

<style lang="scss" scoped>
.app-container{
  height: 100%;
  .el-row{
    height: 100%;
    .table-box{
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .task-border-right {
      border-right: 1px solid gainsboro;
    }
    .el-pagination {
      padding: 10px;
    }
  }
}
</style>