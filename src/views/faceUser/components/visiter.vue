<template>
  <div class="visiter" v-loading="loading">
    <div class="flex">
      <div class="title">访客拜访分析
        <communities-select v-model="CharQuery.communityId" :value="CharQuery.communityId" :placeholder="placeholder" @change="visitInitChange"></communities-select></div>
      <div class="record"> <a @click="onVisitRecord">查看详细记录 ></a></div>
    </div>
    <div class="floatR total">
      <span v-if="CountData.statisCnt">拜访次数统计：{{CountData.statisCnt}} 次</span>
      <span v-if="CountData.statisCnted">受访次数统计：{{CountData.statisCnted}} 次</span>
    </div>
    <div v-if="CountData.statisCnt || CountData.statisCnted">
      <div class="flexInfo w100">
        <BarChart :id="this.BarChart" :CharData="CharData"></BarChart>
        <div class="flex" v-for="(items, index) of Top" :key="index">
          <div class="mr25">
            <div class="TopInfo">
              <h4 class="textCenter" v-if="index == 'Top1'">受访人TOP5</h4>
              <h4 class="textCenter" v-else>拜访人员TOP5</h4>
              <ul>
                <li v-for="(item, i) of items" :key="i">
                  <span>{{ i + 1 }}</span>
                  <span>
                    <img :src="item.identityImgPath" alt class="statisCntImg">
                  </span>
                  <span class="statisCnt">{{item.name}}</span>
                  <span class="statisCnt bold">{{item.statisCnt}} 次</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="none">暂无数据</div>
  </div>
</template>

<script>
import {
  getVisitInfo,
  getVisitInfoCont,
  getVisitInfoTop
} from "@/api/faceUser/visiter";

export default {
  props: {
    personId: null,
    show: Number,
    name: String
  },
  components: {
    BarChart: () => import("@/common/component/Charts/barChart")
  },
  data() {
    return {
      chart: null,
      BarChart: "BarChart",
      value: "",
      placeholder: "小区选择",
      CharData: {},
      CountData: {},
      CharQuery: {
        personId: this.personId,
        communityId: "",
        visitType: 0
      },
      Top: {},
      loading: false
    };
  },
  // watch: {
  //   show: "visitInit"
  // },
  created() {
    this.visitInit();
  },
  methods: {
    visitInit() {
      // if (this.show > 6 && this.show < 8) {
        this.query();
      // }
    },
    visitInitChange() {
      this.$nextTick(() => {
        this.query();
      });
    },
    query() {
      var _ChartData;
      this.loading = true;
      getVisitInfo(this.CharQuery).then(res => {
        this.loading = false;
        if(res.status === 200) {
          _ChartData = res.data;
          this.CharQuery.visitType = 1;
          this.$nextTick(() => {
            getVisitInfo(this.CharQuery).then(res => {
              this.$set(_ChartData, "statisDatased", res.data.statisDatas);
              this.CharData = _ChartData;
              this.CharQuery.visitType = 0;
            });
          });
        }else {
          this.loading = false;
          this.$notify({
            title: "提示",
            message: "访客加载失败，请刷新",
            type: "warning",
            duration: 2000
          });
        }
      });

      var _CountData;
      getVisitInfoCont(this.CharQuery).then(res => {
        this.loading = false;
        _CountData = res.data;
        this.CharQuery.visitType = 1;
        this.$nextTick(() => {
          getVisitInfoCont(this.CharQuery).then(res => {
            this.$set(_CountData, "statisCnted", res.data.statisCnt);
            this.CountData = _CountData;
            this.CharQuery.visitType = 0;
          });
        });
      });

      var visitTop = this.CharQuery,
      visitTopData = { Top1: [], Top2: [] };
      this.$set(visitTop, "top", 5);
      this.$nextTick(() => {
        getVisitInfoTop(visitTop).then(res => {
          visitTopData.Top1 = res.data;
          visitTop.visitType = 1;
          this.$nextTick(() => {
            getVisitInfoTop(visitTop).then( res => {
              this.$set(visitTopData,'Top2', res.data)
                this.Top = visitTopData;
                this.CharQuery.visitType = 0
            })
          })
        })
      })
    },

    // 人行记录
    onVisitRecord() {
      this.$router.push({
        path: "/dataCenter/dataView/passRecord",
        query: {
          personId: this.personId,
          type: 'Visit'
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.visiter {
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
  .floatR {
    float: right;
    margin-right: 30px;
  }
  .total {
    color: #666666;
    font-size: 14px;
  }
  .none {
    height: 64vh;
    width: 100%;
    text-align: center;
    line-height: 64vh;
    font-size: 13px;
    color: #909399;
  }
  .flexInfo {
    display: flex;
    .mr25 {
      margin-right: 25px;
      width: max-content;
      .textCenter {
        text-align: center;
      }
      .TopInfo {
        text-align: left;
        margin-top: 80px;
        line-height: 40px;
        color: #666;
        font-size: 16px;
        .statisCntImg {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          vertical-align: middle;
        }
        .statisCnt {
          font-size: 18px;
          color: #10a0ff;
        }
        .bold {
          font-size: 19px;
          font-weight: bold;
        }
      }
    }
    .w100 {
      width: 100%;
    }
  }
}
</style>