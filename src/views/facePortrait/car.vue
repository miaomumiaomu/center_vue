<template>
  <div class="car-list">
    <div v-for="(item, index) in list" :key="index" class="card">
      <div class="carno">
        <span class="car-number">{{ item.plateNumber }}</span>
        <template v-if="item.personTags">
          <div v-for="(item, index) in item.personTags.split(',')" :key="index"
          class="person-type-container" :style="{ 'background': faceLibraryData[item].color }">
            <span class="person-type">{{ faceLibraryData[item].shortName }}</span>
          </div>
        </template>
      </div>
      <div class="row-class">
        <img src="@/assets/views-center/visitor-person.png" alt="" style="width: 10px;">
        <span class="inner">{{ item.name }}</span>
      </div>
      <div class="row-class">
        <img src="@/assets/views-center/visitor-telphone.png" alt="" style="width: 11px">
        <span class="inner">{{ item.phone }}</span>
      </div>
      <div class="row-class">
        <img src="@/assets/views-center/device-place.png" alt="" style="width: 11px">
        <span class="inner">{{ item.identityNo }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: {
    list: Array
  },
  watch: {
  },
  computed: {
    ...mapState({
      faceLibraryData: state => state.commonData.faceLibraryData,
    })
  },
  data() {
    return {
    };
  },
  methods: {
    getData(init = false) {
    },
    onScrollToPage(e) {
      const taskListElem = e.currentTarget;
      const listHeight = taskListElem.clientHeight;
      if (taskListElem.scrollHeight - taskListElem.scrollTop <= listHeight) {
        this.pageSize += 10
        this.getData()
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.car-list {
  display: flex;
  flex-wrap: wrap;
}
.card {
  display: inline-block;
  width: 305px;
  height: 166px;
  padding: 24px 20px 0 25px;
  margin-right: 7px;
  margin-bottom: 15px;
  background: rgba(25, 37, 61, 1);
  color: rgba(226, 233, 238, 1);
  border:1px solid rgba(59, 76, 110, 1);
  cursor: pointer;

  .carno {
    font-size: 26px;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    .car-number {
      margin-right: 6px;
    }
    .person-type-container {
      height: 24px;
      width: 24px;
      border-radius: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 5px;
      .person-type {
        color: rgba(226, 233, 238, 1);
        font-size: 14px;
      }
    }
  }
  .row-class {
    margin-bottom: 8px;
    img {
      margin-right: 4px;
    }
    .inner {
      color: rgba(226, 233, 238, 0.733);
      font-size: 14px;
    }
  }
}
</style>
