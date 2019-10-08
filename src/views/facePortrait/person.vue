<template>
  <div class="person-list">
    <div v-for="(item, index) in list" class="person-card" :key="index"
    @click="$router.push('/dataCenter/application/super/personJAR')">
      <!-- 右上上角标 -->
      <div class="right-corner" v-if="item.similarity">
        <div class="triangle"></div>
        <div class="square">
          <span>相似度:</span>
          <p>{{ item.similarity + '%' }}</p>
        </div>
      </div>

      <div class="card-inner">
        <div class="person-img">
          <img v-if="item.id" :src="`/api/person/personInfos/${item.id}/img`" alt="">
          <img v-else :src="item.identityImgPath" alt="">
        </div>
        <div class="person-info">
          <div class="person-name">
            <p>{{ item.name }}</p>
            <template v-if="item.personTags">
              <div v-for="(item, index) in item.personTags.split(',')" :key="index"
              class="person-type-container" :style="{ 'background': faceLibraryData[item].color }">
                <span class="person-type">{{ faceLibraryData[item].shortName }}</span>
              </div>
            </template>
          </div>
          <span>{{ item.identityNo }}</span>
        </div>
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
.person-list {
  display: flex;
  flex-wrap: wrap;
}
@mixin baseCard() {
  background: rgba(25, 37, 61, 1);
  .right-corner {
    position: absolute;
    right: 0;
    top: 0;
    .triangle {
      float: left;
      border-style: solid;
      border-width: 12px 6px;
    }
    .square {
      float: right;
      width: 92px;
      height: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
      span {
        font-size: 12px;
        transform: scale(.9);
        color: rgba(255,255,255,0.7613);
      }
      p {
        font-size: 14px;
        color: #fff;
      }
    }
  }
}

.person-card {
  width: 301px;
  height: 123px;
  margin-bottom: 12px;
  margin-right: 15px;
  display: inline-block;
  position: relative;
  border-radius:2px;
  border:1px solid rgba(59,76,110,1);
  cursor: pointer;

  @include baseCard;
  $corner-border-color: #DB871D;
  .right-corner {
    .triangle {
      border-color: $corner-border-color $corner-border-color transparent transparent;
    }
    .square {
      background: $corner-border-color;
      color: #fff;
    }
  }

  .card-inner {
    height: 100%;
    width: 100%;
    display: flex;

    .person-img {
      position: relative;
      margin: 14px 15px 14px 12px;
      width: 79px;
      height: 95px;
      img {
        height: 100%;
        width: 100%;
      }
    }
    .person-info {
      display: flex;
      flex-direction: column;
      .person-name {
        display: flex;
        align-items: center;
        padding-bottom: 10px;
        padding-top: 35px;
        p {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          font-size: 24px;
          color:rgba(205, 211, 224, 1);
          margin-right: 7px;
          max-width: 120px;
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
      span {
        font-size: 16px;
        color:rgba(226,233,238,0.733);
      }
    }
  }
}
</style>
