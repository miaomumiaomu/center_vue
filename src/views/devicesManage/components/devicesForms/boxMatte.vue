<template>
  <div>
    <el-form ref="form_Matte" :model="form_Matte" :rules="rules" label-width="100px" :disabled="isDisabled">
      <el-row class="first-box">

        <el-col :span="12">
          <el-form-item label="外部Id" prop="outerId">
            <el-input v-model="form_Matte.outerId" placeholder="请输入外部Id"/>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="ip" prop="ip" >
            <el-input v-model="form_Matte.ip" placeholder="请输入设备ip" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="mac" prop="mac"  >
            <el-input v-model="form_Matte.mac" placeholder="请输入mac地址" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="tvCode" prop="tvCode"  >
            <el-input v-model="form_Matte.tvCode" placeholder="请输入TVcode" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="路数上限" prop="maxRoutes" >
            <el-input v-model="form_Matte.maxRoutes" placeholder="请输入路数上限"  />
          </el-form-item>
        </el-col>
        <el-col :span="24" >
          <el-form-item label="摄像头" prop="deviceCameras" >
            <camera-select :chan="form_Matte.deviceCameras[0]" :cameraType="0" :getcameraType="1" v-model="form_Matte.deviceCameras" :value="form_Matte.deviceCameras && form_Matte.deviceCameras.map(item=>{return {deviceId: item.id,name:item.name}})" :maxRoutes="form_Matte.maxRoutes" 
              :disabled="!Number(this.form_Matte.maxRoutes)" />
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
  </div>
</template>

<script>
export default {
  components: {
    CameraSelect:()=>import("../CameraSelect")
  },
  props: {
    modeType: [Number,String],
    forms: Object,
    isDisabled: Boolean,
  },
  data() {
    return {
      form_Matte: {
        model: null, //型号
        outerId: null, //外部Id
        mac: null, //mac
        ip: null, //ip
        tvCode: null, //tvCode
        maxRoutes: null, //路数上限
        deviceCameras: [], //摄像头
      },
      rules: {
        model: { required: true, message: "请输入型号" },
        outerId: { required: true, message: "请输入外部Id" },
        ip: { required: true, message: "请输入ip" },
        maxRoutes: { required: true, message: "请输入路数上限" },
        deviceCameras: { required: true, message: "请选择摄像头" },
      }
    };
  },
  watch: {
    modeType() {
      this.$refs.form_Matte.resetFields()
    }
  },
  mounted() {
    this.$refs.form_Matte.resetFields();
    if(this.forms && Object.keys(this.forms).length > 0) {
      this.form_Matte = this.forms
      console.log(this.forms)
    }
  },
  methods: {
    onUpData() {
      this.$refs.form_Matte.validate((valid) => {
        if(!valid) {
          return
        }else {
          this.$emit("complete", this.form_Matte, true)
        }
      });
    }
  },
};
</script>

<style lang="scss" scoped>
  .first-box {
    padding: 0 20px;
  }
</style>