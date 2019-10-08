<template>
  <div class="company-list">
    <div class="content" v-for="(item, index) in list" :key="index">
      <div class="content-title">
        <div>{{ item.name }}</div>
        <div :style="{ background: color[item.supervisoryLevel - 1] }">{{ item.supervisoryLevel | commonFilter('supervisory_level') }}</div>
      </div>
      <div class="container">
        <div class="content-fullName">{{ item.fullName }}</div>
        <div class="content-info">
          <div style="margin-bottom: 20px">
            <span class="margin-right">入职时间:</span>
            <span>{{ item.time }}</span>
          </div>
          <div style="margin-bottom: 5px">
            <span class="margin-right">姓ㅤㅤ名:</span>
            <span>{{ '啊啊啊' }}</span>
          </div>
          <div style="margin-bottom: 5px">
            <span class="margin-right">手机号码:</span>
            <span>{{ '啊啊啊' }}</span>
          </div>
          <div>
            <span class="margin-right">身份证号:</span>
            <span>{{ '啊啊啊' }}</span>
          </div>
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
.company-list {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  .content{
    display: inline-block;
    width: 410px;
    min-height: 210px;
    background:rgba(25, 37, 61, 1);
    border-radius:4px;
    border:1px solid rgba(59, 76, 110, 1);
    // margin-right: 30px;
    margin-bottom: 30px;

    .content-title{
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 51px;
      background:linear-gradient(360deg,rgba(44, 95, 198, 0.416),rgba(70, 179, 240, 0.416) 100%);
      div:first-child{
        font-size: 20px;
        color:rgba(255,255,255,1);
        margin-left: 30px;
      }
      div + div{
        width: 58px;
        height: 20px;
        line-height: 21px;
        background:#3286E0;
        border-radius:2px;
        font-size: 12px;
        text-align: center;
        color:rgba(226,233,238,1);
        margin-right: 30px;
      }
    }
    .container {
      padding: 20px 37px 20px 30px;
      .content-fullName {
        color: rgba(226, 233, 238, 0.733);
        font-size: 17px;
        line-height: 23px;
        letter-spacing: 1px;
        margin-bottom: 10px;
      }
      .content-info {
        font-size: 16px;
        color: rgba(226, 233, 238, 0.733);
        .row {
          margin-bottom: 12px;
        }
        .margin-right {
          margin-right: 12px;
        }
      }
    }
  }
}
</style>
