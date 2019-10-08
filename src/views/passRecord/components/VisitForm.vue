<template>
  <el-dialog :visible.sync="isFormDialog" title="拜访记录详情" width="500px">
    <div class="passInfo border">
      <ul>
        <li>
          <span>拜访时间</span>
          ：{{visitList.passTime}}
        </li>
        <li>
          <span>登记设备</span>
          ：{{visitList.communityName}} {{visitList.deviceName}}
        </li>
      </ul>
    </div>
    <div class="border">
      <div class="heading">
        <div class="title">访客信息</div>
      </div>
      <div class="img-box">
        <el-card :body-style="{ padding: '2px' }">
          <img-show class="pic" width="110px" height="135px" text="暂无照片" :img-src="visitList.passBaseImg" />
          <div class="img-name">抓拍照片</div>
        </el-card>
      </div>
      <div class="person-info">
        <ul>
          <li>
            <span class="label tow">姓名</span>
            ：{{visitorList.name}}
          </li>
          <li>
            <span class="label tow">类型</span>
            ：{{visitorType}}
          </li>
          <li>
            <span class="label tow">年龄</span>
            ：{{visitorList.age}}
          </li>
          <li>
            <span class="label tow">性别</span>
            ：<span v-if="visitorList.sex==1">男</span>
            <span v-if="visitorList.sex==2">女</span>
          </li>
          <li>
            <span class="label three">证件号</span>
            ：{{visitorList.identityNo}}
          </li>
        </ul>
      </div>
    </div>

    <div class="third-box">
      <div class="heading">
        <div class="title">受访人信息</div>
      </div>
      <div class="img-box sel">
        <el-card :body-style="{ padding: '2px' }">
          <img-show class="pic" width="110px" height="135px" text="暂无照片" :img-src="ownerList.identityImgPath" />
          <!-- <img :src="ownerList.identityImgPath"> -->
          <div class="img-name">证件照片</div>
        </el-card>
      </div>
      <div class="right-ul">
        <ul>
          <li>
            <span class="label tow">姓名</span>
            ：{{ownerList.name}}
          </li>
          <li>
            <span class="label tow">性别</span>
            ：
            <span v-if="ownerList.sex==1">男</span>
            <span v-if="ownerList.sex==2">女</span>
          </li>
          <li>
            <span class="label tow">年龄</span>
            ：{{ownerList.age}}
          </li>
          <li>
            <span class="label tow">类型</span>
            ：{{ownerType}}
          </li>
          <li>
            <span class="label three">证件号</span>
            ：{{ownerList.identityNo}}
          </li>
          <li>
            <span class="label tow">住址</span>
            ：{{ownerList.address}}
          </li>
        </ul>
      </div>
    </div>
    <div slot="footer">
      <el-button type="primary" size="mini" @click="isFormDialog=false">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getAccessRecordInfos } from "@/api/passRecord.js";
import { getperson } from "@/api/carManage.js";
import { getLibrary } from "@/utils/";
import { mapState } from "vuex";
export default {
  props: {
    isOpen: {
      default: false,
      type: Boolean
    },
    data: Object
  },
  data() {
    return {
      isFormDialog: false,
      visitList: {
        passBaseImg: null,
        passTime: null,
        communityName: null,
        deviceName: null
      },
      visitorList: {
        name: "",
        identityNo: "",
        age: "",
        sex: "",
        personTags: ""
      },
      visitorType: "",
      ownerList: {
        name: "",
        identityNo: "",
        age: "",
        sex: "",
        type: null,
        address: "",
        identityImgPath: ""
      },
      ownerType: ""
    };
  },
  watch: {
    isOpen(val) {
      if (val) {
        this.isFormDialog = val;
      }
    },
    computed: {
      ...mapState({
        faceLibraryData: state => state.commonData.faceLibraryData
      })
    },
    isFormDialog(val) {
      if (val) {
        this.visitorList = {
          name: "",
          identityNo: "",
          age: "",
          sex: "",
          personTags: ""
        };
        this.visitorType = "";
        this.ownerList = {
          name: "",
          identityNo: "",
          age: "",
          sex: "",
          type: null,
          address: "",
          identityImgPath: ""
        };
        this.ownerType = "";
        this.data.refObjId && this.getInfo();
      }
      this.$emit("update:isOpen", val);
    }
  },

  methods: {
    getInfo() {
      getAccessRecordInfos(this.data.refObjId).then(res => {

        this.visitList = res.data;
        // 获取访客信息
        res.data.personId &&
          getperson(res.data.personId).then(res => {
            this.visitorList = res.data;
            res.data.personTags ? this.visitorType = this.faceLibraryData[res.data.personTags].name : ''
          });

        // 获取受访人信息
        res.data.respondentsId &&
          getperson(res.data.respondentsId).then(res => {
            this.ownerList = res.data;
            res.data.personTags ? this.ownerType = this.faceLibraryData[res.data.personTags].name : ''
          });
      });
    }
  }
};
</script>
<style lang="scss" scoped>
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
// .right-card {
//   margin-left: 18px;
// }
.img-box {
  display: flex;
  margin-bottom: 5px;
  height: 160px;
  // &.sel {
  //   height: 100px;
  //   width: 87px;
  //   display: inline-block;
  //   img {
  //     height: 100px;
  //     width: 85px;
  //   }
  //   .img-name {
  //     width: 85px;
  //   }
  // }
  img {
    width: 110px;
    height: 135px;
  }
  .img-name {
    width: 110px;
    text-align: center;
    color: #a5a5a5;
    line-height: 16px;
  }
  // .compare-box {
  //   width: 124px;
  //   display: inline-block;
  // }
}
.person-info {
  display: inline-block;
  position: absolute;
  top: 97px;
  left: 150px;
}
// .similarity {
//   display: inline-block;
//   position: relative;
//   width: 40px;
//   height: 92px;
//   text-align: center;
//   overflow: hidden;
//   span {
//     position: absolute;
//     top: 0px;
//     left: 5px;
//     color: #606266;
//   }
// }

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
.third-box {
  position: relative;
  .right-ul {
    display: inline-block;
    position: absolute;
    top: 25px;
    left: 130px;
  }
  // .label {
  //   width: 42px;
  // }
  .tow {
    letter-spacing: 2em;
  }
  .three {
    letter-spacing: 0.5em;
  }
  // .five {
  //   letter-spacing: 0em;
  // }
}
</style>


