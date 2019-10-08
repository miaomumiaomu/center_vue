<template>
  <div>
    <el-dialog class="unit-form" :class="{ 'data-view': false }" :title="isView ? '查看单位' : id?'编辑单位':'添加单位'" :visible.sync="isFormDialog" width="700px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" :disabled="isView ? true : false">
        <catalog-pane label="基础信息" name="basics">
          <el-row  class="first-box">
            <el-col :span="24" class="heading">基础信息</el-col>
            <el-col :span="12">
              <el-form-item label="单位名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入实有单位名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="实际名称" prop="realName">
                <el-input v-model="form.realName" placeholder="请输入实际名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="行业类型" prop="industryType">
                <dict-select dict-name="industry_Type" v-model="form.industryType"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="单位类型" prop="compType">
                <dict-select dict-name="comp_type" v-model="form.compType"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="管理级别" prop="supervisoryLevel">
                <dict-select dict-name="supervisory_level" v-model="form.supervisoryLevel"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="营业执照" prop="certificateNo">
                <el-input v-model="form.certificateNo" placeholder="请输入营业执照号"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="开业时间" prop="startBusinessTime">
                <el-date-picker v-model="form.startBusinessTime" format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="date" placeholder="开业日期" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="停业时间" prop="stopBusinessTime">
                <el-date-picker v-model="form.stopBusinessTime" format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="date" placeholder="停业日期" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="主营范围" prop="businessScopeMain">
            <el-input v-model="form.businessScopeMain" placeholder="请输入主营范围"/>
          </el-form-item>
          <el-form-item label="副营范围" prop="businessScopeSide">
            <el-input v-model="form.businessScopeSide" placeholder="请输入副营范围"/>
          </el-form-item>
          <el-form-item label="联系电话" prop="contactTel">
            <el-input v-model="form.contactTel" placeholder="请输入联系电话"/>
          </el-form-item>
          <el-form-item label="单位地址" prop="fullName">
            <el-row>
              <el-col :span="8">
                <communities-select v-model="form.communityId" class="nowrap" clearable @change="communityChange"/>
              </el-col>
              <el-col :span="15" :offset="1">
                <address-search ref="addressSearch" :id="form.communityId" @finish="getAddress"></address-search>
                <el-input @focus="openAddress" v-model="form.fullName" ></el-input>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="单位图片">
            <el-upload class="pic-list" ref="uploadList" :on-exceed="onUploadExceed" :file-list="picList" :limit="1" :on-change="onUploadChange" :on-remove="remove" action accept=".jpeg, .jpg, .png, .bmp" list-type="picture-card" :auto-upload="false">
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
        </catalog-pane>
        <catalog-pane label="法人信息" name="live">
          <div class="info-heading">
            <span>法人信息</span>
            <span style="float: right">
              <el-button class="txt-btn" size="mini" type="text" icon="el-icon-plus" @click="onItemEdit()">选择人员库成员</el-button>
              <el-button class="txt-btn" size="mini" type="text" icon="el-icon-plus" @click="onItemEditadd()">手动添加</el-button>
            </span>
          </div>
          <div class="live-box" v-if="form.legalPersonName">
            <el-form>
              <el-form-item>
                <el-col :span="6">
                  <img :src="imgShow" class="pic" v-if="imgShow" />
                  <img src="~@/assets/noimage.jpg" class="pic" v-else />
                </el-col>
                <el-col :span="14" :offset="1">
                  <ul class="content">
                    <li>法人姓名：{{form.legalPersonName}}</li>
                    <!-- <li>人员类别：{{form.sex | commonFilter('comm_sex')}}</li> -->
                    <li>联系方式：{{form.legalPersonTel || '暂无'}}</li>
                    <!-- <li>证件类型：{{form.phone ? form.phone : '未知'}}</li> -->
                    <li>证件号码：{{form.legalPersonIdNo || '暂无'}}</li>
                  </ul>
                </el-col>
              </el-form-item>
            </el-form>
          </div>
        </catalog-pane>
      </el-form>
      <div slot="footer" v-if="!isView">
        <el-button size="mini" type="primary" @click="onSubmit()">确定</el-button>
        <el-button size="mini" @click="isFormDialog = false">取消</el-button>
      </div>

      <label-form ref="labelForm" :is-open.sync="isFormDialogAdd" :id.sync="personId" v-on:choseMan="addFinish"/>
    </el-dialog>

    <!-- 表单详情 -->
    <person-select :is-open.sync="isFormDialogSelect" v-on:choseMan="choseMan" ref="SelectForm" title="选择法人"/>

  </div>
