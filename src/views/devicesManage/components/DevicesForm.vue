<template>
  <div>
    <el-dialog class="devices-form body0" :title="id?'编辑设备':'添加设备'" :visible.sync="isFormDialog" width="620px">
      <div :style="waterBg">
        <el-form ref="form" :model="form" :rules="rules" label-width="100px" :disabled="isDisabled">
          <el-row  class="first-box">
            <el-col :span="24" class="heading">基本信息</el-col>
            <el-col :span="12">
              <el-form-item prop="id" class="m0" />
              <el-form-item prop="father" class="m0" />
              <el-form-item prop="son" class="m0" />
              <el-form-item prop="communityId" class="m0" />
              <el-form-item prop="communityCode" class="m0" />
              <el-form-item label="设备类型" prop="deviceType">
                <dict-select dict-name="device_type" v-model="form.deviceType" :disabled="id ? true : false"/>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="设备子类型" prop="deviceBoxType" 
              :rules="[
                { required: form.deviceType === 1 || form.deviceType === 2 ? true : false, message: '请选择设备子类型', type: 'number' },
              ]">
                <dict-select :dict-name=" form.deviceType === 1 ? 'deviceBox_type' : 'deviceCamera_type'" v-model="form.deviceBoxType" :disabled="id ? true : form.deviceType === 1 || form.deviceType === 2 ? false : true" />
              </el-form-item>
            </el-col>
            
            <el-col :span="12">
              <el-form-item label="设备名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入名称" />
              </el-form-item>
            </el-col>

            <el-col :span="12" >
              <el-form-item label="序列号" prop="venderSn">
                <el-input v-model="form.venderSn" placeholder="请输入序列号" :readonly="id && form.deviceType === 1 ? true : false">
                  <el-button @click="deviceInfo" slot="append" icon="el-icon-search" v-if="form.deviceType === 1 && form.deviceBoxType == 1 ? true : false"></el-button>
                </el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="经纬度" prop="lng">
                <el-input :value="form.lng&&form.lat?form.lng+','+form.lat:''" placeholder="请选择经纬度" @focus="onOpenLocation" readonly />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="标准地址" prop="fullName">
                <el-input v-model="form.fullName" placeholder="请选择标准地址" @focus="addressDialogOpen" :title="form.fullName" readonly />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="设备品牌" prop="deviceManu">
                <dict-select dict-name="device_brand" v-model="form.deviceManu" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="设备型号" prop="deviceModel">
                <el-input v-model="form.deviceModel" placeholder="请填写设备型号"/>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="所属小区" prop="communityId">
                <communities-select v-model="form.communityId" class="nowrap"
                 :policeAreaCode="areaData.areaCode || areaData.code" clearable @change="communitiesChange" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="所属应用" prop="applicationId">
                <el-select v-model="form.applicationId">
                  <el-option v-for="item in applications" :key="item.id" :label="item.appName" :value="item.id" />
                </el-select>
              </el-form-item>
            </el-col>
            
            <el-col :span="12">
              <el-form-item label="状态" prop="status">
                <el-switch
                  v-model="form.status"
                  active-color="#13ce66"
                  active-text="开"
                  inactive-text="关"
                  :active-value="1"
                  :inactive-value="0"
                  >
                </el-switch>
              </el-form-item>
            </el-col>

            <el-col :span="24" class="heading">设备信息</el-col>

          </el-row>
        </el-form>
        
        <!-- 实联 -->
        <boxUnit v-if="form.deviceType === 1 && form.deviceBoxType === 1" ref="boxUnit" @complete="dataSettle" :modeType="form.deviceType" :forms="forms" :id="id" :isDisabled="isDisabled"/>

        <!-- 抠图 -->
        <boxMatte v-if="form.deviceType === 1 && form.deviceBoxType === 0" ref="boxMatte" @complete="dataSettle" :modeType="form.deviceType" :forms="forms" :isDisabled="isDisabled"/>

        <!-- 摄像头 -->
        <caremas :community="community"  v-if="form.deviceType === 2" ref="caremas" @complete="dataSettle" :modeType="form.deviceType" :forms="forms" :id="id" :isDisabled="isDisabled"/>

        <!-- 门禁 -->
        <door :community="community" v-if="form.deviceType === 3 || form.deviceType === 4" ref="door" @complete="dataSettle" :modeType="form.deviceType" :forms="forms" :isDisabled="isDisabled"/>
      </div>
      <div slot="footer">
        <el-button size="mini" type="primary" v-if="!isDisabled" @click="onSubmit()">确定</el-button>
        <el-button size="mini" @click="isFormDialog = false">{{ !isDisabled ? '取消' : '关闭'}}</el-button>
      </div>
    </el-dialog>

    <!-- 经纬度选择器 -->
    <map-location ref="mapLocation" :zoom="12" @local="onSetLocation" />

    <!-- 辖区混合树 -->
    <!-- 限制到路或以下 -->
    <jurisdiction-addr-menu-dialog ref="addressDialog"  @finish="getAddress" :policeAreaId="form.policeAreaId" 
    :policeAreaCode="form.policeAreaCode" :limit="{ dataType: 1 }" warnText="请选择到路或其以下"></jurisdiction-addr-menu-dialog>
  </div>
