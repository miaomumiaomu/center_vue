<template>
  <module-tabs class="app-container" :data="tabsData" :active="tabsActive" />
</template>
<script>
export default {
  name: "userManage",
  components: {
    UserConfigure: () => import("./userConfigure"),
    RoleConfigure: () => import("./roleConfigure")
  },
  data() {
    return {
      tabsActive: "userConfigure",
      tabsData: [
        {
          name: "userConfigure",
          label: "用户管理",
          component: this.$options.components.UserConfigure
        },
        {
          name: "roleConfigure",
          label: "角色配置",
          component: this.$options.components.RoleConfigure
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