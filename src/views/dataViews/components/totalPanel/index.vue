<template>
  <div class="statistics-panel">
    <div class="main-panel">
      <div class="statistics-item">
        <div>
          <img src="@/assets/views-center/house.png" alt="house">
          <span>实有房屋</span>
        </div>
        <strong>{{actualHouse}}</strong>
      </div>
      <div class="statistics-item">
        <div>
          <img src="@/assets/views-center/unit.png" alt="unit">
          <span>实有单位</span>
        </div>
        <strong>{{actualCompany}}</strong>
      </div>
      <div class="statistics-item">
        <div>
          <img src="@/assets/views-center/device.png" alt="device">
          <span>实有设备</span>
        </div>
        <strong>{{deviceTotal}}</strong>
      </div>
      <div class="statistics-item">
        <div>
          <img src="@/assets/views-center/population.png" alt="population">
          <span>实有人口</span>
        </div>
        <strong>{{actualPerson}}</strong>
      </div>
      <div class="statistics-item">
        <div>
          <img src="@/assets/views-center/car.png" alt="car">
          <span>实有车辆</span>
        </div>
        <strong>{{actualCar}}</strong>
      </div>
      <div class="statistics-item">
        <div>
          <img src="@/assets/views-center/focus-person.png" alt="person">
          <span>关注人员</span>
        </div>
        <strong>{{attPerson}}</strong>
      </div>
    </div>
    <div class="aside-panel"></div>
  </div>
</template>

<script>
import {
  getPoliceAreaPartTotal,
  getPoliceAreaDeviceTotal
} from "@/api/dataViews/policeArea";
import { getCarCommon } from "@/api/viewsCenter/carView";

export default {
  props: {
    policeAreaCode: {
      type: String,
      default: ""
    },
    communityCode: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      actualHouse: 0,  // 实有房屋
      actualCompany: 0,  // 实有单位
      deviceTotal: 0,  // 实有设备
      actualPerson: 0,  // 实有人口
      actualCar: 0,  // 实有车辆
      attPerson: 0  // 关注人员
    };
  },
  watch: {
    policeAreaCode(val) {
      if (val.length > 0) {
        this.fetchPartTotal({ policeAreaCode: val });
        this.fetchDeviceTotal({ policeAreaCode: val });
        this.fetchCarTotal({ policeAreaCode: val });
      }
    },
    communityCode(val) {
      const pCode = this.policeAreaCode;
      if (val.length > 0) {
        this.fetchPartTotal({ communityCode: val });
        this.fetchDeviceTotal({ communityCode: val });
        this.fetchCarTotal({ communityCode: val });
      } else if (pCode.length > 0) {
        this.fetchPartTotal({ policeAreaCode: pCode });
        this.fetchDeviceTotal({ policeAreaCode: pCode });
        this.fetchCarTotal({ policeAreaCode: pCode });
      }
    }
  },
  methods: {
    fetchPartTotal(params) {
      getPoliceAreaPartTotal(params).then(res => {
        const { status, data } = res;
        if (status === 200) {
          data.forEach(item => {
            this[item.name] = item.count;
          });
        }
      });
    },
    fetchDeviceTotal(params) {
      getPoliceAreaDeviceTotal(params).then(res => {
        const { status, data } = res;
        if (status === 200) {
          this[data.name] = data.value;
        }
      });
    },
    fetchCarTotal(params) {
      getCarCommon(params).then(res => {
        const { status, data } = res;
        if (status === 200) {
          this.actualCar = data.collected;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
  .statistics-panel {
    width: 37.6vw;
    height: 80px;
    position: absolute;
    display: flex;
    top: 4.77vh;
    left: 19px;
    background-image: url("~@/assets/views-center/panel-bg.png");
    background-size: 105% 128%;
    background-repeat: no-repeat;
    background-position: center center;
    z-index: 668;
    overflow: hidden;
    user-select: none;
    .main-panel {
      display: flex;
      width: 35.8vw;
      height: 100%;
      padding-top: 15px;
      .statistics-item {
        flex: 1;
        text-align: center;
        color: #fff;
        > div {
          padding-bottom: 4px;
          img {
            height: 0.72vw;
            vertical-align: middle;
          }
          span {
            font-size: 0.72vw;
            opacity: .58;
            vertical-align: middle;
          }
        }
        > strong {
          font-size: 1.45vw;
          font-weight: normal;
        }
      }
    }
    .aside-panel {
      flex: 1;
    }
  }
</style>
