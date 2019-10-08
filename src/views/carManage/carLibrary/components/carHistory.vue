<template>
  <el-dialog class="form-layer" title="房屋信息变更历史" :visible.sync="isAddFormDialog" width="900px" append-to-body>
    <el-table ref="listTabel" :data="data" highlight-current-row >
      <el-table-column type="index" label="序号" width="50" align="center" />
      <el-table-column prop="fullName" label="房屋" min-width="50" align="center" />
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
import { getCarHistory } from "@/api/carManage";
export default {
  data() {
    return {
      isAddFormDialog: false,
      data: [],
    }
  },
  props: {
    personId: [String, Number],
  },
  methods: {
    open(carId) {
      this.isAddFormDialog = true
      getCarHistory({ carId }).then(res => {
        if (res.status === 200) {
          this.data = res.data
        }
      })
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
