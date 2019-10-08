<template>
  <div class="app-container">
    <el-form :inline="true" :model="listQuery" ref="listForm" size="mini" class="common-table-form"  @submit.native.prevent>
      <el-form-item label="关键字" prop="_filter_like_keyword">
        <el-input placeholder="请输入小区名称" v-model="listQuery._filter_like_keyword" @keyup.enter.native="onSearch"/>
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
        小区管理
        <em>{{applicationData.total}}</em>
      </div>
      <div class="right">
        <el-button class="txt-btn" type="text" size="mini" icon="el-icon-plus" @click="onItemEdit()" v-permission="'FUNC_APPLICATION_ADD'">添加</el-button>
        <!-- <el-button class="txt-btn" size="mini" type="text" icon="el-icon-delete" @click="onItemDelete" v-permission="'FUNC_HOUSE_DELETE'">删除</el-button> -->
      </div>
    </div>

    <el-table height="calc(100vh - 255px)" :data="applicationData.rows" highlight-current-row @selection-change="onListChange">
      <!-- <el-table-column type="selection" width="50" /> -->
      <el-table-column align="center" label="序号" width="50px" type="index" />
      <el-table-column align="center" label="小区名称" prop="name" />
      <el-table-column align="center" label="小区类型" prop="type">
        <template slot-scope="{row: { type }}">{{getType(type)}}</template>
      </el-table-column>
      <el-table-column align="center" label="小区地址" prop="fullName" />
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="onItemEdit(scope.row.id)" v-permission="'FUNC_APPLICATION_UPDATE'">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑弹窗 -->
    <el-dialog :visible.sync="isFormDialog" :title="this.form.id?'编辑小区信息':'添加小区'" width="700px">
      <el-form :model="form" ref="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="代码" prop="code" v-if="this.form.id">
              <el-input v-model="form.code" readonly/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="小区类型" prop="type">
              <dict-select dict-name="project_type" v-model="form.type"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="小区地图" prop="range">
              <el-button icon="el-icon-edit-outline" @click="isRegionDialog = true">编辑</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="小区地址" prop="fullName">
          <el-input placeholder="请选择小区地址" v-model="form.fullName" class="project-addr" readonly>
            <el-button icon="el-icon-edit-outline" slot="append" @click="addressDialogOpen">编辑</el-button>
          </el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="所属辖区" prop="policeAreaName">
              <el-input placeholder="请选择小区地址" v-model="form.policeAreaName" class="project-addr" readonly>
                <el-button icon="el-icon-edit-outline" slot="append" :disabled="this.form.id ? true : false " @click="addressPoliceDialogOpen">编辑</el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="小区范围" prop="numberList" v-if="form.id">
              <el-button icon="el-icon-edit-outline" @click="addressCheckboxDialogOpen">编辑</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="小区负责人" prop="contactName">
              <el-input v-model="form.contactName" placeholder="请输入小区负责人" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系方式" prop="contactTel">
              <el-input v-model="form.contactTel" maxlength="12" placeholder="请输入联系方式" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="物业公司" prop="organizeName">
              <el-input v-model="form.organizeName" placeholder="请输入物业公司" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属派出所" prop="pcsCode">
              <el-input v-model="form.pcsCode" placeholder="请输入派出所编码" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="描述" prop="description">
          <el-input type="textarea" :rows="2" v-model="form.description" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" size="mini" @click="onSubmit">确定</el-button>
        <el-button size="mini" @click="isFormDialog=false">取消</el-button>
      </div>
    </el-dialog>
    <el-pagination @size-change="onListLimit" @current-change="onListPaging" :current-page="listQuery.pageNo" :page-size="listQuery.pageSize" :page-sizes="[15,30,50]" layout="total, sizes, prev, pager, next, jumper" :total="applicationData.total" />
    <!-- 地图绘制 -->
    <map-region-draw :is-open.sync="isRegionDialog" :data="form.range" @complete="onDrawComplete" />
    <!-- 小区地址 -->
    <address-dialog ref="addressDialog" @finish="getAddress"></address-dialog>
    <!-- 辖区地址 -->
    <jurisdiction-menu-dialog ref="addressPoliceDialog" @finish="getPoliceAddress" ></jurisdiction-menu-dialog>
    <!-- 地址选择树 -->
    <address-checkbox-dialog ref="addressCheckboxDialog" :limitLevel="limitLevel" @finish="selectFinish" :disable="false" :checkedData="form.numberList"></address-checkbox-dialog>
  </div>
