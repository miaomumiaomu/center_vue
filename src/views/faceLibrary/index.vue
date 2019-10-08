<template>
  <div class="app-container">
    <el-row>
      <!-- 左侧标签库管理 S -->
      <el-col :span="4" class="task-border-right" v-if="haveInit">
        <label-library ref="labelLibrary" @libChange="libChange" />
      </el-col>
      <!-- 左侧标签库管理 E -->
      
      <el-col :span="haveInit ? 20 : 24" class="table-box">
        <!-- 多选标签 -->
        <multiple-choice-tag @tagChange="tagsChange"></multiple-choice-tag>

        <!-- 表单筛选 -->
        <el-form class="common-table-form" ref="listForm" :inline="true" @submit.native.prevent size="mini">
          <el-form-item prop="pageNo" class="m0" />
          <el-form-item prop="pageSize" class="m0" />
          <el-form-item prop="totalCount" class="m0" />
          <el-form-item label="以图搜图">
            <picture-search2 ref="picSearch"></picture-search2>
          </el-form-item>
          <el-form-item label="姓名" prop="_filter_like_name">
            <el-input placeholder="姓名" v-model="listQuery._filter_like_name" @keyup.enter.native="onSearch" clearable />
          </el-form-item>
          <el-form-item prop="_filter_like_identityNo" label="证件号码">
            <el-input v-model="listQuery._filter_like_identityNo" clearable @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item prop="_filter_eq_sex" label="性　　别">
            <dict-select v-model="listQuery._filter_eq_sex" dict-name="comm_sex" />
          </el-form-item>
          <el-form-item prop="ages" label="年龄段">
            <div class="generation">
              <el-input v-model="listQuery._filter_ge_startAge" class="generation-input"></el-input>
              <div> - </div>
              <el-input v-model="listQuery._filter_le_endAge" class="generation-input"></el-input>
            </div>
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
          <div class="title" v-if="listTableData.total">
            人员管理
            <em v-if="listTableData.total">{{listTableData.total}}</em>
          </div>
          <div class="right">
            <el-button class="txt-btn" style="color: #fff" size="mini" type="danger" icon="el-icon-delete" v-if="currentMenuData.num === 4" @click="DelLibrarys()">一键删除</el-button>
            <el-button class="txt-btn" size="mini" type="text" icon="el-icon-plus" v-if="currentMenuData.num!=2" @click="onItemEdit()" v-permission="'FUNC_PERSON_ADD'">添加</el-button>
            <el-button class="txt-btn" size="mini" type="text" icon="el-icon-delete" v-if="currentMenuData.num!=2" @click="onItemDelete" v-permission="'FUNC_PERSON_DELETE'">注销</el-button>
            <div class="separator"></div>
            <el-button-group class="switch">
              <el-button :type="mode===0?'primary':'info'" @click="mode=0" size="mini">
                <svg-icon icon-class="category" />
              </el-button>
              <el-button :type="mode===1?'primary':'info'" @click="mode=1" size="mini">
                <svg-icon icon-class="images" />
              </el-button>
            </el-button-group>
          </div>
        </div>

        <!-- 表格模式 S -->
        <el-table v-show="mode == 0" ref="listTabel" :data="listTableData.rows" height="calc(100vh - 255px)" v-loading.body="listTableLoading" highlight-current-row @selection-change="onListChange">
          <el-table-column type="selection" width="50" />
          <el-table-column label="序号" align="center" type="index" width="60" />
          <el-table-column min-width="80" label="证件照" align="center">
            <template slot-scope="scope">
              <suspension-menu :SuspensionData="scope.row"/>
            </template>
          </el-table-column>
          <el-table-column label="姓名" prop="name" align="center" width="100"/>
          <el-table-column min-width="100" label="证件类型" align="center">
            <template slot-scope="{ row: { certificateType } }">{{ certificateType | commonFilter('document_types') }}</template>
          </el-table-column>
          <el-table-column label="证件号码" prop="identityNo" align="center" />
          <el-table-column label="性别" prop="sex" align="center" />
          <el-table-column label="年龄" prop="age" align="center" />
          <el-table-column label="类别" min-width="110" align="center">
            <template slot-scope="scope">
              <face-category-list :data="faceLibraryData" :type="0" :chosen="scope.row.personTags?scope.row.personTags.split(','):[]" />
            </template>
          </el-table-column>
          <el-table-column fixed="right" width="70" label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="success" @click="onItemEdit(scope.row.id)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 表格模式 E -->

        <!-- 卡片模式 S -->
        <div class="card-list" v-show="mode == 1">
          <div class="item" :class="{sel: listIds.includes(item.id)}" v-for="item in listTableData.rows" :key="item.id" @click="$refs.listTabel.toggleRowSelection(item)">
            <div class="pic">
              <img :src="item.imgShow">
              <face-category-list :data="faceLibraryData" :type="1" :chosen="item.personTags?item.personTags.split(','):[]" />
            </div>
            <div class="box">
              <div class="txt">
                <svg-icon icon-class="user" />
                <b class="name">{{item.name}}</b>
                <el-checkbox :value="listIds.includes(item.id)" />
              </div>
              <div class="txt">
                <svg-icon icon-class="credentials" />
                <label>{{item.identityNo}}</label>
              </div>
              <div class="btns">
                <el-button size="mini" @click.stop="onItemEdit(item.id)" v-permission="'FUNC_PERSON_UPDATE'">编辑</el-button>
              </div>
            </div>
          </div>
        </div>
        <!-- 卡片模式 E -->

        <el-pagination @size-change="onListLimit" @current-change="onListPaging" :current-page="listQuery.pageNo" :page-size="listQuery.pageSize" :page-sizes="[15,30,50]" layout="total, sizes, prev, pager, next, jumper" :total="listTableData.total" />
      </el-col>
    </el-row>

    <label-form :libraryNum="listQuery._filter_eq_libraryNum" ref="labelForm" :is-open.sync="isAddFormDialog" :id.sync="labelFormId" :readonly="formReadonly" @complete="updateView"/>

  </div>
