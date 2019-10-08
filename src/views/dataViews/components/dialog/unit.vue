<template>
  <div class="dialog-container">
    <div class="title">实有单位</div>
    <!-- <img src="@/assets/data-views/dialog-close.png" alt="" @click="hanldeClose"> -->
    <div class="card-container" @scroll="onScrollToPage">
      <template v-for="(item, index) in listData">
        <div :key="index" class="card" @click="handleClick(item)">
          <div class="unit-name">{{ item.name }}</div>
          <div class="unit-address">{{ item.fullName }}</div>
        </div>
      </template>
    </div>

    <unit-detail-dialog :visible.sync="visible" :unitId="unitId"></unit-detail-dialog>
  </div>
</template>

<script>
import { addrCompanyList } from '@/api/unitManage'
export default {
  components: {
    unitDetailDialog: () => import("./unitDetail"),
  },
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
  data() {
    return {
      visible: false,
      pageSize: 10,
      unitId: null,
      listData: []
    }
  },
  methods: {
    getData() {
      addrCompanyList({
        pageNo: 1,
        pageSize: this.pageSize,
        _filter_like_locationCode: this.locationCode
      }).then(res => {
        res.status === 200 && (this.listData = res.data.rows)
      })
    },
    handleClick(item) {
      this.unitId = item.id
      this.visible = true
    },
    onScrollToPage(e) {
      const taskListElem = e.currentTarget;
      const listHeight = taskListElem.clientHeight;
      if (taskListElem.scrollHeight - taskListElem.scrollTop <= listHeight) {
        this.pageSize += 10
        this.getData()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-container {
  width: 420px;
  height: 340px;
  background: url("~@/assets/data-views/dialog-unit.png") no-repeat center;
  padding: 15px 27px 25px 45px;

  .title {
    font-size:20px;
    color:rgba(55,122,184,1);
    margin-bottom: 20px;
  }

  img {
    position: absolute;
    right: 18px;
    top: 28px;
    cursor: pointer;
  }

  .card-container {
    overflow: auto;
    height: 253px;
    .card {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 15px 24px;
      height: 78px;
      background: #1B253A;
      margin-bottom: 9px;
      cursor: pointer;

      &:nth-last-child(1) {
        margin-bottom: 0px;
      }
      .unit-name {
        font-size:18px;
        color:rgba(226,233,238,1);
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .unit-address {
        font-size:14px;
        color:rgba(107,133,166,1);
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
