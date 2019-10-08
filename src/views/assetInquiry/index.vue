<template>
  <el-row class="app-container">
    <!-- <address-menu ref="menu" :operating="false" @change="onMenuChange" /> -->
    <jurisdiction-addr-menu @change="onMenuChange" _key="personManageFlag" />
    <el-col :span="18">
      <label-table ref="labelTable" :data="currentRow" :fullAddressName="fullAddressName"/>
    </el-col>
  </el-row>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "assetInquiry",
  components: {
    JurisdictionAddrMenu: () => import("@/components/JurisdictionAddrMenu"),
    LabelTable: () => import("./components/LabelTable"),
  },
  computed: {
    ...mapState({
      userInfo: state=> state.user.userInfo,
    })
  },
  data: () => ({
    currentRow: {},
    fullAddressName: '',

    tabsActive: "labelTable",
    initState: {
      labelTable: true,
      carTable: false
    }
  }),
  mounted() {
    this.initRecursion();
    this.fullAddressName = this.userInfo.policeAreaName
  },
  methods: {
    onMenuChange(status, data, node, labels) {
      this.currentRow = data;
      this.fullAddressName = labels
    },
    onTabsChange(tab) {
      this.tabsActive = tab.name;
      // 判断是否需要初始化
      if (!this.initState[this.tabsActive]) {
        this.initState[this.tabsActive] = true;
        this.$refs[this.tabsActive].init && this.$refs[this.tabsActive].init();
      }
    },
    initRecursion() {
      this.$nextTick(() => {
        if (this.$refs[this.tabsActive]) {
          this.$refs[this.tabsActive].init &&
            this.$refs[this.tabsActive].init();
        } else {
          setTimeout(() => {
            this.initRecursion();
          }, 200);
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.app-container {
  height: 100%;
  & > .el-col {
    height: 100%;
  }

  /* 标签切换 */
  .el-tabs {
    position: relative;
    height: 100%;
    border: 0;
    box-shadow: none;
    background: transparent;
    /deep/ {
      .el-tabs__content {
        height: calc(100% - 47px);
        padding: 0;
      }
      .el-tab-pane {
        height: 100%;
      }
      .el-tabs__header {
        background: #fafbfd;
      }
      .el-tabs__item {
        width: 120px;
        height: 48px;
        line-height: 48px;
        padding: 0 !important;
        border-right: 1px solid #e4e5e6;
        text-align: center;
        font-size: 14px;
        color: #666;
        &.is-active {
          background: #fff;
          font-weight: bold;
          color: #353535;
        }
      }
    }
  }
}
</style>