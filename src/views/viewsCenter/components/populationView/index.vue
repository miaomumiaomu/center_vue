<template>
  <div class="tab-container">
    <div class="row" :style="{ marginBottom: '10px' }">
      <div class="col" :style="{ width: '20%' }">
        <div class="top-panel">
          <div class="statistics-panel">
            <div class="statistics-item">
              <img src="@/assets/views-center/people.png" alt="统计人口">
              <div>
                <p>实有人口</p>
                <strong>{{total}}</strong>
              </div>
            </div>
            <div class="statistics-item">
              <img src="@/assets/views-center/criminal-person.png" alt="统计人口">
              <div>
                <p>前科重点人员</p>
                <strong>{{focusPersonTotal}}</strong>
              </div>
            </div>
            <div class="statistics-item">
              <img src="@/assets/views-center/person.png" alt="统计人口">
              <div>
                <p>今日感知人脸</p>
                <strong>{{todaySnap}}</strong>
              </div>
            </div>
            <div class="statistics-item">
              <img src="@/assets/views-center/p-count.png" alt="统计人口">
              <div>
                <p>今日感知人数</p>
                <strong>{{todayFlow}}</strong>
              </div>
            </div>
          </div>
          <div class="top-panel num-panel">
            <div class="section">
              <div class="section-header" :style="{paddingTop: '6px'}">
                <div class="section-title">
                  <img src="@/assets/views-center/tag.png" alt="tag">
                  <span>前科重点人员分类</span>
                </div>
              </div>
              <div class="section-body">
                <ring-chart :data="personCategoryData" isClassify />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col" :style="{ width: '80%' }">
        <div class="row">
          <div class="col" :style="{ width: '42%' }">
            <div class="section line-panel" :style="{paddingTop: '6px'}">
              <div class="section-header">
                <div class="section-title">
                  <img src="@/assets/views-center/tag.png" alt="tag">
                  <span>感知数量分析</span>
                </div>
              </div>
              <div class="section-body">
                <line-area :data="lineData" :index="0" :classify="['已登记', '未登记']" />
              </div>
            </div>
          </div>
          <div class="col" :style="{ width: '33%' }">
            <div class="section line-panel" :style="{paddingTop: '6px'}">
              <div class="section-header">
                <div class="section-title">
                  <img src="@/assets/views-center/tag.png" alt="tag">
                  <span>迁入/迁出人口</span>
                </div>
              </div>
              <div class="section-body">
                <line-area :data="lineData2" :index="1" />
              </div>
            </div>
          </div>
          <div class="col" :style="{ width: '25%' }">
            <div class="section top-panel">
              <div class="section-header">
                <div class="section-title">
                  <img src="@/assets/views-center/tag.png" alt="tag">
                  <span>整日出入频次TOP10</span>
                </div>
                <div class="right-info">
                  <el-radio-group v-model="timeRange" size="small" @change="handlePersonTop10Change">
                    <el-radio-button :label="0">1天</el-radio-button>
                    <el-radio-button :label="1">7天</el-radio-button>
                    <el-radio-button :label="2">30天</el-radio-button>
                  </el-radio-group>
                </div>
              </div>
              <div class="section-body">
                <ul>
                  <li v-for="(item, index) in faceList" :key="item.id">
                    <div class="img-show" title="点击查看详情" :style="{ backgroundImage: `url(${item.identityImgUrl})`, cursor: 'pointer' }" @click="_onShowDetail(item.id)">
                      <div v-if="index < 2" class="top2"></div>
                      <div v-else class="bot"></div>
                      <span>{{index + 1}}</span>
                    </div>
                    <div class="right-sec">
                      <h4>
                        <span>{{item.name}}</span>
                        <template v-if="item.personTags">
                          <b v-for="(tagItem, index) in item.personTags.split(',')" :key="index" :style="{ backgroundColor: _onTagMatchColor(tagItem) }">{{_onTagMatchName(tagItem)}}</b>
                        </template>
                      </h4>
                      <p>{{item.identityNo}}</p>
                    </div>
                    <div :class="`top-right ${index < 2 ? 'top-2' : 'bottom-2'}`">
                      <span>{{item.count}}</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col" :style="{ width: '20%' }">
        <div class="section bottom-panel nation-panel">
          <div class="section-header">
            <div class="section-title">
              <img src="@/assets/views-center/tag.png" alt="tag">
              <span>籍贯分布</span>
            </div>
          </div>
          <div class="section-body">
            <china-map height="98%" :data="placeData" :total="total" />
            <div class="nation-table">
              <template v-for="(item, index) in placeData.slice(0, 10)">
                <div :key="index" class="table-row" :style="{ 'background': index % 2 === 0 ? 'rgba(33,44,71,0.4841)' : 'rgba(146,146,146,0.15)' }">
                  <div class="table-index">{{ index + 1 }}</div>
                  <div class="table-name">{{ item.name }}</div>
                  <div class="table-percent">
                    {{ (item.value/total * 100).toFixed(2) }}
                  </div>
                  <span style="transform: scale(0.7);">%</span>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
      <div class="col" :style="{ width: '20%' }">
        <div class="section bottom-panel">
          <div class="section-header">
            <div class="section-title">
              <img src="@/assets/views-center/tag.png" alt="tag">
              <span>今日热点设备分析</span>
            </div>
          </div>
          <div class="section-body">
            <bar-chart :data="hotDeviceData" :colorIndex="1" />
          </div>
        </div>
      </div>
      <div class="col" :style="{ width: '20%' }">
        <div class="section bottom-panel">
          <div class="section-header">
            <div class="section-title">
              <img src="@/assets/views-center/tag.png" alt="tag">
              <span>少数民族分布</span>
            </div>
          </div>
          <div class="section-body">
            <horizon-column :data="nativeData" color="#45ADED" />
          </div>
        </div>
      </div>
      <div class="col" :style="{ width: '20%' }">
        <div class="section bottom-panel">
          <div class="section-header">
            <div class="section-title">
              <img src="@/assets/views-center/tag.png" alt="tag">
              <span>年龄分布</span>
            </div>
          </div>
          <div class="section-body">
            <horizon-column :data="ageData" color="#428C8D" />
          </div>
        </div>
      </div>
      <div class="col" :style="{ width: '20%' }">
        <div class="section bottom-panel">
          <div class="section-header">
            <div class="section-title">
              <img src="@/assets/views-center/tag.png" alt="tag">
              <span>人口分布统计</span>
            </div>
          </div>
          <div class="section-body">
            <bar-chart :data="distributionData" :colorIndex="0" />
          </div>
        </div>
      </div>
    </div>
    <!-- 详情弹窗 -->
    <label-form :is-open.sync="isDetailsForm" :id="personId" isView/>
  </div>
