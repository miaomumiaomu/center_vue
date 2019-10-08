<template>
  <div class="app-container">
    <div class="content">
      <el-form ref="form" :model="form" :rules="formRules" label-width="140px">
        <el-form-item label="中心名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="所在区域" prop="addrDistrictCode">
          <city-picker :value="form.addrDistrictCode" @complete="onAddrCodeChange" />
        </el-form-item>
        <el-form-item label="中心地址" prop="address">
          <el-input v-model="form.address" />
        </el-form-item>
        <el-form-item label="地图默认放大级别" prop="mapLevel">
          <el-input v-model.number="form.mapLevel" />
        </el-form-item>
        <el-form-item label="地图最小层级" prop="minMapLevel">
          <el-input v-model.number="form.minMapLevel" />
        </el-form-item>
        <el-form-item label="地图最大层级" prop="maxMapLevel">
          <el-input v-model.number="form.maxMapLevel" />
        </el-form-item>
        <el-form-item label="中心地图范围" prop="range">
          <el-button icon="el-icon-edit-outline" @click="isRegionDialog = true">编辑</el-button>
          <!-- <span>（请先填写准确的中心地址）</span> -->
        </el-form-item>
        <el-form-item label="全局告警弹窗" prop="alarmSwitch">
          <el-switch
            v-model="form.alarmSwitch"
            active-text="开"
            inactive-text="关"
            active-color="#13ce66"
            :active-value="1"
            :inactive-value="0"
            >
          </el-switch>
        </el-form-item>
        <el-form-item label="综合大数据视窗名称" prop="bigDataViewName">
          <el-input v-model="form.bigDataViewName" />
        </el-form-item>
        <el-form-item label="人脸大数据视窗名称" prop="faceDataViewName">
          <el-input v-model="form.faceDataViewName" />
        </el-form-item>
        <el-form-item label="车辆大数据视窗名称" prop="carDataViewName">
          <el-input v-model="form.carDataViewName" />
        </el-form-item>
        <el-form-item label="中心简介" prop="description">
          <el-input type="textarea" resize="none" :autosize="{ minRows: 4 }" v-model="form.description" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" v-permission="'FUNC_CENTERCONFIG_UPDATE'">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 地图绘制 -->
    <map-region-draw :is-open.sync="isRegionDialog" :data="form.range" @complete="onDrawComplete" />
  </div>
</template>
<script>
import { getCenterConfig, putCenterConfig } from "@/api/centerConfig";

export default {
  name: "centerConfig",
  data: () => ({
    isRegionDialog: false,

    form: {
      id: null,
      name: null,
      address: null,
      addrDistrictCode: null,
      bigDataViewName: null,
      faceDataViewName: null,
      carDataViewName: null,
      description: null,
      range: [],
      mapLevel: null,
      maxMapLevel: 20,
      minMapLevel: 3,
      alarmSwitch: 0 //关闭
    },
    formRules: {
      name: [{ required: true, message: "中心名称不能为空" }],
      address: [{ required: true, message: "中心地址不能为空" }],
      range: [{ required: true, message: "请配置中心地图范围" }],
      // addrDistrictCode: { required: true, message: "所在区域不能为空" },
      bigDataViewName: { required: true, message: "综合大数据视窗名称不能为空" },
      faceDataViewName: { required: true, message: "人脸大数据视窗名称不能为空" },
      carDataViewName: { required: true, message: "车辆大数据视窗名称不能为空" },
      mapLevel: [
        { required: true, message: "地图默认放大级别" },
        { type: "number", min: 1,max: 20, message: "请填写1-20之间的数字" }
      ],
      maxMapLevel: [
        { required: true, message: "地图最大层级不能为空" },
        { type: "number", min: 3, max: 20, message: `请填写3-20之间的数字` }
      ],
      minMapLevel: [
        { required: true, message: "地图最小层级不能为空" },
        { type: "number", min: 3, max: 20, message: `请填写3-20之间的数字` }
      ],
      alarmSwitch: { required: true, message: "全局告警开关" },
    }
  }),
  created() {
    this.init();
  },
  methods: {
    init() {
      getCenterConfig().then(res => {
        if (res.status == 200) {
          this.form = res.data;
          if(!this.form.maxMapLevel && !this.form.minMapLevel) {
            this.$set(this.form, "maxMapLevel", 20);
            this.$set(this.form, "minMapLevel", 3);
          }
        }
      });
    },
    onDrawComplete(data) {
      this.form.range = data;
    },
    onAddrCodeChange(data) {
      this.form.addrDistrictCode = data;
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (!valid) return false;

        let _form = JSON.parse(JSON.stringify(this.form));
        delete _form.realMapUrl;

        putCenterConfig(_form).then(res => {
          let isSuccess = res.status === 200;
          this.$notify({
            title: isSuccess ? "成功" : "失败",
            message: isSuccess ? "保存成功" : res.message,
            type: isSuccess ? "success" : "error",
            duration: 2000
          });
          if(res.status === 200) {
            // this.$store.dispatch('getCenterInfo')
            // 保存成功更新数据
            isSuccess && this.init();
          }
        });
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.app-container {
  position: relative;
  height: 100%;
  .content {
    height: calc(100vh - 119px);
    width: 100%;
    overflow: scroll;
  }
  .el-form {
    margin: 50px auto;
    width: 500px;
    /deep/ .el-form-item__label {
      font-size: 13px;
      color: #3f4041;
    }
    span {
      font-size: 13px;
      color: #999;
    }
  }
}
</style>