<template>
  <el-dialog
    title="选择分析对象"
    class="picture-layer body0"
    :visible.sync="isPictureDialog"
    width="1000px"
    append-to-body
  >
    <el-form :model="pictureQuery" ref="pictureForm" :rules="pictureFormRules" label-width="70px" :style="waterBg">
      <el-row>
        <el-col :span="7" class="left-form">
          <div class="croppa-box">
            <croppa
              v-model="croppa"
              :initial-image="pictureQuery.imgBase64"
              @loading-end="onImageLoading"
              :class="{error: croppaError}"
              accept=".jpeg, .jpg, .png, .bmp"
              placeholder=" "
              :width="120"
              :height="120"
              :quality="2"
              :zoom-speed="10"
              :disabled="false"
              :prevent-white-space="true"
              :show-remove-button="true"
            >
              <img slot="placeholder" src="~@/assets/upload-tips.jpg">
            </croppa>
            <div class="tip">图片可进行拖动缩放</div>
            <div class="checkbox">
              <el-checkbox v-model="original">原图搜索</el-checkbox>
            </div>
          </div>
          <el-form-item label="关键字">
            <el-input v-model="pictureQuery.keyword" placeholder="姓名/证件号"></el-input>
          </el-form-item>
          <el-form-item class="threshold segmentation" label="阈　值" prop="threshold">
            <el-slider
              v-model="pictureQuery.threshold"
              :step="0.01"
              :min="0.35"
              :max="1"
              :format-tooltip="val => parseInt(val*100)+'%'"
            ></el-slider>
            <div class="txt">{{parseInt(pictureQuery.threshold*100)}}%</div>
          </el-form-item>
          <el-form-item label="TOP N" prop="top">
            <el-input v-model.number="pictureQuery.top" placeholder="匹配到的人数"></el-input>
          </el-form-item>
          <el-form-item label="类　型" prop="personTags">
            <face-library-select
              v-model="pictureQuery.personTags"
              placeholder="全部"
              multiple
              collapse-tags
              v-if="isPictureDialog"
              :filtrateNum="[2]" 
            />
          </el-form-item>
          <el-form-item label-width="0">
            <el-button class="w100" type="success" @click="onPictureSubmit()">
              开始检索
              <i class="el-icon-caret-right"></i>
            </el-button>
          </el-form-item>
        </el-col>
        <el-col :span="17" class="user-list">
          <div class="title">
            <b>搜索结果：</b>
            <em v-if="picUserData.length">{{picUserData.length}}</em>
            <div v-if="picUserData.length" class="tip">请选择要分析的人员</div>
          </div>
          <div class="img-list">
            <div class="item" v-for="(item,index) in picUserData" :key="index" :class="single ? {sel: confirmSingle.identityNo == item.identityNo} : {sel: listIds.includes(item.identityNo)}" @click="single ? onChangeSingle(item) : onChangeRow(item, index)">
              <div class="pic">
                <img :src="item.identityImgPath">
                <face-category-list
                  :data="faceLibraryData"
                  :type="1"
                  :chosen="item.personTags?item.personTags.split(','):[]"
                />
                <div class="mask" v-if="item.similarity">
                  相似度：
                  <b>{{item.similarity}}%</b>
                </div>
              </div>
              <div class="box">
                <div class="txt">
                  <svg-icon icon-class="user"/>
                  <b class="name">{{item.name}}</b>
                  <el-checkbox :value="single ? confirmSingle.identityNo == item.identityNo : listIds.includes(item.identityNo)" />
                </div>
                <div class="txt">
                  <svg-icon icon-class="credentials"/>
                  <label>{{item.identityNo}}</label>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer">
      <el-button size="mini" type="primary" @click="onUserListSubmit">开始分析</el-button>
      <el-button size="mini" @click="isPictureDialog = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from "vuex";

import { postImageSearch } from "@/api/common";

