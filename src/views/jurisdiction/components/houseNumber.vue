<template>
  <el-dialog :visible.sync="isFormDialog" title="门牌号" width="550px" append-to-body>
    <el-transfer v-model="checkData" :data="checkList" :props="prop" :titles="['未分配的门牌号', '已分配的门牌号']" filterable></el-transfer>
    <div slot="footer">
      <el-button type="primary" size="mini" @click="allBind">全部绑定</el-button>
      <el-button type="primary" size="mini" @click="onSubmit">确定</el-button>
      <el-button size="mini" @click="isFormDialog=false">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addrTree } from "@/api/standardAssets";
import { setRoadLinkNumber, delRoadLinkNumber, getRoadNumbers, getBindNumbersByRoad } from "@/api/Jurisdiction";
import { messageTip } from '@/utils'

export default {
  data() {
    return {
      checkData: [],
      checkBaseData: [], //路原有的门牌号
      isFormDialog: false,
      checkList: [],
      search: '',
      prop: {
        key: 'id'
      },
      roadData: {}
    }
  },
  methods: {
    open(data) {
      this.roadData = data
      let districtId = data.locationId
      let type = data.location.type
      let policeRoadId = data.id
      this.isFormDialog = true
      Promise.all([this.addrTree(districtId, type), this.getRoadNumbers(policeRoadId)]).then(res => {
        getBindNumbersByRoad(districtId).then(resolve => {
          let arr = resolve.data.filter(item => !this.checkData.includes(item))
          this.checkList = this.checkList.filter(item => !arr.includes(item.id))
        })
      })
    },
    onSubmit() {
      let commonData = this.checkBaseData.filter(item => this.checkData.includes(item.locationId)).map(item => item.locationId)
      Promise.all([this.setRoadLinkNumber(this.getAddData(commonData)), this.delRoadLinkNumber(this.getDelData(commonData))]).then(res => {
        let tip = res[0] || res[1]
        messageTip(tip , '修改成功')
        this.isFormDialog = false
      })
    },
    addrTree(districtId, type) {
      return addrTree({ districtId, type }).then(res => {
        this.checkList = res.data
      })
    },
    getRoadNumbers(policeRoadId) {
      return getRoadNumbers({ policeRoadId }).then(res => {
        this.checkBaseData = res.data
        this.checkData = res.data.map(item => item.locationId)
      })
    },
    //获取添加的门牌号id
    getAddData(commonData) {
      let addData = [...this.checkData]
      for(let i = 0; i < commonData.length; i++) {
        let index = addData.indexOf(commonData[i])
        
        if (index !== -1) {
          addData.splice(index, 1)
        }
      }
      return addData
    },
    //获取删除的门牌号id
    getDelData(commonData) {
      let delData = this.checkBaseData.map(item => {
        return {
          id: item.id,
          locationId: item.locationId
        }
      })
      for(let i = 0; i < commonData.length; i++) {
        for(let j = 0; j < delData.length; j++ ) {
          if (commonData[i] === delData[j].locationId) {
            delData.splice(j, 1)
            break
          }
        }
      }
      return delData
    },
    setRoadLinkNumber(data) {
      if (!data.length) return
      let { policeAreaId, id: policeRoadId } = this.roadData
      let numberList = data
      return setRoadLinkNumber({ policeAreaId, policeRoadId, numberList, linkAllNumber: false })
    },
    delRoadLinkNumber(data) {
      if (!data.length) return
      let arr = data.map(item => item.id)
      return delRoadLinkNumber({ roadNumberIdList: arr })
    },
    allBind() {
      let { policeAreaId, id: policeRoadId } = this.roadData
      setRoadLinkNumber({ policeAreaId, policeRoadId, linkAllNumber: true }).then(res => {
        messageTip(res, '全部关联成功')
        this.isFormDialog = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
