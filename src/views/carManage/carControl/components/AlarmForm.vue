<template>
  <el-dialog :visible.sync="isFormDialog" width="680px" title="处理"  append-to-body>
    <div class="monitorName">
      <b>{{formInfo.monitorName}}</b>
      <p v-if="formInfo.monitorTimeFlag == '0'">长期有效</p>
      <p v-else>在控时间：{{formInfo.monitorBeginTime}}　至　{{formInfo.monitorEndTime}}</p>
    </div>
    <div class="main">
      <div class="tit">
        <span>命中详情：</span>
        </div>
      <el-row :gutter="20">
        <el-col :span="11">
          <div class="pic-box">
            <a @click="onLookPicture(formInfo.plateImgPath)">
              <img-show height="180px" txt="暂无背景" :img-src="formInfo.plateImgPath" />
            </a>
            <div class="txt">背景图</div>
          </div>
        </el-col>
          <el-col :span="13">
            <ul class="info">
              <!-- <li><span>停车场：{{formInfo.garageName}}</span></li> -->
              <li><span>采集时间：{{formInfo.passTime}}</span></li>
              <li><span>采集设备：{{formInfo.gateName}}</span> <span><a class="lookmap" @click="showMapLocation" :value="formInfo.lng&&formInfo.lat?formInfo.lng+','+formInfo.lat:''">查看地图</a></span></li>
              <li><span>所属辖区：{{formInfo.policeAreaName}}</span></li>
              <li><span>车牌号：{{formInfo.plateNumber}}</span></li>
              <li><span>类别：<div :style="{display: 'inline-block'}"><face-category-list :data="carLibraryData" :type="0" :chosen="formInfo.libraryNums ? formInfo.libraryNums.split(',') : []" /></div></span></li>
              <li><span>车主姓名：{{formInfo.name}}</span></li>
              <li><span>证件号：{{formInfo.identityNo}}</span></li>
              <li><span>联系方式：{{formInfo.phone}}</span></li>
            </ul>
        </el-col>
      </el-row>
      <div class="dealinstructions">
        <span>处理说明：</span>
        <el-input type="textarea" resize="none" :autosize="{ minRows: 4, maxRows: 4 }" placeholder="请填写处理结果" v-model="formInfo.handleContent" :readonly="formInfo.handleFlag === 1" />
      </div>
      <div class="control-set">
          <div>布控设置：</div>
          <div v-if="!formInfo.handleFlag">
            <el-radio v-model="radioType" :label="0">不操作</el-radio><br/>
            <el-radio v-model="radioType" :label="1">移除布控</el-radio><br/>
          </div>
          <div v-else>
            <div>{{ formInfo.addWhiteList ?  '已移除布控' : ' 无操作'}}</div>
          </div>
      </div>
      <el-col :span="24" style="text-align:center;padding-bottom: 10px;">
        <el-button type="text" size="mini" class="delNote">如确认告警消息为误报，可点击 <el-button size="mini" class="delBtn" @click="onDeleteInfo(formInfo.id)">删除告警信息</el-button></el-button>
      </el-col>
    </div>
    <div slot="footer">
      <el-button size="mini" type="primary" @click="onSubmit()" v-if="formInfo.handleFlag === 0">保存</el-button>
      <el-button size="mini" @click="isFormDialog = false">取消</el-button>
    </div>
    <!-- 图片弹窗 -->
    <el-dialog title="背景大图" :visible.sync="isLookDialog" append-to-body width="27%">
      <img :src="rowBgImg" alt="" :style="{ width: '100%' }">
    </el-dialog>

    <!-- 经纬度选择 -->
    <map-location ref="locationDialog" :zoom="18" :isUnChange="true" />
  </el-dialog>
  
</template>
<script>
import moment from "moment";
import { postCarAlarmHandle, deleteCarAlarmLogs } from "@/api/carManage";

export default {
  props: {
    formInfo: null,
    isOpen: {
      default: false,
      type: Boolean
    },
    id: null,
    carLibraryData: {
      default: {},
      type: Object
    }
  },
  data:() => ({
    isFormDialog: false,
    isLookDialog: false,
    rowBgImg: null,
    delList: [],
    radioType: 0
  }),
  watch: {
    isOpen(val) {
      this.isFormDialog = val;
    },
    isFormDialog(val) {
      if (val) {
        this.radioType = 0;
      }
      this.$emit("update:isOpen", val);
    }
  },
  methods: {
    // 查看大图
    onLookPicture(url) {
      this.rowBgImg = url;
      this.isLookDialog = true;
    },
    showMapLocation() {
      this.$refs.locationDialog.open({
        lng: this.formInfo.lng,
        lat: this.formInfo.lat
      });
    },
    onSubmit() {
      if (this.formInfo.handleContent == null || this.formInfo.handleContent == "") {
        this.$notify({
          title: "提示",
          message: "请填写处理结果",
          type: "warning",
          duration: 2000
        });
        return;
      }
      postCarAlarmHandle({
        id: this.id,
        handleContent: this.formInfo.handleContent,
        addWhiteList: this.radioType
      }).then(res => {
        let isSuccess = res.status === 200;
        this.$notify({
          title: isSuccess ? "成功" : "失败",
          message: isSuccess ? "处理成功" : res.message,
          type: isSuccess ? "success" : "error",
          duration: 2000
        });
        if (isSuccess) {
          this.isFormDialog = false;
          this.$emit("complete");
        }
      });
    },
    onDeleteInfo(id) {
      this.delList.push(id);

      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        confirmButtonClass: "el-button--mini",
        cancelButtonClass: "el-button--mini fr",
        type: "warning"
      }).then(()=>{
        deleteCarAlarmLogs({ ids: this.delList }).then(res => {
          let isSuccess = res.status === 200;
            this.$notify({
              title: isSuccess ? "成功" : "失败",
              message: isSuccess ? "删除成功" : res.message,
              type: isSuccess ? "success" : "error",
              duration: 2000
            });
            if (isSuccess) {
              this.isFormDialog = false;
              this.delList = [];
              this.$emit('complete');
            }
        });
      })
    }
  }
}

</script>
<style lang="scss" scoped>
  .title {
    background: #fafbfd;
    padding: 12px 14px;
    border-bottom: 1px solid #e5e5e5;
    font-size: 16px;
    color: #3f4041;
    p {
      margin-top: 10px;
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
      display: flex;
      justify-content: space-between;
      .lookvideo{
        color: #409EFF;
      }
    }
    .pic-box {
      position: relative;
      padding: 12px 0 0;
      overflow: hidden;
      border: 1px solid #edeff3;
      border-radius: 10px;
      text-align: center;
      .bgphoto{
        line-height: 160px;
        height: 160px;
      }
      .item {
        display: inline-block;
        width: 120px;
        vertical-align: top;
        margin: 0 8px;
        font-size: 0;
      }
      .img-show {
        display: inline-block;
        vertical-align: top;
        /deep/ img {
          position: relative;
          left: calc((270px - 100%)/2);
        }
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
        float: left;
        width: 100%;
        line-height: 20px;
        margin-bottom: 8px;
        font-size: 13px;
        color: #3f4041;
        .lookmap{
          color: #409EFF;
          margin-left: 10px;
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
  .dealinstructions{
    display: flex;
    margin: 10px 0;
    span {
      display: block;
      width: 90px;  
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
</style>