<template>
  <div class="tab-container">
    <div class="section-header">
      <img src="@/assets/views-center/tag.png" alt="">
      <span>前科重点人员</span>
    </div>
    <div class="select-focus">
      <multiple-choice-tag @tagChange="tagsChange"></multiple-choice-tag>
    </div>
    <div class="list" @scroll="onScrollToPage">
      <template v-for="(item, index) in dataList">
        <div class="list-container" :key="index">
          <div class="fix"></div>
          <div class="content">
            <img class="avatar-img" :src="item.imgShow" alt="" @click="showDetailForm(item.id)">
            <strong>{{ item.name }}</strong>
            <p>{{ item.birthday }}</p>
            <div class="type-belong" v-if="item.personTags">
              <template v-for="(list, index) in item.personTags.split(',')">
                <span class="type-single" :style="{ 'background': faceLibraryData[list].color }" :key="index">
                  {{ faceLibraryData[list].shortName }}
                </span>
              </template>
            </div>
            <div class="detail">
              <div class="detail-info">
                <img src="@/assets/views-center/focus-identity.png" alt="">
                <span>{{ item.identityNo }}</span>
              </div>
              <div class="detail-info">
                <img src="@/assets/views-center/device-place.png" alt="">
                <span>{{ item.address }}</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <label-form :is-open.sync="isDetailsForm" :id="personId" isView/>
  </div>
</template>

<script>
import { mapState } from "vuex";
import {
  getFocusedList,
} from "@/api/viewsCenter/focused";
export default {
  components: {
    LabelForm: () => import("@/components/FaceLabelForm"),
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
      params: {
        pageNo: 1,
        pageSize: 15,
        _filter_in_categoryIds: '',
        _filter_in_personTags: '',
      },
      selectData: null,

      isDetailsForm: false,
      personId: null,

      dataList: []
    };
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      let _categoryIds = null
      let _personTags = null
      let data = this.selectData
      if (data) {
        _categoryIds = []
        _personTags = []
        data.forEach(items => items.forEach(item => {
          if (item.color) {
            _personTags.push(item.id)
          } else {
           _categoryIds.push(item.id)
          }
        }))
        this.params._filter_in_categoryIds = _categoryIds.join(',')
        this.params._filter_in_personTags = _personTags.join(',')
      }
      getFocusedList(this.params).then(res => {
        this.dataList = res.data.rows
      })
    },

    showDetailForm(id) {
      this.personId = id
      this.isDetailsForm = true
    },
    tagsChange(data) {
      this.selectData = data
      this.params.pageSize = 15
      this.getList()
    },
    onScrollToPage(e) {
      const taskListElem = e.currentTarget;
      const listHeight = taskListElem.clientHeight;
      if (taskListElem.scrollHeight - taskListElem.scrollTop <= listHeight) {
        this.params.pageSize += 10
        this.getList()
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.tab-container {
  background: #151D2D;
  height: 80vh;
  .section-header {
    padding: 1.5625vw 2.34375vw 0.8333vw 2.34375vw;
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
  .select-focus {
    display: flex;
    padding: 0 3.4896vw 0.729vw 3.4896vw;
    .pre {
      display: flex;
      align-items: center;
      font-size: 0.8333vw;
      color: #E2E9EE;
      margin-right: 10px;
    }
    .focusOn {
      color: #E2E9EE;
      border:1px solid rgba(4,101,193,0.3);
      background:rgba(44,95,198,0.3);
      padding: 0.4167vw 0.729vw;
      font-size: 0.78125vw;
    }
  }
  .list {
    display: flex;
    flex-wrap: wrap;
    padding: 0 2.65625vw;
    overflow: auto;
    height: calc(100% - 8.125vw);
    .list-container {
      background-color: rgba(17, 32, 51, 1);
      display: flex;
      flex-direction: column;
      margin: 0.83333vw;
      width: 14.5%;
      height: fit-content;
      .fix {
        height: 3.021vw;
        background-color: rgba(21, 29, 45, 1);
      }
      .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 13.02vw;
        width: 13.02vw;
        color: rgba(144, 151, 161, 1);
        border:2px solid;
        border-image:linear-gradient(180deg, rgba(33,62,112,1), rgba(41,90,125,1)) 2 2;
        .avatar-img {
          height: 5.41667vw;
          width: 5.41667vw;
          border: 0.3125vw solid rgba(75, 101, 139, 0.37);
          border-radius: 100%;
          margin-top: -3.021vw;

          &:hover {
            cursor: pointer;
          }
        }
        strong {
          margin-top: 0.6671vw;
          font-size: 1.514vw;
          font-weight: normal;
        }
        p {
          font-size: 0.729vw;
        }
        .type-belong {
          display: flex;
          justify-content: center;
          $type-color: white;
          margin-top: 0.9375vw;
          .type-single {
            padding: 0.15625vw 0.8333vw;
            color: white;
            font-size: 0.729vw;
          }
          span+span {
            margin-left: 0.6771vw;
          }
        }
        .detail {
          width: 100%;
          margin-top: 1.25vw;
          margin-bottom: 1.25vw;
          font-size: 0.729vw;
          .detail-info {
            padding-left: 1.7708vw;
            padding-right: 1.3542vw;
          }
          div+div{
            margin-top: 0.3125vw;
          }
        }
      }
    }
  }

  /deep/ {
    .el-button {
      background: rgba(32, 44, 64, 1);
      border: 1px solid rgba(53, 66, 94, 1);
      border-color: rgba(53, 66, 94, 1);
      color: rgba(107, 133, 166, 1);
    }
    .el-button:hover, .el-button:focus {
      color: rgba(226, 233, 238, 1);
      border-color: rgba(4, 101, 193, 0.3);
      background-color: rgba(44, 95, 198, 0.3);
    }
    .el-button--medium {
      padding: 0.4167vw 0.729vw;
      font-size: 0.78125vw;
      border-radius: 0px;
    }
    .el-button+.el-button {
      margin-left: 10px;
    }
  }
}
</style>
