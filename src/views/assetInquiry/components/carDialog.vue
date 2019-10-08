<template>
  <el-dialog :visible.sync="isFormDialog" title="持有车辆" width="740px" append-to-body>
    <div class="info">
      <div class="user-info"> 
        <div>{{userInfo.name}}</div>
        <face-category-list :data="faceLibraryData" :type="0" :chosen="userInfo.personTags?userInfo.personTags.split(','):[]" />
        <div>{{userInfo.identityNo}}</div>
      </div>
      <div style="float: right;">车辆信息： {{tableData.length}}</div>
    </div>
    <el-table ref="listTabel" :data="tableData" highlight-current-row >
      <el-table-column prop="plateNumber" label="车牌号" min-width="50" align="center" />
      <el-table-column prop="vehicleBrand" label="车辆品牌" min-width="50" align="center" />
      <el-table-column width="100" prop="vehicleModel" label="车辆型号" align="center" />
      <el-table-column width="120" prop="vehicleType" label="车辆类型" align="center">
        <template slot-scope="scope">
          <div>{{scope.row.vehicleType | commonFilter('vehicle_type')}}</div>
        </template>
      </el-table-column>
      <el-table-column width="80" prop="newEnergy" label="新能源" align="center">
        <template slot-scope="{row: {newEnergy}}">{{newEnergy ? '是' : '否'}}</template>
      </el-table-column>
      <el-table-column width="80" label="类别" align="center">
        <template slot-scope="scope">
          <face-category-list :data="carLibraryData" :type="0" :chosen="scope.row.libraryNums?scope.row.libraryNums.split(','):[]" />
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer">
      <el-button type="primary" size="mini" @click="isFormDialog=false">确定</el-button>
      <!-- <el-button size="mini" @click="isFormDialog=false">取消</el-button> -->
    </div>
  </el-dialog>
</template>
<script>
import { getCarByPersonId } from '@/api/carManage'
import { mapState } from "vuex";
export default {
  data() {
    return {
      tableData: [],
      isFormDialog: false,
      userInfo: {}
    }
  },
  computed: {
    ...mapState({
      faceLibraryData: state => state.commonData.faceLibraryData,
      carLibraryData: state => state.commonData.carLibraryData
    })
  },
  methods: {
    open(userInfo) {
      console.log(userInfo)
      this.isFormDialog = true
      this.getCarByPersonId(userInfo.id)
      this.userInfo = userInfo
    },
    getCarByPersonId(personId) {
      getCarByPersonId({ personId }).then(res => {
        this.tableData = res.data
      })
    }
  },
  created() {
    this.$store.dispatch("commonData/getCarLibraryData");
  },
}
</script>
<style lang="scss" scoped>
.info{
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  .user-info{
    width: 40%;
    display: flex;
    justify-content: space-between;
  }
}
</style>

