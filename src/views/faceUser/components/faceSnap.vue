<template>
  <div class="faceSnap" v-loading="loading">
    <div class="flex">
      <div class="title">人行记录分析
        <communities-select
          v-model="CharQuery.communityId"
          :value="CharQuery.communityId"
          :placeholder="placeholder"
          @change="SnapInitChange"
          clearable
        ></communities-select>
      </div>
      <div class="record">
        <a @click="onPassRecord">查看详细记录 ></a>
      </div>
    </div>
    <div class="flex mr30">
      <div></div>
      <div class="total" v-if="isCount">首次抓拍：{{CountData.firstSnapTime}} 抓拍统计：{{CountData.snapCnt}}</div>
    </div>
    <div id="ChartWidth" class="echart"  v-if="isCharTableData">
      <FaceInfoTime :id="FaceSnapTime" :CharTableData="CharTableData" width="1000px"></FaceInfoTime>
    </div>
    <div v-else class="none">暂无数据</div>
  </div>
</template>

<script>
import { getPersonSnap, getPersonSnapCount } from "@/api/faceUser/faceSnap";

export default {
  components: {
    FaceInfoTime: () => import("@/common/component/Charts/PunchChart")
  },
  props: {
    personId: null,
    // show: Number,
    name: String
  },
  data() {
    return {
      chart: null,
      FaceSnapPlace: "FaceSnapPlace",
      FaceSnapTime: "FaceSnapTime",
      placeholder: "小区选择",
      CharTableData: {},
      isCharTableData: Boolean, //是否有数据
      CountData: {},
      isCount: Boolean, //是否有统计数据
      CharQuery: {
        personId: this.personId,
        communityId: ""
      },
      loading: false,
    };
  },
  created() {
    this.SnapInit();
  },
  // watch: {
  //   show: "SnapInit"
  // },
  methods: {
    SnapInit() {
      // if (this.show > 3 && this.show < 5) {
        this.query();
      // }
    },
    SnapInitChange() {
      this.$nextTick(() => {
        this.query();
      });
    },
    query() {
      this.loading = true;
      getPersonSnap(this.CharQuery).then(res => {
        this.loading = false;
        if (res.data.hours) {
          this.isCharTableData = true;
          let Name = [],
            Time = [],
            Count = [];
          res.data.hours.forEach(element => {
            Time.push(element+"点");
          });
          res.data.analysisItems.forEach((element, index) => {
            Name.push(element.name);
            element.statisDatas.forEach((item, ind) => {
              Count.push([ind, index, item]);
            });
          });
          this.CharTableData = { Name, Time, Count };
        } else {
          this.isCharTableData = false;
        }
      });

      getPersonSnapCount(this.CharQuery).then(res => {
        if (res.data.firstSnapTime) {
          this.isCount = true;
          this.CountData = res.data;
        } else {
          this.isCount = false;
          this.CountData = null;
        }
      });
    },
    // 人行记录
    onPassRecord() {
      this.$router.push({
        path: "dataCenter/dataView/passRecord",
        query: {
          personId:this.personId,
          type: 'Face'
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.faceSnap {
  background: #E9F0F4;
  margin-top: 20px;
  border-bottom: 1px solid #dddddd;
  width: 100%;
  .title{
      &::before{
        position: absolute;
        top: 57%;
        left: 18px;
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
  .mr30 {
    margin-right: 30px;
    .total {
      color: #666666;
      font-size: 14px;
    }
  }
  .none {
    height: 700px;
    width: 100%;
    text-align: center;
    line-height: 400px;
    font-size: 13px;
    color: #909399;
  }
}
</style>