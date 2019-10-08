<template>
  <div class="content" @scroll="onScrollToPage">
    <div class="header">{{ `${list.rows ? list.rows.length : 0}人` }}</div>
    <template v-for="(item, index) in list.rows">
      <div :key="index" class="card">
        <img :src="item.imgShow" alt="" class="card-avatar">
        <div class="info">
          <div style="display: flex">
            <div class="row-class" style="width: 50%">
              <span class="pre">姓ㅤ名:</span>
              <span class="inner" style="padding-right: 5px;">{{ item.name }}</span>
              <img v-if="item.sex === '男'" src="@/assets/data-views/dialog-man.png" alt="">
              <img v-if="item.sex === '女'" src="@/assets/data-views/dialog-women.png" alt="">
              <!-- <img :src="require(`@/assets/data-views/${item.sex === '男' ? 'dialog-man' : 'dialog-women'}.png`)" alt=""> -->
            </div>
            <div class="row-class">
              <span class="pre">类型:</span>
              <template v-if="item.personTags">
                <div v-for="(item, index) in item.personTags.split(',')" class="person-type-container" :key="index" :style="{ 'background': faceLibraryData[item].color }">
                  <span class="person-type">{{ faceLibraryData[item].shortName }}</span>
                </div>
              </template>
            </div>
          </div>
          <div style="display: flex">
            <div class="row-class" style="width: 50%">
              <span class="pre">籍ㅤ贯:</span>
              <span class="inner">{{ item.nativePlace }}</span>
            </div>
            <div class="row-class" style="width: 28%">
              <span class="pre">民族:</span>
              <span class="inner">{{ item.nation | commonFilter('comm_nation') }}</span>
            </div>
            <div class="row-class" style="width: 22%;">
              <span class="pre">年龄:</span>
              <span class="inner">{{ item.age }}</span>
            </div>
          </div>
          <div class="row-class">
            <span class="pre">车牌号:</span>
            <a class="inner" @click="getCarNo(item)" v-if="!item.carNo && item.carNo !== ''">点击获取</a>
            <span class="inner" v-else>{{ item.carNo === '' ? '暂无数据' : item.carNo }}</span>
          </div>
          <div class="row-class">
            <span class="pre">手机号:</span>
            <span class="inner">{{ item.mobile }}</span>
          </div>
          <div class="row-class">
            <span class="pre">身份证:</span>
            <span class="inner">{{ item.identityNo }}</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getPersonHousePageList } from '@/api/assetInquiry'
import { getCarByPersonId } from '@/api/carManage'
export default {
  props: {
    locationCode: String
  },
  watch: {
    locationCode: {
      handler(val) {
        val && this.getData(true)
      },
      immediate: true
    },
  },
  computed: {
    ...mapState({
      faceLibraryData: state => state.commonData.faceLibraryData,
    })
  },
  data() {
    return {
      pageSize: 10,
      list: {}
    };
  },
  mounted() {
  },
  methods: {
    getData(init = false) {
      init && (this.list = {})
      getPersonHousePageList({
        pageNo: 1,
        pageSize: this.pageSize,
        _filter_like_locationCode: this.locationCode
      }).then(res => {
        res.status === 200 && (this.list = res.data)
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
};
</script>

<style lang="scss" scoped>
.content {
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  overflow: auto;
  padding-top: 13px;
  padding-left: 15px;
  padding-bottom: 16px;
  .header {
    font-size: 14px;
    color: #2782f5;
    position: absolute;
    right: 0;
    top: -23px;
  }
  .card {
    display: flex;
    height: 180px;
    width: 392px;
    padding: 30px 14px;
    margin-right: 12px;
    margin-bottom: 10px;
    background: rgba(27, 37, 58, 1);
    &:nth-last-child(1) {
      margin-bottom: 0px;
    }

    .card-avatar {
      height: 100%;
      width: 92px;
      margin-right: 8px;
    }

    .info {
      width: 265px;
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
          line-height: 18px;
        }
      }
      .pre {
        padding-right: 6px;
        line-height: 16px;
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
</style>
