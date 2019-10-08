<template>
  <module-tabs class="app-container" :data="tabsData" :active="tabsActive" />
</template>
<script>
export default {
  name: "libTagsManager",
  components: {
    libManage: () => import("./libManage"),
    tagManage: () => import("./tagManage")
  },
  data() {
    return {
      tabsActive: "tagManage",
      tabsData: [
        {
          name: "tagManage",
          label: "人员标签管理",
          component: this.$options.components.tagManage
        },
        {
          name: "libManage",
          label: "人员库管理",
          component: this.$options.components.libManage
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