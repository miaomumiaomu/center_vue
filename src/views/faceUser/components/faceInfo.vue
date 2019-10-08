<template>
  <div class="faceInfo">
    <div class="title">基础信息</div>
    <!-- <el-form label-position="left" inline class="demo-table-expand"> -->
    <div class="info">
      <div class="flex">
        <div class="flex w542">
          <div class="w49">姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名</div>
          <span>{{infoData.name}}</span>
        </div>
        <div class="flex  w542">
          <div class="w81">证&nbsp;&nbsp;件&nbsp;&nbsp;号</div>
          <span>{{infoData.identityNo}}</span>
        </div>
      </div>
      <div class="flex">
        <div class="flex w542">
          <div class="w49">性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别</div>
          <span>{{infoData.sex | commonFilter('comm_sex')}}</span>
        </div>
        <div class="flex  w542">
          <div class="w81">手&nbsp;&nbsp;机&nbsp;&nbsp;号</div>
          <span>{{infoData.mobile ? infoData.mobile : '未知'}}</span>
        </div>
      </div>
      <div class="flex">
        <div class="flex w542">
          <div class="w49">民&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;族</div>
          <span>{{infoData.nation | commonFilter('comm_nation')}}</span>
        </div>
        <div class="flex w542">
          <div class="w81">籍&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;贯</div>
          <span>{{infoData.nativePlace ? infoData.nativePlace : '未知'}}</span>
        </div>
      </div>
      <div class="flex">
        <div class="flex w542">
          <div class="w49">生&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日</div>
          <span>{{infoData.birthday ? infoData.birthday.substring(0,10) : '未知'}}</span>
        </div>
        <div class="flex w542">
          <div class="w81">证件地址</div>
          <span>{{infoData.address ? infoData.address : '未知'}}</span>
        </div>
      </div>
      <div class="flex">
        <div class="flex w542">
          <div class="w49">人&nbsp;像&nbsp;照</div>
          <div class="flex w464">
            <span v-for="(item,index) of infoData.images" :key="index" class="pic">
              <img-show height="60px" txt="暂无头像" :img-src="item.imgPath">
                <div class="mask" v-if="item.time">{{item.time}}</div>
              </img-show>
            </span>
          </div>
        </div>
        <div class="flex">
          <div class="w81">类&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;型</div>
          <face-category-list
            style="display: flex;"
            :data="faceLibraryData"
            :type="2"
            :chosen="infoData.personTags?infoData.personTags.split(','):[]"
          />
        </div>
      </div>
      <div class="flex mt20 w542">
        <div class="w49">备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注</div>
        <span>{{infoData.remark}}</span>
      </div>
    </div>
    <!-- </el-form> -->
  </div>
</template>
<script>
// import { getLibrary } from "@/utils";
import { mapState } from "vuex";

export default {
  name: 'faceInfo',
  props: {
    infoData: {},
  },
  data() {
    return {
      library: null
    };
  },
  computed: {
    ...mapState({
      faceLibraryData: state => state.commonData.faceLibraryData
    })
  },
  created() {
    this.$store.dispatch("commonData/getFaceLibraryData");
  },
};
</script>
<style lang="scss" scoped>
.faceInfo {
  background: #e9f0f4;
  padding-left: 27px;
  padding-top: 11px;
  // height: 100%;
  .title {
    &::before{
      position: absolute;
      top: 45%;
      left: -10px;
      background: #0fa0ff;
      width: 4px;
      height: 18px;
      margin-top: -8px;
      content: "";
    }
    position: relative;
    font-weight: bold;
    font-size: 18px;
    
  }
  .info {
    margin-top: 15px;
  }
  .w542 {
    min-width: 542px;
    span {
      font-size: 16px;
      color: #333;
    }
  }
  .w49 {
    width: 49px;
    display: flex;
    margin-right: 29px;
    margin-bottom: 16px;
    color: #999;
    font-size: 16px;
  }
  .w81 {
    width: 81px;
    display: flex;
    color: #999;
    margin-right: 29px;
    margin-bottom: 16px;
  }
  .flex {
    display: flex;
  }
  .w464 {
    width: 464px;
    overflow: scroll;
  }
  .pic {
    margin-right: 11px;
  }
  .mt20 {
    margin-top: 20px;
  }
}
</style>