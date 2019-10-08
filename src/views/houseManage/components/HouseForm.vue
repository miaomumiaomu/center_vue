<template>
  <div>
    <el-dialog class="house-form" :class="{ 'data-view': false }" :title="isView ? '查看房屋' : id?'编辑房屋':'添加房屋'" :visible.sync="isFormDialog" width="620px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" :disabled="isView ? true : false">
        <catalog-pane label="基础信息" name="basics">
          <el-row>
            <el-col :span="24" class="heading">基础信息</el-col>
            <el-col :span="12">
              <el-form-item label="房屋名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入房屋名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="使用形式" prop="usageType">
                <dict-select dict-name="house_use_type" v-model="form.usageType"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="房屋用途" prop="purposeType">
                <dict-select dict-name="house_use" v-model="form.purposeType"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="房屋类别" prop="houseType">
                <dict-select dict-name="house_type" v-model="form.houseType"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="房屋性质" prop="propertyType">
                <dict-select dict-name="house_property" v-model="form.propertyType"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="建筑面积" prop="area">
                <el-input v-model="form.area" placeholder="请输入面积" >
                  <template slot="append">平方米</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="所属单位" prop="companyName">
            <el-input v-model="form.companyName" placeholder="请输入单位名称" />
          </el-form-item>
          <el-form-item label="房屋地址" prop="fullName">
            <el-row>
              <el-col :span="8">
                <communities-select v-model="form.communityId" class="nowrap" clearable :disabled="id ? true : false"/>
              </el-col>
              <el-col :span="15" :offset="1">
                <address-search ref="addressSearch" :id="form.communityId" @finish="getAddress"></address-search>
                <el-input @focus="openAddress" v-model="form.fullName" :disabled="id ? true : false"></el-input>
              </el-col>
            </el-row>
          </el-form-item>
        </catalog-pane>
        <el-form-item label="房屋分类" prop="manageLevel">
          <el-radio-group v-model="form.manageLevel">
            <el-radio :label="Number(value)" v-for="(name, value) of houseManageLevel" :key="value">{{name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <catalog-pane label="业主信息" name="live">
          <div class="info-heading">
            <span>业主信息</span>
            <span style="float: right">
              <el-button class="txt-btn" size="mini" type="text" icon="el-icon-plus" @click="onItemEditadd()">选择人员库成员</el-button>
              <el-button class="txt-btn" size="mini" type="text" icon="el-icon-plus" @click="onItemEdit()">手动添加</el-button>
            </span>
          </div>
          <div class="live-box" v-if="form.ownerName">
            <el-form>
              <el-form-item>
                <el-col :span="6">
                  <img :src="imgShow" class="pic" v-if="imgShow" />
                  <img src="~@/assets/noimage.jpg" class="pic" v-else />
                </el-col>
                <el-col :span="14" :offset="1">
                  <ul class="content">
                    <li>业主姓名 <span>{{form.ownerName}}</span></li>
                    <li>联系方式 <span>{{form.ownerTel || '暂无'}}</span></li>
                    <li>证件号码 <span>{{form.ownerIdentityNo || '暂无'}}</span></li>
                  </ul>
                </el-col>
              </el-form-item>
            </el-form>
            <!-- <i class="el-icon-remove btn-del" @click="onDelHousesForm(index)"></i> -->
          </div>
        </catalog-pane>
      </el-form>
      <div slot="footer" v-if="!isView">
        <el-button size="mini" type="primary" @click="onSubmit()">确定</el-button>
        <el-button size="mini" @click="isFormDialog = false">取消</el-button>
      </div>

      <label-form ref="labelForm" :id.sync="personId" :is-open.sync="isFormDialogEdit" v-on:choseMan="addFinish"/>
    </el-dialog>
    <!-- 表单详情 -->
    <person-select :is-open.sync="isFormDialogadd" v-on:choseMan="choseMan" ref="SelectForm" title="选择业主"/>

    
  </div>
</template>

<script>
import { getHouse, putHouse, postHouse } from "@/api/houseManage";
import { addrCompanyList } from "@/api/unitManage";
import { getperson } from "@/api/carManage";

export default {
  props: {
    id: [String, Number],
    data: Object,
    isOpen: {
      default: false,
      type: Boolean
    },
    nodeData: Object,
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
        fullName: null,
        area: null,
        usageType: null,
        purposeType: null,
        houseType: null,
        propertyType: null,
      },
      limitType: 2,
      units: [],
      isFormDialogadd: false,
      isFormDialogEdit: false,
      imgShow: null,
      numbers: [],
      houseManageLevel: JSON.parse(localStorage.getItem('house_manage_level')),
      rules: {
        name: { required: true, message: "名称不能为空" },
        fullName: { required: true, message: "房屋地址不能为空", trigger: 'blur' },
        manageLevel: { required: true, message: "房屋分类必选", trigger: 'blur' },
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
          this.form = { manageLevel: 1 } //防止outId存在导致无法新增
          // this.nodeData.labels && this.getAddress(this.nodeData, this.nodeData.labels)
        }
      }
      this.$emit("update:isOpen", val);
    },
  },
  methods: {
    // 获取表单详情
    getFormDetail() {
      getHouse(this.id).then(res => {
        if (res.status == 200) {
          this.form = res.data;
          this.getpersonInfo(res.data.ownerId)
        }
      });
    },
    // 设置经纬度
    onOpenLocation() {
      this.$refs.mapLocation.open({
        lng: this.form.lng,
        lat: this.form.lat
      });
    },
    // 返回经纬度设置
    onSetLocation(data) {
      this.form = Object.assign({}, this.form, {
        lng: data.lng,
        lat: data.lat
      });
    },
    // 表单提交
    onSubmit() {
      if (!this.form.belongId || this.form.belongType !== this.limitType) {
        this.$notify({ title: "警告", message: '地址请选择到门牌号', type: "warning", duration: 1000 })
        return
      }
      this.$refs.form.validate((valid, errArr) => {
        if (!valid) return;

        // 处理提交数据
        let _form = Object.assign({}, this.form);

        // 判断提交类型
        if (this.id) {
          // 修改
          putHouse(_form).then(res => {
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
          postHouse(_form).then(res => {
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
    // getAddress(data, labels) {
    //   this.form = Object.assign({}, this.form, {
    //     policeAreaCode: data.areaCode || data.code,
    //     policeAreaId: data.areaId || data.id,
    //     locationCode: data.areaCode ? data.code : null,
    //     belongId: data.areaId ? data.locationId : null,
    //     belongType: data.type,
    //     fullName: labels,
    //   })
    // },
    addrCompanyList() {
      addrCompanyList({ pageNo: 1, pageSize: 100000 }).then(res => {
        this.units = res.data.rows
      })
    },
    onItemEditadd() {
      this.$nextTick(() => {
        this.isFormDialogadd = true;
      });
    },
    // 手动添加
    onItemEdit(id, isReadonly) {
      this.personId = id || null
      this.$nextTick(() => {
        this.isFormDialogEdit = true;
      });
    },
    choseMan(val) {
      this.getpersonInfo(val.id);
    },
    //人员添加回调函数
    addFinish(val) {
      const { id, name: ownerName, mobile: ownerTel, identityNo: ownerIdentityNo } = val
      this.imgShow = val.personInfoImages[0].filePath;
      this.form = Object.assign({}, this.form, { ownerName, ownerTel, ownerIdentityNo })
    },
    //获取人员 信息
    getpersonInfo(val) {
      if(val) {
        getperson(val).then(result => {
          if (result.status == 200) {
            this.imgShow = result.data.identityImgPath
            let { name: ownerName, mobile: ownerTel, identityNo: ownerIdentityNo } = result.data
            this.form = Object.assign({}, this.form, { ownerName, ownerTel, ownerIdentityNo })
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
        belongId: data.id,
        belongType: data.type,
        fullName: labels,
      })
      this.$refs.form.clearValidate('fullName')
    },
  },
  mounted() {
    this.addrCompanyList()
  },
  components: {
    AddressSearch: () => import("@/components/AddressSearch"),
    LabelForm: () => import("@/components/FaceLabelForm"),
  }
};
</script>
<style lang="scss" scoped>
.house-form{
  /deep/ .el-select{
    width: 100%;
  }
  .heading, .info-heading {
    position: relative;
    z-index: 10;
    top: -5px;
    line-height: 30px;
    font-size: 13px;
    font-weight: bold;
    color: #3f4041;
    margin: 0 12px;
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
    width: 45%;
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