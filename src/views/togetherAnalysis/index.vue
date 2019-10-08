<template>
  <div class="face-track-analysis">
    <el-form class="form relative" @keyup.enter.native="onSubmit">
      <div class="title">同行分析</div>
      <el-button type="primary" size="mini" icon="el-icon-plus" @click="this.PictureDialog">选择分析对象</el-button>
      <!-- <span style="color: #000">Top N</span>
      <el-select v-model="top" placeholder="请选择">
        <el-option
          v-for="item in tops"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select> -->
    </el-form>
    <div class="faceInfo" v-if="isPersonInfo">
      <div class="relative">
        <el-card class="Info" :body-style="{ display: 'flex' }">
          <img :src="personInfo.identityImgPath" class="image">
          <div class="InfoRight">
            <div>姓名：{{personInfo.name}}</div>
            <div >
              <div>性别：{{personInfo.sex | commonFilter('comm_sex')}}</div>
              <div>年龄：{{personInfo.age}}岁</div>
              <div>{{personInfo.identityNo}}</div>
              <!-- <el-button type="text" class="button">操作按钮</el-button> -->
            </div>
          </div>
        </el-card>
      </div>
      <!-- <div class="relative" v-if="isPersonInfo">
        <el-card class="Time">
          <el-form size="mini" :model="listQuery_Time" :inline="true" @keyup.enter.native="onSubmit" label-position="right">
            <el-form-item prop="_filter_ge_stayTimeBegin_date" label="时间范围">
            </el-form-item>
            <el-form-item prop="_filter_ge_stayTimeBegin_date" label="开始">
              <el-date-picker v-model="listQuery_Time._filter_ge_stayTimeBegin_date" value-format="yyyyMMddHHmmss" type="datetime" placeholder="请选择开始时间" :picker-options="singlePickerOptions()" />
            </el-form-item>
            <el-form-item prop="_filter_le_stayTimeEnd_date" label="结束" >
              <el-date-picker v-model="listQuery_Time._filter_le_stayTimeEnd_date" value-format="yyyyMMddHHmmss" type="datetime" placeholder="请选择结束时间" :picker-options="singlePickerOptions(listQuery_Time._filter_le_stayTimeEnd_date)" />
            </el-form-item>
            <el-form-item class="search">
              <el-button type="success" size="large" @click="timeSearch">开始搜索</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div> -->
    </div>
    <TogetherForceChart v-if="isRelationDate" :id="this.togetherForceChart" :relationData="relationData" style="height: 100%" :top="top"/>
    <div v-else class="middle">暂无数据</div>
    <!-- 以图搜图 - 弹窗 -->
    <picture-layer :is-open.sync="isPictureDialog" :single="true" @complete="personnelConfirm"/>
  </div>
</template>

<script>
import { singlePickerOptions } from "@/utils";
import { getPersonRelation, getPersonRelationTop } from "@/api/faceUser/relation";
import { getPersonInfo } from "@/api/faceUser/faceInfo";

