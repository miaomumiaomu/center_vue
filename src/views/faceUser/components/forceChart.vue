<template>
  <div v-loading="loading">
    <div class="forceChart" :id="id" ></div>
    <TogetherRecord :is-open.sync="isLabelDialog" :id="personId"></TogetherRecord>
  </div> 
</template>

<script>
import { getHouseRelation, getPersonRelationTop } from "@/api/faceUser/relation";
import { getPersonInfo } from "@/api/faceUser/faceInfo";

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
    isloading: {
      type: Boolean,
      required: true,
      default: true
    },
    className: {
      type: String,
      default: "chart"
    },
    width: {
      type: String,
      default: "700px"
    },
    height: {
      type: String,
      default: "400px"
    }
  },
  data() {
    return {
      chart: null,
      graph: {},
      personId: null,
      isLabelDialog: false,
      loading: false,
      ids: [],
      HouseInfo: {}
    };
  },
  created() {
    this.chart = null;
    this.loading = true;
  },
  watch: {
    relationData: 'initChart',
    isloading: 'loadingFun'
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    loadingFun() {
      this.loading = false
    },
    async Add() {
      this.loading = true;
      var infos = this.HouseInfo
      let query = { nodeId: this.HouseInfo.nodeId, nodeType: "House" }
        await getHouseRelation(query).then(result => {
          let Numi = 0;
          result.data[0].relations.forEach((element,index) => {
            if(this.ids.indexOf(element.id) >= 0) {
              Numi += 1;
              return Numi;
            }else{
              getPersonInfo(element.id).then(res => {
                Numi += 1;
                  this.ids.push(element.id)
                // if(index === 0) {
                  this.relationData.nodes[this.relationData.nodes.length - 1].value =  element.relationType === 'OwnerHouse' ? '业主' : element.relationType  === 'HouseMember' ? '家庭成员' : '租客'
                // } 
                  this.relationData.nodes.push({
                  attributes: {modularity_class: 1},
                  category: 0,
                  draggable: true,
                  id: element.id,
                  name: element.nodeName,
                  info: res.data,
                  symbolSize: 50,
                  value: element.relationType === 'OwnerHouse' ? '业主' : element.relationType  === 'HouseMember' ? '家庭成员' : '租客',
                  x: null,
                  y: null
                })
                this.relationData.links.push({id: element.id, source: this.relationData.nodes.length - 1, target: infos.dataIndex, label: { normal: { show: true } }});
                if(result.data[0].relations.length === Numi) {
                  this.chart.dispose();
                  this.chart = null;
                  this.$nextTick(() => {
                    this.initChart();
                  })
                }
              })
            }
          });
          console.log(this.relationData)
          this.loading = false
        })
    },
    formatter(val,ticket,callback) {
      var HTML;
      var graph = this.relationData;
      if(val.dataType === 'node' && val.data.info) {
        HTML = `
          <div style="padding: 10px">
            <div style="display: flex">
              <img src="${val.data.info.images[0].imgPath ? val.data.info.images[0].imgPath : ''}" style="width: 100px; height: 120px;" />
              <div style="margin-left: 10px">
                <div style="font-weight: bold; font-size: 16px; margin-top: 5px;">${val.data.info.name}</div>
                <div style="font-size: 14px; margin-top: 5px;">${val.data.info.sex == 0 ? '未知' : val.data.info.sex == 1 ? '男': '女'}</div>
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
      if(Object.keys(this.relationData).length > 0 && this.relationData.nodes[0] !== undefined) {
        this.ids = new Array();
        this.chart = echarts.init(this.$el);
        var graph =  this.relationData;
        var categories = [];
        for (var i = 0; i < 4; i++) {
          categories[i] = {
            name: i === 0  ? '中心人' : i === 1 ?'人' : i === 2 ? '车' : '房屋'
          };
        }
        const ip = process.env.NODE_ENV === "development" ? process.env.IP : location.host;
        console.log(location.host)
        graph.nodes[0] !== undefined && graph.nodes.forEach((node) => {
          this.ids.push(node.id)
          node.symbolSize = node.symbolSize;
          node.category = node.attributes.modularity_class;
          node.x = node.y = null;
          node.draggable = true;
          node.symbol =  node.info ? 'image://http://' + ip + node.info.images[0].imgPath : node.category === 2 ? `image://${require('@/assets/car.png')}` : `image://${require('@/assets/house.png')}`
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
            formatter: this.formatter,
            showDelay: 250
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
                repulsion: 500,
                edgeLength:[200, 200]
              }
            }
          ]
        });
        this.loading = false;
        this.chart.on('click', {dataType: 'edge'}, (e) => {
          let Tar, Sor, isTogether = false
          //查此线连接的双节点
          this.relationData.nodes.forEach((item, index) => {
            if(index == e.data.target) {
              Tar = item.id
            }
            if(index == e.data.source) {
              Sor = item.id
              if (item.category !== 1) {
                isTogether = true
              }
            }
          });
          if (isTogether) {
            console.log('不是同行，不进行弹窗')
            return
          }
          this.personId = `${Tar},${Sor}`;
          this.isLabelDialog = true;
        });
        this.chart.on('click', {dataType: 'node'}, (e) => {
          if(e.data.category === 3) {
            this.HouseInfo = { nodeId: e.data.id, dataIndex: e.dataIndex }
            this.$nextTick(() => {
              this.Add()
            })
          }
          // else if(e.data.category === 1) {
          //   let val = e.data.info;
          //   this.personInfo = {id: val.id, identityImgPath: val.images[0].imgPath,name: val.name,sex: val.sex,age: val.age, identityNo: val.identityNo, dataIndex: e.dataIndex}
          //   this.$nextTick(() => {
          //     this.Add()
          //   })
          // }else {
          //   return;
          // }
        });
        }else {
        this.loading = false;
        if(this.chart){ 
          this.chart = null 
          this.chart.dispose();
        };
      }
    }
  }

};
</script>
<style lang="scss" scoped>
.forceChart {
  width: 1600%;
  height: 800px;
  margin: 0 auto;
}
.diy {
  width: 30px;
  height: 30px;
}
</style>