export default {
  props: {
    jumpData: {
      default: null,
      type: Object
    },
    isOpen: {
      default: false,
      type: Boolean
    },
    isDialog: {
      
    },
    single: Boolean,
    data: Object,

  },
  watch: {
    isOpen(val) {
      this.isPictureDialog = val;
    },
    isPictureDialog(val) {
      if (!val) {
        // 数据重置
        
        this.pictureQuery={
          keyword: "",
          imgBase64: null,
          threshold: 0.6,
          top: 10,
          personTags: null
        }
      }
      this.$emit("update:isOpen", val);
    },
    data(val) {
      if (val) {
        this.open(this.data);
      }
    }
  },
  data() {
    return {
      croppa: {},
      picUserData: [], // 以图搜图返回的用户数据
      isPictureDialog: false,
      pictureQuery: {
        keyword: "",
        imgBase64: null,
        threshold: 0.6,
        top: 10,
        personTags: null
      },
      croppaError: false,
      pictureFormRules: {
        threshold: {
          type: "number",
          required: true,
          message: "请输入正确的阈值"
        },
        top: [
          { required: true, message: "人数不能为空" },
          { type: "number", min: 1, message: "人数不能小于1人" }
        ]
      },
      listIds: [],
      confirmList: [], //多选
      confirmSingle: {}, //单选
      original: true,
    };
  },
  computed: {
    ...mapState({
      faceLibraryData: state => state.commonData.faceLibraryData,
      waterBg: state => state.user.waterBg, // 水印
    })
  },
  // created() {
    // this.$store.dispatch("commonData/getFaceLibraryData");
  // },
  methods: {
    open(data) {
      this.pictureQuery = Object.assign(this.pictureQuery, data);
      this.isPictureDialog = true;
      this.croppa.refresh && this.croppa.refresh();
      if (this.pictureQuery.imgBase64.includes("data:image/jpeg;base64,")) {
        this.$nextTick(() => {
           this.onPictureSubmit(true);
        });
      }
    },
    onImageLoading() {
      console.log('jumpData', this.jumpData)
      if (this.jumpData && this.jumpData.jump) {
        this.$nextTick(() => {
          this.onPictureSubmit();
        });
      }
    },
    onPictureSubmit(isCroppa) {
      this.$refs.pictureForm.validate(valid => {
        if (!valid) return;
        if (!this.croppa.img && !this.pictureQuery.keyword.toString().length) {
          this.$notify({
            title: "提示",
            message: "图片或关键字必须填写",
            type: "warning",
            duration: 2000
          });
          return;
        }

        // 清空处理
        this.listIds = [];
        this.confirmList = [];
        this.picUserData = [];
        this.confirmSingle = {};

        // 获取图片
        if (!isCroppa) {
          // console.log(this.croppa.img.src === this.croppa.generateDataUrl())
          // console.log(this.croppa.generateDataUrl())
          if (this.original && !this.jumpData) {
            this.pictureQuery.imgBase64 = this.croppa.img ? this.croppa.img.src : null;
          }else {
            this.pictureQuery.imgBase64 = this.croppa.generateDataUrl();
          }
        }

        this.$refs.pictureForm.validate(valid => {
          if (!valid) return false;

          let pictureQuery = JSON.parse(JSON.stringify(this.pictureQuery));

          pictureQuery.imgBase64 = pictureQuery.imgBase64 && pictureQuery.imgBase64.substr(
            pictureQuery.imgBase64.indexOf(",") + 1
          );

          postImageSearch(pictureQuery).then(res => {
            let isSuccess = res.status === 200;
            // 错误处理
            if (!isSuccess) {
              this.$notify({
                title: "失败",
                message: res.message,
                type: "error",
                duration: 2000
              });
              return;
            }

            // 成功处理
            if (res.data.data.length < 1) {
              this.$notify({
                title: "提示",
                message: "抱歉，没能找到匹配的人员",
                type: "warning",
                duration: 2000
              });
              return;
            }

            this.imgKey = new Date().getTime();
            this.picUserData = res.data.data;
          });
        });
      })
    },
    //单选
    onChangeSingle(row) {
      if(this.confirmSingle.identityNo === row.identityNo) {
        this.confirmSingle = {}
      }else {
        this.confirmSingle = row;
      }
    },
    //多选
    onChangeRow(row, index) {
      let _index = this.listIds.indexOf(row.identityNo);

      this.$set(this.listIds, index, _index < 0 ? row.identityNo : null);
      this.$set(this.confirmList, index, _index < 0 ? row : null);
    },
    // 选择匹配图片
    onUserListSubmit() {
      if(this.single) {
        let _data = this.confirmSingle
        // 判断选中一个人员
        if (Object.keys(_data).length === 0) {
          this.$notify({
            title: "提示",
            message: "请选择一个人员",
            type: "warning",
            duration: 2000
          });
          return;
        }
        
        this.isPictureDialog = false;
        this.$emit("complete", _data);

        if (this.jumpData && this.jumpData.jump) {
          this.$emit("isDialog", false)
          //是否是大视窗的跳转
          if(this.jumpData.mode) {
            let routeUrl = this.$router.resolve({
              path: this.jumpData.jumpUrl,
              query: { personId: _data.personId },
            });
            window.open(routeUrl.href, 'main');
          }else if (this.jumpData.jumpUrl) {
            this.$router.push({
              name: this.jumpData.jumpUrl,
              params: { data: _data }
            });
          }
          
        }
      }else  {
        // 过滤空数据
        let _data = this.confirmList.filter(item => !!item);
        // 判断至少选中一个人员
        if (!_data.length) {
          this.$notify({
            title: "提示",
            message: "请先选择一个人员",
            type: "warning",
            duration: 2000
          });
          return;
        }
        this.isPictureDialog = false;
        this.$emit("complete", _data);
        if (this.jumpData && this.jumpData.jump) {
          this.$emit("isDialog", false)
          if(this.jumpData.mode) {
            let routeUrl = this.$router.resolve({
              path: this.jumpData.jumpUrl,
              query: { personId: _data.personId },
            });
            window.open(routeUrl.href, 'main');
          }else {
            this.$router.push({
              name: this.jumpData.jumpUrl,
              params: { data: _data }
            });
          }
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.picture-layer {
  .w100 {
    width: 100%;
  }
  /deep/ .el-slider__runway {
    margin: 15px 0;
  }
  /deep/ .el-form-item__label {
    font-size: 13px;
  }
  .segmentation {
    padding-top: 10px;
    border-top: 1px #e5e5e5 solid;
  }
  .left-form {
    // background: #fafbfd;
    padding: 25px 10px;
    border-right: 1px #e5e5e5 solid;
  }
  .threshold {
    position: relative;
    .el-slider {
      padding: 0 46px 0 8px;
    }
    .txt {
      position: absolute;
      top: 0;
      right: 0;
      font-size: 13px;
      font-weight: bold;
      color: #3f4041;
    }
  }
  .croppa-box {
    margin-bottom: 10px;
  }
  .croppa-container {
    display: block;
    width: 120px;
    height: 120px;
    margin: 0 auto;
    border: 1px #fff solid;
    border-radius: 8px;
    /deep/ {
      canvas {
        border-radius: 8px;
      }
      svg {
        top: -10px !important;
        right: -10px !important;
        width: 20px !important;
        height: 20px !important;
      }
    }
    &.error {
      border: 1px #f56c6c solid;
    }
  }
  .tip {
    line-height: 30px;
    text-align: center;
    font-size: 12px;
    color: #adb1b4;
  }
  .checkbox {
    text-align: center;
  }
}
.user-list {
  .mt20 {
    margin-top: 20px;
  }
  .title {
    // background: #f2f2f2;
    height: 28px;
    line-height: 28px;
    padding: 0 12px;
    font-size: 14px;
    color: #333;
    em {
      background: #b5c0cd;
      padding: 0 10px;
      border-radius: 99px;
      font-style: normal;
      color: #fff;
    }
    .tip {
      float: right;
      font-size: 13px;
      color: #adb1b4;
    }
  }
  .img-list {
    position: relative;
    max-height: 440px;
    margin-top: 10px;
    padding-bottom: 10px;
    overflow: auto;
    .pic {
      position: relative;
      width: 160px;
      height: 160px;
      img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
    .mask {
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      background: rgba(0, 0, 0, 0.4);
      line-height: 18px;
      padding-right: 6px;
      text-align: right;
      font-size: 12px;
      color: #fafbfd;
      b {
        display: inline-block;
        vertical-align: top;
        font-size: 14px;
        color: #ffc600;
      }
    }
    .item {
      float: left;
      margin: 10px 0 0 10px;
      overflow: hidden;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(0, 0, 0, 0.1);
      &.sel {
        border-color: #0fa0ff;
      }
      label {
        font-size: 12px;
        color: #9da5af;
      }
      .box {
        width: 160px;
        padding: 6px;
        b {
          font-size: 14px;
          color: #333;
        }
      }
      .txt {
        display: flex;
        width: 100%;
        height: 18px;
        line-height: 18px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        .name {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .svg-icon {
        display: inline-block;
        height: 100%;
        margin-right: 4px;
        vertical-align: top;
        color: #b5c0cd;
      }
      .el-checkbox {
        float: right;
        margin-left: 4px;
        pointer-events: none;
      }
    }
  }
}
</style>