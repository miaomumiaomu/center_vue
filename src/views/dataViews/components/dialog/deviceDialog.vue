<template>
  <div class="device-dialog">
    <div class="photos">
      <div class="title">{{deviceData.communityName}}-{{deviceData.name}}</div>
      <div class="image-bar">
        <img v-if="deviceData.images" :src="deviceData.images" class="image">
        <no-image v-else></no-image>
      </div>
      <div class="device-content">
        <div>
          <span>设备类型:</span>
          <span>{{deviceData.deviceType}}</span>
        </div>
        <div>
          <span>设备地址:</span>
          <span>{{deviceData.fullName}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  props: {
    deviceData: [Object],
  },
  methods: {
  },
}
</script>
<style lang="scss" scoped>
.device-dialog{
  .photos{
    width: 459px;
    height: 388px;
    background: url('../../../../assets/data-views/device-dialog-bg.png');
    background-size: 108% 120%;
    background-position: 48% 13%;
    position: relative;
    .title{
      position: absolute;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      font-size:18px;
      // font-family:AlibabaPuHuiTiR;
      color:rgba(255,255,255,1);
      line-height:25px;
    }
    .image-bar{
      width: 423px;
      height: 234px;
      position: absolute;
      top: 62px;
      left: 18px;
      .image{
        width: 100%;
        height: 100%;
        color: white;
        text-align: center;
        line-height: 234px;
      }
      div{
        border: 1px solid white;
      }
    }
    .device-content{
      position: absolute;
      top: 306px;
      left: 18px;
      span {
        font-size:12px;
        // font-family:AlibabaPuHuiTiR;
        color:rgba(107,133,166,1);
        line-height:17px;
      }
      span:nth-child(2n){
        font-size:14px;
        // font-family:AlibabaPuHuiTiR;
        color:rgba(255,255,255,1);
        line-height:20px;
      }
    }
  }
}
</style>