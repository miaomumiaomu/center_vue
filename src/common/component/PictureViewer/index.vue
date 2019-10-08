<template>
  <el-dialog title="背景大图" width="1000px" :visible.sync="isBgDialog" append-to-body>
    <el-row :gutter="20">
      <el-col :span="18">
        <croppa
            v-model="croppa"
            v-if="isBgDialog"
            :placeholder="'暂无图片'"
            :initial-image="bgImgInfo.rowBgImg"
            accept=".jpeg, .jpg, .png, .bmp"
            :width="715"
            :height="650"
            :quality="2"
            :zoom-speed="10"
            :disabled="false"
            :show-remove-button="false"
          >
          <div class="btn-group">
            <div class="icon-wrap" @click="_onChangeZoom(0)">
              <svg-icon class-name='zoom-icon' icon-class="zoomUp" />
            </div>
            <div class="icon-wrap" @click="_onChangeZoom(1)">
              <svg-icon class-name='zoom-icon' icon-class="zoomDown" />
            </div>
          </div>
        </croppa>
      </el-col>
      <el-col :span="6">
        <div class="right-img" :style="{ backgroundImage: `url(${bgImgInfo.identityImgPath})` }">
          <p>证件照</p>
        </div>
        <cirque-chart height="80px" class="ring" :data="bgImgInfo.similarity" backgroundColor="#FDF1F1" fontColor="#2e2e2e" />
        <div class="right-img" :style="{ backgroundImage: `url(${bgImgInfo.snapImgPath})` }">
          <p>抓拍照</p>
        </div>
      </el-col>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" :style="{marginRight: '10px'}" @click="isBgDialog = false">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    bgImgInfo: {
      default: {},
      type: Object
    },
    isOpen: {
      default: false,
      type: Boolean
    }
  },
  data: () => ({
    croppa: {},
    isBgDialog: false
  }),
  watch: {
    isOpen(val) {
      this.isBgDialog = val;
    },
    isBgDialog(val) {
      this.$emit("update:isOpen", val);
    }
  },
  methods: {
    _onChangeZoom(flag) {
      if (flag === 0) {
        this.croppa.scaleRatio += 0.1;
      } else {
        this.croppa.scaleRatio -= 0.1;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  /deep/ .el-dialog__body {
    max-height: inherit;
    padding: 20px !important;
  }

  .croppa-container {
    position: relative;
    .btn-group {
      position: absolute;
      right: 14px;
      bottom: 14px;
      .icon-wrap {
        width: 55px;
        height: 30px;
        background-color: rgba(0, 0, 0, .46);
        border-radius: 4px;
        margin-top: 8px;
        text-align: center;
        cursor: pointer;
        .zoom-icon {
          display: inline-block;
          width: 20px;
          height: 26px;
        }
      }
    }
  }

  .right-img {
    width: 100%;
    height: 272px;
    position: relative;
    border: 1px solid gainsboro;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    p {
      width: 100%;
      height: 30px;
      position: absolute;
      bottom: 0;
      line-height: 30px;
      background-color: rgba(0, 0, 0, .3);
      font-size: 18px;
      color: #fff;
      text-align: center;
      user-select: none;
    }
  }

  .ring {
    margin: 13px 0;
  }
</style>