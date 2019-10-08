<template>
  <div class="app-container colligateSearch">
    <div class="left-box">
      <el-form :model="form" ref="form" :rules="rules" label-width="70px">
        <div class="croppa-box">
          <croppa
            v-model="croppa"
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
        <el-form-item label="图片格式">
          <el-select v-model="pictureFormat" placeholder="请选择" class="w100">
            <el-option label="jpg" value="image/jpeg"/>
            <el-option label="bmp" value="image/bmp"/>
            <el-option label="png（控件默认）" value="image/png"/>
          </el-select>
        </el-form-item>
        <el-form-item label="关键字">
          <el-input v-model="form.keyword" placeholder="姓名/证件号" clearable/>
        </el-form-item>
        <el-form-item class="slider-box" label="阈　值" prop="threshold">
          <el-slider
            v-model="form.threshold"
            :step="0.01"
            :min="0.01"
            :max="1"
            :format-tooltip="val => parseInt(val*100)+'%'"
          />
          <div class="txt">{{parseInt(form.threshold*100)}}%</div>
        </el-form-item>
        <el-form-item label="TOP N" prop="top">
          <el-input v-model.number="form.top" placeholder="匹配到的人数"/>
        </el-form-item>
        <el-form-item label="类　型" prop="personTags">
          <face-library-select v-model="form.personTags" placeholder="全部" multiple collapse-tags/>
        </el-form-item>
        <el-form-item label="模  型" prop="modeCode">
          <el-select v-model="form.modelCode" placeholder="全部" class="w100" clearable>
            <el-option
              v-for="item in modelOptions"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="加权算法" prop="computeStrategyType" v-if="form.modelCode==''">
          <el-select v-model="form.computeStrategyType" placeholder="请选择" class="w100">
            <el-option label="分段加权" value="Segment"/>
            <el-option label="指数分配加权" value="ExponentAllot"/>
            <el-option label="最大相似度加权" value="MaxSim"/>
          </el-select>
        </el-form-item>
        <el-form-item label-width="0">
          <el-button class="w100" type="success" @click="onSubmit">
            开始搜索
            <i class="el-icon-caret-right"></i>
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="right-box">
      <div class="title">
        <b>搜索结果：</b>
        <em v-if="listData.length">{{listData.length}}</em>
      </div>

      <div class="img-list">
        <div class="item" v-for="(item,index) in listData" :key="index">
          <div class="pic">
            <img :src="item.identityImgUrl">
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
            </div>
            <div class="txt">
              <svg-icon icon-class="credentials"/>
              <label>{{item.identityNo}}</label>
            </div>
          </div>
          <div class="more">
            <p class="col1">综合：{{item.similarity}}</p>
            <p v-for="model in item.modelSimilarities" :key="model.searchModel.code">{{model.searchModel.code}}：{{model.similarityPercent}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { getTagList } from "@/api/libTagsManage";
import { getBase64 } from "@/utils";
import { getModelMenu } from "@/api/modelConfig";
import { postRouteSearch } from "@/api/debugTool/index";

export default {
  name: "colligateSearch",
  data: () => ({
    form: {
      keyword: "",
      imgBase64: null,
      threshold: 0.6,
      top: 10,
      personTags: "",
      modelCode: "",
      computeStrategyType: ""
    },
    rules: {
      threshold: { required: true, message: "请输入正确的阈值" },
      top: [
        { required: true, message: "人数不能为空" },
        { type: "number", min: 1, message: "人数不能小于1人" }
      ],
      personTags: { required: true, message: "请选择类型" }
    },

    original: false,
    pictureFormat: null,
    croppa: {},

    listData: [],
    modelOptions: []
  }),
  created() {
    this.init();
    this.$store.dispatch("commonData/getFaceLibraryData");
  },
  computed: {
    ...mapState({
      faceLibraryData: state => state.commonData.faceLibraryData
    })
  },
  methods: {
    init() {
      getTagList().then(res => {
        this.form.personTags = res.data.map(item => item.num);
      });
      getModelMenu().then(res => {
        this.modelOptions = res.data;
      });
    },
    onSubmit() {
      if (!this.croppa.img && !this.form.keyword.toString().length) {
        this.$notify({
          title: "提示",
          message: "图片或关键字必须填写",
          type: "warning",
          duration: 2000
        });
        return;
      }

      // 判断图片是否使用原图上传
      if (this.original) {
        this.form.imgBase64 = this.croppa.img ? this.croppa.img.src : null;
      } else {
        this.form.imgBase64 = this.croppa.img
          ? this.croppa.generateDataUrl(this.pictureFormat)
          : null;
      }

      this.$refs.form.validate(valid => {
        if (!valid) return false;

        let _form = Object.assign({}, this.form);
        _form.imgBase64 =
          _form.imgBase64 &&
          _form.imgBase64.substr(_form.imgBase64.indexOf(",") + 1);
        if (_form.modelCode != "") {
          delete _form.computeStrategyType;
        }

        postRouteSearch(_form).then(res => {
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
          if (res.data.length < 1) {
            this.$notify({
              title: "提示",
              message: "抱歉，没能找到匹配的人员",
              type: "warning",
              duration: 2000
            });
            return;
          }

          this.listData = res.data;
        });
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.app-container {
  position: relative;
  display: flex;
  height: 100%;
  .left-box {
    background: #fafbfd;
    width: 280px;
    padding: 25px 10px;
    overflow: auto;
    border-right: 1px #e5e5e5 solid;
    .slider-box {
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
  .right-box {
    flex: 1;
    .title {
      background: #f2f2f2;
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
    }
    .img-list {
      position: relative;
      height: calc(100% - 28px);
      padding-bottom: 10px;
      overflow: auto;
      .col1 {
        font-weight: bold;
        color: #0fa0ff;
      }
      .item {
        position: relative;
        float: left;
        margin: 10px 115px 0 10px;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        border: 1px solid rgba(0, 0, 0, 0.1);
        &.ban-more {
          margin-right: 0;
          .more {
            display: none;
          }
        }
        label {
          font-size: 12px;
          color: #9da5af;
        }
        .more {
          position: absolute;
          top: 5px;
          right: -115px;
          background: #fff;
          width: 120px;
          line-height: 160%;
          padding: 10px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
          border-radius: 6px;
          font-size: 12px;
          color: #333;
          z-index: 99;
        }
        .pic {
          position: relative;
          width: 160px;
          height: 160px;
          overflow: hidden;
          border-radius: 6px 6px 0 0;
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
      }
    }
    .label-list {
      position: absolute;
      top: 0;
      left: 0;
      padding-left: 2px;
      .top-label {
        position: relative;
        float: left;
        line-height: 18px;
        margin-left: -6px;
        padding-right: 6px;
        overflow: hidden;
        font-size: 12px;
        span {
          display: block;
          padding: 0 2px 0 8px;
        }
        .icon {
          position: absolute;
          top: -9px;
          right: 0;
          width: 0;
          height: 0;
          float: left;
          border-left: 6px solid #fff;
          border-top: 9px solid transparent;
          border-bottom: 18px solid transparent;
          content: "";
        }
      }
    }
  }
}
</style>