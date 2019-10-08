<template>
  <div class="company-list">
    <div v-for="(item, index) in list" :key="index" class="card">
      <div class="content-item">
        <div class="image-bar">
          <div class="logo">
            <span class="logo-content" :style="{ backgroundColor: images[item.industryType <= 9 ? item.industryType : 0].color }">
              {{ images[item.industryType <= 9 ? item.industryType : 0].name }}
            </span>
            <span class="triangle" :style="{ borderLeftColor: images[item.industryType <= 9 ? item.industryType : 0].color }"></span>
          </div>
          <img :src="`/api/addrCompany/${item.id}/img`" class="image">
        </div>
        <div style="display: inline-block; margin-left: 16px">
          <div class="content-title">
            <div :title="item.name">{{item.name}}</div>
            <span :class="{
              'title-static': item.supervisoryLevel == 1,
              'title-strength': item.supervisoryLevel == 2,
              'title-key': item.supervisoryLevel == 3 }"
            >{{checkList[item.supervisoryLevel - 1]}}</span>
          </div>
          <div class="content-name">{{item.legalPersonName}}</div>
          <div class="content-tel">{{item.legalPersonTel}}</div>
          <div class="content-addr">{{item.address}}</div>
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
      checkList: ['正常管理', '加强管理', '重点管理'],
      images: [
        {name: '',icon: 'all', color: ''}, 
        {name: '居住', icon: 'live', color: '#0296B6'}, 
        {name: '商业', icon: 'commerce', color: '#0245B6'},
        {name: '办公', icon: 'work', color: '#3A4399'},
        {name: '娱乐', icon: 'recreation', color: '#894E53'},
        {name: '医疗', icon: 'treatment', color: '#B67602'},
        {name: '教育', icon: 'education', color: '#4D4D4D'},
        {name: '政府', icon: 'government', color: '#75712F'},
        {name: '工厂', icon: 'factory', color: '#2F754A'},
        {name: '其它', icon: 'other', color: '#0296B6'}
      ],
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
  flex-wrap: wrap;
}
.card {
  display: inline-block;
  margin-right: 16px;
  margin-bottom: 11px;
  cursor: pointer;
}
.content-item{
  display: flex;
  align-items: center;
  width: 459px;
  height: 169px;
  padding: 22px 17px;
  background:rgba(25, 37, 61, 1);
  border:1px solid rgba(59, 76, 110, 1);
  cursor: pointer;
  .image-bar{
    position: relative;
    .logo{
      position: absolute;
      display: flex;
      top: 0;
      left: 0;
      overflow: hidden;
      .logo-content{
        display: inline-block;
        line-height: 21px;
        width: 36px;
        height: 21px;
        text-align: center;
        background-color: blue;
        color: white;
        font-size: 12px;
        color:rgba(226,233,238,1);
      }
      .triangle{
        float: right;
        border-left: 6px solid blue;
        border-bottom: 21px solid transparent;
      }
    }
    .image{
      width: 129px;
      height: 126px;
      float: left;
    }
  }
  .content-title{
    display: flex;
    align-items: center;
    font-size: 22px;
    color:rgba(226,233,238,1);
    margin-bottom: 24px;
    > div{
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      max-width: 210px;
    }
    .title-static, .title-strength, .title-key {
      vertical-align: middle;
      background:rgba(50, 134, 224, 1);
      border-radius:2px;
      padding: 4px 5px;
      font-size: 12px;
      color:rgba(226,233,238,0.92);
      margin-left: 10px;
    }
    .title-strength{
      background:rgba(198, 124, 29, 1);
    }
    .title-key{
      background:rgba(177, 82, 46, 1);
    }
  }
  .content-name, .content-tel, .content-addr{
    font-size: 14px;
    color:rgba(226,233,238,0.73);
    // line-height:20px;
    margin-bottom: 5px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .content-name::before{
    display: inline-block;
    width: 10px;
    height: 10px;
    background: url('~@/assets/views-center/unit-view/name.png');
    background-size: 100% 100%;
    margin-right: 5px;
    content: '';
  }
  .content-tel::before{
    display: inline-block;
    width: 11px;
    height: 11px;
    background: url('~@/assets/views-center/unit-view/phone.png');
    background-size: 100% 100%;
    margin-right: 5px;
    content: '';
  }
  .content-addr::before{
    display: inline-block;
    width: 12px;
    height: 12px;
    background: url('~@/assets/views-center/unit-view/location.png');
    background-size: 100% 100%;
    margin-right: 5px;
    content: '';
  }
}
</style>
