<template>
  <div v-show="visible" class="person-class">
    <div class="wrapper" @click="hanldeClose"></div>
    <div class="dialog-container">
      <div class="title">{{ houseTitle }}</div>
      <div class="header">
        <!-- <span>共{{ list.total }}人</span> -->
        <img src="@/assets/data-views/dialog-close.png" alt="" @click="hanldeClose">
      </div>
      <div class="main">
        <div class="left-panel">
          <div class="section-header">
            <img src="@/assets/views-center/tag.png" alt="">
            <span>房屋信息</span>
          </div>
          <div class="long-time-no-person">
            <div class="row-class">
              <span class="pre">使用形式:</span>
              <span class="content">{{ houseInfo.usageType | commonFilter('house_use_type') }}</span>
            </div>
            <div class="row-class">
              <span class="pre">房屋用途:</span>
              <span class="content">{{ houseInfo.purposeType | commonFilter('house_use') }}</span>
            </div>
            <div class="row-class">
              <span class="pre">房屋类别:</span>
              <span class="content">{{ houseInfo.houseType | commonFilter('house_type') }}</span>
            </div>
            <div class="row-class">
              <span class="pre">房屋性质:</span>
              <span class="content">{{ houseInfo.propertyType | commonFilter('house_property') }}</span>
            </div>
            <div class="row-class">
              <span class="pre">建筑面积:</span>
              <span class="content">{{ houseInfo.area ? (houseInfo.area + '㎡') : '未知' }}</span>
            </div>
            <div class="row-class">
              <div class="pre">房屋地址:</div>
              <div class="content" style="width: 191px">{{ houseInfo.address }}</div>
            </div>
          </div>

          <div class="section-header">
            <img src="@/assets/views-center/tag.png" alt="">
            <span>业主信息</span>
          </div>
          <div class="owner-list">
            <template v-for="(item, index) in list">
              <div :key="index">
                <div class="card">
                  <img class="card-avatar" :src="item.identityImgPath" alt="">
                  <div class="card-content">
                    <div class="row-class">
                      <img src="@/assets/views-center/visitor-person.png" alt="">
                      <span class="inner">{{ item.name }}</span>
                    </div>
                    <div class="row-class">
                      <img src="@/assets/views-center/visitor-telphone.png" alt="" style="width: 9px">
                      <span class="inner">{{ item.mobile }}</span>
                    </div>
                    <div class="row-class">
                      <img src="@/assets/views-center/focus-identity.png" alt="" style="width: 11px">
                      <span class="inner">{{ item.identityNo }}</span>
                    </div>
                  </div>
                </div>
                <div class="border"></div>
              </div>
            </template>
          </div>
        </div>
        <div class="right-panel">
          <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="实有人员" name="person">
              <person-pane ref="personPane" :locationCode="locationCode"></person-pane>
            </el-tab-pane>
            <el-tab-pane label="实有车辆" name="car">
              <car-pane ref="carPane" :locationCode="locationCode"></car-pane>
            </el-tab-pane>
            <el-tab-pane label="实有单位" name="unit">
              <unit-pane ref="unitPane"></unit-pane>
            </el-tab-pane>
            <el-tab-pane label="访客拜访TOP20" name="visitor">
              <visitor-pane ref="visitorPane" :houseId="houseId"></visitor-pane>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getHouse } from "@/api/dataViews/house-dialog";
import { getperson } from "@/api/carManage";
export default {
  components: {
    PersonPane: () => import("./houseDetail-pane-person"),
    CarPane: () => import("./houseDetail-pane-car"),
    VisitorPane: () => import("./houseDetail-pane-visitor"),
    UnitPane: () => import("./houseDetail-pane-unit"),
  },
  props: {
    visible: {
      type: Boolean,
      default: true
    },
    houseId: {
      type: Number,
      default: null
    },
    houseTitle: {
      type: String,
      default: ''
    },
    locationCode: {
      type: String,
      default: null
    }
  },
  watch: {
    houseId(val) {
      this.houseInfo = {}
      this.list = []
      this.activeName = 'person'
      getHouse(val).then(res => {
        if (res.status == 200) {
          this.houseInfo = res.data
          this.getPersonInfo(res.data.ownerId)
        }
      })
      // this.$refs.personPane.getData(val, this.locationCode, true)
      // this.$refs.carPane.getData(val, this.locationCode, true)
      // this.$refs.visitorPane.getData(val, this.locationCode, true)
      this.$refs.unitPane.getData(val, this.locationCode, true)
    },
  },
  computed: {
  },
  data() {
    return {
      activeName: 'person',
      pageSize: 10,
      houseInfo: {
        fullName: null,
        area: null,
        usageType: null,
        purposeType: null,
        houseType: null,
        propertyType: null,
      },
      list: []
    };
  },
  mounted() {
    document.body.appendChild(this.$el)
  },
  methods: {
    //获取业主 信息
    getPersonInfo(val) {
      if(val) {
        getperson(val).then(result => {
          if (result.status == 200) {
            this.list.push({
              name: result.data.name,
              mobile: result.data.mobile,
              identityNo: result.data.identityNo,
              identityImgPath: result.data.identityImgPath,
            })
          }
        })
      }
    },
    hanldeClose() {
      this.$emit('update:visible', false)
    }
  }
};
</script>

