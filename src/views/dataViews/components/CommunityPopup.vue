<template>
  <div class="community-popup">
    <div class="header">
      <img src="@/assets/views-center/locale3.png" alt="locale">
      <span>{{cName}}</span>
    </div>
    <div class="body">
      <el-row :gutter="3">
        <el-col class="margin-bottom-11">
          <div class="margin-left-12 title">小区地址:</div>
          <div class="content">{{data.fullName}}</div>
        </el-col>
        <el-col :span="12" class="margin-bottom-11">
          <div class="margin-left-12 title">小区类型:</div>
          <div class="content">{{data.type | commonFilter('project_type')}}</div>
        </el-col>
        <el-col :span="12" class="margin-bottom-11">
          <div class="title">物业公司:</div>
          <div class="content">{{data.organizeName}}</div>
        </el-col>
        <el-col :span="12" class="margin-bottom-11">
          <div class="margin-left-12 title" style="letter-spacing: 0;">小区负责人:</div>
          <div class="content">{{data.contactName}}</div>
        </el-col>
        <el-col :span="12" class="margin-bottom-11">
          <div class="title">手机号码:</div>
          <div class="content">{{data.contactTel}}</div>
        </el-col>
        <el-col :span="12" class="margin-bottom-11">
          <div class="margin-left-12 title" style="letter-spacing: 0;">所属派出所:</div>
          <div class="content">{{data.pcsCode}}</div>
        </el-col>
        <el-col :span="12" class="margin-bottom-11">
          <div class="title">所属辖区:</div>
          <div class="content">{{data.policeAreaName}}</div>
        </el-col>
        <el-col :span="12">
          <div class="gather-bar">
            <div style="margin-top: 13px;">
              <div>今日人脸采集</div>
              <strong>{{personTodayAnalysis.personSnapCollect || 0}}</strong>
            </div>
            <div>
              <div>今日人数统计</div>
              <strong>{{personTodayAnalysis.personCount || 0}}</strong>
            </div>
            <div>
              <div>今日人脸预警</div>
              <strong style="color: #E02929;">{{personTodayAnalysis.personAlarm || 0}}</strong>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="gather-bar">
            <div style="margin-top: 13px;">
              <div>今日车辆采集</div>
              <strong>{{carTodayAnalysis.carFlow || 0}}</strong>
            </div>
            <div>
              <div>今日车辆统计</div>
              <strong>{{carTodayAnalysis.carCount || 0}}</strong>
            </div>
            <div>
              <div>今日车辆预警</div>
              <strong style="color: #E02929;">{{carTodayAnalysis.carAlarm || 0}}</strong>
            </div>
          </div>
        </el-col>
        <el-col :span="24">
          <div class="library-bar">
            <div>
              <div>实有人口</div>
              <strong>{{actualPerson}}</strong>
            </div>
            <div>
              <div>实有房屋</div>
              <strong>{{actualHouse}}</strong>
            </div>
            <div>
              <div>实有单位</div>
              <strong>{{actualCompany}}</strong>
            </div>
            <div>
              <div>实有车辆</div>
              <strong>{{actualCar}}</strong>
            </div>
            <div>
              <div>小区设备</div>
              <strong>{{deviceTotal}}</strong>
            </div>
            <div style="border-width: 0;">
              <div>关注人员</div>
              <strong>{{attPerson}}</strong>
            </div>
          </div>
        </el-col>
        
      </el-row>
      <!-- <div class="flex-play flex-play-top">
        <div class="flex-item top-left">
          <div>
            <p>实有人口</p>
            <strong>{{actualPerson}}</strong>
          </div>
        </div>
        <div class="flex-item top-center">
          <div>
            <p>实有单位</p>
            <strong>{{actualCompany}}</strong>
          </div>
        </div>
        <div class="flex-item top-right">
          <div>
            <p>实有房屋</p>
            <strong>{{actualHouse}}</strong>
          </div>
        </div>
      </div>
      <div class="flex-play flex-play-bottom">
        <div class="flex-item bottom-left">
          <div>
            <p>实有车辆</p>
            <strong>{{actualCar}}</strong>
          </div>
        </div>
        <div class="flex-item bottom-center">
          <div>
            <p>关注人员</p>
            <strong>{{attPerson}}</strong>
          </div>
        </div>
        <div class="flex-item bottom-right">
          <div>
            <p>实有设备</p>
            <strong>{{deviceTotal}}</strong>
          </div>
        </div>
      </div> -->
    </div>
    <div class="footer" @click="handleCommunityView">
      <button>进入社区</button>
    </div>
  </div>
</template>

<script>
import {
  getPoliceAreaPartTotal,
  getPoliceAreaDeviceTotal,
  getPoliceAreaCarTotal
} from "@/api/dataViews/policeArea";

import { getPersonTodayAnalysis, getCarTodayAnalysis } from '@/api/dataViews/dynamicPanel'

