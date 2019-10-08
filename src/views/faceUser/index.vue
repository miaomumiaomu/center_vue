<template>
  <div class="app-container">
    <div class="UserInfo">
      <!-- 上层图片 -->
      <div class="top">
        <img v-if="InfoData.images" :src="InfoData.images[nomal].imgPath" class="Infoimg">
        <img v-else src="~@/assets/noimage.jpg" class="Infoimg">
      </div>
      <!-- 中层图片 -->
      <div class="middle">
        <!-- 左切图 -->
        <div @click="leftChange"><img src="~@/assets/to-left.png" class="changeImg"></div>
        <div class="imgs">
          <div class="imgs_">
            <img v-for="(item, index) in InfoData.images" :key="index" :src="item.imgPath" alt="" :class="index === nomal ? 'active_': ''" @click="imgShow(item, index)">
          </div>
        </div>
        <!-- 右切图 -->
        <div @click="rightChange"><img src="~@/assets/to-right.png" class="changeImg"></div>
      </div>
      <!-- 信息层 -->
      <div class="Infos">
        <table>
          <thead></thead>
          <tbody>
            <tr>
              <td class="info-name" :title="InfoData.name">姓名：{{InfoData.name}}</td>
              <td>类型：
                <face-category-list style="display:inline;vertical-align: super;" :data="faceLibraryData" :type="0" :chosen="InfoData.personTags?InfoData.personTags.split(','):[]" />
              </td>
            </tr>
            <tr>
              <td>性别：{{InfoData.sex | commonFilter('comm_sex')}}</td>
              <td>年龄：{{InfoData.age}}岁</td>
            </tr>
            <tr>
              <td>民族：{{InfoData.nation | commonFilter('comm_nation')}}</td>
              <td>籍贯：{{InfoData.nativePlace ? InfoData.nativePlace : '未知'}}</td>
            </tr>
            <tr>
              <td colspan="2">身份证号：{{InfoData.identityNo}}</td>
            </tr>
            <tr>
              <td colspan="2">手机号：{{InfoData.mobile}}</td>
            </tr>
            <tr>
              <td colspan="2">
                <div class="address">
                  <div>证件地址：</div>
                  <div>{{InfoData.address}}</div>
                </div>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <div class="houseInfo">
                  <div>居住信息：</div>
                  <div @click="faceAddressOpen">
                    <div v-for="(item, index) in HouseData" :key="index">{{item.houseFullName}}</div>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <div class="remark">
                  <div>备注：</div>
                  <div style="word-break: break-all">{{InfoData.remark}}</div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="bottom">
          <el-button class="togetherBtn" size="mini" @click="onPictureDialog(InfoData.images[0].imgPath, 'togetherAnalysis', true)">同行分析</el-button>
          <el-button class="togetherBtn" size="mini" @click="onPictureDialog(InfoData.images[0].imgPath, 'faceTrackAnalysis', false)">轨迹分析</el-button>
          <el-button class="togetherBtn" size="mini" @click="onPictureDialog(InfoData.images[0].imgPath, 'foothold', false)">落脚点分析</el-button>
        </div>
      </div>
    </div>
    <div class="User-contain">
      <div class="infoSwich">
        <el-button-group class="switch">
          <el-button :type="mode===0?'primary':'info'" @click="mode=0" size="mini">
            <svg-icon icon-class="category"/>
            <span class="text">综合信息</span>
          </el-button>
          <el-button :type="mode===1?'primary':'info'" @click="mode=1" size="mini">
            <svg-icon icon-class="images"/>
            <span class="text">关系链</span>
          </el-button>
        </el-button-group>
      </div>
      <div v-if="mode === 0" class="tab-bar">
        <el-tabs v-model="activeName">
          <el-tab-pane label="活动情况" name="first">
            <activity-situation :personId="personId"></activity-situation>
          </el-tab-pane>

          <el-tab-pane label="人行记录分析" name="second">
            <!-- 抓拍信息 -->
            <FaceSnap id="FaceSnap" :personId="personId" :name="InfoData.name" />
          </el-tab-pane>

          <el-tab-pane label="同行记录分析" name="third" >
            <!-- 同行 -->
            <FaceTogether id="FaceTogether" :personId="personId"/>
          </el-tab-pane>
          <el-tab-pane label="门禁通行分析" name="fourth">
            <!-- 通行 -->
            <DoorPass id="DoorPass" :personId="personId" />
          </el-tab-pane>
          <el-tab-pane label="访客拜访分析" name="fifth">
            <!-- 访客 -->
            <Visiter id="Visiter" :personId="personId" />
          </el-tab-pane>
        </el-tabs>
      </div>
      <div v-else-if="mode === 1" class="relation">
        <Relation :personId="personId"></Relation>
      </div>
    </div>
    <!-- 以图搜图 - 弹窗 -->
    <picture-layer :is-open.sync="isPictureDialog" :data="trackAnalysis" :single="single" :jumpData="jumpData" />

    <face-address ref="faceAddress" :houseData="HouseData"></face-address>
  </div>
</template>

<script>
import { getPersonInfo } from "@/api/faceUser/faceInfo";
import { getHouseInfo } from "@/api/faceUser/faceAdress";
import { getCommunitiesList } from "@/api/faceLibrary";
import { mapState } from "vuex";

