<template>
  <el-dialog :visible.sync="isAlarmDialog" width="680px" title="处理" class="body0 dispose-layer" append-to-body v-if="form">
    <div class="title">
      <b>{{form.monitorName}}</b>
      <p v-if="form.monitorTimeFlag == '0'">长期有效</p>
      <p v-else>在控时间：{{form.monitorBeginTime}}　至　{{form.monitorEndTime}}</p>
    </div>
    <div class="main">
      <div class="tit">
        <span>命中详情：</span>
        <!-- <span class="lookvideo"><a>查看视频</a></span> -->
      </div>
      <el-row :gutter="20">
        <el-col :span="10">
          <div class="pic-box">
            <a @click="onLookPicture(form.plateImgPath)">
              <img-show width="250px" txt="暂无背景" :img-src="form.plateImgPath" />
            </a>
            <div class="txt">背景图</div>
          </div>
        </el-col>
        <el-col :span="13">
          <ul class="info">
            <li>
              <span>停车场：{{form.garageName}}</span>
            </li>
            <li>
              <span>抓拍时间：{{form.passTime}}</span>
            </li>
            <li>
              <span>抓拍地点：{{form.gateName}}</span>
              <span>
                <a class="lookmap" v-if="form.lng" @click="showMapLocation" :value="form.lng&&form.lat?form.lng+','+form.lat:''">查看地图</a>
              </span>
            </li>
            <li>
              <span>车牌号：{{form.plateNumber}}</span>
            </li>
            <li>
              <span>类别：
                <face-category-list :data="carLibraryData" :type="0" :chosen="form.libraryNums?form.libraryNums.split(','):[]" />
              </span>
            </li>
            <li>
              <span>车主姓名：{{form.name}}</span>
            </li>
            <li>
              <span>证件号：{{form.identityNo}}</span>
            </li>
            <li>
              <span>联系方式：{{form.phone}}</span>
            </li>
          </ul>
        </el-col>
      </el-row>
      <div class="dealinstructions">
        <span>处理说明：</span>
        <el-input type="textarea" resize="none" :autosize="{ minRows: 4, maxRows: 4 }" placeholder="请填写处理结果" v-model="form.handleContent" :readonly="form.handleFlag === 1" />
      </div>
      <div class="control-set">
          <div>布控设置：</div>
          <div v-if="!form.handleFlag">
            <el-radio v-model="radioType" :label="0">不操作</el-radio><br/>
            <el-radio v-model="radioType" :label="1">移除布控</el-radio><br/>
            <!-- <el-radio v-model="radioType" :label="2">
              <el-date-picker v-model="reAlarmTime" value-format="yyyyMMddHHmmss" type="datetime" placeholder="请选择开始时间" size="mini"/>后再次布控
            </el-radio> -->
          </div>
          <div v-else>
            <div>{{ form.addWhiteList ?  '已移除布控' : ' 无操作'}}</div>
            <!-- <div>{{ form.addWhiteList ?  '已移除布控' : form.reAlarmTime + ' 后再次布控'}}</div> -->
          </div>
      </div>
      <el-col :span="24" style="text-align:center;padding-bottom: 10px;">
        <el-button type="text" size="mini" class="delNote">如确认告警消息为误报，可点击 <el-button size="mini" class="delBtn" @click="onDeleteInfo(form.id)">删除告警信息</el-button></el-button>
      </el-col>
    </div>
    <div slot="footer">
      <el-button size="mini" type="primary" @click="onSubmit()" v-if="form.handleFlag === 0">保存</el-button>
      <el-button size="mini" @click="isAlarmDialog = false">取消</el-button>
    </div>
    <!-- 图片弹窗 -->
    <el-dialog title="背景大图" :visible.sync="isLookDialog" append-to-body width="825px">
      <img-show width="785px" txt="暂无背景" :img-src="rowBgImg" />
    </el-dialog>
    <!-- 经纬度选择 -->
    <map-location ref="locationDialog" :zoom="18" :isUnChange="true" />
  </el-dialog>

</template>
<script>
import { mapState } from "vuex";
import { postCarAlarmHandle, deleteCarAlarmLogs } from "@/api/carManage";

export default {
  props: {
    id: null,
    form: null,
    isOpen: {
      default: false,
      type: Boolean
    }
  },
  data: () => ({
    isAlarmDialog: false,
    isLookDialog: false,
    rowBgImg: null,
    delList: [],
    radioType: 0,
  }),
  watch: {
    isOpen(val) {
      this.isAlarmDialog = val;
    },
    isAlarmDialog(val) {
      if (val) {
        this.radioType = 0,
        this.$store.dispatch("commonData/getCarLibraryData");
      }
      this.$emit("update:isOpen", val);
    }
  },
  computed: {
    ...mapState({
      carLibraryData: state => state.commonData.carLibraryData
    })
  },
  methods: {
    // 查看大图
    onLookPicture(url) {
      this.rowBgImg = url;
      this.isLookDialog = true;
    },
    showMapLocation() {
      this.$refs.locationDialog.open({
        lng: this.form.lng,
        lat: this.form.lat
      });
    },
    onSubmit() {
      if (this.form.handleContent == null || this.form.handleContent == "") {
        this.$notify({
          title: "提示",
          message: "请填写处理结果",
          type: "warning",
          duration: 2000
        });
        return;
      }
      // switch (this.radioType) {
      //   case 0:
      //     this.$set(_form, "addWhiteList", 0)
      //     break;
      //   case 1:
      //     this.$set(_form, "addWhiteList", 1)
      //     break;
      //   case 2:
      //     this.$set(_form, "reAlarmTime", this.reAlarmTime)
      //   default:
      //     break;
      // }
      postCarAlarmHandle({
        id: this.id,
        handleContent: this.form.handleContent,
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
          this.isAlarmDialog = false;
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
        
        deleteCarAlarmLogs({ids:this.delList}).then(res => {
          let isSuccess = res.status === 200;
            this.$notify({
              title: isSuccess ? "成功" : "失败",
              message: isSuccess ? "删除成功" : res.message,
              type: isSuccess ? "success" : "error",
              duration: 2000
            });
            if (isSuccess) {
              this.isAlarmDialog = false;
              this.delList = [];
              this.$emit('complete');
            }
        });
      })
      
    }
  },
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
    .lookvideo {
      color: #409eff;
    }
  }
  .pic-box {
    position: relative;
    padding: 12px 0 0;
    overflow: hidden;
    border: 1px solid #edeff3;
    border-radius: 10px;
    text-align: center;
    .bgphoto {
      line-height: 160px;
      height: 160px;
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
  }
  .info {
    margin-top: 8px;
    overflow: hidden;
    position: relative;
    li {
      float: left;
      width: 100%;
      line-height: 20px;
      margin-bottom: 8px;
      font-size: 13px;
      color: #3f4041;
      .lookmap {
        color: #409eff;
        margin-left: 10px;
      }
    }
    li:nth-child(5) {
      position: absolute;
      top: 84px;
      left: 150px;
      .face-category-list.list{
        display: inline-flex;
      }
    }
    span {
      color: #999;
    }
    .el-textarea {
      flex: 1;
    }
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
.dealinstructions {
  display: flex;
  margin: 10px 0;
  span {
    display: block;
    width: 90px;
  }
}
.control-set{
  display: flex;

}

</style>