</template>
<script>
import { mapState } from "vuex";

import { getLabelList, deleteLabel, deleteLibrary } from "@/api/faceLibrary";
import { colorBrightness } from "@/utils";

export default {
  name: "faceLibrary",
  components: {
    LabelForm: () => import("@/components/FaceLabelForm"),
    LabelLibrary: () => import("./components/libraryMenu")
  },
  data() {
    return {

      mode: 0, // 显示切换
      isAddFormDialog: false, // 控制表单显示
      labelFormId: null, // 当前id
      colorBrightness: colorBrightness, // 色彩亮度判断

      formReadonly: false,

      currentMenuData: [],
      listIds: [],
      listQuery: {
        pageNo: 1,
        pageSize: 15,
        totalCount: null,
        _filter_eq_libraryNum: null,
        _filter_like_name: null,
        _filter_like_identityNo: null,
        _filter_eq_sex: null,
        _filter_ge_startAge: null,
        _filter_le_endAge: null
      },
      listTableData: {},
      listTableLoading: false,
      libraryNums: null,
      selectData: [],
    };
  },
  computed: {
    ...mapState({
      faceLibraryData: state => state.commonData.faceLibraryData
    }),
    haveInit() {
      return location.hash.includes('debugTool')
    }
  },
  watch: {
    currentMenuData(val) {
      // if(val.num) {
      //   this.listQuery._filter_eq_libraryNum = val.num;
      //   this.listQuery._filter_eq_categorieId = null
      // } else {
      //   this.listQuery._filter_eq_libraryNum = null
      //   this.listQuery._filter_eq_categorieId = val.id;
      // }
      // this.listQuery._filter_eq_categorieAll = null
      // if(location.hash.includes('faceLibrary')) {
      //   this.listQuery._filter_eq_categorieAll = 'all'
      // }
      // this.onResetForm();
    }
  },
  mounted() {
    this.$store.dispatch("commonData/getFaceLibraryData");
    this.getTableList()
  },
  methods: {
    // 更新页面数据
    updateView() {
      this.labelFormId = null;
      this.onSearch();
    },
    // 菜单更新
    libChange(data) {
      this.libraryNums = data.num
    },
    // 获取表格数据
    getTableList() {
      let _categoryIds = null
      let _personTags = null
      let data = this.selectData
      if (data) {
        _categoryIds = []
        _personTags = []
        data.forEach(items => items.forEach(item => {
          if (item.color) {
            _personTags.push(item.id)
          } else {
           _categoryIds.push(item.id)
          }
        }))
        _categoryIds = _categoryIds.join(',')
        _personTags = _personTags.join(',')
      }
      this.listTableLoading = true;
      getLabelList({ ...this.listQuery,_filter_in_categoryIds: _categoryIds,  _filter_in_personTags: _personTags, _filter_eq_libraryNums: this.libraryNums })
        .then(res => {
          this.listTableData = res.data;
        })
        .finally(() => {
          this.isSuspensionMenu = true;
          this.listTableLoading = false;
        });
    },
    // 查询
    async onSearch() {
      //传关键字到组件搜索身份证号
      let data = []
      await this.$refs.picSearch.picSearch(this.listQuery._filter_like_name).then(res => {
        data = res
      })
      if (!data) { //当以图搜图条件都为空
        this.listQuery = Object.assign(this.listQuery, {
          pageNo: 1,
          totalCount: null,
          _filter_in_identityNos: null
        });
        this.getTableList();
      } else if (data.length) { //当有身份证时
        this.listQuery = Object.assign(this.listQuery, {
          pageNo: 1,
          totalCount: null,
          _filter_in_identityNos: data.join(',')
        });
        this.getTableList();
      } else {
        this.listTableData = {
          rows: [],
          total: 0
        }
      }
      
    },
    // 列表参数重置
    onResetForm() {
      this.listQuery = { pageNo: 1, pageSize: this.listQuery.pageSize }
      this.$refs.picSearch.clear()
      this.getTableList();
    },
    // 更新列表选中
    onListChange(val) {
      this.listIds = val.map(item => item.id);
    },
    // 表单编辑
    onItemEdit(id, isReadonly) {
      isReadonly = isReadonly || false;

      this.labelFormId = id || null;
      this.formReadonly = isReadonly;
      this.$nextTick(() => {
        this.isAddFormDialog = true;
      });
    },
    // 批量删除
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

      this.$confirm("此操作将永久注销, 是否继续?", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        confirmButtonClass: "el-button--mini",
        cancelButtonClass: "el-button--mini fr",
        type: "warning"
      }).then(() => {
        deleteLabel({
          ids: this.listIds
        }).then(res => {
          let isSuccess = res.status === 200;
          this.$notify({
            title: isSuccess ? "成功" : "失败",
            message: isSuccess ? "删除成功" : res.message,
            type: isSuccess ? "success" : "error",
            duration: 2000
          });

          if (isSuccess) {
            this.updateView();
          }
        });
      });
    },

    //删除库
    DelLibrarys() {
      // if(this.)
      let _num = this.currentMenuData.num
      this.$confirm(`此操作将永久删除【陌生人库】, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteLibrary(_num).then( res => {
            if(res.data.success) {
              this.updateView()
              this.$notify({
                title: "提示",
                message: "删除成功",
                type: "success",
                duration: 2000
              });
            }
          })
        })
    },

    /* 分页处理 */
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
    tagsChange(data) {
      this.selectData = data
      this.getTableList()
    }

  },
};
</script>
<style lang="scss" scoped>
.app-container {
  position: relative;
  height: 100%;
  .el-row,
  .el-col {
    height: 100%;
  }
  .task-border-right {
    border-right: 1px solid gainsboro;
  }
  .el-table {
    .pic {
      display: block;
      width: 50px;
      height: 62px;
      margin: 0 auto;
    }
  }
}
.common-tool{
  .title{
    height: 42px;
    line-height: 42px;
  }
}
.table-box {
  display: flex;
  flex-direction: column;
  .el-button {
    margin-left: 0;
  }
  .el-pagination {
    padding: 10px;
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
      height: 198px;
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