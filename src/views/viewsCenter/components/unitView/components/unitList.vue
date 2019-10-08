<template>
  <div class="unit-list">
    <div class="header">
      <div class="title">单位列表</div>
      <div class="select">
        <el-radio-group v-model="radioList" @change="checkboxChange" size="small">
          <el-radio-button label="全部"></el-radio-button>
          <el-radio-button label="正常管理"></el-radio-button>
          <el-radio-button label="加强管理"></el-radio-button>
          <el-radio-button label="重点管理"></el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <div class="menu">
      <el-row type="flex" justify="space-between"> 
        <el-col class="menu-item" v-for="(item, index) in unitData" :key="index" @click.native="menuClick(item.name, index)" :style="{ borderColor:  current == index ? '#357ED5': '' }">
          <div class="menu-item-bar">
            <img :src="getImage(item.name, index)" class="image">
            <div class="title" :style="{ color:  current == index ? '#357ED5': '' }">{{item.name}}</div>
            <div class="sum" :style="{ color:  current == index ? '#357ED5': '' }">{{item.value}}家</div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div ref="contentWheel" class="content" style="margin-top: 1.11vh;" @mousewheel="wheel">
      <el-row :gutter="20">
        <el-col :span="8" :style="`margin-top: ${index > 2 ? '1.1111vh' : 0};`" v-for="(item, index) in unitList" :key="index"  >
          <div class="content-item" @click="itemClick(item)">
            <div class="image-bar">
              <div class="logo-bar">
                <div class="logo">
                  <span class="logo-content" :style="{ backgroundColor: images[item.industryType].color }">{{images[item.industryType].name}}</span>
                  <span class="triangle" :style="{ borderLeftColor: images[item.industryType].color }"></span>
                </div>
              </div>
              <img v-if="item.imgUrl" :src="item.imgUrl" class="image">
              <img v-else src="@/assets/no-image.png" alt="" class="image">
            </div>
            <div style="display: inline-block;padding: 0.46vh 0 0.46vh 0.833vw;">
              <div class="content-title">
                <div :title="item.name">{{item.name}}</div>
                <span :class="{ 'title-static': item.supervisoryLevel == 1, 'title-strength': item.supervisoryLevel == 2, 'title-key': item.supervisoryLevel == 3, }">{{checkList[item.supervisoryLevel - 1]}}</span>
              </div>
              <div class="content-name">{{item.legalPersonName}}</div>
              <div class="content-tel">{{item.legalPersonTel}}</div>
              <div class="content-addr" :title="item.fullName">{{item.fullName}}</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <unit-form :is-open.sync="isFormDialog" :id="unitFormId" :isView="true"/>
  </div>