</template>

<script>
import {
  getTotalData,
  getPersonSnap,
  getHouseMove,
  getPersonTop10,
  getPlaceTop,
  getNationSpread,
  getAgeSpread,
  getPersonCategory,
  getHotSnapDevice,
  getDistribution
} from "@/api/viewsCenter/population";
import { mapState } from "vuex";

export default {
  props: {
    areaType: {
      type: String,
      default: "1"
    },
    areaCode: {
      type: String,
      default: ""
    }
  },
  components: {
    LineArea: () => import("../LineArea"),
    ChinaMap: () => import("../ChinaMap"),
    HorizonColumn: () => import("../HorizonColumn"),
    RadarChart: () => import("../RadarChart"),
    RingChart: () => import("../RingChart"),
    BarChart: () => import("../BarChart"),
    LabelForm: () => import("@/components/FaceLabelForm")
  },
  data() {
    return {
      timeRange: 0,
      total: 0,
      focusPersonTotal: 0,
      todaySnap: 0,
      todayFlow: 0,
      lineData: {
        time: [],
        name: [],
        data: []
      },
      lineData2: {
        time: [],
        name: [],
        data: []
      },
      placeData: [],
      faceList: [],
      tableData: [],
      nativeData: [],
      ageData: [],
      personCategoryData: [],
      hotDeviceData: [],
      distributionData: [],
      personId: '',
      isDetailsForm: false
    };
  },
  mounted() {
    if (this.areaCode) {
      this.getData();
    }
    this.$store.dispatch("commonData/getFaceLibraryData");
  },
  watch: {
    areaCode(val) {
      this.$nextTick(() => {
        this.getData();
      });
    }
  },
  computed: {
    ...mapState({
      faceLibraryData: state => state.commonData.faceLibraryData
    })
  },
  methods: {
    getData() {
      this.fetchTotalData();
      this.fetchPersonSnap();
      this.fetchHouseMove();
      this.fetchPersonTop10();
      this.fetchPlaceTop();
      this.fetchNation();
      this.fetchAge();
      this.fetchPersonCategory();
      this.fetchHotSnapDevice();
      this.fetchDistribution();
    },
    handlePersonTimeChange() {
      this.fetchPersonSnap();
    },
    handlePersonTop10Change() {
      this.fetchPersonSnap();
      this.fetchHouseMove();
      this.fetchPersonTop10();
    },
    getCodeParam(params) {
      if (this.areaType == 1) {
        params.policeAreaCode = this.areaCode;
      } else if (this.areaType == 2) {
        params.communityCode = this.areaCode;
      }
    },
    // 获取统计面板数据
    fetchTotalData() {
      const totalParams = {};
      this.getCodeParam(totalParams);
      getTotalData(totalParams).then(res => {
        const { status, data } = res;
        if (status === 200) {
          this.total = data.total;
          this.focusPersonTotal = data.focusPersonTotal;
          this.todaySnap = data.todaySnap;
          this.todayFlow = data.todayFlow;
        }
      });
    },
    // 获取感知数量分析数据
    fetchPersonSnap() {
      const snapParams = { type: this.timeRange };
      this.getCodeParam(snapParams);
      getPersonSnap(snapParams).then(res => {
        const lineData = { time: [], name: ["感知人数统计", "感知人脸统计"], data: [] };
        if (res.status === 200) {
          const { flows = [], times = [] } = res.data || {};
          let data1 = [];
          let data2 = [];
          flows.forEach(item => {
            let timeTmp = item.name;
            // 格式化为期1天的时间节点
            if (this.timeRange == 0) {
              let splitArr = item.name.split('-');
              splitArr.length > 0 && (timeTmp = splitArr[1]);
            }
            lineData.time.push(timeTmp);
            data1.push({ value: item.value, addVal: item.addValue });
          });
          lineData.data.push(data1);
          times.forEach(item => {
            data2.push({ value: item.value, addVal: item.addValue });
          });
          lineData.data.push(data2);
        }
        this.lineData = lineData;
      });
    },
    // 获取迁入迁出人口数据
    fetchHouseMove() {
      const houseParams = { type: this.timeRange };
      this.getCodeParam(houseParams);
      getHouseMove(houseParams).then(res => {
        const lineData2 = { time: [], name: ["迁入", "迁出"], data: [] };
        if (res.status === 200) {
          const { houseMoveIn = [], houseMoveOut = [] } = res.data || {};
          let data1 = [];
          let data2 = [];
          houseMoveIn.forEach(item => {
            lineData2.time.push(item.name);
            data1.push(item.value);
          });
          lineData2.data.push(data1);
          houseMoveOut.forEach(item => {
            data2.push(item.value);
          });
          lineData2.data.push(data2);
        }
        this.lineData2 = lineData2;
      });
    },
    // 获取感知人脸频次排行榜
    fetchPersonTop10() {
      const top10Params = { type: this.timeRange };
      this.getCodeParam(top10Params);
      getPersonTop10(top10Params).then(res => {
        const { status, data } = res;
        if (status === 200) {
          this.faceList = data;
        }
      });
    },
    // 点击弹出详情
    _onShowDetail(id) {
      this.personId = id;
      this.isDetailsForm = true;
    },
    // 获取籍贯分布排行榜
    fetchPlaceTop() {
      const placeParams = {};
      this.getCodeParam(placeParams);
      getPlaceTop(placeParams).then(res => {
        const { status, data } = res;
        if (status === 200) {
          const result = data.map((item, index) => {
            item.index = index + 1;
            return item;
          });
          this.tableData = this.placeData = result;
        }
      });
    },
    // 获取民族分布统计
    fetchNation() {
      const nationParams = {};
      this.getCodeParam(nationParams);
      getNationSpread(nationParams).then(res => {
        let { status, data } = res;
        if (status === 200) {
          data.find((item, index, arr) => {
            if (item.name === '汉族') {
              data.splice(index, 1);
              return true;
            }
          });
          this.nativeData = data;
        }
      });
    },
    // 获取年龄分布
    fetchAge() {
      const ageParams = {};
      this.getCodeParam(ageParams);
      getAgeSpread(ageParams).then(res => {
        const { status, data } = res;
        if (status === 200) {
          this.ageData = data;
        }
      });
    },
    // 获取人员类型分布
    fetchPersonCategory() {
      const pcParams = {};
      this.getCodeParam(pcParams);
      getPersonCategory(pcParams).then(res => {
        const { status, data } = res;
        if (status === 200 && data) {
          const pData = data.filter(item => (item.value !== 0));
          this.personCategoryData = pData;
        }
      });
    },
    // 获取今日热点设备排行
    fetchHotSnapDevice() {
      const deviceParams = {};
      this.getCodeParam(deviceParams);
      getHotSnapDevice(deviceParams).then(res => {
        const { status, data } = res;
        if (status === 200) {
          this.hotDeviceData = data;
        }
      });
    },
    // 获取人口分布统计
    fetchDistribution() {
      const peopleParams = {};
      this.getCodeParam(peopleParams);
      getDistribution(peopleParams).then(res => {
        const { status, data } = res;
        if (status === 200) {
          this.distributionData = data;
        }
      });
    },
    _onTagMatchColor(tag) {
      const result = this.faceLibraryData[tag];
      return result ? result.color : '#164EAB';
    },
    _onTagMatchName(tag) {
      const result = this.faceLibraryData[tag];
      return result ? result.shortName : '未';
    }
  }
};
</script>

