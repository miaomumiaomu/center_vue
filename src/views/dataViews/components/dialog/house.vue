<template>
  <div class="dialog-container">
    <div class="title">{{ houseHeader }}</div>
    <div class="header">
      <span>共{{ list.total }}室</span>
      <!-- <img src="@/assets/data-views/dialog-close.png" alt="" @click="hanldeClose"> -->
    </div>
    <div class="content">
      <el-input v-model="keyword" size="mini" placeholder="请输入关键字" style="margin-bottom:10px"
      @keyup.enter.native="getData" @change="getData" clearable></el-input>
      <div ref="select" class="select">
        <template v-for="(item, index) in typeList">
          <el-button :class="{ focusOn: selectKey === item.typeKey }" :key="index" @click="handleTypeClick(item)">
            <span style="padding-right: 3px" v-if="item.typeKey !== ''">{{ faceLibraryData[item.typeKey].name }}</span>
            <span style="padding-right: 3px" v-else>全部</span>
            <span>{{ item.typeValue }}</span>
          </el-button>
        </template>
      </div>

      <div class="list-container" @scroll="onScrollToPage">
        <template v-for="(item, index) in list.rows">
          <div :class="{
            'card': true,
            'card-selfuse': item.usageType === 1,
            'card-rent': item.usageType === 2,
            'card-empty': item.usageType === 3,
            'card-borrow': item.usageType === 4,
          }" :key="index" @click="handleCardClick(item)">
            <div class="left-corner">
              <div class="square">{{ item.usageType | commonFilter('house_use_type') }}</div>
              <div class="triangle"></div>
            </div>
            <div class="right-corner">{{ `${item.personCount || 0 }人` }}</div>
            <div class="house-name">
              <span>{{ item.houseName }}</span>
              <template v-if="item.personLibrarys">
                <div class="person-type-container" v-for="(item, index) in item.personLibrarys.replace(/^,*|,*$/g,'').split(',')" :key="index" :style="{ 'background': faceLibraryData[item].color }">
                  <span class="person-type">{{ faceLibraryData[item].shortName }}</span>
                </div>
              </template>
            </div>
          </div>
        </template>
      </div>
    </div>

    <house-detail-dialog :visible.sync="visible" :houseTitle="houseTitle" :houseId="houseId" :locationCode="houseCode"></house-detail-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getHouseList, getHouseFilterType } from '@/api/dataViews/house-dialog'

