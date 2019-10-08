<template>
  <module-tabs class="app-container" :data="tabsData" :active="tabsActive" />
</template>
<script>
export default {
  name: "basisConfig",
  components: {
    MenuManage: () => import("./menuManage"),
    ParameterConfig: () => import("./parameterConfig")
  },
  data() {
    return {
      tabsActive: "menuManage",
      tabsData: [
        {
          name: "menuManage",
          label: "菜单管理",
          component: this.$options.components.MenuManage
        },
        {
          name: "parameterConfig",
          label: "参数配置",
          component: this.$options.components.ParameterConfig
        }
      ]
    };
  }
};
</script>
<style lang="scss" scoped>
.app-container {
  position: relative;
  height: 100%;
}
</style>