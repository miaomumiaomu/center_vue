<template>
  <section class="app-main" >
    <transition name="fade" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :style="waterBg"></router-view>
      </keep-alive>
    </transition>
  </section>
</template>

<script>
import { getWaterMark } from '@/api/login'
import { mapState } from "vuex";

export default {
  name: "AppMain",
  data() {
    return {
      userInfo: null,
    }
  },
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews;
    },
    ...mapState({
      waterBg: state => state.user.waterBg, // 水印
    })
  },
};
</script>