export default {
  components: {
    HouseDetailDialog: () => import("./houseDetail"),
  },
  props: {
    houseHeader: {
      type: String,
      default: ""
    },
    locationCode: {
      type: String,
      default: ""
    },
  },
  watch: {
    locationCode(val) {
      getHouseFilterType({ locationCode: this.locationCode }).then(res => {
        res.status === 200 && (this.typeList = res.data)
        this.$nextTick(() => {
          this.listHeight = 419 - this.$refs.select.offsetHeight + 'px'
        })
      })
      this.getData()
    }
  },
  computed: {
    ...mapState({
      faceLibraryData: state => state.commonData.faceLibraryData,
    })
  },
  data() {
    return {
      visible: false,
      listHeight: 0,
      houseTitle: '',
      houseId: null,
      houseCode: null,

      keyword: null,
      selectKey: '',
      pageSize: 20,
      list: {},
      typeList: []
    };
  },
  mounted() {
    this.$store.dispatch("commonData/getFaceLibraryData")
  },
  methods: {
    getData() {
      getHouseList({
        pageNo: 1,
        pageSize: this.pageSize,
        _filter_like_locationCode: this.locationCode,
        _filter_like_keyword: this.keyword,
        _filter_like_tagId: this.selectKey,
      }).then(res => {
        res.status === 200 && (this.list = res.data)
      })
    },
    handleTypeClick(item) {
      this.selectKey = item.typeKey
      this.pageSize = 20
      this.getData()
    },
    handleCardClick(item) {
      this.houseTitle = item.houseName
      this.houseId = item.id
      this.houseCode = item.houseCode
      this.visible = true
    },
    onScrollToPage(e) {
      const taskListElem = e.currentTarget;
      const listHeight = taskListElem.clientHeight;
      if (taskListElem.scrollHeight - taskListElem.scrollTop <= listHeight) {
        this.pageSize += 10
        this.getData()
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.dialog-container {
  height: 503px;
  width: 461px;
  background: url(~@/assets/data-views/dialog-house.png) no-repeat center;
  padding: 25px 30px 30px 46px;
  background-size: 109% 103%;
  background-position: 50% 6%;

  .title {
    color: white;
    font-size:18px;
    width: 150px;
    position: absolute;
    left: 0;
    right: 0;
    top: 17px;
    margin: 0 auto;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .header {
    display: flex;
    margin-bottom: 12px;
    justify-content: space-between;
    span {
      color: rgba(55, 122, 184, 1);
      font-size: 14px;
    }
    img {
      padding-right: 5px;
      cursor: pointer;
    }
  }

  .content {
    .select {
      .focusOn {
        color: #E2E9EE;
        border:1px solid rgba(4,101,193,0.3);
        background:rgba(44,95,198,0.3);
      }
    }

    .list-container {
      height: 335px;
      overflow: auto;

      .card {
        position: relative;
        display: inline-block;
        width:117px;
        height:68px;
        margin-right: 10px;
        margin-bottom: 9px;
        cursor: pointer;
        background:rgba(57, 59, 65, 0.48);
        box-shadow: 2px 2px 12px 0px rgba(83, 86, 91, 1) inset;
        border:1px solid rgba(72, 72, 72, 1);
        $bg-color: rgba(79, 83, 91, 1);
        $fz-color: rgba(138, 142, 148, 1);

        .left-corner {
          position: absolute;
          left: 0;
          top: 0;
          .square {
            float: left;
            width: 32px;
            height: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 12px;
            padding-top: 1px;
            background: $bg-color;
            color: rgba(161, 161, 162, 1);
          }
          .triangle {
            float: right;
            border-style: solid;
            border-width: 10px 4px;
            border-color: $bg-color transparent transparent $bg-color ;
          }
        }
        .right-corner{
          position: absolute;
          right: 8px;
          top: 8px;
          font-size: 12px;
          transform: scale(0.916);
          color: $fz-color;
        }

        .house-name {
          padding-top: 30px;
          font-size:16px;
          text-align: center;
          display: flex;
          justify-content: center;
          align-items: center;
          color: $fz-color;

          .person-type-container {
            height: 15px;
            width: 15px;
            border-radius: 100%;
            display: flex;
            justify-content: center;
            margin-right: 4px;
            // border: 1px solid rgba(226, 233, 238, 1);
            .person-type {
              color: rgba(226, 233, 238, 1);
              font-size: 12px;
              transform: scale(0.75);
            }
          }
        }
      }

      .card-selfuse { // 自用style
        background:rgba(23,32,48,1);
        box-shadow: 2px 2px 12px 0px rgba(36,77,104,1) inset;
        border:1px solid rgba(38,66,85,1);
        $bg-color: rgba(52, 93, 120, 1);
        $fz-color: rgba(108,165,203,1);
        .house-name {
          color: $fz-color;
        }
        .left-corner {
          .square {
            background: $bg-color;
            color: $fz-color;
          }
          .triangle {
            border-color: $bg-color transparent transparent $bg-color ;
          }
        }
        .right-corner{
          color: $fz-color;
        }
      }

      .card-borrow { // 未知style
        background:rgba(27, 38, 66, 0.48);
        border: 1px solid rgba(48, 71, 115, 1);
        box-shadow: 2px 2px 12px 0px rgba(43, 64, 106, 1) inset;
        $bg-color: rgba(43, 64, 106, 1);
        $fz-color: rgba(63, 108, 196, 1);
        .house-name {
          color: $fz-color;
        }
        .left-corner {
          .square {
            background: $bg-color;
            color: rgba(116, 154, 231, 1);
          }
          .triangle {
            border-color: $bg-color transparent transparent $bg-color ;
          }
        }
        .right-corner{
          color: $fz-color;
        }
      }

      .card-empty { // 闲置style
        background:rgba(23, 32, 48, 1);
        border: 1px solid rgba(53, 82, 87, 1);
        box-shadow: 2px 2px 12px 0px rgba(35, 98, 99, 1) inset;
        $bg-color: rgba(63, 119, 117, 1);
        $fz-color: rgba(74, 143, 141, 1);
        .house-name {
          color: $fz-color;
        }
        .left-corner {
          .square {
            background: $bg-color;
            color: rgba(108, 203, 196, 1);
          }
          .triangle {
            border-color: $bg-color transparent transparent $bg-color ;
          }
        }
        .right-corner{
          color: $fz-color;
        }
      }

      .card-rent {
        background:rgba(66, 47, 27, 0.48);
        border: 1px solid rgba(136, 100, 52, 0.3);
        box-shadow: 2px 2px 12px 0px rgba(106, 88, 43, 0.82) inset;
        $bg-color: rgba(106, 84, 43, 1);
        $fz-color: rgba(196, 148, 63, 0.88);
        .house-name {
          color: $fz-color;
        }
        .left-corner {
          .square {
            background: $bg-color;
            color: rgba(231, 183, 116, 1);
          }
          .triangle {
            border-color: $bg-color transparent transparent $bg-color ;
          }
        }
        .right-corner{
          color: $fz-color;
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
      margin-right: 7px;
      margin-bottom: 12px;
    }
    .el-button:hover, .el-button:focus {
      color: rgba(226, 233, 238, 1);
      border-color: rgba(4, 101, 193, 0.3);
      background-color: rgba(44, 95, 198, 0.3);
    }
    .el-button--medium {
      padding: 8px 12px;
      font-size: 13px;
      border-radius: 0px;
    }
    .el-button + .el-button {
      margin-left: 0px;
    }
  }
}
</style>
