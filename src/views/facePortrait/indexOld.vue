<template>
  <div class="app-container">
    <!-- 工具栏 -->
    <div class="headImage" id="headImage">
      <div  class="titileImage">
        <img src="~@/assets/home.png" id="titImg" alt="">
      </div>  
      <div class="search" id="search">
        <el-input placeholder="姓名/证件号" v-model="listQuery.keyword" class="input-with-select" @keyup.enter.native="onSearch" />
        <span class="inCarema">
          <div class="prepend" v-show="image">  
            <img :src="image">
            <div class="close" @click="onEmpty">
              <i class="el-icon-close"></i>
            </div>
          </div>
          <el-upload class="upload" action="" accept=".jpeg,.jpg,.png,.bmp" :auto-upload="false" :show-file-list="false" :on-change="onUpload">
            <i class="el-icon-picture"></i>
          </el-upload>
          <el-button icon="el-icon-search" type="primary" class="serBtn" @click="onSearch">查询</el-button>
        </span>
        <el-checkbox v-model="IsoverviewDisabled" class="serchCheckBox">高级搜索</el-checkbox>
      </div>
      <el-form v-show="this.IsoverviewDisabled" ref="listQuery" :model="listQuery" class="heightSearch" id="heightSearch">
        <el-form-item prop="threshold">
          <div class="threshold">
            <span>阈　值</span>
            <el-slider v-model="listQuery.threshold" :step="0.01" :min="0.35" :max="1" :format-tooltip="val => parseInt(val*100)+'%'" :disabled="image ? false : true"></el-slider>
          </div>
        </el-form-item>
        <el-form-item prop="top" :rules="[{ type: 'number', min: 1, message: '人数不能小于1人' }]">
          <div class="topN">
            <span>TOP&nbsp;N</span>
            <el-input v-model.number="listQuery.top" style="width: 10.4vw" placeholder="匹配到的人数"  :disabled='image ? false : true'></el-input>
          </div>
        </el-form-item>
        <el-form-item class="type" prop="personTags">
          <span>类型</span>
          <face-library-select v-model="listQuery.personTags" :filtrateNum="[2]" style="width: 10.4vw" placeholder="全部" multiple collapse-tags />
        </el-form-item>
      </el-form>
    </div>

    
    <!-- 表格模式 S -->
    <div class="card-bottom">
      <div class="flex" v-if="picUserData.data">
        <div class="searchRes" >搜索结果:{{picUserData.data.length}}</div>
        <div class="searchInfo">点击查看具体的人员信息</div>
      </div>
      <div class="card-list">
          <div
            class="item"
            v-for="(item, index) in picUserData.data"
            :key="index"
          >
            <router-link  :to="{path:'/dataCenter/application/super/faceUser', query:{queryId:item.personId}}">
              <div class="pic">
                <!-- <div class="lib"> -->
                  <!-- <dictionaries-select :dictionaries="item.libraryNums" :dictionariesDate="faceLibraryData" :isMany="true"></dictionaries-select> -->
                  <face-category-list
                    :data="faceLibraryData"
                    :type="1"
                    :chosen="item.personTags?item.personTags.split(','):[]"
                  />
                <!-- </div> -->
                <img :src="item.identityImgPath">
                <div class="mask" v-if="item.similarity">
                  <span>相似度：<span class="ext">{{item.similarity}}%</span></span></div>
              </div>
              <div class="box">
                <div class="txt">
                  <div>
                    <img src="~@/assets/IdName.png" alt="">
                    <b class="name">{{item.name}}</b>
                  </div>
                  <div class="LH20">
                    <b class="name name_info_sex">{{item.sex | commonFilter('comm_sex')}}</b>
                    <b class="name name_info_age">({{item.age}}岁)</b>
                  </div>
                </div>
                <div class="txt">
                  <img class="IdCardImg" src="~@/assets/IdCard.png" alt="">
                  <div class="IdCardNum"> {{item.identityNo}}</div>
                </div>  
              </div>
            </router-link>
          </div>
      </div>
    </div>
  </div>
