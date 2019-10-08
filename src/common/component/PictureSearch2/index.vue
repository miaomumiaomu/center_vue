<template>
  <div class="pic-search">
    <el-upload
      class="avatar-uploader"
      action=""
      :auto-upload="false"
      :show-file-list="false"
      :on-change="onUpload">
      <div v-if="data.imgBase64" class="image">
        <img :src="data.imgBase64" class="avatar">
        <i class="el-icon-error cancel" @click.stop="imageDel"></i>
      </div>
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
    <el-select v-model="data.threshold" placeholder="阈值" class="select">
      <el-option
        v-for="item in threshold"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <el-select v-model="data.top" placeholder="TOP N" class="select">
      <el-option
        v-for="item in topData"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
  </div>
</template>
<script>
import { postSearchIdentityNo } from "@/api/common";
export default {
  data() {
    return {
      threshold: [
        { value: 0.6, label: '60%' },
        { value: 0.7, label: '70%' },
        { value: 0.8, label: '80%' },
        { value: 0.9, label: '90%' },
        { value: 1, label: '100%' },
      ],
      topData: [
        { value: 10, label: '10' },
        { value: 9, label: '9' },
        { value: 8, label: '8' },
        { value: 7, label: '7' },
        { value: 6, label: '6' },
        { value: 5, label: '5' },
      ],
      data: {
        imgBase64: null,
        // top: 10,
        threshold: 0.6,
        keyword: '',
      }
    }
  },
  methods: {
    onUpload(file) {
      let reader = new FileReader();
      reader.readAsDataURL(file.raw);
      reader.addEventListener("load", () => {
        this.data.imgBase64 = reader.result
      });
    },
    async picSearch(keyword = '') {
      this.data.keyword = keyword
      let identityNo = []
      let { imgBase64 } = this.data
      if (imgBase64 || keyword) {
        imgBase64 ? imgBase64 = imgBase64.substr(imgBase64.indexOf(',') + 1) : ''
        await postSearchIdentityNo({ ...this.data, imgBase64 }).then(res => {
          identityNo = res.data
        })
        return identityNo
      } else {
        return null
      }
    },
    clear() {
      this.data = { imgBase64:null, threshold: 0.6, keyword: null }
    },
    imageDel(e) {
      this.$set(this.data, 'imgBase64', null)
    }
  }
}
</script>
<style lang="scss">
.pic-search{
  display: flex;
  .avatar-uploader{
    .el-upload {
      border: 1px solid #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      // overflow: hidden;
      height: 26px;
    }
    .el-upload:hover {
      border-color: #409EFF;
    }
    .image{
      .cancel{
        position: absolute;
        top: -6px;
        right: -6px;
        color: red;
        font-size: 12px;
        z-index: 100;
        cursor: pointer;
      }
    }
  }
  .avatar-uploader-icon {
    font-size: 18px;
    color: #8c939d;
    width: 24px;
    height: 24px;
    line-height: 24px;
    text-align: center;
  }
  .avatar {
    width: 24px;
    height: 24px;
    display: block;
    border-radius: 6px;
  }
  .select{
    width: 100px;
    margin-left: 10px;
  }
}
</style>