<style lang="scss" scoped>
.person-class {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9999;

  .wrapper {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: auto;
    background: #2a3340;
    opacity: 0.8;
    z-index: 999;
  }
  .dialog-container {
    position: relative;
    height: 727px;
    width: 1261px;
    top: 10%;
    margin: 0 auto;
    background: url("~@/assets/data-views/dialog-person-detail-new.png") no-repeat center;
    padding: 18px 32px 22px 34px;
    z-index: 1000;

    .title {
      color: white;
      font-size:18px;
      width: 196px;
      text-align: center;
      padding: 10px 0px;
      margin-bottom: 5px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .header {
      position: absolute;
      right: 60px;
      top: 30px;
      img {
        cursor: pointer;
      }
    }

    .main {
      height: calc(100% - 45px);
      display: flex;
      overflow: auto;
      .left-panel {
        width: 345px;
        height: 100%;
        .section-header {
          padding: 24px 0 16px 25px;
          color: rgba(226, 233, 238, 0.8602);
          display: flex;
          align-items: center;
          img {
            margin-right: 5px;
          }
          span {
            font-size: 14px;
          }
        }
        .long-time-no-person {
          height: 192px;
          padding-left: 43px;
          padding-right: 47px;
          .row-class {
            display: flex;
            margin-bottom: 12px;
            &:last-child {
              margin: 0;
            }
            .pre {
              font-size: 13px;
              color:rgba(107, 133, 166, 1);
              padding-right: 8px;
              line-height: 17px;
            }
            .content {
              font-size:15px;
              color:rgba(255, 255, 255, 0.8511);
            }
          }
        }
        .owner-list {
          height: 288px;
          padding-left: 53px;
          padding-right: 17px;
          margin-right: 30px;
          overflow: auto;

          .card {
            display: flex;

            .card-avatar {
              width: 62px;
              height: 69px;
              margin-right: 18px;
            }
            .card-content {
              color: rgba(226, 233, 238, 0.733);
              font-size: 14px;
              display: flex;
              flex-direction: column;
              .row-class {
                margin-top: 6px;
              }
            }
          }
          .border {
            height: 1px;
            border-bottom: 1px solid rgba(71, 101, 164, 0.405);
            margin-top: 25px;
            margin-bottom: 14px;
          }

          & div:last-child > .border {
            display: none;
          }
        }
      }
      .right-panel {
        width: calc(100% - 365px);
      }
    }
  }
}

/deep/ {
  .el-tabs__content {
    height: 590px;
    border: 1px solid rgba(27, 78, 127, 0.939);
    overflow: unset;
  }
  .el-tab-pane {
    height: 100%;
  }
  .el-tabs--card > .el-tabs__header {
    border-bottom: none;
    margin: 0;
    .el-tabs__nav {
      border: none;
    }
    .el-tabs__item {
      width: 89px;
      height: 36px;
      line-height: 36px;
      text-align: center;
      background-color: #052146;
      color: #6b85a6;
      font-size: 14px;
      border-width: 0;
      border-top-left-radius: 6px;
      border-top-right-radius: 6px;
    }
    .el-tabs__item.is-active {
      background-color: #0245b6;
      color: #fff;
      z-index: 20 !important;
    }
    .el-tabs__item::after {
      content: "";
      width: 20px;
      height: 40px;
      position: absolute;
      right: -19px;
      top: 2px;
      background-image: url("~@/assets/views-center/triangle.png");
    }
    .el-tabs__item.is-active::after {
      content: "";
      width: 20px;
      height: 40px;
      position: absolute;
      right: -19px;
      top: 2px;
      background-image: url("~@/assets/views-center/triangle-hl.png");
    }
    #tab-car {
      position: relative;
      left: 5px;
      z-index: 14;
    }
    #tab-unit {
      position: relative;
      left: 10px;
      z-index: 13;
    }
    #tab-visitor {
      position: relative;
      left: 15px;
      z-index: 12;
      width: 125px;
      padding: 0 16px;
    }
  }
}
</style>
