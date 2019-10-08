<template>
  <div class="no-image">
    <svg-icon icon-class="no-image" :style="{ fontSize: iconSize }"/>
    <div class="title" :style="{ fontSize: fontSize }">{{title}}</div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: '暂无图片'
    },
    iconSize: {
      type: String,
      default: '80px'
    },
    fontSize: {
      type: String,
      default: '18px'
    }
  }
}
</script>
<style lang="scss" scoped>
.no-image{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(56, 57, 59, 0.7);
  .title {
    color: rgba(250, 250, 250, 0.41);
  }
}
</style>