<template>
  <div class="app-container calendar-list-container">
    <el-form ref="filter" :model="listQuery" :inline="true" @keyup.enter.native="onSearch" size="mini" class="p10">
      <el-form-item label="时间" prop="handleStartTimeChange" >
        <date-picker :beginTime.sync="listQuery.handleStartTimeChange" :endTime.sync="listQuery.handleEndTimeChange" />
      </el-form-item>
      <el-form-item prop="handleFilter"  label="姓名">
        <el-input
          size="mini"
          @keyup.enter.native="handleFilter"
          style="width: 120px;"
          class="filter-item"
          placeholder="姓名"
          v-model="listQuery._filter_like_personName"
          clearable
        />
      </el-form-item>
      <el-form-item prop="_filter_eq_communityId_long"  label="所属小区">
        <communities-select
          v-model="listQuery._filter_eq_communityId_long"
          style="width: 120px;"
          class="nowrap"
          placeholder="全部"
          size="mini"
          clearable
        />
        </el-form-item>
        <el-form-item prop="_filter_in_libraryNumArr_intarr" label="类别">
        <face-library-select
          v-model="listQuery._filter_in_libraryNumArr_intarr"
          style="width: 120px;"
          size="mini"
          class="nowrap"
          placeholder="全部"
        />
        </el-form-item>
        <el-form-item>
          <el-button size="mini" class="filter-item" type="primary" @click="handleFilter">搜索</el-button>
        </el-form-item>
    </el-form>


    <div class="list-main" :style="{height:height}" ref="list">
      <div
        class="item"
        :span="8"
        v-for="(o, index) in list"
        :key="index"
        :offset="index > 0 ? 2 : 0"
      >
        <el-card :body-style="{ padding: '0px' }">
          <div class="image-top">
            <div class="label-wrap"></div>
            <img :src="o.snapImgPath" class="image">
            <face-category-list
              :data="faceLibraryData"
              :type="1"
              :chosen="o.personTags?o.personTags.split(','):[]"
            />
            <div class="bottom-shadow">
              <span class="time">{{o.collectTime}}</span>
              <el-button type="text" class="button" @click="getBg(o)">背景</el-button>
            </div>
          </div>
          <div class="p10">
            <div class="name">
              <svg-icon icon-class="custom" class-name="svg-icon"/>
              <span>{{o.personName}}</span>
              <add-modal v-if="!o.identityNo" @save="handleAdd" :id="o.id" class="btn">
                <el-button type="text">添加</el-button>
              </add-modal>
              <change-modal
                v-else
                @save="handleJudge"
                :id="o.id"
                :oldIdentityNo="o.identityNo"
                class="btn"
              >
                <el-button type="text">变更</el-button>
              </change-modal>
            </div>
            <div class="cameraName">
              <svg-icon icon-class="locale" class-name="svg-icon"/>
              <span>{{o.deviceName}}</span>
            </div>
          </div>
        </el-card>
      </div>
    </div>
    <div v-show="!listLoading" class="pagination-container p10">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="listQuery.offset"
        :page-sizes="[100,200,300]"
        :page-size="listQuery.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>

    <el-dialog title="背景大图" :visible.sync="dialogFormVisible">
      <el-card :body-style="{ padding: '0px' }">
        <img :src="bg" class="inner-image">
      </el-card>
    </el-dialog>
  </div>
</template>

<script>
import moment from "moment";
import { mapState } from "vuex";
import { singlePickerOptions } from "@/utils";

import { putIdentityNo } from "@/api/debugTool/index";
import { getSnappingList } from "@/api/faceSnapping.js";
import AddModal from "./components/AddModal";
import ChangeModal from "./components/ChangeModal";