</template>

<script>

import { getDevices, putDevices, postDevices, getApplications } from "@/api/devicesManage";
import { getDeviceInfo} from "@/api/video";
import { mapState } from "vuex";

export default {
  components: {
    boxMatte: () => import("./devicesForms/boxMatte"),
    boxUnit: () => import("./devicesForms/boxUnit"),
    caremas: () => import("./devicesForms/caremas.vue"),
    door: () => import("./devicesForms/door"),
    JurisdictionAddrMenuDialog: () => import("@/components/JurisdictionAddrMenuDialog"),
  },
  props: {
    id: [String, Number],
    community: Object,
    isOpen: {
      default: false,
      type: Boolean
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    areaData: Object,
    isDisabled: Boolean,
  },
  data() {
    return {
      isFormDialog: false,
      form: {
        deviceType: null, //1：盒子，2:摄像头
        deviceBoxType:null, //盒子类型
        name: null, //设备名称
        deviceSerial: null, //序列号 只有实联盒子才需要多传这个参数
        venderSn: null, //序列号
        communityId: null, //社区Id
        communityCode: null,//社区编号
        id: null,
        father: false,
        son: false,
        lat: null,
        lng: null,
        status: 1,
        applicationId: null,
      },
      limitType: 1,
      form_: {}, //整理数据
      forms: { chan_list: [] }, //过滤后的编辑数据对象  传给子组件
      applications: [],
      rules: {
        deviceType: { required: true, message: "请选择设备类型" },
        name: { required: true, message: "请输入设备名称" },
        venderSn:{required: true, message: "请输入序列号"},
        lng:{required: true, message: "请选择经纬度"},
        fullName:{required: true, message: "请选择地址"},
        deviceManu: {required: true, message: "请填写设备品牌"},
        deviceModel: { required: true, message: "请填写品牌类型" },
        communityId: { required: true, message: '请选择所属小区' },
        applicationId: { required: true, message: '请选择应用' }
      },
    };
  },
  watch: {
    isOpen(val) {
      this.isFormDialog = val;
    },
    isFormDialog(val) {
      this.$refs.form && this.$refs.form.resetFields();
      this.$emit("update:isOpen", val);
      this.form = Object.assign({}, {
        policeAreaCode: this.areaData.areaCode,
        policeAreaId: this.areaData.id,
        status: 1
      })
      if(val && this.id) {
        this.init()
      }else {
        this.forms = null
      }
    },
    'form.communityId'(val, oldval) {
      if (!val || val == oldval) return
      this.getApplications(val)
    }
  },
  computed: {
    ...mapState({
      waterBg: state => state.user.waterBg, // 水印
    })
  },
  methods: {
    deviceInfo() {
      if (this.form.deviceType === 1 && this.form.deviceBoxType == 1) {
        this.form.deviceSerial = this.form.venderSn
        getDeviceInfo(this.form.venderSn).then(res => {
          let result = res.data;
          let _form = {
            dpid: result.dpid,
            type_id: result.type_id,
            state: result.state,
            account: result.account,
            chan_num: result.chan_num,
            chan_list: result.chan_list
          }
          this.forms = _form;
          this.$nextTick(() => {
            this.$refs.boxUnit && this.$refs.boxUnit.upView()
          })
          
        })
      }
    },

    init() {
      let _form_ = this.form
      getDevices(this.id).then(res => {
        let result = res.data
        _form_.id = this.id
        _form_.deviceType = result.deviceType
        delete result.deviceType
        _form_.name = result.name
        delete result.name
        _form_.venderSn = result.venderSn
        if(result.deviceBoxType || result.deviceBoxType == 0 ) {
          _form_.deviceBoxType = result.deviceBoxType
          delete result.deviceBoxType
        }else if(result.cameraType || result.cameraType == 0) {
            _form_.deviceBoxType = result.cameraType
            delete result.cameraType
        }
        let { venderSn, lng, lat, policeAreaId, policeAreaCode, locationCode, locationId, locationType, fullName, deviceManu, deviceModel, communityId, applicationId, status } = result
        this.form = Object.assign({}, _form_, { venderSn, lng, lat, policeAreaId, policeAreaCode, locationCode, locationId, locationType, fullName, deviceManu, deviceModel, communityId, applicationId, status })
        this.forms = result
        this.deviceInfo()
      })
    },
    // 数据整理 通用
    dataSettle(val, isT = false) {
      this.form.son = isT;
      this.form_ = val;
    },

    onSubmit() {
      switch (this.form.deviceType) {
        case 1:
          switch (this.form.deviceBoxType) {
            case 0:
              this.$refs.boxMatte && this.$refs.boxMatte.onUpData()
              break;
            case 1: 
              this.$refs.boxUnit && this.$refs.boxUnit.onUpData()
            default:
              break;
          }
          break;
        case 2: 
          this.$refs.caremas && this.$refs.caremas.onUpData()
          break;
        case 3:
          this.$refs.door && this.$refs.door.onUpData()
        case 4:
          this.$refs.door && this.$refs.door.onUpData()
        default:
          break;
      }
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return
        }else {
          this.form.father = true
        }
      })
      //整理数据并提交
      if(this.form.son && this.form.father) {
        delete this.form.son;
        delete this.form.father;
        this.form.communityCode = this.community.code;
        this.id ? this.form.id = this.id : delete this.form.id;
        this.form.deviceType === 2 ? this.$set(this.form, 'cameraType', this.form.deviceBoxType) : '';

        let { venderSn, lng, lat, policeAreaId, policeAreaCode, locationCode, locationId, locationType, deviceManu, deviceModel, communityId, applicationId, status } = this.form
        let _form = Object.assign({}, this.form, this.form_, { venderSn, lng, lat, policeAreaId, policeAreaCode, locationCode, locationId, locationType, deviceManu, deviceModel, communityId, applicationId, status });

        // return
        if (this.id) {
          // 修改
          putDevices(_form).then(res => {
            let isSuccess = res.status === 200;
            // 提示处理
            this.$notify({
              title: isSuccess ? "成功" : "失败",
              message: isSuccess ? "修改成功" : res.message,
              type: isSuccess ? "success" : "error",
              duration: 2000
            });
            if (isSuccess) {
              this.$emit('complete')
              this.isFormDialog = false;
            }
          });
        }else {
          postDevices(_form).then( res => {
            let isSuccess = res.status === 200;
            // 提示处理
            this.$notify({
              title: isSuccess ? "成功" : "失败",
              message: isSuccess ? "新增成功"
                : res.message,
              type: isSuccess ? "success" : "error",
              duration: 2000
            });
            if (isSuccess) {
              this.$emit('complete')
              this.isFormDialog = false;
            }
          })
        }
      }
    },
    getApplications(communityId) {
      getApplications({ communityId }).then(res => {
        this.applications = res.data
        //当应用不存在的时候自动置空
        if (!this.applications.find(item => item.id == this.form.applicationId)) {
          this.form.applicationId = null
        }
      })
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

    addressDialogOpen() {
      this.$refs.addressDialog.open()
    },
    //返回标准地址
    getAddress(data, labels) {
      this.form = Object.assign({}, this.form, {
        policeAreaCode: data.areaCode || data.code,
        policeAreaId: data.areaId || data.id,
        locationCode: data.areaCode ? data.code : null,
        locationId: data.areaId ? data.id : null,
        locationType: data.fromType,
        fullName: labels,
      })
    },
    communitiesChange() {
      this.$set(this.form, 'applicationId', null)
      this.$nextTick(() => {
        this.$refs.form.clearValidate('applicationId')
      })
    }
  },
};
</script>

<style lang="scss" scoped>
.devices-form {
  /deep/ { 
    .el-input,
    .el-select {
      width: 100%;
    }
  }
  .first-box {
    padding: 0 20px;
    .heading {
      position: relative;
      line-height: 50px;
      font-size: 13px;
      font-weight: bold;
      color: #3f4041;
      &:before {
        position: absolute;
        left: 80px;
        right: 0;
        top: 24px;
        background: #eff1f4;
        height: 1px;
        content: "";
      }
    }
  }
}
</style>