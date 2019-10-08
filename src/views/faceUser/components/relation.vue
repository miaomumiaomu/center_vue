<template>
  <div class="h100">
    <Relation :id="this.Relation" class="Relation" :relationData="relationData" :isloading="isloading"></Relation>
  </div>
</template>

<script>
import { getPersonRelationAndCar } from "@/api/faceUser/relation";
import { getPersonInfo } from "@/api/faceUser/faceInfo";

export default {
  name: "visiter",
  components: {
    Relation: () => import("./forceChart")
  },
  props: {
    personId: null
  },
  data() {
    return {
      chart: null,
      Relation: "relation",
      value: null,
      placeholder: "小区选择",
      relationData: {}, //图数据

      PersonData: [], //人数据
      CarData: [], //车数据
      HouseData: [], //房数据
      Person: {},
      Car:{},
      House: {},
      mainData: null,
      isloading: true,
    };
  },

  created() {
    this.init();
  },
  methods: {
    async init() {
      let link = new Array();
      let node = new Array();
      await getPersonRelationAndCar(this.personId).then(res => {
        if (res.status === 200) {
          this.mainData = res.data[0] || {}
        }
      });
      if(this.mainData.relations) {
        const { id, nodeName, relations =[], carCount, houseCount } = this.mainData;
        await getPersonInfo(this.personId).then(res => {
          node.push({
            id: id,
            name: nodeName,
            symbolSize: 50,
            info: res.data,
            attributes: { modularity_class: 0 },
            value: `${carCount ?  '拥有' : houseCount ? '业主' : '同行' + relations[0].count + '次'}`
          });
          link.push({
            id: id,
            source: 1,
            target: 0,
            label: { normal: { show: true } },
          });
        })
        await this.$nextTick(() => {
            relations && relations.forEach((element, index) => {
              if(element.nodeType  === 'Person') {
                this.PersonData.push(element)
              }else if(element.nodeType === 'Car') {
                this.CarData.push(element)
              }else if(element.nodeType === 'House') {
                this.HouseData.push(element)
              }
            });
          })
        await Object.keys(this.CarData).length > 0 && await this.CarQuery().then(res => {
                this.Car = { links: res.link, nodes: res.node }
              })
        await Object.keys(this.HouseData).length > 0 && await this.HouseQuery().then(res => {
                this.House = { links: res.link, nodes: res.node }
              })
        await Object.keys(this.PersonData).length > 0 && await this.PersonQuery();
        await this.$nextTick(() => {
          if(Object.keys(this.CarData).length > 0 && Object.keys(this.HouseData).length > 0 && Object.keys(this.PersonData).length > 0) {
            console.log("有车 有房 有人")
            link = link.concat(this.Car.links, this.House.links, this.Person.links)
            node = node.concat(this.Car.nodes, this.House.nodes, this.Person.nodes)
          }else if(!Object.keys(this.CarData).length > 0 && Object.keys(this.HouseData).length > 0 && Object.keys(this.PersonData).length > 0) {
            console.log("无车 有房 有人")
            link = link.concat(this.House.links, this.Person.links)
            node = node.concat(this.House.nodes, this.Person.nodes)
          }else if(Object.keys(this.CarData).length > 0 && !Object.keys(this.HouseData).length > 0 && Object.keys(this.PersonData).length > 0) {
            console.log("有车 无房 有人")
            link = link.concat(this.Car.links, this.Person.links)
            node = node.concat(this.Car.nodes, this.Person.nodes)
          }else if(!Object.keys(this.CarData).length > 0 && !Object.keys(this.HouseData).length > 0  && Object.keys(this.PersonData).length > 0) {
            console.log("无车 无房 有人")
            link = link.concat(this.Person.links)
            node = node.concat(this.Person.nodes)
          }else if(Object.keys(this.CarData).length > 0 && Object.keys(this.HouseData).length > 0 && !Object.keys(this.PersonData).length > 0) {
            console.log("有车 有房 无人")
            console.log()
            link = link.concat(this.Car.links, this.House.links)
            node = node.concat(this.Car.nodes, this.House.nodes)
          }else if(!Object.keys(this.CarData).length > 0 && Object.keys(this.HouseData).length > 0 && !Object.keys(this.PersonData).length > 0) {
            console.log("无车 有房 无人")
            link = link.concat(this.House.links)
            node = node.concat(this.House.nodes)

          }else if(Object.keys(this.CarData).length > 0 && !Object.keys(this.HouseData).length > 0 && !Object.keys(this.PersonData).length > 0) {
            console.log("有车 无房 无人")
            link = link.concat(this.Car.links)
            node = node.concat(this.Car.nodes)

          }else if(!Object.keys(this.CarData).length > 0 && !Object.keys(this.HouseData).length > 0  && !Object.keys(this.PersonData).length > 0) {
            console.log("无车 无房 无人")
            this.isloading = false
            return
          }
            this.$nextTick(() => {
              this.relationData = { links: link, nodes: node }
              console.log(this.relationData)
            })
        })
      }else {
        this.$notify({
        title: "提示",
        message: "暂无关系链数据",
        type: "warning",
        duration: 2000
        });
        this.isloading = false
        return;
      }
    },
    //人
    async PersonQuery() {
      let link = new Array();
      let node = new Array();
        for(let i = 0; i < this.PersonData.length; i++) {
          await getPersonInfo(this.PersonData[i].id).then(res => {
            if(res.status === 200) {
              node.push({
                id: this.PersonData[i].id,
                name: this.PersonData[i].nodeName,
                symbolSize: 50,
                info: res.data,
                attributes: {
                  modularity_class: 1
                },
                value: `${this.PersonData[i + 1] ? '同行' + this.PersonData[i + 1].count + '次': '拥有'}`
              })
              link.push({
                id: this.PersonData[i].id ,
                source: i + 1 + this.HouseData.length + this.CarData.length,
                target: 0,
                label: { normal: { show: true } },
              });
            }
            if(this.PersonData.length === i + 1) {
                this.Person = { links: link, nodes: node }
            }
          })
        }
    },
    //车
    async CarQuery() {
      let _HouseOneRelationType;
      if(this.HouseData[0] && this.HouseData[0].relationType) {
        _HouseOneRelationType  = this.HouseData[0].relationType
      }
      return new Promise(resolve => {
        let link = new Array();
        let node = new Array();
        for( let i = 0 ; i < this.CarData.length; i++ ) {
          node.push({
            id: this.CarData[i].id,
            name: this.CarData[i].nodeName,
            symbolSize: 50,
            attributes: {
              modularity_class: 2
            },
            value: `${this.CarData[i + 1] ? '拥有' : _HouseOneRelationType === 'OwnerHouse' ? '业主' : _HouseOneRelationType === 'HouseMember' ? '家庭成员' : _HouseOneRelationType === 'HouseRent' ? '租客' : '同行'}`
          })
          link.push({
            id: this.CarData[i].id,
            source: i + 2,
            target: 0,
            label: { normal: { show: true } },
          });
          if ( i === this.CarData.length -1 ) {
            resolve({ link, node })
          }
        }
      })
    },
    //房
    async HouseQuery() {
      return new Promise(resolve => {
        let link = new Array();
        let node = new Array();
        for( let i = 0 ; i < this.HouseData.length; i++ ) {
          let _HouseData = this.HouseData[i + 1] 
          node.push({
            id: this.HouseData[i].id,
            name: this.HouseData[i].nodeName,
            symbolSize: 50,
            attributes: {
              modularity_class: 3
            },
            value: `${ _HouseData ? _HouseData.relationType === 'OwnerHouse' ? '业主' : _HouseData.relationType === 'HouseMember'  ? '家庭成员' : '租客' : this.PersonData[0] ? '同行' + this.PersonData[0].count + '次' : ''}`
          })
          link.push({
            id: this.HouseData[i].id,
            source: i + 2 + this.CarData.length,
            target: 0,
            label: { normal: { show: true } },
          });
          if ( i === this.HouseData.length -1 ) {
            // console.log(link, node)
            resolve({ link, node })
          }
        }
      })
    },
  }
};
</script>
<style lang="scss" scoped>
.h100 {
  height: 100%;
  .Relation {
    height: 100% !important;
  }
}
</style>