export default {
  name: "historyDebug",
  components: { AddModal, ChangeModal },
  data() {
    return {
      singlePickerOptions: singlePickerOptions,

      scroll: 0,
      height: "calc(100vh - 240px)",
      value5: [moment().subtract(5, "m")._d, ""],
      listQuery: {
        offset: 1,
        limit: 100,
        _filter_ge_collectTime_date: moment(moment().subtract(5, "m")).format(
          "YYYYMMDDHHmmss"
        ),
        _filter_le_collectTime_date: "",
        cameraIds: undefined,
        _filter_like_personName: undefined,
        _filter_in_libraryNumArr_intarr: undefined
      },
      getBglist: {
        imgTime: undefined,
        cameraId: undefined,
        imgFrame: undefined
      },
      list: null,
      total: null,
      listLoading: true,
      dialogFormVisible: false,
      dialogStatus: "",
      tableKey: 0,
      bg: undefined,

      tooltipDestroy: true,
    };
  },
  created() {
    this.getList();
    this.$store.dispatch("commonData/getFaceLibraryData");
  },
  computed: {
    ...mapState({
      faceLibraryData: state => state.commonData.faceLibraryData
    })
  },
  mounted() {
    this.height =
      this.$root.$el.offsetHeight - this.$refs.filter.offsetHeight - 190 + "px";
    window.addEventListener("resize", () => {
      this.height =
        this.$root.$el.offsetHeight -
        this.$refs.filter.offsetHeight -
        190 +
        "px";
    });
  },
  activated() {
    this.$refs.list.scrollTo(0, this.scroll);
    this.tooltipDestroy = true;
  },
  deactivated() {
    this.scroll = this.$refs.list.scrollTop;
    this.tooltipDestroy = false;
  },
  methods: {
    getList() {
      this.listLoading = true;
      this.tooltipDestroy = false;
      getSnappingList(this.listQuery).then(res => {
        this.list = res.data;
        this.total = res.data.length;
        this.listLoading = false;
        this.tooltipDestroy = true;
      });
    },
    getBg(bgData) {
      this.dialogFormVisible = true;
      this.bg = bgData.bgImgPath;
    },
    handleFilter() {
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.offset = val;
      this.getList();
    },
    handleStartTimeChange(date) {
      this.listQuery._filter_ge_collectTime_date = date
        ? moment(date).format("YYYYMMDDHHmmss")
        : "";
    },
    handleEndTimeChange(date) {
      this.listQuery._filter_le_collectTime_date = date
        ? moment(date).format("YYYYMMDDHHmmss")
        : "";
    },
    // 分割字符串，转成数组
    strToArr(str) {
      return str.split(",");
    },
    // 判断颜色值
    judgeColor(str) {
      let color = "#409eff";
      if (str) {
        if (str.includes("黑")) {
          color = "red";
        } else if (str.includes("白")) {
          color = "green";
        } else if (str.includes("陌")) {
          color = "yellow";
        }
      }
      return color;
    },
    // 添加操作
    handleAdd(data) {
      putIdentityNo(data).then(response => {
        if (response.status == 200) {
          this.$message({
            message: "添加成功！",
            type: "success"
          });
          this.handleFilter();
        } else {
          this.$message.error(response.message);
        }
      });
    },
    // 变更操作
    handleJudge(data) {
      putIdentityNo(data).then(response => {
        if (response.status == 200) {
          this.$message({
            message: "变更成功！",
            type: "success"
          });
          this.handleFilter();
        } else {
          this.$message.error(response.message);
        }
      });
    },
  }
};
</script>

<style lang="scss" scoped>
.p10 {
  padding: 10px;
}
.calendar-list-container {
  height: 100%;
  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }
  .button {
    padding: 0;
    float: right;
  }
  .image {
    width: 100%;
    height: 180px;
    display: block;
  }
  .inner-image {
    width: 100%;
    display: block;
  }
  .image-top {
    width: 100%;
    position: relative;
  }
  .bottom-shadow {
    width: 100%;
    height: 30px;
    position: absolute;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.6);
    padding: 0 4px;
    padding-top: 6px;
  }
  .label-wrap {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden;
  }
  .top-label {
    float: left;
    overflow: hidden;
    &:nth-of-type(n + 2) {
      margin-left: -15px;
    }
  }
  .label-rect {
    float: left;
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    color: #2e2e2e;
    font-size: 15px;
  }
  .label-trangle {
    width: 0;
    height: 0;
    float: left;
    border-left: 30px solid #409eff;
    border-top: 30px solid transparent;
    border-bottom: 30px solid transparent;
    transform: translateY(-30px);
  }
  .svg-icon {
    font-size: 14px;
    vertical-align: top;
  }
  .btn-group {
    overflow: hidden;
    padding: 4px;
  }
  .list-main {
    overflow-y: auto;
    .item {
      float: left;
      width: 180px;
      margin-bottom: 10px;
      margin-right: 20px;
    }
    .time {
      font-size: 14px;
      color: #fff;
    }
    .name {
      display: flex;
      line-height: 26px;
      margin-bottom: 4px;
      span {
        flex: 1;
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .svg-icon {
        position: relative;
        top: 6px;
        margin-right: 4px;
      }
    }
    .btn {
      float: right;
      font-size: 15px;
    }
    .cameraName {
      line-height: 20px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      .svg-icon {
        position: relative;
        top: 3px;
      }
    }
    .el-button {
      padding: 0;
    }
    .el-card__body {
      width: 180px;
    }
  }
}
</style>
