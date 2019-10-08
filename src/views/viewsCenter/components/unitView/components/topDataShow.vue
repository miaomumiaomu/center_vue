<template>
  <el-row type="flex" justify="space-between" class="top-data-show">
    <el-col v-for="(item, index) in data" :key="index" class="item">
      <div class="table">
        <div class="td">
          <img :src="getImage(index)" alt="未获取到图片">
        </div>
        <div class="td">
          <div>{{item.name || '从业人员'}}</div>
          <div>
            <iCountUp :startVal="0" :endVal="Number(item.value) || 0" :decimals="0" :duration="2" :options="countUpOptions"/>
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>
<script>
import{ getCommunityCommon } from '@/api/viewsCenter/unitView'
import iCountUp from "vue-countup-v2";
export default {
  data() {
    return {
      data: [],
      image: ['unit-sum', 'static-management', 'strength-management', 'key-management', 'employee'],
      countUpOptions: {
        useEasing: true,
        useGrouping: true,
        separator: ",",
        decimal: "."
      },
    }
  },
  props: {
    code: Object
  },
  components: {
    iCountUp,
  },
  watch: {
    code() {
      this.getCommunityCommon()
    }
  },
  mounted () {
    this.getCommunityCommon()
  },
  methods: {
    getImage(index) {
      let url = this.image[index]
      return require('@/assets/views-center/unit-view/' + url + '.png')
    },
    getCommunityCommon() {
      getCommunityCommon({ ...this.code }).then(res => {
        let sum = 0
        res.data.forEach(item => {
          if (item.name) {
            sum += Number(item.value)
          }
        })
        res.data.unshift({ name: '单位总数', value: sum })
        this.data = res.data
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.top-data-show{
  padding: 0.833vh 0;
  background:#151D2D;
  .item{
    margin: 0 10.5px;
  }
  .table{
    display: table;
    table-layout: fixed;
    width: 100%;
    height: 8.52vh;
    background:#1B2435;
    .td{
      display: table-cell;
      vertical-align: middle;
      img{
        margin-left: 3.333vw;
        width: 3.055vh;
        height: 2.87vh;
      }
      > div{
        margin-left: 9px;
        font-size: 0.8333vw;
        font-family:AlibabaPuHuiTiM;
        color:rgba(255,255,255,0.582);
        margin-bottom: 2px;
      }
      div + div{
        margin-left: 9px;
        font-size:1.875vw;
        font-family:DINAlternate-Bold;
        font-weight:bold;
        color:rgba(255,255,255,1);
        letter-spacing: 0.76px;
      }
    }
  }
}
</style>

