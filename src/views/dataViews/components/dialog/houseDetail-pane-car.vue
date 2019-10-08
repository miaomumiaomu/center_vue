<template>
  <div class="content" @scroll="onScrollToPage">
    <div class="header">{{ `${list.rows ? list.rows.length : 0}辆` }}</div>
    <template v-for="(item, index) in list.rows">
      <div :key="index" class="card">
        <div class="carno">
          <span class="car-number">{{ item.plateNumber }}</span>
          <template v-if="item.personTags">
            <div v-for="(item, index) in item.personTags.split(',')" class="person-type-container" :key="index" :style="{ 'background': faceLibraryData[item].color }">
              <span class="person-type">{{ faceLibraryData[item].shortName }}</span>
            </div>
          </template>
        </div>
        <div class="row-class">
          <span class="pre">姓ㅤ名:</span>
          <span class="inner">{{ item.name }}</span>
        </div>
        <div class="row-class">
          <span class="pre">手机号:</span>
          <span class="inner">{{ item.phone }}</span>
        </div>
        <div class="row-class">
          <span class="pre">身份证:</span>
          <span class="inner">{{ item.identityNo }}</span>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { carInHouse } from "@/api/houseManage";
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
      carInHouse({
        _filter_like_locationCode: this.locationCode,
        pageNo: 1,
        pageSize: 10000
      }).then(res => {
        this.list = res.data;
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
  padding-left: 21px;
  padding-top: 14px;
  padding-bottom: 14px;
  .header {
    font-size: 14px;
    color: #2782f5;
    position: absolute;
    right: 0;
    top: -23px;
  }
  .card {
    display: flex;
    flex-direction: column;
    width: 255px;
    height: 159px;
    padding: 22px 0 27px 22px;
    margin-right: 9px;
    margin-bottom: 13px;
    background: rgba(27, 37, 58, 1);
    color:rgba(255, 255, 255, 0.8511);
    &:nth-last-child(1) {
      margin-bottom: 0px;
    }

    .carno {
      font-size:20px;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      .car-number {
        margin-right: 6px;
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
    }
    .row-class {
      margin-bottom: 10px;
      .pre {
        font-size:12px;
        color:rgba(107, 133, 166, 1);
      }
      .inner {
        font-size: 14px;
      }
    }
  }
}
</style>