export default {
  name: "togetherAnalysis",
  components: {
    TogetherForceChart: () => import("./components/togetherForceChart"),
  },
  data() {
    return {
      isPictureDialog: false,
      togetherForceChart: "togetherForceChart",
      listQuery_Time: {
        _filter_ge_stayTimeBegin_date: null,
        _filter_le_stayTimeEnd_date: null,
      },
      personInfo: {},
      relationData: {},
      isPersonInfo: false,
      isRelationDate: false, //是否有同行数据
      top: 0,
      tops: [
        {label: '全部', value: 0},
        {label: 1, value: 1},
        {label: 2, value: 2},
        {label: 3, value: 3},
        {label: 4, value: 4},
        {label: 5, value: 5},
      ],
      singlePickerOptions: singlePickerOptions,
    };
  },
  created() {
    this.JumpQuery()
    this.$store.dispatch("commonData/getFaceLibraryData");
  },
  watch: {
    $route(){
      this.JumpQuery()
    }
  },
  activated() {
    if (Object.keys(this.$route.query).length > 0) {
      getPersonInfo(this.$route.query.personId).then( res => {
        const { age,  identityNo, images=[], name, sex } = res.data;
        this.personInfo = { identityImgPath: images[0].imgPath, name: name, sex: sex, age: age, identityNo: identityNo  }
      })
    }else {
      if(window.location.hash.indexOf('togetherAnalysis') > 0 && this.$route.params.data ) {
        this.personnelConfirm(this.$route.params.data);
      }
    }
  },
  methods: {
    timeSearch() {
      console.log(this.listQuery_Time)
    },
    async JumpQuery() {
      if(window.location.hash.split('?').length > 1 && this.personInfo.personId != window.location.hash.split('?')[1].split('=')[1] && window.location.hash.indexOf('togetherAnalysis') > 0) {
        await getPersonInfo(window.location.hash.split('?')[1].split('=')[1]).then( res => {
          const { age,  identityNo, images=[], name, sex } = res.data;
          this.personInfo = { identityImgPath: images[0].imgPath, name: name, sex: sex, age: age, identityNo: identityNo  }
        })
        this.$nextTick(() => {
          this.personnelConfirm(this.$route.query, false)
        })  
      }else {
        if(window.location.hash.indexOf('togetherAnalysis') > 0 && this.$route.params.data ) {
          this.personnelConfirm(this.$route.params.data);
        }
      }
    },
    // 人员选择完成
    async personnelConfirm(val, boolean = true ) {
      this.isPersonInfo = true;
      if(boolean) {
        this.personInfo = val;
      }
      let query = { persons: [{id: val.personId, limit: 10}] }
      val.personId && await getPersonRelationTop(query).then(res => { //限制
      // val.personId && await getPersonRelation(val.personId).then(res => { //未限制
        var result = res, Numi = 0;
        if (res.status === 200  && res.data.length > 0) {
          this.isRelationDate = true;
          const { id, nodeName, nodeType, relations=[] } = res.data[0];
          let links, nodes;
          let link = new Array();
          let node = new Array();
            getPersonInfo(val.personId).then( res => {
            node.push({id: id, name: nodeName, symbolSize: 50, 
            value: `同行 ${result.data[0].relations[Numi].count}次`, 
            info: res.data, attributes: { modularity_class:  0 }
            })
              relations && relations.forEach((element, index) => {
                  getPersonInfo(element.id).then(res => {
                    Numi += 1
                    // console.log(result.data[0].relations[Numi] ? result.data[0].relations[Numi].count : '')
                    node.push(
                    { 
                      id: element.id, 
                      name: element.nodeName, 
                      symbolSize: 50, 
                      info: res.data,
                      value: `同行 ${result.data[0].relations[Numi] ? result.data[0].relations[Numi].count + "次" : ''}`,
                      attributes: { 
                        modularity_class: nodeType == "Person" ? 1 : 2
                      },
                    })
                    link.push({ id: element.id, source: index + 1, target: 0, label: { normal: { show: true } }, })
                    if(result.data[0].relations.length === Numi) {
                      this.relationData = { links: link, nodes: node }
                    }
                  })
              })
            })
        }else {
          this.isRelationDate = false;
        }
      })
    },
    PictureDialog() {
      this.isPictureDialog = true;
    }
  },
};
</script>
<style lang="scss" scoped>
@import "~@/styles/modules/faceTrackAnalysis.scss";
  .relative {
    position: relative !important;
    
  }
  .faceInfo {
    .Info {
      z-index: 100;
      margin: 20px;
      position: absolute;
      width: 340px;
      word-break: break-all;
      .image {
        width: 100px;
        height: 120px;
      }
      .InfoRight{
        padding: 14px 0 0  14px;
        line-height: 25px;
      }
    }
    .Time {
      margin: 20px;
      z-index: 100;
      width: 340px;
      position: absolute;
      top: 170px;
    }
  }
  .search {
    float: right;
  }
  .middle {
    width: 100%;
    height: 100%;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
</style>