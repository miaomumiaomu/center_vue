<template>
  <div>
    <el-form ref="form_caremasInfo" :model="form_caremasInfo" :rules="rules" label-width="100px" :disabled="isDisabled">
      <el-row class="first-box">

        <el-col :span="12">
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="form_caremasInfo.userName" placeholder="请输入用户名" @input="onAutoComplete"/>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="密码" prop="password">
            <el-input v-model="form_caremasInfo.password" placeholder="请输入密码" @input="onAutoComplete"/>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="IP" prop="ip">
            <el-input v-model="form_caremasInfo.ip" placeholder="请输入Ip" @input="onAutoComplete"/>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="端口" prop="port" >
            <el-input v-model="form_caremasInfo.port" placeholder="请输入设备端口"/>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="主码流" prop="mainStream" >
            <el-input v-model="form_caremasInfo.mainStream" placeholder="请输入主码流地址"/>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="子码流" prop="childStream" >
            <el-input v-model="form_caremasInfo.childStream" placeholder="请输入子码流地址" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- <SLcarema-select :is-open.sync="isFormDialog" :forms="forms" @complete="upCarema"/> -->
  </div>
</template>

<script>

export default {
  props: {
    id: [String, Number],
    readMethodType: Number,
    forms: Object,
    isDisabled: Boolean,
  },
  data() {
    return {
      form_caremasInfo: {
        userName: null, //用户名
        password: null, //密码
        ip: null,  // 设备IP
        port: null, //端口
        mainStream: null, //主码流
        childStream: null, //子码流
      },
      rules: {
        userName: { required: true, message: "请输入用户名" },
        password: { required: true, message: "请输入密码" },
        ip: { required: true, message: "请输入Ip" },
        port: { required: true, message: "请输入端口号" },
      },
    };
  },
  watch: {
    readMethodType(val) {
      if(!this.id && val) {
        this.$refs.form_caremasInfo.resetFields()
      }
    }
  },
  created() {
    if(this.id) {
      this.form_caremasInfo = this.forms
    }
  },
  methods: {
    onUpData() {
      if(this.readMethodType) {
        return
      }else {
        this.$refs.form_caremasInfo.validate((valid) => {
          if(!valid) {
            this.$emit("complete", {}, false, true)
            return
          }else{
            this.$emit("complete", this.form_caremasInfo, true, true)
          }
        });
      }
    },
    onAutoComplete() {
      this.form_caremasInfo.mainStream = `rtsp://${this.form_caremasInfo.userName}:${this.form_caremasInfo.password}@${this.form_caremasInfo.ip}:554/h264/ch1/main/av_stream`;
      this.form_caremasInfo.childStream = `rtsp://${this.form_caremasInfo.userName}:${this.form_caremasInfo.password}@${this.form_caremasInfo.ip}:554/h264/ch1/sub/av_stream`;
    }
  },
};
</script>

<style lang="scss" scoped>
  .first-box {
    // padding: 0 20px;
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
</style>