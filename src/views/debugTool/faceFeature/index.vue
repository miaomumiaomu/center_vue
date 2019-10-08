<template>
  <div class="face-feature-main">
    <el-upload ref="upload" class="update-image" action="" accept=".jpeg,.jpg,.png,.bmp" list-type="picture-card" :auto-upload="false" :multiple="true">
      <i class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
    <div class="submit">
       <el-select v-model="submitQuery.modelCode" placeholder="请选择模型" clearable>
        <el-option v-for="item in modelOptions" :key="item.id" :label="item.name" :value="item.code"></el-option>
      </el-select>
      <el-button type="primary" @click="onSubmit">开始分析</el-button>
    </div>
    <div class="data-show" v-if="dataJson">
      <div class="tit">JSON数据结果</div>
      <code class="json" v-html="dataJson"></code>
    </div>
  </div>
</template>
<script>
import { postFaceFeature } from "@/api/debugTool/index";
import {getModelMenu} from '@/api/modelConfig'
export default {
  name: "faceFeature",
  data() {
    return {
      submitQuery: {
        modelCode:"",
        imageList: []
      },
      dataJson: null,
      modelOptions:[],
    };
  },
  created() {
    getModelMenu().then(res => {
      this.modelOptions = res.data;
    });
  },
  methods: {
    onSubmit() {
      if (!this.$refs.upload.uploadFiles.length) {
        this.$notify({
          title: "提示",
          message: "请上传图片",
          type: "warning",
          duration: 2000
        });
      } else {
        this.dataJson = null;
        this.submitQuery.imageList = [];
        // 开始上传右侧多张
        this.$refs.upload.uploadFiles.map(file => {
          let reader = new FileReader();
          reader.readAsDataURL(file.raw);
          reader.addEventListener("load", () => {
            this.submitQuery.imageList.push(
              reader.result.substr(reader.result.indexOf(",") + 1)
            );

            // 多张图片上传完成
            if (
              this.submitQuery.imageList.length ===
              this.$refs.upload.uploadFiles.length
            ) {
              postFaceFeature(this.submitQuery).then(res => {
                this.dataJson = res.data;
              });
            }
          });
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.face-feature-main {
  padding: 20px;
  .submit {
    padding: 20px 0;
    clear: both;
    .el-button {
      width: 200px;
      height: 40px;
    }
  }
  .data-show {
    clear: both;
    border: 1px #eee solid;
    .tit {
      background: #eee;
      line-height: 40px;
      padding: 0 10px;
    }
    .json {
      background: #fff;
      margin: 0;
      padding: 10px;
      word-wrap: break-word;
    }
  }
}
</style>
