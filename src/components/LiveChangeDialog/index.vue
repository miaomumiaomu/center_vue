<template>
  <el-dialog class="form-layer" :title="isHouse ? '居住信息变更历史' : '单位信息变更历史'" :visible.sync="isAddFormDialog" width="900px" append-to-body>
    <el-table ref="listTabel" :data=" isHouse ? data : tableData" highlight-current-row >
      <el-table-column type="index" label="序号" width="50" align="center" />
      <el-table-column :prop="isHouse ? 'addrName' : 'companyName'" :label="isHouse ? '地址' : '公司名'" min-width="50" align="center" />
      <el-table-column label="加入时间/离开时间" align="center">
        <template slot-scope="{ row: { inTime, outTime } }">
          <div>{{ inTime }} / {{ outTime }}</div>
        </template>
      </el-table-column>
      <el-table-column label="加入审批人/离开审批人" align="center">
        <template slot-scope="{ row: { inUserName, outUserName } }">
          <div>{{ inUserName }} / {{ outUserName }}</div>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer">
      <el-button size="mini" @click="isAddFormDialog = false">关闭</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getLiveInfo, getCompanyHistory } from "@/api/faceLibrary";
export default {
  data() {
    return {
      isAddFormDialog: false,
      data: [],
      isHouse: true,
      tableData: []
    }
  },
  props: {
    personId: [String, Number],
  },
  methods: {
    open(val) {
      this.isHouse = val
      this.isAddFormDialog = true
      if (val) {
        getLiveInfo({ personId: this.personId }).then(res => {
          if (res.status === 200) {
            this.data = res.data
          }
        })
      } else {
        getCompanyHistory({ personId: this.personId }).then(res => {
          this.tableData = res.data
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.no-data{
  margin: 25px;
  text-align: center;
}
.live-bar{
  max-height: 400px;
  overflow: auto;
}
.live-change{
  margin: 10px 14px;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #EBEEF5;
  border-radius: 5px;
  line-height: 2;
  .change-type{
    margin-right: 20px;
  }
}
</style>