export default {
  props: {
    code: {
      type: String,
      default: ""
    },
    cName: {
      type: String,
      default: ""
    },
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      actualHouse: 0,  // 实有房屋
      actualCompany: 0,  // 实有单位
      deviceTotal: 0,  // 实有设备
      actualPerson: 0,  // 实有人口
      actualCar: 0,  // 实有车辆
      attPerson: 0,  // 关注人员
      personTodayAnalysis: {}, 
      carTodayAnalysis: {}
    };
  },
  watch: {
    code(val) {
      if (val.length > 0) {
        this.fetchPartTotal(val);
        this.fetchDeviceTotal(val);
        this.fetchCarTotal(val);
        this.getPersonTodayAnalysis(val)
        this.getCarTodayAnalysis(val)
      }
    },
  },
  methods: {
    fetchPartTotal(communityCode) {
      getPoliceAreaPartTotal({ communityCode }).then(res => {
        const { status, data } = res;
        if (status === 200) {
          data.forEach(item => {
            this[item.name] = item.count;
          });
        }
      });
    },
    fetchDeviceTotal(communityCode) {
      getPoliceAreaDeviceTotal({ communityCode }).then(res => {
        const { status, data } = res;
        if (status === 200) {
          this[data.name] = data.value;
        }
      });
    },
    fetchCarTotal(communityCode) {
      getPoliceAreaCarTotal({ communityCode }).then(res => {
        const { status, data } = res;
        if (status === 200) {
          this[data.name] = data.count;
        }
      });
    },
    handleCommunityView() {
      this.$emit('drillDown', this.code);
    },
    getPersonTodayAnalysis(communityCode) {
      getPersonTodayAnalysis({ communityCode }).then(res => {
        this.personTodayAnalysis = res.data
      })
    },
    getCarTodayAnalysis(communityCode) {
      getCarTodayAnalysis({ communityCode }).then(res => {
        this.carTodayAnalysis = res.data
      })
    },
  }
};
</script>

<style lang="scss" scoped>
  .community-popup {
    width: 457px;
    height: 434px;
    position: relative;
    background-image: url("~@/assets/views-center/community-bg.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    padding: 21px 27px 0 22px;
  }
  .header {
    img {
      width: 21px;
      vertical-align: middle;
    }
    span {
      font-size: 15px;
      color: #FFE617;
      vertical-align: middle;
    }
  }
  .body {
    margin: 21px 0 9px;
    .margin-bottom-11{
      margin-bottom: 11px;
    }
    .el-col{
      display: flex;
      align-items: center;
      .margin-left-12{
        margin-left: 12px;
      }
      .title{
        width: 76px;
        height: 18px;
        font-size:13px;
        color:rgba(107,133,166,1);
        line-height:18px;
        letter-spacing:3.8px;
      }
      .content{
        height:21px;
        font-size:15px;
        color:rgba(255,255,255,1);
        line-height:21px;
      }
      .gather-bar{
        width: 100%;
        height:109px;
        color: white;
        background:rgba(27,42,62,0.73);
        margin-bottom: 6px;
        > div{
          width: 100%;
          display: flex;
          align-items: center;
          margin-bottom: 9px;
          div{
            width:104px;
            height:20px;
            margin-left: 14px;
            color:rgba(255,255,255,1);
            line-height:20px;
          }
          strong{
            margin-left: 13px;
            font-size:19px;
            color:rgba(64,146,200,1);
            line-height:24px;
          }
        }
      }
      .library-bar{
        width: 100%;
        height:75px;
        background:rgba(27,42,62,0.73);
        padding: 0 6px;
        display: flex;
        justify-content: center;
        align-items: center;
        > div {
          flex: 1;
          margin-left: 6px;
          border-right: 0.2px solid rgba(151, 151, 151, 0.21);
          div{
            height:18px;
            font-size:13px;
            color:rgba(255,255,255,0.58);
            line-height:18px;
          }
          strong{
            height:22px;
            font-size:19px;
            color:rgba(255,255,255,1);
            line-height:22px;
          }
        }
      }
    }
    // .flex-play {
    //   display: flex;
    //   flex-wrap: nowrap;
    //   background-color: #1B2A3E;
    //   padding: 12px;
    // }
    // .flex-play-top {
    //   padding-bottom: 0;
    // }
    // .flex-item {
    //   flex: 1;
    //   border-left: 1px solid rgba($color: #979797, $alpha: .21);
    //   border-bottom: 1px solid rgba($color: #979797, $alpha: .21);
    //   > div {
    //     display: inline-block;
    //     text-align: left;
    //     padding-left: 4px;
    //     p {
    //       margin: 0;
    //       font-size: 12px;
    //       color: rgba($color: #ffffff, $alpha: .58);
    //     }
    //     strong {
    //       font-size: 18px;
    //       font-weight: normal;
    //       color: #fff;
    //     }
    //   }
    // }
    // .flex-play-bottom {
    //   .flex-item {
    //     border-bottom: none;
    //   }
    // }
    // .top-left, .bottom-left {
    //   border-left: none;
    // }
    // .top-center, .bottom-center {
    //   text-align: center;
    // }
    // .top-right, .bottom-right {
    //   text-align: right;
    //   padding-right: 4px;
    // }
  }
  .footer {
    text-align: center;
    font-size: 14px;
    color: #377AB8;
    button {
      width: 94px;
      height: 35px;
      background-color: #2C5FC6;
      color: #fff;
      font-size: 16px;
      border: none;
      border-radius: 2px;
      outline: none;
      cursor: pointer;
      line-height: 35px;
    }
  }
</style>
