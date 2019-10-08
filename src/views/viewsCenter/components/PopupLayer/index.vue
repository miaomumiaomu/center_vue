<template>
  <div class="tab-container">
    <el-tooltip
      placement="bottom"
      effect="dark"
    >
      <slot></slot>
      <div slot="content">
        <div class="tooltip-btn-group">
          <el-button size="mini" @click="onLinkTo('/#/dataCenter/application/faceTrackAnalysis', { personId })">轨迹分析</el-button><em/>
          <el-button size="mini" @click="onLinkTo('/#/dataCenter/application/togetherAnalysis', { personId })">同行分析</el-button><em/>
          <el-button size="mini" @click="onRouteTo('/dataCenter/application/super/faceUser', { queryId: personId })">超级档案</el-button><em/>
          <el-button size="mini" @click="onLinkTo('/#/dataCenter/application/foothold', { personId })">落脚点分析</el-button><em/>
          <el-button size="mini" @click="onLinkTo('/#/dataCenter/dataView/passRecord', { personId })">人行记录</el-button>
        </div>
      </div>
    </el-tooltip>
  </div>
</template>

<script>
import { param } from "@/utils/";

export default {
  props: {
    personId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {};
  },
  methods: {
    onLinkTo(url, query) {
      const queryStr = param(query);
      window.open(`${url}?${queryStr}`, 'main');
    },
    onRouteTo(url, query) {
      let routeUrl = this.$router.resolve({
        path: url,
        query
      });
      window.open(routeUrl.href, 'main');
    },
  }
};
</script>

<style lang="scss" scoped>
.tooltip-btn-group {
  margin-top: 6px;
  .el-button {
    background-color: transparent;
    border: 3px solid #0e182c;
    outline: 1px solid #48dee1;
    color: #48dee1;
  }
  .el-button:hover {
    background-color: #3cc1c3;
  }
}
</style>
