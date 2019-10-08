<template>
  <div class="face-location-main">
    <el-upload ref="upload" class="image-upload" action="" accept=".jpeg,.jpg,.png,.bmp" list-type="picture-card" :on-change="onUpload" :show-file-list="false" :auto-upload="false">
      <img v-if="submitQuery.imgBase64" :src="'data:image/jpeg;base64,' + submitQuery.imgBase64" class="avatar" @load="onLoadPic($event)">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      <div class="face-item" v-for="(item,index) in faceList" :class="{col1:item.deep}" :style="{top: item.top+'px', left: item.left+'px', width: item.width+'px', height: item.height+'px'}" :key="index"></div>
    </el-upload>
    <el-button type="primary" plain @click="onRotateImage">图片顺时针旋转90度</el-button>
    <!-- 表单筛选 -->
    <el-form class="form" ref="listForm" :inline="true">
      <el-form-item label="开启扣图">
        <el-switch v-model="submitQuery.crop" :active-value="1" :inactive-value="0" />
      </el-form-item>
      <el-form-item label="最小人脸像素">
        <el-input v-model="submitQuery.minface" />
      </el-form-item>
      <el-form-item label="返回人脸数">
        <el-input v-model="submitQuery.top" />
      </el-form-item>
    </el-form>
    <div class="submit">
      <el-button type="primary" @click="onSubmit">开始检测</el-button>
    </div>
    <el-tabs v-model="tabsIndex" type="border-card">
      <el-tab-pane label="分析结果" name="0">
        <div class="json-list" v-if="dataJson">
          <code class="json" v-if="dataJson.data.length" v-html="item" v-for="(item,index) in dataJson.data" :key="index" />
          <span v-if="!dataJson.data.length">未检测到人脸</span>
        </div>
      </el-tab-pane>
      <el-tab-pane label="图片组" name="1">
        <div class="pic-list" v-if="dataJson">
          <img :src="item.image" v-for="(item,index) in dataJson.data" :key="index">
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import imgCalibration, { imageHandle } from "@/utils/fileUtil";
import { postFaceCheck } from "@/api/debugTool/index";

export default {
  name: "faceCheck",
  data() {
    return {
      submitQuery: {
        imgBase64: "",
        crop: 1,
        minface: 160,
        top: 10
      },
      zoom: 1, // 用于判断图片是否缩小
      dataJson: null,
      faceList: [], // 人脸框
      tabsIndex: 0
    };
  },
  methods: {
    onLoadPic(ev) {
      this.zoom = 1;
      if (ev.target.naturalHeight > 400) {
        this.zoom = 400 / ev.target.naturalHeight;
      }
    },
    onUpload(file, fileList) {
      this.faceList = [];
      this.dataJson = null;

      imgCalibration(file.raw).then(newFile => {
        let reader = new FileReader();
        reader.readAsDataURL(newFile);
        reader.addEventListener("load", () => {
          this.submitQuery.imgBase64 = reader.result.substr(
            reader.result.indexOf(",") + 1
          );
        });
      });
    },
    onRotateImage() {
      if (!this.submitQuery.imgBase64) {
        this.$notify({
          title: "提示",
          message: "请上传图片",
          type: "warning",
          duration: 2000
        });
        return;
      }

      this.faceList = [];
      this.dataJson = null;

      let img = new Image();
      img.src = "data:image/jpeg;base64," + this.submitQuery.imgBase64;
      img.onload = () => {
        const data = imageHandle.rotateImage(img, img.width, img.height);
        this.submitQuery.imgBase64 = data.substr(data.indexOf(",") + 1);
      };
    },
    onSubmit(val) {
      if (!this.submitQuery.imgBase64) {
        this.$notify({
          title: "提示",
          message: "请上传图片",
          type: "warning",
          duration: 2000
        });
        return;
      }

      this.faceList = [];
      this.dataJson = null;

      postFaceCheck(this.submitQuery).then(res => {
        this.dataJson = res.data;
        if (this.dataJson.data && this.dataJson.data.length > 0) {
          this.dataJson.data.forEach(item => {
            this.faceList.push({
              deep: true,
              top: item.leftTopY * this.zoom,
              left: item.leftTopX * this.zoom,
              width: (item.rightBottomX - item.leftTopX) * this.zoom,
              height: (item.rightBottomY - item.leftTopY) * this.zoom
            });
          });
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.face-location-main {
  padding: 20px;
  .form {
    padding-top: 20px;
    overflow: hidden;
    clear: both;
    .el-form-item {
      margin-bottom: 0;
    }
  }
  .json-list {
    max-height: 400px;
    overflow: auto;
    word-wrap: break-word;
  }
  .pic-list {
    overflow: hidden;
    padding: 10px 10px 0;
    margin: -10px;
    img {
      float: left;
      width: 80px;
      height: 80px;
      margin: 0 10px 10px 0;
    }
  }
  .submit {
    padding: 20px 0;
    clear: both;
    .el-button {
      width: 200px;
      height: 40px;
      &.col1 {
        background-color: #f42b4c;
        border-color: #f42b4c;
      }
    }
  }
  .image-upload {
    float: left;
    min-width: 200px;
    min-height: 200px;
    margin-right: 20px;
    /deep/ {
      .el-upload {
        position: relative;
        width: 100%;
        height: auto;
        min-height: 200px;
        overflow: hidden;
      }
      .avatar-uploader-icon {
        position: absolute;
        top: 50%;
        left: 50%;
        font-size: 80px;
        transform: translate(-50%, -50%);
      }
      img {
        display: block;
        width: auto;
        max-height: 400px;
      }
    }
  }
  .face-item {
    position: absolute;
    border: 2px #42b983 solid;
    &.col1 {
      border-color: #f42b4c;
    }
  }
  code {
    margin: 0;
  }
}
</style>