</template>
<script>
import { singlePickerOptions, getBase64 } from "@/utils";
import { postImageSearch } from "@/api/common";
import { mapState } from "vuex";

export default {
  name: "homepage",
  data: () => ({
    //高级搜索 显示 隐藏
    IsoverviewDisabled: false,
    listQuery: {
      keyword: "", //关键字
      imgBase64: '', // 图片BASE64
      threshold: 0.6, //阀值
      top: 10,  //搜索结果条数
      personTags: null // 空默认全部
    },
    mode: 0,
    isPictureDialog: true,
    picUserData: {},
    image: '',
  }),
  watch: {
    IsoverviewDisabled: 'onResetForm'
  },
  computed: {
    ...mapState({
      faceLibraryData: state => state.commonData.faceLibraryData
    })
  },
  created() {
    this.$store.dispatch("commonData/getFaceLibraryData");
  },
  methods: {
    //查询
      onSearch() {
        this.$refs.listQuery.validate(valid => {
          if (!valid) return;
          let searchAni = document.getElementById("search");
          let TitImg = document.getElementById("titImg");
          let HS = document.getElementById("heightSearch");
          let headImage = document.getElementById("headImage");
          if(this.image) {
            this.listQuery.imgBase64 = this.image.split(',')[1]
          }
          postImageSearch(this.listQuery).then(res => {
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
            this.picUserData = {};
            // 动画
            searchAni.style.width = '60%';
            HS.style.width = '60%';
            HS.children[0].style.marginRight = '55px';
            HS.children[1].style.marginRight = '55px';
            HS.children[2].style.marginRight = '55px';
            headImage.style.marginTop = '80px';  
            TitImg.style.width = '410px';
            TitImg.style.height = '45px';
            return;
          }
          // 动画
          searchAni.style.width = '49%';
          HS.style.width = '49%';
          HS.children[0].style.marginRight = '11px';
          HS.children[1].style.marginRight = '11px';
          HS.children[2].style.marginRight = '11px';
          headImage.style.marginTop = 0;
          TitImg.style.width = 0;
          TitImg.style.height = 0;
          this.imgKey = new Date().getTime();
          this.picUserData = res.data;
        });
      })
    },
      //重置
      onResetForm() {
        if(!this.IsoverviewDisabled) {
          this.$refs.listQuery.resetFields();
        }
        
        // this.getTableList();
      },
      onUpload(file) {
      // 判断是否需要在图片变更的时候清空文本
      // if (this.emptyText) {
      //   this.value = "";
      // }
      let reader = new FileReader();
      reader.readAsDataURL(file.raw);
      reader.addEventListener("load", () => {
        this.image = reader.result;
      });
    },
    onEmpty() {
      this.image = "";
      this.listQuery.imgBase64 = "";
    },

    //   /* 分页处理 */
    onListPaging(val) {
      this.listQuery.pageNo = val;
      // this.listQuery.totalCount = this.listTableData.total;
      // this.getTableList();
    },
    onListLimit(val) {
      this.listQuery.pageSize = val;
      // this.listQuery.totalCount = this.listTableData.total;
      // this.getTableList();
    }
    //   /* 分页处理 */
  }
};
</script>

