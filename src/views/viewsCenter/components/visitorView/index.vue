<template>
  <div class="tab-container">
    <div class="chart">
      <div class="today-visit">
        <div class="today-visit-inner">
          <img src="@/assets/views-center/visitor-today.png" alt="">
          <div class="num-container">
            <p>今日访客</p>
            <strong>{{ todayVisit }}</strong>
          </div>
        </div>
      </div>
      <div class="bar-chart">
        <div class="section-header">
          <div style="display: flex">
            <img src="@/assets/views-center/tag.png" alt="">
            <span>拜访时间分布</span>
          </div>
        </div>
        <div class="section-content">
          <bar-chart :data="barData" :tooltipFormatter="'{c}人'"/>
        </div>
      </div>
      <div class="frequent-visit">
        <div class="section-header">
          <div style="display: flex">
            <img src="@/assets/views-center/tag.png" alt="">
            <span>频繁受访</span>
          </div>
        </div>
        <div class="section-content">
          <template v-for="(item, index) in frequentList">
            <div class="frequent-card" :key="index">
              <!-- 右上上角标 -->
              <div class="right-corner">
                <div class="triangle"></div>
                <div class="square">
                  <span style="padding-left: 5px">{{ '连续5天' }}</span>
                  <span style="padding-right: 5px">{{ `${item.total}次` }}</span>
                </div>
              </div>
              <!-- 中间文字 -->
              <div class="card-inner">
                <div>
                  <p>{{ item.address }}</p>
                </div>
                <div class="inner-bottom">
                  <div>
                    <img src="@/assets/views-center/visitor-person.png" alt="">
                    <span>{{ item.ownerName }}</span>
                  </div>
                  <div>
                    <img src="@/assets/views-center/visitor-telphone.png" alt="">
                    <span>{{ item.ownerTel }}</span>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <div class="right">
      <div class="right-top">
        <div class="select-day">
          <el-radio-group v-model="filterType" @change="handleSelectChange" size="small" >
            <el-radio-button :label="0">1天</el-radio-button>
            <el-radio-button :label="1">7天</el-radio-button>
            <el-radio-button :label="2">30天</el-radio-button>
          </el-radio-group>
        </div>
        <div class="line-chart">
          <div class="section-header">
            <div style="display: flex">
              <img src="@/assets/views-center/tag.png" alt="">
              <span>访客流量统计</span>
            </div>
          </div>
          <div class="section-content">
            <line-chart :data="lineData" />
          </div>
        </div>
      </div>
      <div class="right-bottom">

        <div class="visit-person">
          <div class="section-header">
            <div style="display: flex">
              <img src="@/assets/views-center/tag.png" alt="">
              <span>拜访人员 TOP20</span>
            </div>
          </div>
          <div class="section-content">
            <template v-for="(item, index) in personList" >
              <div :class="{
                'visit-person-card': true,
                'card-color': index === 0 || index === 1,
              }" :key="index">
                <!-- 右上上角标 -->
                <div class="right-corner">
                  <div class="triangle"></div>
                  <div class="square">{{ item.total + '次' }}</div>
                </div>

                <div class="card-inner" @click="showPersonForm(item.personInfoId)">
                  <div class="person-img">
                    <!-- 左上角标 -->
                    <span class="left-corner-num">{{ index + 1 }}</span>
                    <div class="left-corner"></div>

                    <img :src="item.identityImgUrl" alt="">
                  </div>
                  <div class="person-info">
                    <p>{{item.name}}</p>
                    <span>{{item.identityNo}}</span>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>

        <div class="visit-room">
          <div class="section-header">
            <div style="display: flex">
              <img src="@/assets/views-center/tag.png" alt="">
              <span>受访房间 TOP20</span>
            </div>
          </div>
          <div class="section-content">
            <template v-for="(item, index) in roomList">
              <div :class="{
                'visit-room-card': true,
                'card-color': index === 0 || index === 1,
              }" :key="index">
                <!-- 左上角标 -->
                <span class="left-corner-num">{{ index + 1 }}</span>
                <div class="left-corner"></div>
                <!-- 右上上角标 -->
                <div class="right-corner">
                  <div class="triangle"></div>
                  <div class="square">{{ item.total + '次' }}</div>
                </div>
                <!-- 中间文字 -->
                <div class="card-inner" @click="showHouseForm(item.houseId)">
                  <div>
                    <p>{{ item.address }}</p>
                  </div>
                  <div class="inner-bottom">
                    <div>
                      <img src="@/assets/views-center/visitor-person.png" alt="">
                      <span>{{ item.ownerName }}</span>
                    </div>
                    <div>
                      <img src="@/assets/views-center/visitor-telphone.png" alt="">
                      <span>{{ item.ownerTel }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>

      </div>
    </div>
    
    <label-form :is-open.sync="personForm" :id="personId" isView />
    <house-form :is-open.sync="houseForm" :id="houseId" isView />
  </div>
</template>

<script>
import {
  getVisitorToday,
  getVisitorTimeAnaly,
  getVisitorFrequent,
  getVisitorFlow,
  getVisitorRoom,
  getVisitorPerson
} from "@/api/viewsCenter/visitor";
export default {
  components: {
    BarChart: () => import("../BarChart"),
    LineChart: () => import("./LineChart"),
    LabelForm: () => import("@/components/FaceLabelForm"),
    HouseForm: () => import('@/views/houseManage/components/HouseForm')
  },
  props: {
    areaType: { // 1为辖区 2为项目 只能传其一
      type: String,
      default: ""
    },
    areaCode: {
      type: String,
      default: ""
    }
  },
  watch: {
    areaCode: {
      handler(val) {
        if (this.areaType == 1) {
          this.params.policeAreaCode = this.areaCode;
          this.params.communityCode = null;
        } else if (this.areaType == 2) {
          this.params.policeAreaCode = null;
          this.params.communityCode = this.areaCode;
        }
        this.$nextTick(() => {
          this.getData()
        })
      },
      immediate: true
    }
  },
  data() {
    return {
      filterType: '1',
      params: {},
      personForm: false,
      personId: null,
      houseForm: false,
      houseId: null,

      todayVisit: 0,
      barData: [],
      frequentList: [],
      lineData: [],
      roomList: [],
      personList: [],
    }
  },
  methods: {
    getData() {
      getVisitorToday(this.params).then(res => {
        if(res.status === 200) {
          this.todayVisit = res.data.todayVisit
        }
      })
      getVisitorTimeAnaly(this.params).then(res => {
        if(res.status === 200) {
          this.barData = res.data
        }
      })
      getVisitorFrequent(this.params).then(res => {
        if(res.status === 200) {
          this.frequentList = res.data
        }
      })
      getVisitorFlow({ ...this.params, type: this.filterType }).then(res => {
        if(res.status === 200) {
          this.lineData = res.data
        }
      })
      getVisitorRoom({ ...this.params, type: this.filterType }).then(res => {
        if(res.status === 200) {
          this.roomList = res.data
        }
      })
      getVisitorPerson({ ...this.params, type: this.filterType }).then(res => {
        if(res.status === 200) {
          this.personList = res.data
        }
      })
    },
    // addAdressEnd(array) { // 添加地址门牌楼号变量
    //   if (!array) return []
    //   array.forEach(item => {
    //     if (item.address) {
    //       let beforeNumArray = /^\D+/.exec(item.address) // 过滤出数字之前的字符串
    //       let splitArray = item.address.split(beforeNumArray) // 分割数字及数字之后的字符串
    //       item.address = beforeNumArray[0] 
    //       item.addressEnd = splitArray[1]
    //     }
    //   })
    //   return array
    // },
    handleSelectChange(type) {
      getVisitorFlow({ ...this.params, type: this.filterType }).then(res => {
        if(res.status === 200) {
          this.lineData = res.data
        }
      })
      getVisitorRoom({ ...this.params, type: this.filterType }).then(res => {
        if(res.status === 200) {
          this.roomList = res.data
        }
      })
      getVisitorPerson({ ...this.params, type: this.filterType }).then(res => {
        if(res.status === 200) {
          this.personList = res.data
        }
      })
    },
    showPersonForm(id) {
      this.personId = id
      this.personForm = true
    },
    showHouseForm(id) {
      this.houseId = id
      this.houseForm = true
    },
  }
};
</script>

<style lang="scss" scoped>
.tab-container {
  height: 80vh;
  display: flex;
  $bg-main: #151D2D;

  @mixin section() {
    .section-header {
      padding: 20px 0 15px 25px;
      color: #E2E9EE;
      display: flex;
      align-items: center;
      justify-content: space-between;
      img {
        margin-right: 5px;
      }
      span {
        font-size: 14px;
      }
    }
    .section-content {
      height: calc(100% - 51px);
    }
  }

  @mixin baseCard() {
    background: #121825;
    border: 1px solid rgba(59,76,110,1);
    .left-corner-num {
      position: absolute;
      left: 0.2083vw;
      top: 0.10416vw;
      color: white;
      font-size: 12px;
      z-index: 99;
      transform: scale(0.9);
    }
    .left-corner {
      position: absolute;
      left: 0;
      top: 0;
      border-style: solid;
      border-width: 0.625vw 0.625vw;
    }
    .right-corner {
      position: absolute;
      right: 0;
      top: 0;
      .triangle {
        float: left;
        border-style: solid;
        border-width: 0.5208vw 0.3125vw;
      }
      .square {
        float: right;
        width: 1.98vw;
        height: 1.0416vw;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        font-size: 0.729vw;
      }
    }
  }

  @mixin cardColor() {

    .card-color {
      border: 1px solid rgba(59,76,110,1);
      $corner-border-color: #C67C1D;
      .left-corner {
        border-color: $corner-border-color transparent transparent $corner-border-color;
      }
      .right-corner {
        .triangle {
          border-color: $corner-border-color $corner-border-color transparent transparent;
        }
        .square {
          background: $corner-border-color;
        }
      }
    }
  }
  

  .chart {
    width: 33%;
    margin-right: 10px;
    display: flex;
    flex-direction: column;
    .today-visit {
      height: 10.8%;
      background: $bg-main;
      margin-bottom: 10px;

      .today-visit-inner {
        display: flex;
        align-items: center;
        background: #1B2435;
        margin: 0.5208vw 1.0417vw;
        height: calc(100% - 1.0416vw);
        img {
          margin-left: 5.208vw;
          height: 1.548vw;
        }
        .num-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: calc(100% - 6.666vw);
          p {
            font-size: 0.729vw;
            color: rgba(255, 255, 255, 0.5828);
          }
          strong {
            color: #E2E9EE;
            font-size: 1.6667vw;
            font-weight: bold;
          }
        }
      }
    }
    .bar-chart {
      height: 36%;
      background: $bg-main;
      margin-bottom: 10px;
      @include section;
    }
    .frequent-visit {
      height: 51%;
      background: $bg-main;
      @include section;
      .section-content {
        padding-left: 1.302vw;
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        align-content: flex-start;
        overflow: auto;

        .frequent-card {
          height: 5.73vw;
          width: 14.0625vw;
          position: relative;
          margin-bottom: 0.5208vw;

          @include baseCard;
          $corner-border-color: #3F5278;
          .right-corner {
            .triangle {
              border-color: $corner-border-color $corner-border-color transparent transparent;
            }
            .square {
              display: flex;
              justify-content: space-between;
              width: 5.625vw;
              background: $corner-border-color;
            }
          }

          &:nth-child(odd) {
            margin-right: 0.5208vw;
          }

          .card-inner {
            height: 100%;
            width: 100%;
            padding: 1.354vw 0.78125vw 0.729vw;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            p {
              font-size: 0.8333vw;
              color:#CDD3E0;
              padding-bottom: 5px;
            }
            span {
              font-size: 0.78125vw;
              color:#AAB1B7;
            }
            .inner-bottom {
              display: flex;
              justify-content: space-between;
            }
          }
        }
      }
    }
  }

  .right {
    width: 66%;
    background: $bg-main;
    .right-top {
      height: 50%;
      padding-bottom: 15px;

      .select-day {
        text-align: right;
        padding: 15px 15px 0 0;
      }
      .line-chart {
        height: calc(100% - 37px);
        @include section;
      }
    }
    .right-bottom {
      height: 50%;
      display: flex;
      .visit-room {
        width: 50%;
        @include section;
        .section-content {
          padding-left: 1.302vw;
          display: flex;
          justify-content: flex-start;
          flex-wrap: wrap;
          align-content: flex-start;
          overflow: auto;

          .visit-room-card {
            height: 5.73vw;
            width: 14.0625vw;
            position: relative;
            margin-bottom: 0.5208vw;

            @include baseCard;
            $corner-border-color: #2B406A;
            .left-corner {
              border-color: $corner-border-color transparent transparent $corner-border-color;
            }
            .right-corner {
              .triangle {
                border-color: $corner-border-color $corner-border-color transparent transparent;
              }
              .square {
                background: $corner-border-color;
              }
            }

            &:nth-child(odd) {
              margin-right: 0.5208vw;
            }

            .card-inner {
              height: 100%;
              width: 100%;
              padding: 1.354vw 0.78125vw 0.729vw;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              cursor: pointer;
              p {
                font-size: 0.8333vw;
                color:#CDD3E0;
                padding-bottom: 5px;
              }
              span {
                font-size: 0.78125vw;
                color:#AAB1B7;
              }
              .inner-bottom {
                display: flex;
                justify-content: space-between;
              }
            }
          }

          @include cardColor();
        }
      }

      .visit-person {
        width: 50%;
        @include section;

        .section-content {
          display: flex;
          justify-content: flex-start;
          flex-wrap: wrap;
          align-content: flex-start;
          overflow: auto;
          padding-left: 1.302vw;

          .visit-person-card {
            height: 5.73vw;
            width: 14.35vw;
            margin-bottom: 0.5208vw;
            position: relative;

            @include baseCard;
            $corner-border-color: #3F5278;
            .left-corner {
              border-color: #767676 transparent transparent #767676;
            }
            .right-corner {
              .triangle {
                border-color: $corner-border-color $corner-border-color transparent transparent;
              }
              .square {
                background: $corner-border-color;
              }
            }

            &:nth-child(odd) {
              margin-right: 0.5208vw;
            }

            .card-inner {
              height: 100%;
              width: 100%;
              display: flex;
              cursor: pointer;

              .person-img {
                position: relative;
                margin: 0.83333vw 0.573vw 0.78125vw;
                height: 4.11458vw;
                width: 3.33333vw;
                img {
                  height: 100%;
                  width: 100%;
                }
              }
              .person-info {
                display: flex;
                flex-direction: column;
                justify-content: center;
                p {
                  width: 7.8125vw;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  overflow: hidden;
                  font-size: 1.25vw;
                  color:rgba(205, 211, 224, 1);
                  padding-bottom: 0.4167vw;
                }
                span {
                  font-size: 0.8854vw;
                  color:rgba(226,233,238,0.733);
                }
              }
            }
          }

          @include cardColor();
        }
      }
    }
  }
  

  /deep/ {
    .el-radio-button--small .el-radio-button__inner {
      padding: 4px 14px 4px 14px;
      border-left: 1px solid #35425E;
      font-size: 12px;
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
  }
}
</style>
