<template>
  <div class="faceTogether" v-loading="loading">
    <div class="flex">
      <div class="title">人脸同行分析
        <communities-select
          v-model="CharQuery.communityId"
          :value="CharQuery.communityId"
          :placeholder="placeholder"
          @change="TogetherInitChange"
        ></communities-select>
      </div>
      <div class="record">
        <a @click="isLabelDialog=true">查看详细记录 ></a>
      </div>
    </div>
    <div class="flex">
      <div>
        <FaceInfoPlace
          :id="this.FaceTogetherPlace"
          :CharData="CharData"
          v-if="isCharData"
          :name="'同行地点分布'"
        ></FaceInfoPlace>
        <div v-else class="none">暂无数据</div>
      </div>
      <div>
        <FaceInfoPlace
          :id="this.FaceTogetherTime"
          :CharData="CharData_"
          v-if="isCharData_"
          :name="'同行时间分布'"
        ></FaceInfoPlace>
        <div v-else class="none">暂无数据</div>
      </div>
      <div class="TopInfo" v-if="Top.length > 0">
        <h4 style="color: #666; fontSize: 16px">同行人员TOP5</h4>
        <ul>
          <li v-for="(item, index) in Top" :key="index">
            <span>{{index+1}}.</span>
            <span>
              <img-show width="48px" height="48px" txt="暂无头像" style="borderRadius: 50%" :img-src="item.personId"></img-show>
            </span>
            <span class="name">{{item.personName}}</span>
            <span class="statisCnt bold">{{item.count}}</span>
            <em class="bold">次</em>
          </li>
        </ul>
      </div>
    </div>
    <TogetherRecord :is-open.sync="isLabelDialog" :id="personId"></TogetherRecord>
  </div>
</template>

<script>
import {
  getTogetherCommunityInfo,
  getTogetherTime,
  getTogetherTop
} from "@/api/faceUser/faceTogether";
import { getPersonImg } from "@/api/common";

export default {
  name: "faceTogether",
  components: {
    FaceInfoPlace: () => import("@/common/component/Charts/pieChart"),
    TogetherRecord: () => import("@/components/Together/TogetherRecord")
  },
  props: {
    personId: null,
    show: Number
  },
  data() {
    return {
      chart: null,
      FaceTogetherPlace: "FaceTogetherPlace",
      FaceTogetherTime: "FaceTogetherTime",
      placeholder: "小区选择",
      isCharData: Boolean,
      isCharData_: Boolean,
      isLabelDialog: false,
      CharData: [],
      CharData_: [],
      Top: {},
      CharQuery: {
        personId: this.personId,
        communityId: ""
      },
      loading: false
    };
  },
  created() {
    this.query()
  },
  // watch: {
  //   show: "TogetherInit"
  // },
  methods: {
    // TogetherInit() {
    //   // if (this.show > 4 && this.show < 6) {
    //     this.query();
    //   // }
    // },

    TogetherInitChange() {
      this.$nextTick(() => {
        this.query();
      });
    },

    query() {
      this.loading = true;
      getTogetherCommunityInfo(this.CharQuery).then(res => {
        this.loading = false
        if (res.data.length === 0) {
          this.isCharData = false;
          this.CharData = [];
        } else {
          this.isCharData = true;
          this.CharData = res.data;
        }
      });

      getTogetherTime(this.CharQuery).then(res => {
        this.loading = false
        if (res.data.length === 0) {
          this.isCharData_ = false;
          this.CharData_ = [];
        } else {
          this.isCharData_ = true;
          this.CharData_ = res.data;
        }
      });

      var CharQuery_ = this.CharQuery;

      this.$set(CharQuery_, "top", 5);
      this.$nextTick(() => {
        getTogetherTop(CharQuery_).then(res => {
          this.Top = res.data;
        });
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.faceTogether {
  margin-top: 20px;
  border-bottom: 1px solid #dddddd;
  background: #E9F0F4;
  .title{
    &::before{
      position: absolute;
      top: 57%;
      left: 17px;
      background: #0fa0ff;
      width: 4px;
      height: 19px;
      margin-top: -8px;
      content: "";
    }
    position: relative;
    font-weight: bold;
    font-size: 18px;
    margin-bottom: 20px;
    padding-left: 27px;
    padding-top: 11px;
  }
  .record {
    float: right;
    font-weight: bold;
    font-size: 18px;
    padding-right: 27px;
    padding-top: 20px;
    color: #10A0FF;
  }
  .flex {
    display: flex;
    justify-content: space-between;
  }
  .TopInfo {
    text-align: left;
    margin-top: -15px;
    line-height: 55px;
    color: #666;
    font-size: 16px;
    margin-right: 80px;
    ul {
      width: 10vw;
    }
    li {
      position: relative;
      display: flex;
      width: 100%;
      .img-show {
        border-radius: 4px;
        overflow: hidden;
        margin: 0 5px;
      }
      .name {
        display: inline-block;
        width: 45%;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      em {
        position: absolute;
        right: 0px;
        color: #c0c0c0;
        // font-size: 16px;
        font-style: inherit;
      }
    }
    .statisCnt {
      font-size: 19px;
      color: #10a0ff;
      position: absolute;
      right: 18px;
      margin-right: 3px;
    }
  }
  .none {
    width: 500px;
    height: 700px;
    text-align: center;
    line-height: 400px;
    color: #909399;
    font-size: 14px;
  }
  .bold {
    font-size: 20px;
    font-weight: bold;
    color: #10A0FF !important;
  }
}
</style>