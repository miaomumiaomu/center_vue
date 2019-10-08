<template>
  <div class="doorPass" v-loading="loading">
    <div class="flex">
      <div class="title">门禁通行分析 
        <communities-select v-model="CharQuery.communityId" :value="CharQuery.communityId" :placeholder="placeholder" @change="DoorPassInitChange"></communities-select>
      </div>
      <div class="record"><router-link :to="{path:'/dataCenter/dataView/passRecord',query:{personId:personId,type:'Access'}}">查看详细记录 ></router-link></div>
    </div>
    <div  class="flex" v-if="CountData.accessPassCnt">
      <div></div>
      <div>抓拍统计：{{CountData.accessPassCnt}}次</div>
    </div>
    <div>
      <div v-if="isCharData" class="flexAround">
        <DoorPassPlace :id="this.DoorPassPlace" :CharData="CharData" :name="'门禁同行分析'"></DoorPassPlace>
        <div  class="TopInfo">
          <h4>门禁通行TOP5</h4>
          <ul>
            <li v-for="(item, index) in Top" :key="index" >
              <span>{{index+1}}</span>
              <span>{{item.communityName}}</span>
              <span class="inBlock">{{item.name}}</span>
              <span class="statisCnt">{{item.statisCnt}} 次</span>
            </li>
          </ul>
        </div>
      </div>
      <div v-else class="none">暂无数据</div>
    </div>
  </div>
</template>

<script>
import { getDoorPass, getDoorPassCount, getDoorPassTop } from "@/api/faceUser/doorPass";

export default {
  name: 'doorPass',
  props: {
    personId: null,
    show: Number,
    name:String
  },
  components: {
    DoorPassPlace: () => import("@/common/component/Charts/pieChart"),
  },
  data() {
    return {
      chart: null,
      DoorPassPlace: 'DoorPassPlace',
      value: '',
      placeholder: '小区选择',
      CharData: [],
      isCharData: Boolean, //是否有数据
      CountData: {},
      isCount: Boolean, //是否有统计数据
      Top: {},
      CharQuery: {
        personId: this.personId,
        communityId: '',
      },
      loading: false,
    };
  },
  created() {
    this.query()
  },
  // watch: {
  //   show: 'DoorPassInit'
  // },
  methods: {
    // DoorPassInit() {
    //   // if(this.show > 5 && this.show < 7) {
    //     this.query();
    //   // }
    // },
    DoorPassInitChange() {
      this.$nextTick(() => {this.query()})
    },
    query() {
      this.loading = true;
      getDoorPass(this.CharQuery).then( res => {
        this.loading = false;
        if(res.data.length === 0) {
          this.isCharData = false;
          this.CharData = [];
        }else {
          this.isCharData = true;
          this.CharData = res.data;
        }
     })
     
     getDoorPassCount(this.CharQuery).then( res => {
       this.loading = false;
       if(res.data.accessPassCnt) {
          this.isCount = false;
          this.CountData = {};
        }else {
          this.isCount = true;
          this.CountData = res.data;
        }
     })
      
      let CharQuery_ = { personId: this.personId, communityId: this.value, top: 5 }
      getDoorPassTop(CharQuery_).then( res => {
        this.Top = res.data
      })
    }
  },
};
</script>
<style lang="scss" scoped>
.doorPass {
  margin-top: 20px;
  border-bottom: 1px solid #dddddd;
  background: #E9F0F4;
  .title{
    &::before{
      position: absolute;
      top: 57%;
      left: 17px;
      background: #0fa0ff;
      width: 4px;
      height: 19px;
      margin-top: -8px;
      content: "";
    }
    position: relative;
    font-weight: bold;
    font-size: 18px;
    margin-bottom: 20px;
    padding-left: 27px;
    padding-top: 11px;
  }
  .record {
    float: right;
    font-weight: bold;
    font-size: 18px;
    padding-right: 27px;
    padding-top: 20px;
    color: #10A0FF;
  }
  .flex {      
    display: flex;
    justify-content: space-between;
  }
  .none {
    height: 64vh;
    width: 100%;
    text-align: center;
    line-height: 64vh;
    font-size: 13px;
    color: #909399;
  }
  .TopInfo {
    line-height: 50px;
    color: #666;
    font-size: 16px;
    span {
      margin-right: 5px;
    }
    .statisCntImg {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      vertical-align: middle;
    }
    .statisCnt {
      font-weight: bold;
      font-size: 19px;
      color: #10A0FF;
    }
    .inBlock {
      display: inline-block;
      width: 125px;
    }
  }
  .flexAround {
    display: flex;
    justify-content: space-around;
  }
}
</style>