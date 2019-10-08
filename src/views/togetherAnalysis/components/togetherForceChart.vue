<template>
  <div v-loading="loading">
    <div class="forceChart" :id="id" ></div>
    <TogetherRecord :is-open.sync="isLabelDialog" :id="personId"></TogetherRecord>
    <!-- <el-card class="Info" :body-style="{ display: 'flex' }" v-if="Object.keys(personInfo).length > 0">
      <img :src="personInfo.identityImgPath" class="image">
      <div class="InfoRight">
        <div>姓名：{{personInfo.name}}</div>
        <div >
          <div>性别：{{personInfo.sex | commonFilter('comm_sex')}}</div>
          <div>年龄：{{personInfo.age}}岁</div>
          <div>{{personInfo.identityNo}}</div>
        </div>
        <el-button class="add" @click="add" type="primary" >查看此人更多关系</el-button>
      </div>
    </el-card> -->
  </div> 
</template>

<script>
import { getPersonRelation, getPersonRelationTop } from "@/api/faceUser/relation";
import { getPersonInfo } from "@/api/faceUser/faceInfo";
import { mapState } from "vuex";

export default {
  components: {
    TogetherRecord: () => import("@/components/Together/TogetherRecord")
  },
  props: {
    relationData: {
      type: Object,
      required: true,
    },
    id: {
      type: String,
      default: "chart"
    },
    top: {
      type: Number,
      default: 0
    },
    className: {
      type: String,
      default: "chart"
    },
  },
  data() {
    return {
      chart: null,
      graph: {},
      isLabelDialog: false,
      personId: null,
      personInfo: {},
      ids:[],
      loading: false,
    };
  },
  computed: {
    ...mapState({
      faceLibraryData: state => state.commonData.faceLibraryData
    })
  },
  mounted() {
    this.chart = null;
  },
  watch: {
    relationData: 'initChart'
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    //添加节点
    async Add() {
      this.loading = true;
      var infos = this.personInfo
      let query = { persons: [{id: this.personInfo.id, limit: this.top}] }
        await getPersonRelationTop(query).then(result => {
          let Numi = 0;
          result.data[0].relations.forEach((element,index) => {
            if(this.ids.indexOf(element.id) >= 0){
              Numi += 1;
              this.loading = false;
              return Numi;
            }else{
              getPersonInfo(element.id).then(res => {
                Numi += 1;
                // if(index === 0) {
                  this.relationData.nodes[this.relationData.nodes.length - 1].value = `同行 ${element.count}次`
                // } 
                  this.relationData.nodes.push({
                  attributes: {modularity_class: 1},
                  category: 0,
                  draggable: true,
                  id: element.id,
                  name: element.nodeName,
                  info: res.data,
                  symbolSize: 50,
                  value: `同行${element.count}次`,
                  x: null,
                  y: null
                })
                this.relationData.links.push({id: element.id, source: this.relationData.nodes.length - 1, target: infos.dataIndex, label: { normal: { show: true } }});
                if(result.data[0].relations.length === Numi) {
                  this.chart.dispose();
                  this.chart = null;
                  this.$nextTick(() => {
                    this.loading = false;
                    this.initChart();
                  })
                }
              })
            }
          });
        })
        // this.relationData.nodes.push({attributes: {modularity_class: 1},
        //   category: 0,
        //   draggable: true,
        //   id: Math.floor(Math.random()*52 + 1),
        //   name: '测试',
        //   info: {images: [{imgPath: "/files/group1/M00/03/8E/wKgKzFyGVi2ABqK2AAAJnjqIg3s84.jpeg"}]},
        //   symbolSize: 50,
        //   value: 100,
        //   x: null,
        //   y: null
        //   })
        // this.relationData.links.push({id:1111, source: this.relationData.nodes.length - 1, target: infos.dataIndex});
        // this.chart = null;
        // this.$nextTick(() => {
          // this.initChart();
        // })
    },
    formatter(val,ticket,callback) {
      var _faceLibraryData = this.faceLibraryData
      var HTML;
      var graph = this.relationData;
      if(val.dataType === 'node') {
        HTML = `
          <div style="padding: 10px">
            <div style="display: flex">
              <img src="${val.data.info.images[0].imgPath ? val.data.info.images[0].imgPath : ''}" style="width: 100px; height: 120px;" />
              <div style="margin-left: 10px">
                <div>
                  <span style="font-weight: bold; font-size: 16px; margin-top: 5px;">${val.data.info.name}</span>
                  <span style="marginLeft: 5px">${_faceLibraryData[val.data.info.personTags].name}</span>
                </div>
                <div style="font-size: 14px; margin-top: 5px;">
                  <span>${val.data.info.sex == 0 ? '未知' : val.data.info.sex == 1 ? '男': '女'}</span>
                  <span style="marginLeft: 5px">${val.data.info.age}岁</span></div>
                <div style="font-size: 14px; margin-top: 5px;">${val.data.info.mobile ? val.data.info.mobile : '未知'}</div>
                <div style="font-size: 14px; margin-top: 5px;">${val.data.info.identityNo}</div>
              </div>
            </div>
            <div style="margin-top: 5px; display: flex; justify-content: space-around;" >
              <button class="actBtn" onclick="javascript:window.location.href='#/dataCenter/application/super/faceUser?queryId=${val.data.id}'";>超级档案</button>
              <button class="actBtn" onclick="javascript:window.location.href='#/dataCenter/application/faceTrackAnalysis?personId=${val.data.id}'">轨迹分析</button>
              <button class="actBtn" onclick="javascript:window.location.href='#/dataCenter/application/togetherAnalysis?personId=${val.data.id}'">同行分析</button>
            </div>
          </div>`
        return HTML
      }else if(!val.data.info && val.dataType === 'node') {
        return
      }
    },
    initChart() {
      this.loading = true;
      if(this.chart) {
        this.chart.dispose();
        // this.chart = null;
      }
      if(Object.keys(this.relationData).length > 0) {
        this.ids = new Array();
        this.chart = echarts.init(this.$el);
        var graph =  this.relationData;
        var categories = [];
        for (var i = 0; i < 3; i++) {
          categories[i] = {
            name: i === 0  ? '中心人' : '人' ,
          };
        }
        const ip = process.env.NODE_ENV === "development" ? process.env.IP : location.host;
        graph.nodes.forEach((node,index) => {
          this.ids.push(node.id)
          node.symbolSize = node.symbolSize // index < 6 ? node.symbolSize + 10 : node.symbolSize;
          node.category = node.attributes.modularity_class;
          node.x = node.y = null;
          node.draggable = true;
          node.symbol = 'image://http://' + ip + node.info.images[0].imgPath // node.info.images[0].imgPath.indexOf('group1') === 0 ? 'image://http://' + ip + '/' + node.info.images[0].imgPath : 'image://http://' + ip + node.info.images[0].imgPath;
          node.label = {
            normal: {
                show: true,
                position: 'bottom',
                color: '#fff' // 黑暗主题
              }
          };
        });
        this.chart.setOption({
          tooltip: {
            enterable: true,
            position: "top",
            formatter: this.formatter
          },
          legend: [
            {
              data: categories.map(function(a) {
                return a.name;
              }),
              textStyle: {
                color: '#9dbde7' // 黑暗主题
              }
            }
          ],
          animation: false,
          series: [
            {
              type: "graph",
              layout: "force",
              data: graph.nodes,
              links: graph.links,
              categories: categories,
              roam: true,
              focusNodeAdjacency: true,
              label: {
                normal: {
                  position: "right"
                }
              },
              force: {
                repulsion: 1000,
                edgeLength:[150, 150]
              }
            }
          ]
        });
        this.$nextTick(() => {
          this.loading = false;
        })
        // 监听chart
        this.chart.on('click', {dataType: 'edge'}, (e) => {
          let Tar, Sor
          //查此线连接的双节点
          this.relationData.nodes.forEach((item, index) => {
            if(index == e.data.target) {
              Tar = item.id
            }
            if(index == e.data.source) {
              Sor = item.id
            }
          });
          this.personId = `${Tar},${Sor}`;
          this.isLabelDialog = true;
        });
        this.chart.on('click', {dataType: 'node'}, (e) => {
          let val = e.data.info;
          this.personInfo = {id: val.id, identityImgPath: val.images[0].imgPath,name: val.name,sex: val.sex,age: val.age, identityNo: val.identityNo, dataIndex: e.dataIndex}
          this.$nextTick(() => {
            this.Add()
          })
        });
      }else {
        this.chart.dispose();
        this.chart = null;
      }
    },
  }

};
</script>
<style lang="scss" scoped>
.forceChart {
  width: 100%;
  height: 100%;
  margin: 0 auto;
}
.diy {
  width: 30px;
  height: 30px;
}
.Info {
    z-index: 100;
    margin: 20px;
    position: absolute;
    width: 340px;
    word-break: break-all;    
    right: -1%;
    top: 5%;
    .image {
      width: 100px;
      height: 120px;
    }
    .InfoRight{
      padding: 14px 0 0  14px;
      line-height: 25px;
    }
  }

</style>