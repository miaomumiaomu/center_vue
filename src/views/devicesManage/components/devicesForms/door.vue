<template>
  <div>
    <el-form ref="form_door" :model="form_door" :rules="rules" label-width="100px" :disabled="isDisabled">
      <el-row class="first-box">

        <el-col :span="12">
          <el-form-item label="外部Id" prop="outerId">
            <el-input v-model="form_door.outerId" placeholder="请输入外部Id"/>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="位置照片" prop="image">
            <el-upload class="upload" action accept=".jpeg, .jpg, .png, .bmp" :auto-upload="false" :show-file-list="false" :on-change="onUpload" >
              <img v-if="form_door.image" :src="form_door.image" class="upload-show">
              <el-button v-else>上传</el-button>
            </el-upload>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" resize="none" :autosize="{ minRows: 3 }" v-model="form_door.remark"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import moment from "moment";
import { postPicturesUpload } from "@/api/common";
import { getDevices, putDevices, postDevices } from "@/api/devicesManage";

export default {
  props: {
    community: Object,
    modeType: [Number,String],
    forms: {
      type: Object,
      default: {},
    },
    isDisabled: Boolean,
  },
  data() {
    return {
      moment: moment,
      form_door: {
        outerId: null, //外部Id
        lng: null, //经度
        lat: null, //纬度
        status: 0,  //启用
        houseId: null, //门牌ID
        houseName: null, //门牌名
        image: null, //位置照片
        remark: null, //备注
      },
      rules: {
        outerId: { required: true, message: "请输入外部Id" },
        lng: { required: true, message: "请选择经纬度" },
      },
      camera:[1,2,3],
    };
  },
  watch: {
    modeType(val) {
      this.$refs.form_door.resetFields();
    },
  },
  mounted() {
    this.$refs.form_door.resetFields();
    if(this.forms && Object.keys(this.forms).length > 0) {
      this.form_door = this.forms
    }
  },
  methods: {
    // 照片上传
    onUpload(file) {
      let formData = new FormData();
      formData.append("files", file.raw);
      formData.append("type", 2); //设备
      postPicturesUpload(formData).then(res => {
        if (res.status == 200) {
          this.$set(this.form_door, "image", res.data[0].filePath);
        } else {
          this.$message.error("图片上传失败，请联系管理员！");
        }
      })
      .catch(() => {
        this.$message.error("图片上传失败，请联系管理员！");
      });
    },

    onUpData() {
      this.$refs.form_door.validate((valid) => {
        if(!valid) {
          return
        }else {
          this.$emit("complete", this.form_door, true)
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
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
    .upload-show{
      width: 185px;
    }
  }
</style>
