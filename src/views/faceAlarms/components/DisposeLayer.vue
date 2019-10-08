<template>
  <!-- 详情&处理 -->
  <el-dialog :title="`${data.handleFlag == 1?'查看':'处理'}告警信息`" class="dispose-layer body0" width="600px" :visible.sync="isDisposeDialog" v-if="data" append-to-body :before-close="onClose">
    <div :style="waterBg">
      <div class="title">
        <b>{{data.monitorName}}</b>
        <p v-if="data.monitorTimeFlag == 0">长期有效</p>
        <p v-else>布控时间：{{data.monitorBeginTime}} 至 {{data.monitorEndTime}}</p>
      </div>
      <div class="main" v-if="data.alarmType == 0 || data.alarmType == 2">
        <div class="tit">命中详情：</div>
        <el-row :gutter="20">
          <el-col :span="24" v-if="videoUrl">
            <el-card :body-style="{ padding: '10px' }">
              <video-box :videoUrl="videoUrl" ref="videoBox" />
            </el-card>
          </el-col>
          <el-col :span="13">
            <div class="pic-box">
              <div class="item">
                <img-show width="120px" height="120px" text="暂无头像" :img-src="data.snapImgPath" />
                <div class="txt">抓拍照片</div>
              </div>
              <div class="item">
                <img-show width="120px" height="120px" text="暂无头像" :img-src="data.identityImgPath" />
                <div class="txt">证件照</div>
              </div>
              <div class="similarity">{{data.similarity |percentage}}%</div>
            </div>
        </el-col>
        <el-col :span="11">
          <div class="pic-box">
            <a @click="onLookPicture(data)">
              <img-show height="120px" txt="暂无背景" :img-src="data.bgImgPath" />

              <!-- 图片弹窗 -->
              <picture-viewer :isOpen.sync="isBgDialog" :bgImgInfo="bgImgInfo" />
            </a>
            <div class="txt">背景图</div>
          </div>
        </el-col>
      </el-row>
      <ul class="info">
        <li class="w60">
          <span>布控人员：{{data.name}}</span>
        </li>
        <li class="w20">
          <span>年龄：{{data.age}}岁</span>
        </li>
        <li class="w20">
          <span>性别：{{data.sex}}</span>
        </li>
        <li>
          <span>证件号码：{{data.identityNo}}</span>
        </li>
        <li>
          <span>抓拍地址：{{data.communityName ? data.communityName : '无抓拍地址'}} {{data.deviceName || ''}}</span>
          <camera-video :mode="2" :deviceCode="data.deviceCode" :deviceName="data.deviceName" :onLine="data.onLine" :chanDpid="data.chanDpid" />
          <!-- <el-button type="text" size="mini" style="height:18px" @click="isVideoDialog=true">{{data.deviceName}}</el-button> -->
        </li>
        <li>
          <span>处理说明：</span>
          <el-input type="textarea" resize="none" :autosize="{ minRows: 4, maxRows: 4 }" placeholder="请填写处理结果" v-model="data.handleContent" :readonly="data.handleFlag == 1" />
        </li>
        <li>
          <span>布控设置：</span>
          <div v-if="!data.handleFlag">
            <el-radio v-model="radioType" :label="0">不操作</el-radio><br/>
            <el-radio v-model="radioType" :label="1">移除布控</el-radio><span style="margin-left: 25px;">勾选后该布控对象进入白名单</span><br/>
            <el-radio v-model="radioType" :label="2">误报</el-radio><span style="margin-left: 25px;">勾选后该抓拍对象进入白名单</span><el-button v-if="radioType == 2" style="margin-left: 10px;" size="mini" @click="onDiscern(data.snapImgPath, true)">识别</el-button><br/>
          </div>
          <div v-else>
            <div>{{ data.addWhiteList ?  data.addWhiteList == 1 : '已移除布控' ? '误报' : ' 无操作'}}</div>
          </div>
        </li>
      </ul>
      <el-col :span="24" style="text-align:center;padding-bottom: 10px;">
        <el-button type="text" size="mini" class="delNote">如确认告警消息为误报，可点击 <el-button size="mini" class="delBtn" @click="onDeleteInfo(data.id)">删除告警信息</el-button></el-button>
      </el-col>
    </div>
    <div class="main" v-if="data.alarmType == '1'">
      <div class="tit">命中详情：</div>
      <el-row :gutter="20">
        <el-col :span="24" v-if="videoUrl">
          <el-card :body-style="{ padding: '10px' }">
            <video-box :videoUrl="videoUrl" ref="videoBox" />
          </el-card>
        </el-col>
        <el-col :span="7">
          <div class="pic-box">
            <div class="item">
              <img-show width="120px" height="120px" text="暂无头像" :img-src="data.identityImgPath" />
              <div class="txt">证件照</div>
            </div>
          </div>
        </el-col>
        <el-col :span="17">
          <ul class="info">
            <li class="mb">最后出现：{{data.imgTime ? data.imgTime : '从未出现'}}</li>
            <li>
              <span>布控人员：{{data.name}}</span>
            </li>
            <li>
              <span>年龄：{{data.age}}岁</span>
            </li>
            <li>
              <span>性别：{{data.sex}}</span>
            </li>
            <li>
              <span>证件号码：{{data.identityNo}}</span>
            </li>
            <li>
              <span>抓拍地址：{{data.communityName && data.deviceName ? data.communityName + ' ' + data.deviceName : '无抓拍地址' }}</span>
              <camera-video :mode="2" :deviceCode="data.deviceCode" :deviceName="data.deviceName" :chanListData="chanListData" />
            </li>
          </ul>
        </el-col>
        <el-col :span="24" class="dispose-box">
          <p>处理说明：</p>
          <el-input type="textarea" resize="none" :autosize="{ minRows: 4, maxRows: 4 }" placeholder="请填写处理结果" v-model="data.handleContent" :readonly="data.handleFlag == 1" />
        </el-col>
        <el-col :span="24" class="alarm-set">
          <span>布控设置：</span>
          <div v-if="!data.handleFlag">
            <el-radio v-model="radioType" :label="0">不操作</el-radio><br/>
            <el-radio v-model="radioType" :label="1">移除布控</el-radio><span style="margin-left: 25px;">勾选后该布控对象进入白名单</span><br/>
            <el-radio v-model="radioType" :label="2">误报</el-radio><span style="margin-left: 25px;">勾选后该抓拍对象进入白名单</span><el-button v-if="radioType == 2" style="margin-left: 10px;" size="mini" @click="onDiscern(data.snapImgPath, true)">识别</el-button><br/>
          </div>
          <div v-else>
            <div>{{ data.addWhiteList ? data.addWhiteList == 1 : '已移除布控' ? '误报' : '无操作'}}</div>
          </div>
        </el-col>
        <el-col :span="24" style="text-align:center;padding-bottom: 10px;">
          <el-button type="text" size="mini" class="delNote">如确认告警消息为误报，可点击 <el-button size="mini" class="delBtn" @click="onDeleteInfo(data.id)">删除告警信息</el-button></el-button>
        </el-col>
      </el-row>
    </div>
  </div>

    <div slot="footer">
      <template v-if="data.handleFlag == 0">
        <el-button size="mini" type="primary" @click="onSubmit">保 存</el-button>
        <el-button size="mini" @click="onClose">取 消</el-button>
      </template>
      <el-button size="mini" type="primary" v-else @click="onClose">关 闭</el-button>
    </div>

    <!-- 以图搜图 - 弹窗 -->
    <picture-layer :is-open.sync="isPictureDialog" :data="trackAnalysis" :single="single" :jumpData="jumpData" @complete="finish"/>
  </el-dialog>
