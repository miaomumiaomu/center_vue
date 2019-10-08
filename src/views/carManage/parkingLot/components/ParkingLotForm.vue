<template>
  <div>
    <el-dialog :title="id?'编辑停车场信息':'添加停车场信息'" :visible.sync="isFormDialog" width="500px">
      <el-form label-width="100px" ref="form" :rules="rules" :model="form" :style="waterBg">
        <el-form-item label="停车场名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入停车场名称"/>
        </el-form-item>
        <el-form-item label="经纬度" prop="lng">
          <el-input
            :value="form.lng&&form.lat?form.lng+','+form.lat:''"
            placeholder="请选择经纬度"
            @focus="showMapLocation"
          />
        </el-form-item>
        <el-form-item label="所属小区" prop="communityId" >
          <communities-select v-model="form.communityId" placeholder="请选择所属小区" @finish="projectSelect" />
        </el-form-item>
        <el-form-item label="备注" prop="parkDesc">
          <el-input
            type="textarea"
            resize="none"
            :autosize="{minRows:3}"
            v-model="form.parkDesc"
            placeholder="请输入备注信息"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="mini" type="primary" @click="onSubmit()">确定</el-button>
        <el-button size="mini" @click="isFormDialog=false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 经纬度选择 -->
    <map-location ref="locationDialog" :zoom="18" @local="setLocation"/>
  </div>
</template>

<script>
import { getCommunitiesList } from "@/api/faceLibrary";
import { mapState } from "vuex";

import {
  putParkingLot,
  postParkingLot,
  getParkingLot
} from "@/api/carManage/parkingLot";

export default {
  props: {
    id: [String, Number],
    isOpen: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      isFormDialog: false,
      form: {
        id: null,
        name: null,
        lng: null,
        lat: null,
        communityId: null,
        parkDesc: null
      },
      rules: {
        lng: { required: true, message: "请选择经纬度" },
        name: { required: true, message: "请输入停车场名称" },
        communityId: { required: true, message: "请选择所属小区" }
      }
    };
  },
  watch: {
    isOpen(val) {
      this.isFormDialog = val;
    },
    isFormDialog(val) {
      if (val) {
        this.$nextTick(() => {
          this.$refs.form && this.$refs.form.resetFields();
        });
        this.id && this.init();
      }

      this.$emit("update:isOpen", val);
    }
  },
  computed: {
    ...mapState({
      waterBg: state => state.user.waterBg, // 水印
    })
  },
  methods: {
    init() {
      getParkingLot(this.id).then(res => {
        if (res.status == 200) {
          this.form = res.data;
        }
      });
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (!valid) return;

        if (this.id) {
          this.form.id = this.id;
          putParkingLot(this.form).then(res => {
            let isSuccess = res.status === 200;

            this.$notify({
              title: isSuccess ? "成功" : "失败",
              message: isSuccess ? "修改成功" : res.message,
              type: isSuccess ? "success" : "error",
              duration: 2000
            });

            if (isSuccess) {
              this.isFormDialog = false;
              this.$emit("complete");
            }
          });
        } else {
          this.form.id = null;
          
          postParkingLot(this.form).then(res => {
            let isSuccess = res.status === 200;
            this.$notify({
              title: isSuccess ? "成功" : "失败",
              message: isSuccess ? "新增成功" : res.message,
              type: isSuccess ? "success" : "error",
              duration: 2000
            });
            if (isSuccess) {
              this.isFormDialog = false;
              this.$emit("complete");
            }
          });
        }
      });
    },
    showMapLocation() {
      this.$refs.locationDialog.open({
        lng: this.form.lng,
        lat: this.form.lat
      });
    },
    setLocation(location) {
      this.form = Object.assign({}, this.form, {
        lng: location.lng,
        lat: location.lat
      });
    },
    //所属小区返回
    projectSelect(value) {
      this.$set(this.form, 'communityId', value)
    }
  }
};
</script>
