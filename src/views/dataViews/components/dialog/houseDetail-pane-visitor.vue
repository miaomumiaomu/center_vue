<template>
  <div class="content" @scroll="onScrollToPage">
    <div class="header">
      <el-radio-group v-model="filterType" @change="handleSelectChange" size="small">
        <el-radio-button :label="0">7天</el-radio-button>
        <el-radio-button :label="1">30天</el-radio-button>
        <el-radio-button :label="2">90天</el-radio-button>
      </el-radio-group>
    </div>
    <template v-for="(item, index) in list">
      <div :class="{
        'visit-person-card': true,
        'card-color': index === 0 || index === 1,
      }" :key="index">
        <!-- 右上上角标 -->
        <div class="right-corner">
          <div class="triangle"></div>
          <div class="square">{{ item.total + '次' }}</div>
        </div>

        <div class="card-inner">
          <div class="person-img">
            <!-- 左上角标 -->
            <span class="left-corner-num">{{ index + 1 }}</span>
            <div class="left-corner"></div>

            <img :src="item.identityImgUrl" alt="">
          </div>
          <div class="person-info">
            <p>{{ item.name }}</p>
            <span>{{ item.identityNo }}</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { getHouseVisitorTop } from '@/api/dataViews/house-dialog'
export default {
  props: {
    houseId: Number
  },
  watch: {
    houseId: {
      handler(val) {
        val && this.getData(true)
      },
      immediate: true
    },
  },
  data() {
    return {
      filterType: '0',
      pageSize: 10,
      list: []
    };
  },
  methods: {
    getData(init = false) {
      init && (this.list = [])
      getHouseVisitorTop({
        type: this.filterType,
        houseId: this.houseId,
      }).then(res => {
        res.status === 200 && (this.list = res.data)
      })
    },
    handleSelectChange(type) {
      this.filterType = type
      this.getData()
    },
    onScrollToPage(e) {
      const taskListElem = e.currentTarget;
      const listHeight = taskListElem.clientHeight;
      if (taskListElem.scrollHeight - taskListElem.scrollTop <= listHeight) {
        this.pageSize += 10
        this.getData()
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.content {
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  overflow: auto;
  padding-left: 12px;
  padding-top: 15px;
  padding-bottom: 17px;
  .header {
    color: #2782f5;
    position: absolute;
    right: 0;
    top: -29px;
  }
  @mixin baseCard() {
    background: rgba(27, 37, 58, 0.649);
    .left-corner-num {
      position: absolute;
      left: 4px;
      top: 2px;
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
      border-width: 12px 12px;
    }
    .right-corner {
      position: absolute;
      right: 0;
      top: 0;
      .triangle {
        float: left;
        border-style: solid;
        border-width: 10px 6px;
      }
      .square {
        float: right;
        width: 45px;
        height: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: rgba(145, 171, 204, 1);
        font-size: 12px;
      }
    }
  }

  @mixin cardColor() {
    .card-color {
      $corner-border-color: #DB871D;
      .left-corner {
        border-color: $corner-border-color transparent transparent $corner-border-color;
      }
      .right-corner {
        .triangle {
          border-color: $corner-border-color $corner-border-color transparent transparent;
        }
        .square {
          background: $corner-border-color;
          color: #fff;
        }
      }
    }
  }
  .visit-person-card {
    width: 260px;
    height: 103px;
    margin-bottom: 10px;
    margin-right: 10px;
    position: relative;

    @include baseCard;
    $corner-border-color: rgba(43, 64, 106, 0.901);
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

    // &:nth-child(odd) {
    //   margin-right: 10px;
    // }
    &:nth-last-child(1) {
      margin-bottom: 0px;
    }

    .card-inner {
      height: 100%;
      width: 100%;
      display: flex;

      .person-img {
        position: relative;
        margin: 11px 13px 13px 11px;
        width: 64px;
        height: 79px;
        img {
          height: 100%;
          width: 100%;
        }
      }
      .person-info {
        display: flex;
        flex-direction: column;
        p {
          width: 150px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          font-size: 22px;
          color:rgba(226, 233, 238, 1);
          padding-bottom: 12px;
          padding-top: 25px;
        }
        span {
          font-size: 14px;
          color:rgba(226,233,238,0.733);
        }
      }
    }
  }

  @include cardColor();

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
