<template>
  <div>
    <el-form ref="form_caremas" :model="form_caremas" :rules="rules" label-width="100px" :disabled="isDisabled">
      <el-row class="first-box">
        <!-- <el-col :span="12">
          <el-form-item label="设备代码" prop="deviceCode">
            <el-input v-model="form_caremas.deviceCode" placeholder="请输入序列号" />
          </el-form-item>
        </el-col> -->

        <el-col :span="12">
          <el-form-item label="外部Id" prop="outerId">
            <el-input v-model="form_caremas.outerId" placeholder="请输入外部Id"/>
          </el-form-item>
        </el-col>

        <el-col :span="12" >
          <el-form-item label="读取方式" prop="readMethod">
            <el-select v-model="form_caremas.readMethod" >
              <el-option v-for="(item,index) in readWays" :key="index" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="24" >
          <caremas-info :readMethodType="form_caremas.readMethod" :isDisabled="isDisabled" v-show="form_caremas.readMethod === 0" ref="caremasInfo" @complete="dataSettle" :id="id" :forms="form_info"/>
        </el-col>

        <el-col :span="12">
          <el-form-item label="国标编码" prop="parentOuterId">
            <el-input v-model="form_caremas.parentOuterId" placeholder="国标编码" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="位置照片" prop="image">
            <el-upload class="upload" action accept=".jpeg, .jpg, .png, .bmp" :auto-upload="false" :show-file-list="false" :on-change="onUpload" >
              <img v-if="form_caremas.image" :src="form_caremas.image" class="upload-show">
              <el-button v-else>上传</el-button>
            </el-upload>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" resize="none" :autosize="{ minRows: 3 }" v-model="form_caremas.remark"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="second-box">
        <el-col :span="24" class="heading">抓拍人脸参数</el-col>
        <el-col :span="8">
          <img src="~@/assets/camera/img1.jpg" class="example">
          <span></span>
        </el-col>
        <el-col :span="16">
          <el-form-item label="人脸高度" prop="faceHeight">
            <el-input v-model="form_caremas.faceHeight" placeholder="请输入人脸高度" />
          </el-form-item>
          <el-form-item label="人脸宽度" prop="faceWidth">
            <el-input v-model="form_caremas.faceWidth" placeholder="请输入人脸宽度" />
          </el-form-item>
        </el-col>
        <el-col :span="24" class="heading">背景图参数</el-col>
        <el-col :span="8">
          <img src="~@/assets/camera/img2.jpg" class="example">
          <span></span>
        </el-col>
        <el-col :span="16">
          <el-form-item label="背景高度" prop="backgroundWidth">
            <el-input v-model="form_caremas.backgroundWidth" placeholder="请输入背景图片高度" />
          </el-form-item>
          <el-form-item label="背景宽度" prop="backgroundHeight">
            <el-input v-model="form_caremas.backgroundHeight" placeholder="请输入背景图片宽度" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    
  </div>
</template>

<script>
import { postPicturesUpload } from "@/api/common";

export default {
  components: {
    HouseSelected: () => import("../HouseSelected"),
    CaremasInfo: () => import("./caremas/caremasInfo"),
  },
  props: {
    id: [String, Number],
    community: Object,
    modeType: [Number,String],
    forms: Object,
    isDisabled: Boolean,
  },
  data() {
    return {
      form_caremas: {
        // deviceCode: null,  //设备代码
        outerId: null, //外部ID
        readMethod: null, //读取方式
        // userName: null, //用户名
        // password: null, //密码
        // ip: null,  // 设备IP
        // port: null, //端口
        // mainStream: null, //主码流
        // childStream: null, //子码流
        image: null, //照片
        houseKey: null, //门牌楼号
        houseId: null, //门牌ID
        remark: null, //备注
        faceHeight: "160", //人脸高度
        faceWidth: "160", //人脸宽度
        backgroundWidth: "1920", //背景宽度
        backgroundHeight: "1080", //背景高度
        parentOuterId: null, //上级外部Id
      },
      form_: {}, //
      form_info: {}, //编辑的数据
      granson: true,
      rules: {
        // outerId: { required: true, message: "请输入外部Id" },
        readMethod: { required: true, message: "请选择读取方式" },
        // userName: { required: true, message: "请输入用户名" },
        // password: { required: true, message: "请输入密码" },
        // ip: { required: true, message: "请输入Ip" },
        // port: { required: true, message: "请输入端口号" },
        lng: { required: true, message: "请选择经纬度" },
      },
      readWays: []
    };
  },
  watch: {
    modeType() {
      this.$refs.form_caremas.resetFields();
      if(Object.keys(this.forms).length > 0) {
        this.form_caremas = this.forms
      }
    }
  },
  created() {
    this.readTypeInit()
  },
  mounted() {
    this.$refs.form_caremas.resetFields();
    if(this.forms && Object.keys(this.forms).length > 0) {
      if(this.id && !this.forms.readMethod) {
        this.$set(this.form_info, "userName", this.forms.userName)
        delete this.forms.userName

        this.$set(this.form_info, "password", this.forms.password)
        delete this.forms.password

        this.$set(this.form_info, "ip", this.forms.ip)
        delete this.forms.ip

        this.$set(this.form_info, "port", this.forms.port)
        delete this.forms.port

        this.$set(this.form_info, "mainStream", this.forms.mainStream)
        delete this.forms.mainStream

        this.$set(this.form_info, "childStream", this.forms.childStream)
        delete this.forms.childStream
      }
      this.form_caremas = this.forms
    }
  },
  methods: {
    // 获取读取方式
    readTypeInit() {
      let Ob_readWays = JSON.parse(window.localStorage.getItem('device_readMethod'));
      let Ar_readWays = new Array();
      for(let i=0; i < Object.keys(Ob_readWays).length; i++) {
        Ar_readWays.push({ value: i, label: Ob_readWays[i] })
      }
      this.readWays = Ar_readWays
    },

    

    // 照片上传
    onUpload(file) {
      if (file.size / 1024 > 1024) {
        setTimeout(() => {
          this.$notify({
            title: "提示",
            message: `图片【${file.name}】超过1024KB，请压缩后上传`,
            type: "warning",
            duration: 2000
          });
        }, 10);
        return
      }
      let formData = new FormData();
      formData.append("files", file.raw);
      formData.append("type", 2); //设备
      postPicturesUpload(formData).then(res => {
        if (res.status == 200) {
          this.$set(this.form_caremas, "image", res.data[0].filePath);
        } else {
          this.$message.error("图片上传失败，请联系管理员！");
        }
      })
      .catch(() => {
        this.$message.error("图片上传失败，请联系管理员！");
      });
    },

    // 数据整理 通用
    dataSettle(val, isT = false, Iscaremas = false) {
      if(Iscaremas) {
        this.granson = isT
      }
      this.form_ = val;
    },

    onUpData() {
      this.$refs.caremasInfo.onUpData();
      let _form;
      if(this.id && this.form_.readMethodType) {
        _form = Object.assign({}, this.form_);  
      }else {
        _form = Object.assign({}, this.form_caremas, this.form_);
      }
      this.$refs.form_caremas.validate((valid) => {
        if(!valid) {
          return
        }else {
          this.$emit("complete", _form, this.granson)
        }
      });
    }
  },
};
</script>

<style lang="scss" scoped>
  .first-box {
    padding: 0 20px;
    .upload-show {
      width: 185px;
    }
  }
  .second-box {
    padding: 0 20px 20px 20px;
    img {
      display: block;
      margin: auto;

    }
  }
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
</style>