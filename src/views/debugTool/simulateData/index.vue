<template>
  <div class="app-container">
    <el-form class="simulate" ref="personlistQuery" :rules="personRules" :model="personlistQuery" :inline="true" @keyup.enter.native="onSearch">
      <el-form-item>
        <span class="title">人脸数据</span>
        <!-- <div>
          数字：<el-input-number  placeholder="请输入数字" v-model="testnum" size="small" />
          <div></div>
        </div>
        <div style="marginTop: 10px">
          <el-button @click="startest">开始推送</el-button>
          <el-button @click="endtest">结束推送</el-button>
        </div> -->
      </el-form-item>
      <el-form-item label="采集设备" prop="deviceId">
        <device-select ref="personDeviceSelect" @change="personDeviceChange" :deviceCameraType="1" :isAll="false" width="auto"></device-select>
      </el-form-item>
      <el-form-item label="* 抓拍照片" prop="faceImg">
        <!-- 传多张 -->
        <el-upload ref="upload" class="update-image" action="" accept=".jpeg,.jpg,.png,.bmp" list-type="picture-card" :auto-upload="false" :multiple="true">
          <i class="el-icon-plus"></i>
        </el-upload>
        <!-- 传一张 -->
        <!-- <el-upload class="avatar-uploader" ref="faceImg" action="" accept=".jpeg,.jpg,.png,.bmp" :show-file-list="false" :on-change="handleChangeSnap" :auto-upload="false">
          <img v-if="personSnapImage" :src="personSnapImage" class="avatar">
          <i v-if="!personSnapImage" class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload> -->
      </el-form-item>
      <el-form-item label="背景照片" prop="bgFaceImg">
         <el-upload class="avatar-uploader" ref="bgFaceImg" action="" accept=".jpeg,.jpg,.png,.bmp" :show-file-list="false" :on-change="handleChangeBg" :auto-upload="false">
          <img v-if="personBgImage" :src="personBgImage" class="avatar">
          <i v-if="!personBgImage" class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item class="tr">
        <el-button  class="subBtn"  type="primary" size="large" @click="onPersonSubmit">提交</el-button>
        <!-- <el-button >取消</el-button> -->
      </el-form-item>
    </el-form>
    
    <el-form class="simulate" ref="carListQuery" :model="carListQuery" :rules="carRules" :inline="true" @keyup.enter.native="onSearch">
      <el-form-item>
        <span class="title">车辆数据</span>
      </el-form-item>
      <el-form-item label="车牌号" prop="plateNumber">
        <el-input maxlength="8" v-model="carListQuery.plateNumber" placeholder="请输入车牌号"></el-input>
      </el-form-item>
      <el-form-item label="采集设备" prop="deviceId">
        <device-select ref="carDeviceSelect" @change="carDeviceChange" :deviceCameraType="0" :isAll="false" width="auto"></device-select>
      </el-form-item>
      <el-form-item label="进出类型" prop="type">
        <el-radio v-model="carListQuery.type" label="0">进</el-radio>
        <el-radio v-model="carListQuery.type" label="1">出</el-radio>
      </el-form-item>
      <el-form-item label="抓拍照片" prop="pic">
        <el-upload class="avatar-uploader" ref="pic" action="" accept=".jpeg,.jpg,.png,.bmp" :show-file-list="false" :on-change="handleChangeCarSnap" :auto-upload="false">
          <img v-if="carSnapImage" :src="carSnapImage" class="avatar">
          <i v-if="!carSnapImage" class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item class="tr">
        <el-button class="subBtn" type="primary" size="large" @click="onCarSubmit">提交</el-button>
        <!-- <el-button >取消</el-button> -->
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getDevicesList } from "@/api/devicesManage";
import { postCarSimulate, postPersonSimulate } from "@/api/debugTool/index";
export default {
  name: "",
  data() {
    return {
      personlistQuery: {
        deviceId: null,
        faceImg: [],
        bgFaceImg: null,
      },

      personSnapImage: null,
      personBgImage: null,

      carListQuery: {
        plateNumber: null,
        portData: null,
        deviceId: null,
        type: null,
        pic: null
      },

      carSnapImage: null,

      deviceQuery: {
        pageNo: 0,
        pageSize: 99999
      },

      listTableData: null,
      personRules: {
        deviceId: [
          { required: true, message: '请选择采集设备'},
        ],
        // upload: [
        //   { required: true, message: '请上传抓拍照片'},
        // ],
        bgFaceImg: [
          { required: true, message: '请上传背景照片'},
        ],
      },
      carRules: {
        plateNumber: [
          { required: true, message: '请输入车牌号'},
        ],
        outId: [
          { required: true, message: '请选择停车场'},
        ],
        deviceId: [
          { required: true, message: '请选择采集设备'},
        ],
        type: [
          { required: true, message: '请上传选择类型'},
        ],
        pic: [
          { required: true, message: '请上传照片'},
        ],
      },
      //测试推送
      testTime: null,
      testnum: null,
      testImg: []
    };
    
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      // 获取表单数据
      getDevicesList(this.deviceQuery).then(res => {
        if(res.status === 200) {
          this.listTableData = res.data.rows
        }
      })
    },

    // 人抓拍传一张
    async handleChangeSnap(file) {
      let reader = new FileReader();
          reader.readAsDataURL(file.raw);
      await reader.addEventListener("load", () => {
        this.personlistQuery.faceImg = reader.result.substr(reader.result.indexOf(",") + 1);
        this.personSnapImage = reader.result;
      });
    },

    // 人抓拍 传多张
    async handleChangeBg(file) {
      let reader = new FileReader();
          reader.readAsDataURL(file.raw);
      await reader.addEventListener("load", () => {
        this.personlistQuery.bgFaceImg = reader.result.substr(reader.result.indexOf(",") + 1);
        this.personBgImage = reader.result;
      });
    },

    async handleChangeCarSnap(file) {
      let reader = new FileReader();
          reader.readAsDataURL(file.raw);
      await reader.addEventListener("load", () => {
        this.carListQuery.pic = reader.result.substr(reader.result.indexOf(",") + 1);
        this.carSnapImage = reader.result;
      });
    },
  
    //消息提示 
    message(val) {
      if(val) {
          this.$notify({
          title:  "成功" ,
          message: "推送成功",
          type:  "success",
          duration: 2000
        });
      }else {
        this.$notify({
          title:  "失败" ,
          message: "上传失败",
          type:  "error",
          duration: 2000
        });
      }
    },

    // 人数据提交
    personReset() {
      this.$refs['personlistQuery'].resetFields()
      this.$refs.upload.uploadFiles = new Array()
      this.personBgImage = null;
    },
    onPersonSubmit() {
      if (!this.$refs.upload.uploadFiles.length) {
        this.$notify({
          title: "提示",
          message: "请上传抓拍图片",
          type: "warning",
          duration: 2000
        });
      } else {
        // this.dataJson = null;
        this.$refs['personlistQuery'].validate((valid) => {
          if (valid) {
            // 开始上传右侧多张
            this.$refs.upload.uploadFiles.map(file => {
              let reader = new FileReader();
              reader.readAsDataURL(file.raw);
              reader.addEventListener("load", () => {
                this.personlistQuery.faceImg.push(
                  reader.result.substr(reader.result.indexOf(",") + 1)
                );
                // 多张图片上传完成
                if (this.personlistQuery.faceImg.length === this.$refs.upload.uploadFiles.length) {
                    postPersonSimulate(this.personlistQuery).then(res => {
                      if(res.data.success) {
                        this.message(true)
                        this.personReset()
                        this.$refs.personDeviceSelect.clear()
                      }else {
                        this.message(false)
                        this.personReset()
                      }
                    })
                  } else {
                    return false;
                  }
                })
            })
          }
        });
      }
    },
    //车数据提交
    CarReset() {
      this.$refs['carListQuery'].resetFields()
      this.carSnapImage = null;
    },
    onCarSubmit() {
      this.$refs['carListQuery'].validate((valid) => {
        if (valid) {
          let _form = Object.assign({}, this.carListQuery)
          postCarSimulate(_form).then(res => {
            if(res.data.success) {  
              this.message(true)
              this.CarReset();
              this.$refs.carDeviceSelect.clear()
            }else {
              this.message(false)
              this.CarReset();
            }
          })
        } else {
          return false;
        }
      });
    },

    // _test(val) {
    //   let query = {
    //     bgFaceImg: val,
    //     deviceId: 1,
    //     faceImg: [val]
    //   }
    //   postPersonSimulate(query).then(res => {
    //   if(res.data.success) {
    //       this.message(true)
    //     }else {
    //       this.message(false)
    //     }
    //   })
    // },

    // startest() {
    //   let num = this.testnum;
    //   let img = this.testImg;
    //   if(!num) {
    //     this.$notify({
    //       title:  "失败" ,
    //       message: "请输入数字",
    //       type:  "error",
    //       duration: 2000
    //     });
    //   }else {
    //     this.testTime = setInterval(() => {
    //       if(num > 0) {
    //         let i = Math.ceil(Math.random()*img.length)
    //         this._test(img[i]);
    //         // console.log(img[i])
    //       }else {
    //         clearInterval(this.testTime)
    //         this.testTime = null;
    //       }
    //       num -=1;
    //     },1000)
    //   }
    // },

    // endtest() {
    //   clearInterval(this.testTime)
    //   this.testTime = null
    // }
    personDeviceChange(val) {
      console.log(val)
      this.$set(this.personlistQuery, 'deviceId', val)
    },
    carDeviceChange(val) {
      console.log(val)
      this.$set(this.carListQuery, 'deviceId', val)
    }
  },
};
</script>

<style lang="scss" scoped>
  .app-container {
    height: 100%;
    display: flex;
    overflow: auto !important;
    .simulate {
      display: flex;
      flex-direction: column;
      margin: 50px auto;
    }
    
    .avatar-uploader .el-upload {
      cursor: pointer;
      position: relative;
      overflow: hidden;
      border: none;
    }
    .avatar-uploader-icon {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
      &:hover {
        border-color: #409EFF;
      }
    }
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .tr {
      text-align: right;
    }
    .subBtn {
      width: 200px;
    }
    .title {
      font-weight: bold;
      font-size: 22px;
    }
  }
</style>