<template>
  <div class="alarmsBox">
    <div class="alamsInfoBox">
      <div @scroll="onScroll" class="faceInfoBox">
        <div class="emptyInfo" v-if="monitorData.length === 0">暂无数据</div>
        <div class="alarmsInfo" v-else v-for="item in monitorData" :key="item.id">
          <div class="control">{{item.monitorName}}</div>
          <div class="pic">
            <img-show txt="暂无图片 " width='58px' height="65px" :img-src="item.snapImgPath || item.plateImage" />
          </div>
          <ul class="info">
            <li v-if="item.plateNumber">
              <span>车&emsp;&emsp;牌：
                <b>{{item.plateNumber}}</b>
              </span>
            </li>
            <li v-else>
              <span>姓&emsp;&emsp;名：
                <b>{{item.name}}</b>
              </span>
            </li>
            <li>
              <span>抓拍时间：{{item.imgTime || item.passTime}}</span>
            </li>
            <li>
              <span>抓拍地址：{{item.communityName}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: {  // props校验类型，Number类型直接传值不能传非0值
    category: '',
    monitorData: {
      default: () => [],
      type: Array
    }
  },
  data() {
    return {
      faceData: {},

      disposeData: null,
      disposeId: null,
      isDisposeDialog: false,

      isCarDialog: false,
      dealId: null,
      carForm: null
    };
  },
  methods: {
    onScroll(e) {
      const faceInfoBox = e.target;
      if (faceInfoBox.scrollHeight - faceInfoBox.scrollTop <= faceInfoBox.clientHeight && this.monitorData.length > 0) {
        this.$emit('scroll-bottom', this.category);
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.alarmsBox {
  height: 246px;
  .alamsInfoBox {
    height: 100%;
    .faceInfoBox {
      height: 100%;
      overflow: scroll;
    }
  }
  .alarmsInfo {
    position: relative;
    padding-bottom: 11px;
    padding-left: 11px;
    background: rgba(255, 0, 0, 0.04);
    border: 1px solid rgba(238, 57, 57, 1);
    margin-bottom: 4px;
    cursor: pointer;
    .control {
      line-height: 38px;
      width: 283px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .pic {
      display: inline-block;
      border-radius: 4px;
      overflow: hidden;
    }
    .info {
      position: absolute;
      top: 38px;
      left: 77px;
    }
    li {
      width: 210px;
      line-height: 20px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      font-size: 14px;
      font-weight: 400;
      color: rgba(102, 102, 102, 1);
    }
  }
  .emptyInfo {
    padding-top: 90px;
    font-size: 24px;
    text-align: center;
    color: gainsboro;
  }
  .alarmsInfo:nth-last-child(1) {
    margin-bottom: 0px;
  }
  .alarmsBottom {
    background: #f6f7f8;
    color: #f30b05;
    height: 38px;
    line-height: 36px;
    padding: 0 4px 0 28px;
    a {
      color: #666666;
      float: right;
    }
  }
}
</style>
