<template>
  <div class="content-box">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: "CatalogPane"
};
</script>
<style lang="scss" scoped>
.content-box {
  overflow: hidden;
}
</style>