</template>
<script>
import{ getCommunityIndustryType, getCommunitiesList } from '@/api/viewsCenter/unitView'
export default {
  data() {
    return {
      unitData: [], //行业类型菜单数据
      checkList: ['正常管理', '加强管理', '重点管理'],
      radioList: '全部',
      current: 0,
      currentKey: null,//菜单字典值
      unitList: [],
      images: [
        {name: '全部',icon: 'all', color: ''}, 
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
      loading: false,
      pageNo: 1,
      total: 0,
      isFormDialog: false,
      unitFormId: null
    }
  },
  components: {
    unitForm: () => import('@/views/unitManage/components/unitForm')
  },
  props: {
    code: Object
  },
  watch: {
    code() {
      this.getCommunityIndustryType()
      this.getCommunitiesList(true)
    }
  },
  mounted() {
    this.getCommunityIndustryType()
    this.getCommunitiesList()
  },
  methods: {
    getImage(name, index) {
      let isCurrent = index == this.current
      let url = null
      this.images.find((item, index) => {
        if (item.name === name) {
          url = this.images[index].icon
          return true
        } else {
          return false
        }
      })
      if (isCurrent) {
        url = `select/${url}`
      } else {
        url = `static/${url}`
      }
      return require('@/assets/views-center/unit-view/' + url + '.png')
    },
    menuClick(name, index) {
      this.current = index
      if(!this.current) {
        this.currentKey = null
      } else {
        this.images.find((item, index) => {
          if (item.name === name) {
            this.currentKey = index
            return true
          } else {
            return false
          }
        })
      }
      
      this.getCommunitiesList(true)
    },
    itemClick(data) {
      this.isFormDialog = true
      this.unitFormId = data.id
    },
    wheel(e) {
      if(e.wheelDelta > 0) {
        return
      }
      if (this.loading) {
        return
      }
      let node = this.$refs.contentWheel
      if (node.clientHeight + node.scrollTop >= node.scrollHeight) {
        if ((this.pageNo - 1) * 9 < this.total) {
          this.getCommunitiesList()
        }
      }
    },
    checkboxChange(value) {
      this.getCommunitiesList(true)
    },
    getCommunityIndustryType() {
      getCommunityIndustryType({ ...this.code }).then(res => {
        let sum = 0
        res.data.forEach((item, index) => {
          sum += item.value
        })
        res.data.unshift({ dictValue: '0', name: '全部', value: sum })
        this.unitData = res.data
      })
    },
    getCommunitiesList(isReset) {
      let _filter_eq_supervisoryLevel = null
      if (this.radioList === '正常管理') {
        _filter_eq_supervisoryLevel = 1
      } else if(this.radioList === '加强管理'){
        _filter_eq_supervisoryLevel = 2
      } else if(this.radioList === '重点管理') {
        _filter_eq_supervisoryLevel = 3
      }
      this.loading = true
      let pageNo = isReset ? 1 : this.pageNo
      //以前的接口，导致多一步转换参数
      let { communityCode: _filter_like_communityCode, policeAreaCode: _filter_like_policeAreaCode } = this.code
      getCommunitiesList({ pageNo, pageSize: 9, _filter_eq_supervisoryLevel, _filter_eq_industryType: this.currentKey,  _filter_like_communityCode, _filter_like_policeAreaCode }).then(res => {
        if (isReset) {
          this.unitList = res.data.rows
          this.pageNo = 2
        } else {
          if (res.data.rows) {
            this.unitList.push(...res.data.rows)
            this.pageNo ++
          }
        }
        this.total = res.data.total
        this.loading = false
      })
    }
  },
}
</script>
<style lang="scss" scoped>
.unit-list{
  padding: 1.944vh 1.875vw 2.31vh 1.927vw;
  height: 65.7vh;
  background:rgba(21,29,45,1);
  .header{
    .title{
      display: inline-block;
      font-size:0.73vw;
      font-family:AlibabaPuHuiTiM;
      color:rgba(226,233,238,1);
      line-height:1.04vw;
      margin-bottom: 1.203vh;
      &::before{
        content: '';
        display: inline-block;
        width: 0.78vw;
				height: 0.78vw;
        background: url('../../../../../assets/views-center/house-view/top-logo.png');
        background-size: 100% 100%;
        margin-top: 0.185vh;
        margin-right: 0.26vw;
      }
    }
    .select{
      float: right;
    }
  }
  .menu{
    margin: 0 -6.5px 0 -6.5px;
    .menu-item{
      position: relative;
      // width: 10.64vh;
      margin: 0 6.5px 0 6.5px;
      height: 8.7vh;
      background:rgba(27,36,53,0.6716);
      border:1px solid rgba(38,48,67,1);
      cursor: pointer;
      .menu-item-bar{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
      }
      .image{
        width: 1.457vw;
      }
      .title{
        font-size:0.78vw;
        font-family:AlibabaPuHuiTiR;
        color:rgba(107,133,166,1);
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        letter-spacing:3px;
        line-height:21px;
      }
      .sum{
        font-size:0.677vw;
        font-family:PingFangSC-Semibold;
        font-weight:600;
        color:rgba(107,133,166,1);
      }
    }
  }
  .content{
    overflow-y: auto;
    overflow-x: hidden;
    height: 48.47vh;
    .content-item{
      display: flex;
      align-items: center;
      width: 100%;
      height: 15vh;
      padding: 1.57vh 0.885vw 1.57vh;
      background:rgba(18,24,37,1);
      border:1px solid rgba(49,75,126,1);
      cursor: pointer;
      .image-bar{
        .logo-bar{
          position: relative;
          .logo{
            position: absolute;
            top: 0;
            left: 0;
            width: 2.1875vw;
            height: 1.944vh;
            overflow: hidden;
            .logo-content{
              display: inline-block;
              width: 1.875vw;
              height: 100%;
              text-align: center;
              vertical-align: top;
              background-color: blue;
              color: white;
              font-size:0.573vw;
              font-family:AlibabaPuHuiTiM;
              color:rgba(226,233,238,1);
              line-height:1.48vh;
            }
            .triangle{
              float: right;
              border-left: 0.3125vw solid blue;
              border-bottom: 1.944vh solid transparent;
            }
          }
        }
        .image{
          width: 10.37vh;
          height: 11.48vh;
          display: block;
          float: left;
        }
      }
      .content-title{
        display: flex;
        align-items: center;
        font-size:2.055vh;
        font-family:AlibabaPuHuiTiR;
        color:rgba(226,233,238,1);
        margin-bottom: 1.759vh;
        > div{
          max-width: 8vw;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        .title-static, .title-strength, .title-key {
          vertical-align: middle;
          background:rgba(25,40,65,1);
          border-radius:2px;
          opacity:0.879;
          padding: 0.185vh 0.2604vw;
          border:1px solid rgba(2,69,182,1);
          font-size:1.11vh;
          // font-family:AlibabaPuHuiTiR;
          color:rgba(226,233,238,1);
          // line-height:17px;
          margin-left: 0.2604vw;
        }
        .title-strength{
          background:rgba(51,31,20,1);
          border:1px solid rgba(182,97,2,1);
        }
        .title-key{
          background:rgba(55,20,20,1);
          border:1px solid rgba(182,33,2,1);
        }
      }
      .content-name, .content-tel, .content-addr{
        font-size:0.729vw;
        font-family:AlibabaPuHuiTiR;
        color:rgba(226,233,238,0.73);
        // line-height:20px;
        margin-bottom: 0.185vh;
        max-width: 13vw;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        &::before{
          display: inline-block;
          width: 0.5729vw;
          height: 0.5729vw;
          background: url('../../../../../assets/views-center/unit-view/name.png');
          background-size: 100% 100%;
          margin-right: 0.2604vw;
          content: '';
        }
      }
      .content-tel::before{
        width: 0.5729vw;
        height: 0.5729vw;
        background: url('../../../../../assets/views-center/unit-view/phone.png');
        background-size: 100% 100%;
        margin-right: 0.208vw;
      }
      .content-addr::before{
        width: 0.5729vw;
        height: 0.5729vw;
        background: url('../../../../../assets/views-center/unit-view/location.png');
        background-size: 100% 100%;
        margin-right: 0.208vw;
      }
    }
  }
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
