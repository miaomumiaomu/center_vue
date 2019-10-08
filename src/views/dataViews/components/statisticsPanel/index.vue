<template>
  <div class="main">
    <div class="contain">
      <div class="section-header">
        <img src="@/assets/views-center/tag.png" alt="">
        <span>房屋用途统计</span>
      </div>
      <div class="section-content">
        <ring-chart :data="houseData" />
      </div>
      <div class="border"></div>
    </div>
    <div class="contain">
      <div class="section-header">
        <img src="@/assets/views-center/tag.png" alt="">
        <span>人员管理类别</span>
      </div>
      <div class="section-content">
        <ring-chart :data="personManageData" />
      </div>
      <div class="border"></div>
    </div>
    <div class="contain">
      <div class="section-header">
        <img src="@/assets/views-center/tag.png" alt="">
        <span>人员居住情况</span>
      </div>
      <div class="section-content">
        <ring-chart :data="personLive" />
      </div>
      <div class="border"></div>
    </div>
    <div class="contain">
      <div class="section-header section-header-left30">
        <img src="@/assets/views-center/tag.png" alt="">
        <span>单位类型统计</span>
      </div>
      <div class="section-content">
        <bar-chart :data="communityData" />
      </div>
      <div class="border"></div>
    </div>
    <div class="contain">
      <div class="section-header section-header-left30">
        <img src="@/assets/views-center/tag.png" alt="">
        <span>关注人员</span>
      </div>
      <div class="section-content">
        <bar-chart :data="focuseData" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getFocusedLib } from "@/api/viewsCenter/focused";
import { getHousePropertyType, getPersonManage, getPersonLive } from "@/api/dataViews/statistics";
import { getCommunityTypeStatis } from '@/api/viewsCenter/unitView'
export default {
  props: {
    policeAreaCode: [String]
  },
  components: {
    RingChart: () => import("./RingChart"),
    BarChart: () => import("./BarChart"),
  },
  watch: {
    policeAreaCode: {
      handler(val) {
        if (val) {
          this.getData()
        }
      },
      immediate: true
    }
  },
  computed: {
    ...mapState({
      faceLibraryData: state => state.commonData.faceLibraryData,
    })
  },
  data() {
    return {
      houseData: [],
      personManageData: [],
      personLive: [],
      communityData: [],
      focuseData: []
    };
  },
  created() {
    this.$store.dispatch("commonData/getFaceLibraryData")
  },
  mounted() {
  },
  methods: {
    getData() {
      getHousePropertyType({ policeAreaCode: this.policeAreaCode }).then(res => {
        if (res.status === 200) {
          this.houseData = res.data
        }
      })
      getPersonManage({ policeAreaCode: this.policeAreaCode }).then(res => {
        if (res.status === 200) {
          this.personManageData = res.data
        }
      })
      getPersonLive({ policeAreaCode: this.policeAreaCode }).then(res => {
        if (res.status === 200) {
          this.personLive = res.data
        }
      })
      getCommunityTypeStatis({ policeAreaCode: this.policeAreaCode }).then(res => {
        if (res.status === 200) {
          this.communityData = res.data
        }
      })
      getFocusedLib({ focusPerson: 1, policeAreaCode: this.policeAreaCode }).then(res => {
        if (res.status === 200) {
          this.focuseData = res.data.map(item => {
            return { name: this.faceLibraryData[item.typeKey].name, value: item.typeValue }
          })
        }
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.main {
  display: flex;
  .contain {
    width: 20%;
    height: 84%;
    position: relative;
    .section-header {
      padding: 18px 0 0 42px;
      color: #E2E9EE;
      display: flex;
      align-items: flex-end;
      img {
        margin-right: 5px;
      }
      span {
        font-size: 14px;
      }
    }
    .section-header-left30 {
      padding-left: 30px;
    }
    .section-content {
      height: calc(100% - 34px);
    }
    .border {
      position: absolute;
      top: 36px;
      right: 0;
      height: 140px;
      border-right: 1px solid rgba(151, 151, 151, 0.37);
    }
  }
}
</style>
