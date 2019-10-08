<template>
  <el-dialog title="人行记录" class="trajectory-layer body0" :visible.sync="isDetailsDialog" width="800px">
    <div class="head">
      <div class="address">抓拍地点:{{currentData.address}}</div>
      <div class="total">共{{detailsData.length}}张抓拍</div>
    </div>
    <!-- 表格模式 S -->
    <el-table ref="listTabel" :data="detailsData" height="calc(100vh - 250px)" highlight-current-row>
      <el-table-column align="center" label="序号" type="index" width="50" />
      <el-table-column align="center" label="抓拍照片" width="100">
        <template slot-scope="scope">
          <suspension-menu :SuspensionData="scope.row" @isDialog="isDialog" :isSimilarity="true" :picData="picData" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="抓拍背景" width="120">
        <template slot-scope="scope">
          <a @click="onLookPicture(scope.row)" v-if="scope.row.bgImgPath">
            <img-show height="48px" txt="暂无背景" :img-src="scope.row.bgImgPath" />
          </a>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="personName" label="姓名" />
      <el-table-column align="center" label="数据类型">
        <template slot-scope="scope">{{type[scope.row.passType]}}</template>
      </el-table-column>
      <el-table-column align="center" label="抓拍设备">
        <template slot-scope="scope">
          <camera-video :mode="0" :deviceCode="scope.row.deviceCode" :deviceName="scope.row.deviceName" :onLine="scope.row.onLine" :chanDpid="scope.row.chanDpid" />
        </template>
      </el-table-column>
      <el-table-column align="center" prop="collectTime" width="150" label="抓拍时间" />
    </el-table>
    <!-- 表格模式 E -->
    <div slot="footer">
      <el-button size="mini" type="primary" @click="isDetailsDialog = false">关闭</el-button>
    </div>

    <!-- 图片弹窗 -->
    <picture-viewer :isOpen.sync="isBgDialog" :bgImgInfo="bgImgInfo" />

  </el-dialog>
</template>
<script>
import { getPersonImg } from "@/api/common";
import { getTrajectoryDetails } from "@/api/faceTrackAnalysis";
import { postChanList, getCheckOnline } from "@/api/video";

export default {
  data() {
    return {
      currentData: {},
      detailsData: [],
      isDetailsDialog: false,
      type: ["人脸识别", "车辆识别", "门禁记录", "拜访记录"],
      picData: {},

      isBgDialog: false, // 控制背景图显示
      bgImgInfo: {},

      // 视频
      chanListData: [],
    };
  },
  created() {
    postChanList([]).then(res => {
      this.chanListData = res.data;
    })
  },
  methods: {
    open(data) {
      this.picData = {};
      this.currentData = data;
      getTrajectoryDetails({
        _filter_eq_locationId: data.id
      }).then(async res => {
        if (res.status === 200) {
          res.data.forEach(item => {
            this.getPersonImg(item.personId);
            
            this.chanListData && this.chanListData.forEach(element => {
              if (element.deviceCode == item.deviceCode) {
                this.$set(item, 'isReqVideo', true);
                this.$set(item, 'chanDpid', element.chanDpid);
                getCheckOnline(element.chanDpid).then(res => {
                  if (res.data.state == 1) {
                    this.$set(item, 'onLine', true);
                  };
                })
              }
            });
          })
          this.detailsData = res.data;
          this.isDetailsDialog = true;
        }
      });

    },
    getPersonImg(id) {
      if (this.picData[id] === undefined) {
        this.$set(this.picData, id, null);
        getPersonImg(id).then(res => {
          this.$set(this.picData, id, res.status == 200 ? res.data : null);
        });
      }
    },
    // 查看大图
    onLookPicture(data) {
      if (!data) return;
      const { bgImgPath, snapImgPath, similarity = 0 } = data;
      const { identityImgPath } = this.currentData;
      this.bgImgInfo = {
        rowBgImg: bgImgPath,
        snapImgPath,
        identityImgPath,
        similarity: Math.floor(similarity * 100)
      };
      this.isBgDialog = true;
    },

    //此 弹框层 关闭
    isDialog(val) {
      this.isDetailsDialog = val;
    }
  }
};
</script>
<style lang="scss" scoped>
.trajectory-layer {
  .head {
    display: flex;
    line-height: 50px;
    padding: 0 10px;
    font-size: 16px;
    color: #333;
    .address {
      flex: 1;
      padding-right: 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-weight: bold;
    }
    .total {
      color: #666;
    }
  }
  .img-show {
    display: inline-block;
    vertical-align: top;
    margin: 0 auto;
    overflow: hidden;
    border-radius: 4px;
  }
  /deep/ {
    .el-dialog__footer {
      border-top: 0;
    }
  }
  // .similarity {
  //   display: inline-block;
  //   min-width: 55px;
  //   line-height: 48px;
  //   vertical-align: top;
  // }
}
</style>