<style lang="scss" scoped>
.app-container {
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
  .headImage {
    margin-top: 80px;
    transition: all .5s linear;
    .titileImage {
      text-align: center;
      margin-bottom: 20px;
      #titImg {
        width: 410px;
        height: 45px;
        transition: all .5s linear;
      }
    }
    .search {
      margin: 0 auto;
      width: 60%;
      display: flex;
      position: relative;
      transition: all .5s linear;
      .serchCheckBox {
        line-height: 35px;
        margin-left: 10px;
      }
    }
  }

  .heightSearch {
    display: flex;
    border-radius: 10px;
    width: 60%;
    margin: 10px auto;
    top: 50px;
    transition: all .5s linear;
    .el-form-item {
      margin-bottom: 10px;
      @media only screen and (min-width: 992px) {
        margin-right: 0;
      }
      @media only screen and (min-width: 1376px) {
        margin-right: 1vw;
      }
      @media only screen and (min-width: 1920px) {
        margin-right: 2.5vw;
      }
    }
    .threshold {
      display: flex;
      span {
        margin-right: 5px;
      }
      .el-slider {
      width: 10.4vw;
      }
    }
  }
  .card-bottom{
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-top: 50px;
    border-bottom: 1px #eee solid;
    .flex {
      display: flex;
      justify-content: space-between;
      width: 58%;
      margin: 14px auto;
      .searchRes {
        color: #666;
        font-size: 18px;
      }
      .searchInfo {
        color: #999;
        font-size: 14px;
        margin-right: 35px;
      }
    }
  .card-list {
    flex: 1;
    padding-bottom: 10px;
    overflow: auto;
    margin: 0 auto;
    width: 60%;
    .pic {
      position: relative;
      display: block;
      width: 220px;
      height: 198px;
      overflow: hidden;
      img {
        display: block;
        width: 100%;
        height: 100%;
      }
      .lib {
        position: absolute;
        padding: 4px 0px 0 6px;
        width: 36px;
        height: 25px;
        color: #fff;
        font-size: 14px;
        background: linear-gradient(-63deg, transparent 15px, #10A0FF 0);
        text-align: left;
      }
    }
    .mask {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.4);
      line-height: 18px;
      padding: 0 4px;
      font-size: 12px;
      color: #fff;
      text-align: center;
      span {
        font-size: 14px;
        .ext {
        font-weight: bold;
        color: #ffc600;
        }
      }
    }
    .item {
      float: left;
      margin: 10px 0 0 16px;
      overflow: hidden;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      border: 1px solid transparent;
      &.sel {
        border-color: #0fa0ff;
      }
      b {
        font-size: 14px;
        color: #333;
      }
      label {
        font-size: 12px;
        color: #9da5af;
      }
      .box {
        width: 180px;
        margin: 19px 0 16px 21px;
        .txt {
          display: flex;
          height: 18px;
          line-height: 18px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-bottom: 4px;
          img {
            width: 13px;
            height: 14px;
            margin-right: 6px;
          }
          .IdCardImg {
            width: 15px;
            height: 12px;
            margin-top: 3px;
          }
          .IdCardNum {
            font-size: 14px;
            color: #666;
          }
          .name {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 18px;
          }
          .name_info_sex {
            font-size: 12px;
            color: #666666;
            margin-left: 3px;
          }
          .name_info_age {
            color: #666666;
            font-size: 12px;
          }
        }
      }
      .svg-icon {
        display: inline-block;
        height: 100%;
        margin-right: 4px;
        vertical-align: top;
        color: #b5c0cd;
      }
      .btns {
        display: flex;
        margin-top: 4px;
        .el-button {
          flex: 1;
          margin-left: 0;
        }
      }
      .el-checkbox {
        float: right;
        margin-left: 4px;
        pointer-events: none;
      }
    }
  }
  }
  .inCarema {
    position: relative;
    z-index: 100;
    .upload{
      position: absolute;
      right: 110%;
      top: 27%
    }
  }
  .serBtn {
    margin-left: 5px;
  }
  .prepend,
  .append {
    position: absolute;
    top: 10%;
    z-index: 9;
  }
  .append {
    right: 6px;
    cursor: pointer;
    i {
      display: inline-block;
      vertical-align: top;
      color: #878c8f;
    }
  }
  .prepend {
    right: 140%;
    background: #fafbfd;
    overflow: hidden;
    border: 1px solid #e1e4e6;
    img {
      float: left;
      width: 1.7em;
      height: 1.7em;
    }
    .close {
      height: 1em;
      margin-left: 1.7em;
      cursor: pointer;
      i {
        position: relative;
        top: 50%;
        display: inline-block;
        vertical-align: top;
        font-size: 14px;
        color: #878c8f;
        transform: translateY(-50%);
      }
    }
  }
  .LH20 {
    line-height: 21px;
  }
  .topN {
    display: flex;
    span {
      margin-right: 3px;
    }
  }
  // .none {
  //   text-align: center;
  // }
}
</style>