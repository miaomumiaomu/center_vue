<template>
  <div class="person-class">
    <div class="dialog-container">
      <div class="title">关注人员</div>
      <div class="header">
        <span>共{{ listData.length }}人</span>
        <!-- <img src="@/assets/data-views/dialog-close.png" alt="" @click="hanldeClose"> -->
      </div>
      <div class="content" @scroll="onScrollToPage">
        <template v-for="(item, index) in listData">
          <div :key="index" class="card">
            <img :src="item.imgShow" alt="" class="card-avatar">
            <div class="info">
              <div style="display: flex">
                <div class="row-class" style="width: 50%">
                  <span class="padding-right6">姓ㅤ名:</span>
                  <span class="inner" style="padding-right: 5px;">{{ item.name }}</span>
                  <img v-if="item.sex === '男'" src="@/assets/data-views/dialog-man.png" alt="">
                  <img v-if="item.sex === '女'" src="@/assets/data-views/dialog-women.png" alt="">
                  <!-- <img :src="require(`@/assets/data-views/${item.sex === '男' ? 'dialog-man' : 'dialog-women'}.png`)" alt=""> -->
                </div>
                <div class="row-class">
                  <span class="padding-right6">类型:</span>
                  <template v-if="item.personTags">
                    <div v-for="(item, index) in item.personTags.split(',')" class="person-type-container" :key="index" :style="{ 'background': faceLibraryData[item] ? faceLibraryData[item].color : '#409EFF' }">
                      <span class="person-type">{{ faceLibraryData[item] ? faceLibraryData[item].shortName : item }}</span>
                    </div>
                  </template>
                </div>
              </div>
              <div style="display: flex">
                <div class="row-class" style="width: 50%">
                  <span class="padding-right6">籍ㅤ贯:</span>
                  <span class="inner">{{ item.nativePlace }}</span>
                </div>
                <div class="row-class" style="width: 28%">
                  <span class="padding-right6">民族:</span>
                  <span class="inner">{{ item.nation | commonFilter('comm_nation') }}</span>
                </div>
                <div class="row-class" style="width: 22%;">
                  <span class="padding-right6">年龄:</span>
                  <span class="inner">{{ item.age }}</span>
                </div>
              </div>
              <div class="row-class">
                <span class="padding-right6">车牌号:</span>
                <a class="inner" @click="getCarNo(item)" v-if="!item.carNo && item.carNo !== ''">点击获取</a>
                <span class="inner" v-else>{{ item.carNo === '' ? '暂无数据' : item.carNo }}</span>
              </div>
              <div class="row-class">
                <span class="padding-right6">手机号:</span>
                <span class="inner">{{ item.mobile }}</span>
              </div>
              <div class="row-class">
                <span class="padding-right6">身份证:</span>
                <span class="inner">{{ item.identityNo }}</span>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getPersonHousePageList } from '@/api/assetInquiry'
import { getCarByPersonId } from '@/api/carManage'
export default {
  props: {
    locationCode: {
      type: String,
      default: null
    }
  },
  watch: {
    locationCode(val) {
      this.getData()
    }
  },
  computed: {
    ...mapState({
      faceLibraryData: state => state.commonData.faceLibraryData,
    })
  },
  data() {
    return {
      pageSize: 10,
      listData: []
    }
  },
  methods: {
    getData() {
      getPersonHousePageList({
        pageNo: 1,
        pageSize: this.pageSize,
        _filter_eq_focusPerson: 1,
        _filter_like_locationCode: this.locationCode
      }).then(res => {
        res.status === 200 && (this.listData = res.data.rows || [])
      })
    },
    getCarNo(item) {
      getCarByPersonId({ personId: item.id }).then(res => {
        if (res.status === 200) {
          let str = ''
          res.data.forEach((item, index) => {
            if (index === 0) {
              str += item.plateNumber
            } else {
              str += (',' + item.plateNumber)
            }
          })
          this.$set(item, 'carNo', str)
        }
      })
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
}
</script>

<style lang="scss" scoped>
.dialog-container {
  height: 461px;
  width: 461px;
  margin: 0 auto;
  background: url("~@/assets/data-views/dialog-person-detail.png") no-repeat center;
  padding: 18px 22px 38px;

  .title {
    color: white;
    font-size:18px;
    width: 150px;
    position: absolute;
    left: 0;
    right: 0;
    top: 9px;
    margin: 0 auto;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .header {
    display: flex;
    margin-bottom: 13px;
    margin-top: 5px;
    justify-content: space-between;
    span {
      color: rgba(55, 122, 184, 1);
      font-size: 14px;
    }
    // img {
    //   cursor: pointer;
    // }
  }

  .content {
    height: calc(100% - 41px);
    overflow: auto;
    .card {
      display: flex;
      height: 172px;
      width: 100%;
      padding: 25px 18px;
      margin-bottom: 10px;
      background: rgba(27, 37, 58, 1);
      &:nth-last-child(1) {
        margin-bottom: 0px;
      }

      .card-avatar {
        height: 100%;
        width: 92px;
        margin-right: 20px;
      }

      .info {
        width: calc(100% - 112px);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        font-size: 0;
        .row-class {
          align-items: center;
          display: flex;
        }
        .person-type-container {
          height: 18px;
          width: 18px;
          border-radius: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-right: 5px;
          // border: 1px solid rgba(226, 233, 238, 1);
          .person-type {
            color: rgba(226, 233, 238, 1);
            font-size: 12px;
            transform: scale(0.833);
            padding-top: 1px;
          }
        }
        .padding-right6 {
          padding-right: 6px;
        }
        span {
          color: #6B85A6;
          font-size: 12px;
          white-space: nowrap;
        }
        .inner {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.851);
        }
        a {
          text-decoration: underline;
        }
      }
    }
  }
}
</style>
