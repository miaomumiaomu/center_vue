<template>
  <div>
    <el-form ref="form_unit" :model="form_unit" :rules="rules" label-width="100px" :disabled="isDisabled">
      <el-row class="first-box">

        <el-col :span="12">
          <el-form-item label="平台Id" prop="dpid">
            <el-input v-model="form_unit.dpid" :disabled="true" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="类型id" prop="type_id">
            <el-input v-model="form_unit.type_id" :disabled="true" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="状态" prop="state">
            <el-radio v-model="form_unit.state" :label="1" :disabled="true">在线</el-radio>
            <el-radio v-model="form_unit.state" :label="0" :disabled="true">离线</el-radio>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="账号" prop="account">
            <el-input v-model="form_unit.account" :disabled="true" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="通道数" prop="chan_num" >
            <el-input v-model="form_unit.chan_num" :disabled="true" />
            <div class="synchronize">
              <span>{{stringReplace(form_unit.callBackUrl)}}</span>
              <el-button v-if="form_unit.callBackUrl" @click="synchronize">地址同步</el-button>
            </div>
          </el-form-item>
        </el-col>

        <el-col>
          <!-- <el-form-item label="通道" prop="deviceCameras" >
            <el-button @click="add">添加摄像头</el-button>
          </el-form-item> -->
          <el-form-item>
            <el-col :span="12" v-for="(item,index) in forms ? forms.chan_list ? forms.chan_list : forms.deviceCameras: []" :key="index">
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <span>{{item.chan_name || item.chanName}}</span>
                  <!-- <el-button style="float: right;" type="text" @click="remove(index)"><i class="el-icon-close"></i></el-button> -->
                </div>
                <div>平台Id: {{item.dpid || item.chanDpid}}</div>
                <div class="box_info">
                  <div>序号：{{item.index || item.chanIndex}}</div>
                  <div>状态：{{item.state === 1 || item.chanState === 1 ? '在线' : '离线'}}</div>
                  <camera-select :cameraType="1" :getcameraType="1" :chan="item" @complete="upCarema" :maxRoutes="1" />
                </div>
              </el-card>
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- <SLcarema-select :is-open.sync="isFormDialog" :forms="forms" @complete="upCarema"/> -->
  </div>
</template>

<script>
import { bindShiLianBoxSerial } from "@/api/devicesManage";

export default {
  components: {
    CameraSelect:()=>import("../CameraSelect")
  },
  props: {
    id:[Number,String],
    modeType: [Number,String],
    forms: Object,
    isDisabled: Boolean,
  },
  data() {
    return {
      isFormDialog: false,
      form_unit: {
        dpid: null, //平台Id
        type_id: null, //类型Id
        state: "1", //状态
        account: null, //账号
        chan_num: null, //通道数
        deviceCameras: [],
        chan_list: []
      },
      rules: {
        dpid: { required: true, message: "请输入平台Id" },
        type_id: { required: true, message: "请输入类型Id" },
        account: { required: true, message: "请输入账号" },
        chan_num: { required: true, message: "请输入通道数" },
        // deviceCameras: { required: true, message: "请添加通道" }
      }
    };
  },
  updated() {
    console.log(this.form_unit)
  },
  watch: {
    modeType() {
      this.$refs.form_unit.resetFields()
    }
  },
  mounted() {
    this.upView()
  },
  methods: {
    upView() {
      if(this.forms && Object.keys(this.forms).length > 0) {
        this.form_unit = Object.assign(this.form_unit, this.forms)
      }
    },

    //选择摄像头 
    upCarema(val, type) {
      if(type) {
        if(!this.id) {
          this.form_unit.deviceCameras.push(val)
        }else {
          this.form_unit.deviceCameras.map((item,index) => {
            if(item.chanDpid === val.chanDpid) {
              this.$set(item, 'deviceId', val.deviceId)
              this.$set(item, 'name', val.name)
            }
          })
        }
      }else {
        this.form_unit.deviceCameras.map((item,index) => {
          if(item.deviceId === val.deviceId) {
            if(!type && this.id) {
              delete item.deviceId
              delete item.name
            }else {
              this.form_unit.deviceCameras.splice(0, 1)
            }
          }
        })
      }
    },
    onUpData() {
      this.$refs.form_unit.validate((valid) => {
        if(!valid) {
          return
        }else {
          let _form = this.form_unit;
          delete _form.chan_list
          this.$emit("complete", _form, true)
        }
      });
    },
    synchronize() {
      bindShiLianBoxSerial(this.form_unit.venderSn).then(res => {
        this.$notify({
          title: "成功",
          message: "同步成功",
          type: "success",
          duration: 2000
        });
      })
    },
    //端口字符串截取
    stringReplace(val) {
      if(!val) {
        return
      }
      return val.replace(/\/[a-zA-Z]+/g, '')
    }
  },
};
</script>

<style lang="scss" scoped>
  .first-box {
    padding: 0 20px;
    /deep/ {
      .box-card {
        width: 90%;
        margin-bottom: 20px;
        .el-card__header{
          padding: 5px 20px;
        }

        .el-card__body {
          padding: 5px 20px;
        }
    }
    }
  }
  .synchronize{
    white-space: nowrap;
    margin-top: 15px;
    span{
      font-size: 18px;
      line-height: 10px;
      margin-right: 15px;
    }
  }
</style>