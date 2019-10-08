<template>
  <div class="house-list">
    <div class="content" v-for="(item, index) in list" :key="index">
      <div class="content-title">
        <div>{{ item.name }}</div>
        <div :style="{ background: color[item.manageLevel - 1] }">{{ item.manageLevel | commonFilter('house_manage_level') }}</div>
      </div>
      <div class="content-fullName">{{ item.fullName }}</div>
      <div class="content-item">
        <div class="row">
          <img src="@/assets/views-center/visitor-person.png" alt="" style="width: 10px;">
          <span>{{ item.ownerName }}</span>
        </div>
        <div class="row">
          <img src="@/assets/views-center/visitor-telphone.png" alt="" style="width: 11px">
          <span>{{ item.ownerTel }}</span>
        </div>
        <div class="row">
          <img src="@/assets/views-center/focus-identity.png" alt="" style="width: 12px">
          <span>{{ item.ownerIdentityNo }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    list: Array
  },
  watch: {
  },
  data() {
    return {
      color: ['#3286E0', '#C67C1D', '#B1522E']
    };
  },
  methods: {
    getData(init = false) {
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
.house-list {
  display: flex;
  flex-wrap: wrap;
  .content{
    display: inline-block;
    width: 301px;
    height: 251px;
    background:rgba(25, 37, 61, 1);
    border-radius:4px;
    border:1px solid rgba(59, 76, 110, 1);
    margin-right: 14px;
    margin-bottom: 27px;
    cursor: pointer;

    .content-title{
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 51px;
      background:linear-gradient(360deg,rgba(44, 95, 198, 0.416),rgba(70, 179, 240, 0.416) 100%);
      div:first-child{
        font-size: 20px;
        color:rgba(255,255,255,1);
        margin-left: 24px;
      }
      div + div{
        width: 40px;
        height: 21px;
        line-height: 21px;
        background:#3286E0;
        border-radius:2px;
        font-size: 12px;
        text-align: center;
        color:rgba(226,233,238,1);
        margin-right: 24px;
      }
    }
    .content-fullName {
      color: rgba(226, 233, 238, 0.733);
      font-size:17px;
      margin: 15px 24px 40px 24px;
      line-height: 23px;
    }
    .content-item{
      padding: 0 24px;
      .row {
        display: flex;
        align-items: center;
        margin-bottom: 12px;

        img {
          margin-right: 11px;
        }
        span {
          font-size: 16px;
          color:rgba(226,233,238,0.73);
        }
      }
    }
  }
}
</style>