</template>

<script>
import {
  getAddrCompany,
  addAddrCompany,
  updateAddrCompany
} from "@/api/unitManage";

import { postPicturesUpload } from "@/api/common";
import { getperson } from "@/api/carManage";
import { getCommunityNumbers } from "@/api/unitManage";

export default {
  props: {
    id: [String, Number],
    data: Object,
    isOpen: {
      default: false,
      type: Boolean
    },
    nodeData: Object, // 标准地址树的数据
    isView: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isFormDialog: false,
      personId: null,
      form: {
        name: null,
        code: null,
        compType: null,
        industryType: null,
        fullName: null,
        location: null,
        legalPersonName: null,
        legalPersonTel: null,
        legalPersonIdNo: null,
        certificateNo: null,
        startBusinessTime: null,
        stopBusinessTime: null,
        businessScopeMain: null,
        businessScopeSide: null,
        describes: null,
        supervisoryLevel: null,
        realName: null,
        contactTel: null,
      },
      limitType: 2,
      picList: [],
      isFormDialogAdd: false,
      isFormDialogSelect: false,
      imgShow: null,
      numbers: [],
      rules: {
        name: { required: true, message: "名称不能为空" },
        address: { required: true, message: "地址不能为空" },
        compType: { required: true, message: '单位类型不能为空' },
        industryType: { required: true, message: '行业类型不能为空' },
        code: { required: true, message: '单位代码不能为空' },
        fullName: { required: true, message: '单位地址不能为空' },
        location: { required: true, message: '经纬度不能为空' },
        legalPersonIdNo: [{ min: 18, message: '证件号少于18位', trigger: 'blur'},
        {  max: 18, message: '证件号已经超过18位，请检查证件号', trigger: 'blur'}],
        certificateNo: { max: 20, message: '营业执照最长20位' },
        supervisoryLevel: { required: true, message: '管理级别不能为空' },
        contactTel: { required: true, message: '联系电话不能为空' },
        fullName: { required: true, message: '单位地址不能为空', trigger: 'blur' }
      }
    };
  },
  watch: {
    isOpen(val) {
      this.isFormDialog = val;
    },
    isFormDialog(val) {
      if (val) {
        this.tabsValue = "first";
        this.$refs.form && this.$refs.form.resetFields();

        if (this.id) {
          this.getFormDetail()
        } else {
          this.form = {}
          this.picList = []
        }
      }

      this.$emit("update:isOpen", val);
    }
  },
  methods: {
    // 获取表单详情
    getFormDetail() {
      getAddrCompany(this.id).then(res => {
        if (res.status == 200) {
          this.form = res.data;
          this.getpersonInfo(res.data.legalPersonId)
          this.$set(this.form, 'location', `${res.data.lng},${res.data.lat}`)
          if (res.data.imgUrl) {
            this.picList = [{ url: res.data.imgUrl }]
          } else {
            this.picList = []
          }
        }
      });
    },
    // 表单提交
    onSubmit() {
      if (!this.form.locationId) {
        this.$notify({ title: "警告", message: '请选择单位地址', type: "warning", duration: 1000 })
        return
      }
      this.$refs.form.validate(async (valid, errArr) => {
        if (!valid) return;

        // 处理提交数据
        let _form = Object.assign({}, this.form);
        
        _form.imgUrl = await this.pictureBatchUpload(
          this.$refs.uploadList.uploadFiles.filter(item => item.raw)
        )
        if (this.id) {
          // 修改
          updateAddrCompany(_form).then(res => {
            let isSuccess = res.status === 200;
            // 提示处理
            this.$notify({
              title: isSuccess ? "成功" : "失败",
              message: isSuccess ? "保存成功" : res.message,
              type: isSuccess ? "success" : "error",
              duration: 2000
            });

            if (isSuccess) {
              this.$emit("complete");
              this.isFormDialog = false;
            }
          });
        } else {
          // 新增
          addAddrCompany(_form).then(res => {
            let isSuccess = res.status === 200;
            // 提示处理
            this.$notify({
              title: isSuccess ? "成功" : "失败",
              message: isSuccess ? "新增成功" : res.message,
              type: isSuccess ? "success" : "error",
              duration: 2000
            });
            if (isSuccess) {
              this.$emit("complete");
              this.isFormDialog = false;
            }
          });
        }
      });
    },
    async pictureBatchUpload(files) {
      if (!files.length) {
        return this.form.imgUrl
      }
      let arr = []
      let formData = new FormData()
      files.map(file => {
        formData.append("files", file.raw);
      });
      formData.append('id', this.id ? this.id : '')
      formData.append('type', 1)
      await postPicturesUpload(formData).then(res => {
        arr = res.data
      })
      if(!arr.length) {
        return this.form.imgUrl
      }
      return arr[0].filePath
    },
    // 上传超出限制
    onUploadExceed() {
      // 提示处理
      this.$notify({
        title: "提示",
        message: "暂时只支持传一张",
        type: "warning",
        duration: 2000
      });
    },
    onUploadChange(file, files)  {
      //上传限制200kb
      if (file.size / 1024 > 200) {
        setTimeout(() => {
          this.$notify({
            title: "提示",
            message: `图片【${file.name}】超过200KB，请压缩后上传`,
            type: "warning",
            duration: 2000
          });
        }, 10);
        files.splice(files.length - 1, 1);
      }
    },
    //图片移除
    remove(file, files) {
      this.form.imgUrl = ''
    },
    onItemEditadd() {
      this.personId = null
      this.$nextTick(() => {
        this.isFormDialogAdd = true;
      });
    },
    //手动添加方法
    onItemEdit(id, isReadonly) {
      this.$nextTick(() => {
        this.isFormDialogSelect = true;
      });
    },
    choseMan(val) {
      this.getpersonInfo(val.id);
    },
    //人员添加回调函数
    addFinish(val) {
      const { id, name: legalPersonName, mobile: legalPersonTel, identityNo: legalPersonIdNo } = val
      this.imgShow = val.personInfoImages[0].filePath;
      this.form = Object.assign({}, this.form, { ownerName, ownerTel, ownerIdentityNo })
    },
    //获取人员 信息
    getpersonInfo(val) {
      if(val) {
        getperson(val).then(result => {
          if (result.status == 200) {
            this.imgShow = result.data.identityImgPath
            let { name: legalPersonName, mobile: legalPersonTel, identityNo: legalPersonIdNo } = result.data
            this.form = Object.assign({}, this.form, { legalPersonName, legalPersonTel, legalPersonIdNo })
          }
        })
      } else{
        this.imgShow = ''
      }
    },
    openAddress() {
      this.$refs.addressSearch.open()
    },
    getAddress(data, labels) {
      this.form = Object.assign({}, this.form, {
        locationCode: data.code,
        locationId: data.id,
        locationType: data.type,
        fullName: labels,
      })
      this.$refs.form.clearValidate('fullName')
    },
    communityChange(val) {
      this.form.fullName = ''
      this.form.locationCode = null
      this.form.locationId = null
      this.form.locationType = null
    }
  },
  components: {
    AddressSearch: () => import("@/components/AddressSearch"),
    LabelForm: () => import("@/components/FaceLabelForm"),
  }
};
</script>
<style lang="scss" scoped>
.unit-form{
  /deep/ .el-select{
    width: 100%;
  }
  /deep/ .el-date-editor.el-input {
    width: 100%;
  }
  .pic-list {
    background: #f3f4f5;
    min-height: 58px;
    overflow: hidden;
    padding: 10px 10px 0;
    border-radius: 8px;
    border: 1px #e1e4e6 solid;
    /deep/ {
      &.ban {
        .el-upload {
          display: none;
        }
      }
      .el-upload-list__item,
      .el-upload--picture-card {
        width: 48px;
        height: 48px;
        line-height: 46px;
        margin-bottom: 10px;
      }
      .el-upload-list__item {
        float: left;
      }
      .el-icon-plus {
        line-height: 46px;
      }
      .el-icon-close-tip {
        display: none;
      }
      .el-upload-list__item.is-success .el-upload-list__item-status-label{
        display: none;
      }
    }
  }
  .heading, .info-heading {
    position: relative;
    z-index: 10;
    top: -5px;
    line-height: 30px;
    font-size: 13px;
    font-weight: bold;
    color: #3f4041;
    &:before {
      position: absolute;
      left: 80px;
      right: 0;
      top: 14px;
      background: #eff1f4;
      height: 1px;
      content: "";
    }
  }
  .info-heading:before{
    width: 50%;
  }
  .live-box {
    position: relative;
    background: #f3f4f5;
    overflow: hidden;
    .houseChose{
      display: flex;
      margin-left: 37px;
    }
    .content{
      list-style: none;
      margin-top: 20px;
      li{
        height: 33px;
        line-height: 33px;
        span{
          margin-left: 10px;
        }
      }
    }
    .el-form-item {
      margin-bottom: 5px;
    }
    .pic{
      margin-top: 20px;
      margin-left: 35px;
      width: 106px;
      height: 119px;
    }
    .btn-add {
      position: absolute;
      top: 50%;
      right: 40px;
      margin-top: -15px;
      font-size: 30px;
      cursor: pointer;
    }
    .btn-del {
      position: absolute;
      top: 50%;
      right: 40px;
      margin-top: -15px;
      font-size: 30px;
      cursor: pointer;
    }
  }
}
.data-view{
  .heading, .info-heading{
    color: #6B85A6;
    &::before{
      background-color: rgba(14,94,169, 0.7);
    }
  }
  .pic-list{
    background-color: #0E111B;
    border-color: rgba(14,94,169, 0.7);
  }
  .live-box{
    background-color: #0E111B;
    border: 1px solid rgba(14,94,169, 0.7);
    color: #E2E9EE !important;
  }
  /deep/{
    .el-dialog{
      border: 1px solid rgba(14,94,169, 0.7);
    }
    .el-dialog__title{
      color: #6B85A6;
    }
    .el-dialog__header, .el-dialog__body, .el-dialog__footer{
      background-color: #0E111B;
    }
    .el-form-item__label{
      color: #6B85A6;
    }
    .el-input__inner{
      background-color: #0E111B;
      border-color: rgba(14,94,169, 0.7) !important;
      color: #E2E9EE;
    }
    .el-select__caret{
      visibility: hidden;
    }
    .el-input-group__append{
      background-color: #0E111B;
      border-color: #0E111B;
      color: #6B85A6;
    }
    .el-radio__label{
      color: #E2E9EE;
    }
    .el-radio__input.is-checked + .el-radio__label{
      color: #6B85A6;
    }
    .el-upload-list__item,.el-upload--picture-card{
      background-color: #0E111B;
      border-color: rgba(14,94,169, 0.7);
    }
  }
}
</style>