<style lang="scss" scoped>
.row {
  width: 100%;
  overflow: hidden;
  .col {
    float: left;
    box-sizing: border-box;
    padding: 0 5px;
  }
  > div:first-of-type {
    padding-left: 0;
  }
  > div:last-of-type {
    padding-right: 0;
  }
}
.statistics-panel {
  width: 100%;
  height: 12.6vw;
  padding: 0.42vw 1.04vw 0 1.04vw;
  background-color: #151D2D;
  margin-bottom: 4px;
  border-radius: 2px;
  overflow: hidden;
  .statistics-item {
    background-color: #1B2435;
    padding-top: .3vw;
    padding-bottom: .2vw;
    padding-left: 1.98vw;
    margin-bottom: 0.42vw;
    > img {
      height: 1.14vw;
      float: left;
      position: relative;
      top: 0.42vw;
      margin-right: 6vw;
    }
    > div {
      display: inline-block;
      p {
        font-size: 0.624vw;
        color: rgba(255, 255, 255, .58);
      }
      strong {
        font-size: 1.2vw;
        font-weight: normal;
        color: #fff;
      }
    }
  }
}
.section {
  background-color: #151D2D;
  border-radius: 2px;
  .section-header {
    padding: 16px 20px 0;
    overflow: hidden;
    .section-title {
      float: left;
      > img {
        width: 13px;
        vertical-align: middle;
        margin-right: 2px;
      }
      > span {
        font-size: 12px;
        color: #E2E9EE;
        vertical-align: middle;
      }
    }
    .right-info {
      float: right;
    }
  }
  .section-body {
    position: relative;
    overflow: hidden;
    .nation-table {
      position: absolute;
      left: 10px;
      top: 55px;
      font-size: 12px;
      width: 120px;
      height: 227px;
      color: #E2E9EE;
      .table-row {
        display: flex;
        align-items: center;
        height: 22px;
        font-family: AlibabaPuHuiTiM;
        .table-index {
          color: rgba(133,168,193,1);
          border-radius:1px;
          border:1px solid rgba(133,168,193,1);
          margin-right: 10px;
          padding: 1px 4px 0 4px;
          font-size: 12px;
          transform: scale(0.833);
        }
        .table-name {
          font-size: 12px;
          color: #E2E9EE;
          margin-right: 10px;
        }
      }
    }
    ul {
      height: calc(46vh - 68px);
      overflow: auto;
      margin: 16px 20px;
      margin-bottom: 0;
      padding-right: 10px;
      padding-bottom: 2px;
      li {
        position: relative;
        padding: 10px 0;
        overflow: hidden;
        padding-left: .8vw;
        border-left: 1px solid #1C3058;
        border-right: 1px solid #1C3058;
        border-top: 1px solid #1C3058;
        .right-sec {
          padding-top: 0.624vw;
          padding-left: 4vw;
        }
        .top-right {
          width: 1.8vw;
          height: 1.04vw;
          position: absolute;
          top: 0;
          right: 0;
          line-height: 1.04vw;
          text-align: center;
          font-size: 12px;
          color: #fff;
          ::before {
            content: '';
            width: 0;
            height: 0;
            position: absolute;
            top: 0;
            left: -1.04vw;
            border: .52vw solid transparent;
          }
        }
        .top-2 {
          background-color: #DB871D;
          ::before {
            border-top-color: #DB871D;
            border-right-color: #DB871D;
          }
        }
        .bottom-2 {
          background-color: #2B406A;
          ::before {
            border-top-color: #2B406A;
            border-right-color: #2B406A;
          }
        }
        h4 {
          font-size: 1.06vw;
          color: #E2E9EE;
          font-weight: normal;
          margin-bottom: 0.34vw;
          span {
            display: inline-block;
            width: 60%;
            line-height: 1.2vw;
            font-weight: normal;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            vertical-align: middle;
          }
          b {
            display: inline-block;
            width: 1.144vw;
            height: 1.144vw;
            line-height: 190%;
            background-color: #164EAB;
            border-radius: 50%;
            color: #E2E9EE;
            font-size: 0.624vw;
            margin-right: 2px;
            text-align: center;
            vertical-align: middle;
          }
        }
        p {
          font-size: 0.78vw;
          color: #E2E9EE;
          opacity: .73;
        }
      }
      li:last-of-type {
        border-bottom: 1px solid #1C3058;
      }
    }
  }
}
.top-panel {
  height: 46vh;
}
.num-panel {
  .section {
    height: calc(100% - 12.6vw);
    .section-body {
      height: calc(100% - 36px);
    }
  }
}
.face-list {
  .section-header {
    padding-left: 14px;
    padding-right: 14px;
  }
  .section-body {
    ul {
      margin-left: 14px;
      margin-right: 6px;
    }
  }
}
.nation-panel {
  .section-body {
    height: calc(100% - 34px);
  }
}
.line-panel {
  height: 46vh;
  position: relative;
  .section-header {
    position: absolute;
    top: 0;
    left: 0;
  }
  .section-body {
    height: 100%;
  }
}
.bottom-panel {
  height: calc(37.2vh - 2.18vw);
  .section-body {
    height: calc(100% - 34px);
  }
}
/deep/ {
  ::-webkit-scrollbar-thumb {
    border: 2px solid #1E2638;
  }
  ::-webkit-scrollbar-track {
    background-color: #11151F;
  }
  .img-show {
    width: 3.32vw;
    height: 4.16vw;
    position: relative;
    float: left;
    background-size: cover;
    background-position: center center;
    > div {
      width: 0;
      height: 0;
      position: absolute;
      left: 0;
      top: 0;
      border: 13px solid transparent;
    }
    .top2 {
      border-left-color: #FF861D;
      border-top-color: #FF861D;
    }
    .bot {
      border-left-color: #767676;
      border-top-color: #767676;
    }
    > span {
      position: absolute;
      left: 3px;
      top: 3px;
      color: #fff;
      font-size: 12px;
    }
  }
  .el-radio-button--small .el-radio-button__inner {
    padding: .2vw .78vw .1vw .78vw;
    border-left: 1px solid #35425E;
    font-size: .62vw;
  }
  .el-radio-button__inner {
    background-color: #202C40;
    border-color: #35425E;
    color: #E2E9EE;
    border-radius: 0;
  }
  .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    background-color: rgba(44,95,198,0.3);
    border-color: #0465C1;
    color: #E2E9EE;
    box-shadow: none;
  }
  .el-table::before {
    height: 0;
  }
  .el-table .el-table__header-wrapper th {
    background: linear-gradient(#2C5B7F, #233F71);
    border-bottom: none;
    padding-top: 6px;
    padding-bottom: 6px;
    font-size: 12px;
    color: rgb(208, 220, 230);
  }
  .el-table .el-table__body-wrapper tr.el-table__row {
    background-color: #212C47 !important;
    color: #E2E9EE;
    pointer-events: none;
    td {
      border: none;
      padding-top: 6px;
      padding-bottom: 6px;
    }
  }
  .el-table--striped .el-table__body tr.el-table__row--striped td {
    background-color: #151D2D !important;
    border: none;
  }
}
</style>
