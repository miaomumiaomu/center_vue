<template>
  <module-tabs class="app-container" :data="tabsData" :active="tabsActive" />
</template>
<script>
export default {
  name: "basisConfig",
  components: {
    PopulationTable: () => import("./components/PopulationTable"),
    CompanyTable: () => import("./components/CompanyTable")
  },
  data() {
    return {
      tabsActive: "PopulationTable",
      tabsData: [
        {
          name: "PopulationTable",
          label: "实有人口采集审核",
          component: this.$options.components.PopulationTable
        },
        {
          name: "CompanyTable",
          label: "实有单位采集审核",
          component: this.$options.components.CompanyTable
        }
      ]
    };
  }
};
</script>
<style lang="scss" scoped>
  .app-container {
    .el-tabs__nav .is-top div {
      width: 135px !important;
    }
  }
</style>