export default {
  components: {
    FaceInfo: () => import("./components/faceInfo"),
    FaceAdress: () => import("./components/faceAdress"),
    FaceSnap: () => import("./components/faceSnap"),
    FaceTogether: () => import("./components/faceTogether"),
    DoorPass: () => import("./components/doorPass"),
    Visiter: () => import("./components/visiter"),
    Relation: () => import("./components/relation"),
    ActivitySituation: () => import('./components/activitySituation'),
    FaceAddress: () => import('./components/faceAdress')
  },
  data() {
    return {
      isPictureDialog: false,
      trackAnalysis: null,
      single: false,
      jumpData: {
        jump: false,
        jumpUrl: String
      },

      mode: 0,
      currentDate: new Date(),
      active: 0,
      show: 7,
      personId: null,
      InfoData: {}, //人员信息
      HouseData: [], //居住信息
      loading1: false,
      loading2: false,
      
      //左右切图
      nomal: 0,
      activeName: 'first', //导航切换
    };
  },
  watch: {
    $route() {
      if (window.location.hash.split("?")[1] && !this.personId != window.location.hash.split("?")[1].split("=")[1]) {
        window.localStorage.setItem("personId", window.location.hash.split("?")[1].split("=")[1]);
        this.$nextTick(() => {
          window.location.reload();
        });
      }
    }
  },
  computed: {
    ...mapState({
      faceLibraryData: state => state.commonData.faceLibraryData
    })
  },
  created() {
    this.personId = this.$route.query.queryId
      ? this.$route.query.queryId
      : window.localStorage.getItem("personId");
    this.$route.query.queryId &&
      window.localStorage.setItem("personId", this.$route.query.queryId);
    this.init();
    this.$store.dispatch("commonData/getFaceLibraryData");
  },
  methods: {
    init() {
      getPersonInfo(this.personId).then(res => {
        this.loading1 = true;
        if (res.status === 200) {
          this.loading1 = false;
          this.InfoData = res.data;
        }
        this.loading1 = false;
      });
      getHouseInfo(this.personId).then(res => {
        this.loading2 = true
        if (res.status === 200) {
          this.loading2 = false
          this.HouseData = res.data;
        }
        this.loading2 = false
      });
    },

    /*图片切换*/
    // 左切图
    leftChange() {
      let length = this.InfoData.images.length
      this.nomal -= 1;
      if (this.nomal < 0) {
        this.nomal = length - 1
      }
      // images[0].style.left = - this.nomal * 42 + "px" 
    },
  
    // 右切图
    rightChange() {
      let length = this.InfoData.images.length
      this.nomal += 1;
      if (this.nomal >= length) {
        this.nomal = 0
      }
    },

    imgShow(val, index) {
      this.nomal = index
    },
    /*图片切换*/
    //轨迹分析
    onPictureDialog(url, strUrl, boolean) {
      this.trackAnalysis = {
        keyword: "",
        imgBase64: url,
        threshold: 0.6,
        top: 10,
        personTags: null
      };
      this.jumpData = {
        jump: true,
        jumpUrl: strUrl
      };
      this.single = boolean;
      this.isPictureDialog = true;
    },
    faceAddressOpen() {
      this.$refs.faceAddress.open()
    }
  }
};
</script>
<style lang="scss" scoped>
.app-container {
  height: 100%;
  display: flex;
  padding: 15px;
  .UserInfo {
    background: #f2f2f2;
    width: 350px;
    margin-right: 15px;
    padding: 10px;
    .top {
      text-align: center;
      .Infoimg {
        width: 230px;
        height: 170px;
      }
    }
    .middle {
      width: 100%;
      height: 40px;
      display: flex;
      overflow: hidden;
      .changeImg {
        cursor: pointer;
        width: 30px;
        height: 30px;
        margin-top: 5px;
      }
      .imgs {
        width: 90%;
        height: 100%;
        overflow: hidden;
        position: relative;
        .active_ {
          border: 1px solid red;
        }
        .imgs_ {
          position: absolute;
          transition: all .5s linear;
          left: 0;
          img {
            width: 40px;
            height: 40px;
            margin: 0 5px 0 5px;
            cursor: pointer;
          }
        }
      }
    }
    .Infos {
      table {
        width: 100%;
        font-size: 14px;
        table-layout: fixed;
      }
      .info-name{
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      table > tbody > tr {
        height: 30px;
        margin-top: 5px;
        .address {
          display: flex;
          margin: 10px 0 10px 0;
          div:first-child {
            white-space: nowrap;
          }
        }
        .houseInfo {
          & > div:first-child {
            white-space: nowrap;
          }
          & > div:last-child {
            color: #0000FF;
            text-decoration: underline;
          }
          display: flex;
          margin: 10px 0 10px 0;
        }
        .remark{
          display: flex;
          margin: 10px 0;
          & > div:first-child {
            white-space: nowrap;
          }
        }
      }
      .bottom{
        margin-top: 10px;
      }
    }
  }
  .User-contain {
    background: #f2f2f2;
    width: 100%;
    padding: 0 15px;
    position: relative;
    .infoSwich {
      position: absolute;
      top: 7px;
      right: 15px;
      z-index: 999;
    }
    .tab-bar{
      height: 100%;
      /deep/{
        .el-tabs--top {
          height: 100%;
          display: flex;
          flex-direction: column;
          .el-tabs__content{
            flex: 1;
            .el-tab-pane{
              height: 100%;
            }
          }
        }
      }
    }
    .relation {
      height: 100%;
    }
  }
}
</style>