</template>
<script>
import { postAlarmHandle, deleteAlarms } from "@/api/faceAlarms";
import { getPlayVideo, postChanList, getCheckOnline } from "@/api/video";
import { getBase64 } from '@/utils'
import { mapState } from "vuex";

export default {
  name: 'disposeLayer',
  components: {
    VideoBox: () => import('./VideoBox'),
    TestVideo: () => import('./TestVideo'),
  },
  props: {
    data: Object,
    id: [String, Number],
    isOpen: {
      default: false,
      type: Boolean
    }
  },
  data: () => ({
    isDisposeDialog: false,

    isBgDialog: false, // 控制背景图显示
    rowBgImg: null,
    bgImgInfo: {},
    radioType: 1,
    // 视频
    isVideo: false,
    videoUrl: null,
    chanListData: null,
    delList: [],
    isPictureDialog: false,
    trackAnalysis: null,
    single: false,
    jumpData: {
      jump: true,
    },
    correctPersonId: null,
  }),
  watch: {
    isOpen(val) {
      this.isDisposeDialog = val;
      this.correctPersonId = null
    },
    isDisposeDialog(val) {
      if (val) {
        this.$nextTick(() => {
          this.videoUrl = null;
          this.radioType = 0
          postChanList([]).then(res => {
            this.chanListData = res.data;
            this.chanListData.forEach(element => {
              if (element.deviceCode == this.data.deviceCode) {
                this.$set(this.data, 'chanDpid', element.chanDpid);
                getCheckOnline(element.chanDpid).then(res => {
                  if (res.data.state == 1) {
                    this.$set(this.data, 'onLine', true);
                  };
                })
              }
            });
          })
          this.data.snapId &&
            getPlayVideo(this.data.snapId).then(res => {
              if (res.data.ret === 0) {
                this.videoUrl = res.data.url;
              }
            })
        })
      }
      this.$emit("update:isOpen", val);
    }
  },
  computed: {
    ...mapState({
      waterBg: state => state.user.waterBg, // 水印
    })
  },
  methods: {
    onSubmit() {
      if (this.data.handleContent == null || this.data.handleContent == "") {
        this.$notify({
          title: "提示",
          message: "请填写处理结果",
          type: "warning",
          duration: 2000
        });
        return;
      }
      let _form = new Object;
      this.$set(_form, "id", this.id)
      this.$set(_form, "handleContent",this.data.handleContent)
      switch (this.radioType) {
        case 0:
          this.$set(_form, "operType", 0)
          break;
        case 1:
          this.$set(_form, "operType", 1)
          break;
        case 2:
          this.$set(_form, "operType", 2)
          if (this.correctPersonId) {
            _form.correctPersonId = this.correctPersonId
          }
        default:
          break;
      }

      postAlarmHandle(_form).then(res => {
        let isSuccess = res.status === 200;
        this.$notify({
          title: isSuccess ? "成功" : "失败",
          message: isSuccess ? "处理成功" : res.message,
          type: isSuccess ? "success" : "error",
          duration: 2000
        });

        if (isSuccess) {
          this.isDisposeDialog = false;
          this.$emit("complete");
        }
      });
    },
    // 查看大图
    onLookPicture(data) {
      const { bgImgPath, snapImgPath, identityImgPath, similarity = 0 } = data;
      this.bgImgInfo = {
        rowBgImg: bgImgPath,
        snapImgPath,
        identityImgPath,
        similarity: Math.floor(similarity * 100)
      };
      this.isBgDialog = true;
    },
    // 视频
    onClose() {
      this.isDisposeDialog = false;
      this.$refs.videoBox && this.$refs.videoBox.onClose();
    },
    //识别
    onDiscern(url, boolean) {
      getBase64(url).then(res => {
        this.trackAnalysis = {
          keyword: "",
          imgBase64: res,
          threshold: 0.6,
          top: 10,
          personTags: null
        };
        this.single = boolean;
        this.isPictureDialog = true;
      })
    },
    finish(val) {
      this.correctPersonId = val.personId
    },
    // 删除告警信息
    onDeleteInfo(id) {
      this.delList.push(id);

      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        confirmButtonClass: "el-button--mini",
        cancelButtonClass: "el-button--mini fr",
        type: "warning"
      }).then(()=>{
        
        deleteAlarms({ids:this.delList}).then(res => {
          let isSuccess = res.status === 200;
            this.$notify({
              title: isSuccess ? "成功" : "失败",
              message: isSuccess ? "删除成功" : res.message,
              type: isSuccess ? "success" : "error",
              duration: 2000
            });
            if (isSuccess) {
              this.isDisposeDialog = false;
              this.delList = [];
              this.$emit('complete');
            }
        });
      })
    }
  }
};
</script>
<style lang="scss" scoped>
.dispose-layer {
  .title {
    background: #fafbfd;
    padding: 12px 14px;
    border-bottom: 1px solid #e5e5e5;
    font-size: 16px;
    color: #3f4041;
    p {
      margin-top: 4px;
      font-size: 13px;
      color: #999;
    }
  }
  .main {
    padding: 10px 10px 2px;
    .tit {
      line-height: 32px;
      font-size: 14px;
      color: #3f4041;
    }
    .pic-box {
      position: relative;
      padding: 12px 0 0;
      overflow: hidden;
      border: 1px solid #edeff3;
      border-radius: 10px;
      text-align: center;
      .item {
        display: inline-block;
        width: 120px;
        vertical-align: top;
        margin: 0 8px;
        font-size: 0;
      }
      .img-show {
        display: inline-block;
        max-width: 220px;
        vertical-align: top;
      }
      .txt {
        line-height: 24px;
        font-size: 12px;
        color: #adb1b4;
      }
      .similarity {
        position: absolute;
        left: 50%;
        bottom: 24px;
        background: #f00;
        width: 60px;
        height: 16px;
        line-height: 16px;
        text-align: center;
        font-size: 14px;
        font-weight: bold;
        color: #fff;
        transform: translateX(-50%);
        &:before {
          position: absolute;
          top: 0;
          left: -16px;
          width: 0;
          height: 0;
          float: left;
          border-width: 0 0 16px 16px;
          border-style: solid;
          border-color: transparent transparent #f00 transparent;
          content: "";
        }
        &:after {
          position: absolute;
          top: 0;
          right: -16px;
          width: 0;
          height: 0;
          float: left;
          border-width: 0 16px 16px 0;
          border-style: solid;
          border-color: transparent transparent #f00 transparent;
          content: "";
        }
      }
    }
    .info {
      margin-top: 8px;
      overflow: hidden;
      li {
        display: flex;
        float: left;
        width: 100%;
        line-height: 20px;
        margin-bottom: 8px;
        font-size: 13px;
        color: #3f4041;
        &.w60 {
          width: 60%;
        }
        &.w20 {
          width: 20%;
        }
        &.mb {
          margin-bottom: 18px;
        }
      }
      span {
        color: #999;
      }
      .el-textarea {
        flex: 1;
      }
    }
  }
  .dispose-box {
    padding: 10px 0;
    font-size: 13px;
    color: #999;
    p {
      line-height: 20px;
    }
  }
  .alarm-set{
    display: flex;
    align-items: flex-start;
    margin-top: 10px;
  }
  .delNote{
    color: #CCCCCC;
    cursor: text;
    .delBtn{
      color: #CCCCCC;
      background-color: #fff;
    }
    .delBtn:hover{
      color: #606266;
      background-color: #fff;
    }
    /deep/{
      .el-button.el-button--mini {
          height: 24px;
          padding: 0 10px;
      }
    } 
  }
}
</style>