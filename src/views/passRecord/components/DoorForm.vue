<template>
  <el-dialog :visible.sync="isFormDialog" class="dialog" title="门禁记录详情" width="500px">
    <div class="passInfo border">
      <ul>
        <li>
          <span>进出类型：</span>
          <span v-if="infoList.inOut==0">进</span>
          <span v-if="infoList.inOut==1">出</span>
        </li>
        <li>
          <span>进出时间：</span>
          {{infoList.passTime}}
        </li>
        <li>
          <span>开门方式：</span>
          <span v-if="infoList.passModel==0">门禁卡</span>
          <span v-if="infoList.passModel==1">二代身份证</span>
          <span v-if="infoList.passModel==2">二维码</span>
          <span v-if="infoList.passModel==3">人脸</span>
          <span v-if="infoList.passModel==4">指纹</span>
          <span v-if="infoList.passModel==5">蓝牙</span>
          <span v-if="infoList.passModel==6">远程开门</span>
          <span v-if="infoList.passModel==7">APP</span>
          <span v-if="infoList.passModel==8">语音</span>
          <span v-if="infoList.passModel==9">分机</span>
          <span v-if="infoList.passModel==10">访客</span>
          <span v-if="infoList.passModel==11">按钮</span>
          <span v-if="infoList.passModel==12">其他</span>
        </li>
      </ul>
    </div>
    <div class="border">
      <div class="heading">
        <div class="title">业主信息</div>
        <!-- <el-button type="text" class="button" size="mini" v-if="infoList.passModel=='3'">查看视频</el-button> -->
      </div>
      <div class="img-box sel">
        <el-card :body-style="{ padding: '0px' }">
          <img :src="infoList.passBaseImg">
          <div class="img-name">抓拍照片</div>
        </el-card>
      </div>
      <div class="person-info sel">
        <ul>
          <li>
            <span class="label four">业主姓名</span>
            ：{{ownerList.name}}
          </li>
          <li>
            <span class="label three">证件号</span>
            ：{{ownerList.identityNo}}
          </li>
          <li>
            <span class="label tow">年龄</span>
            ：{{ownerList.age}}
          </li>
          <li>
            <span class="label tow">性别</span>
            ：<span v-if="ownerList.sex==1">男</span>
            <span v-if="ownerList.sex==2">女</span>
          </li>
          <li>
            <span class="label tow">住址</span>
            ：{{ownerList.address}}
          </li>
        </ul>
      </div>
    </div>
    <div>
      <div class="heading">
        <div class="title">门禁信息</div>
      </div>
      <ul>
        <li>
          <span class="label">门禁名称</span>
          ：{{infoList.deviceName}}
        </li>
        <li>
          <span class="label">门禁编号</span>
          ：{{infoList.deviceCode}}
        </li>
        <li>
          <span class="label">设备位置</span>
          ：{{infoList.communityName}}
        </li>
      </ul>
    </div>

    <div slot="footer">
      <el-button type="primary" size="mini" @click="isFormDialog=false">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getAccessRecordInfos } from "@/api/passRecord.js";
import { getperson } from "@/api/carManage.js";

export default {
  props: {
    isOpen: {
      default: false,
      type: Boolean
    },
    data: Object
  },
  watch: {
    isOpen(val) {
      this.isFormDialog = val;
    },
    isFormDialog(val) {
      if (val) {
        this.infoList = {
          inOut: "",
          passTime: "",
          passModel: "",
          passBaseImg: "",
          deviceName: "",
          deviceCode: "",
          communityName: ""
        };
        this.ownerList = {
          name: "",
          identityNo: "",
          age: "",
          sex: "",
          address: ""
        };
        this.data.refObjId && this.getInfo();
      }
      this.$emit("update:isOpen", val);
    }
  },
  data() {
    return {
      isFormDialog: false,
      infoList: {
        inOut: "",
        passTime: "",
        passModel: "",
        passBaseImg: "",
        deviceName: "",
        deviceCode: "",
        communityName: ""
      },
      ownerList: {
        name: "",
        identityNo: "",
        age: "",
        sex: "",
        address: ""
      }
    };
  },
  methods: {
    getInfo() {
      getAccessRecordInfos(this.data.refObjId).then(res => {
        this.infoList = res.data;
        getperson(res.data.personId).then(res => {
          this.ownerList = res.data;
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.dialog {
  .border {
    padding-bottom: 5px;
    border-bottom: 1px #e1e1e1 dashed;
  }
  li {
    line-height: 22px;
  }
  .heading {
    .title {
      display: inline-block;
      line-height: 28px;
      font-weight: bold;
    }
    .button {
      float: right;
    }
    /deep/ {
      .el-button.el-button--mini {
        padding: 0;
      }
    }
  }
  .person-info {
    position: relative;
    &.sel {
      display: inline-block;
      position: absolute;
      top: 115px;
      left: 145px;
      li {
        line-height: 30px;
        width: 345px;
      }
    }
  }
  .img-box {
    display: flex;
    margin-bottom: 5px;
    height: 180px;
    &.sel {
      display: inline-block;
    }
    img {
      width: 110px;
      height: 135px;
    }
    .img-name {
      width: 110px;
      text-align: center;
      color: #a5a5a5;
      line-height: 20px;
    }
  }
  .label {
    width: 56px;
    display: inline-block;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .three {
    letter-spacing: 0.5em;
  }
  .four {
    letter-spacing: 0em;
  }
  .tow {
    letter-spacing: 2em;
  }
}
</style>