</template>

<script>
import {
  getCommunitieList,
  getCommunitie,
  addCommunities,
  updateCommunities,
  delCommunities,
  communitieslinkNumbers,
} from "@/api/projectManage";

import {
  getAddrStandard,
} from "@/api/standardAssets";

import { getDictionary } from "@/api/common";

export default {
  data() {
    return {
      form: {},
      rules: {
        name: { required: true, message: "名称不能为空" },
        type: { required: true, message: "小区类型不能为空" },
        code: { required: true, message: '请输入小区代码' },
        fullName: { required: true, message: "小区地址必须选择" },
        range: { required: true, message: "小区地图必须绘制" },
        numberList: { required: true, message: "请编辑小区范围" },
        policeAreaName: { required: true, message: "请选择所属辖区" }

      },
      listQuery: {
        pageNo: 1,
        pageSize: 15,
        _filter_like_keyword: null
      },
      applicationData: [],
      listIds: [],
      isFormDialog: false,
      isRegionDialog: false,
      listData: [],
      limitLevel: 2, //门牌号多选
    };
  },
  created() {
    this.init();
    this.getDictionary()
  },
  methods: {
    init() {
      getCommunitieList(this.listQuery).then(res => {
        this.applicationData = res.data;
      });
    },
    onListChange(val) {
      this.listIds = val.map(item => item.id);
    },
    async onItemEdit(id) {
      this.form = {}
      this.$set(this.form, 'range', [])
      this.form.id = id || null;
      this.isFormDialog = true;
      this.$nextTick(() => {
        this.$refs.form && this.$refs.form.clearValidate();
      });

      if (this.form.id) {
        await getCommunitie(this.form.id).then(res => {
          this.form = res.data;
        })
        // getMapRange({ id: this.form.id }).then(res => { //获取小区地图
        //   let range = res.data.map(item => {
        //     return [item.lng, item.lat]
        //   })
        //   this.$set(this.form, 'range', range)
        // })
      }
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (!valid) return;
        if (this.form.id) {
          updateCommunities(this.form.id, this.form).then(res => {
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
          addCommunities(this.form).then(res => {
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
    onDrawComplete(data) {
      this.form.range = data;
      this.$refs.form.clearValidate('range')
    },
    getDictionary() {
      getDictionary('project_type').then(res => {
        this.listData = res.data;
      });
    },
    //获取小区类型
    getType(value) {
      let data = this.listData.find(item => {
        return item.value == value
      })
      if (data) {
        return data.label
      }
    },
    addressDialogOpen() {
      this.$refs.addressDialog.open()
    },
    addressPoliceDialogOpen() {
      this.$refs.addressPoliceDialog.open()
    },
    addressCheckboxDialogOpen() {
      this.$refs.addressCheckboxDialog.open()
    },
    getAddress(data, labels) {
      this.form.locationId = data.id
      this.form.locationType = data.type
      this.$set(this.form, 'fullName', labels.join(''))
    },
    // 批量删除
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

      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        confirmButtonClass: "el-button--mini",
        cancelButtonClass: "el-button--mini fr",
        type: "warning"
      }).then(() => {
        delCommunities({
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
            this.init();
          }
        });
      });
    },
    //获取辖区
    getPoliceAddress(data, labelss) {
      this.form = Object.assign({}, this.form, {
        policeAreaId: data.id,
        policeAreaCode: data.areaCode,
        policeAreaName: data.areaName
      })
    },
    //地址选择树返回
    selectFinish(val) {
      let numberList = val
      let { id: communityId } = this.form
      communitieslinkNumbers({ communityId, numberList }).then(res => {
        this.$notify({ title: "提示", message: "操作成功", type: "success", duration: 2000 });
        this.form.numberList = val.map(item => {
          return { locationId: item }
        })
      })
    },
  },
  components: {
    addressDialog: () => import('@/components/AddressDialog'),
    JurisdictionMenuDialog: () => import("@/components/JurisdictionMenuDialog"),
    AddressCheckboxDialog: () => import('@/components/AddressCheckboxDialog'),
  }
};
</script>
<style lang="scss" scoped>
.app-container {
  height: 100%;
  .el-pagination {
    padding: 10px;
  }
  .el-select {
    width: 100%;
  }
  .el-date-editor {
    width: 100%;
  }
  .project-addr{
    /deep/ .el-input-group{
      width: 356px;
    }
  }
}
</style>
