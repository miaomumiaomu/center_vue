<template>
  <el-dialog title="从业人员" :visible.sync="visible" width="70%">
    <div class="employees-header">
      {{ company.name }}
      <el-button-group>
        <el-button :type="mode == 0 ? 'primary' : 'info'" @click="mode = 0" size="mini">
          当前从业人员
        </el-button>
        <el-button :type="mode == 1 ? 'primary' : 'info'" @click="mode = 1" size="mini">
          历史从业人员
        </el-button>
      </el-button-group>
    </div>

    <employees-current v-show="mode===0" :companyId="company.id" @updateHistory="updateHistory"></employees-current>
    <employees-history v-show="mode===1" :companyId="company.id" ref="history"></employees-history>
  </el-dialog>
</template>

<script>
export default {
  components: {
    employeesCurrent: () => import("./employeesCurrent"),
    employeesHistory: () => import("./employeesHistory"),
  },
  props: {
    company: {
      type: Object
    }
  },
  data() {
    return {
      mode: 0,
      visible: false,
    };
  },
  methods: {
    showDialog() {
      this.visible = true
      this.mode = 0
    },
    updateHistory() {
      this.$refs.history.getTableList()
    }
  }
};
</script>
<style lang="scss" scoped>
.employees-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>