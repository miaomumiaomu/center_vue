<template>
  <el-dialog :title="id?'编辑车辆布控':'添加车辆布控'" class="task-form body0" :visible.sync="isFormDialog" width="1200px">
    <el-row>
      <el-col :span="12" class="form-part">
        <el-form :model="form" :rules="rules" ref="form" label-width="100px">
          <el-form-item prop="labelNums" class="m0" />
          <el-form-item prop="regexArrays" class="m0" />
          <el-form-item prop="id" class="m0" />
          <div class="heading">任务信息</div>
          <el-form-item label="任务编号" prop="code">
            <el-input maxlength='50' v-model="form.code" placeholder="任务编号不能重复" />
          </el-form-item>
          <el-form-item label="任务名称" prop="name">
            <el-input maxlength='100' v-model="form.name" placeholder="请输入任务名称" />
          </el-form-item>
          <el-form-item label="负责人" prop="leaders">
            <responsible-select v-model="form.leaders" />
          </el-form-item>
          <el-form-item class="m0" prop="leaderIds" />
          <el-form-item label="布控状态" prop="status">
            <el-radio v-model="form.status" :label="1">在控</el-radio>
            <el-radio v-model="form.status" :label="0">撤控</el-radio>
            <el-radio v-model="form.status" :label="2" :disabled="true">过期</el-radio>
          </el-form-item>
          <el-form-item label="任务描述" prop="description">
            <el-input type="textarea" resize="none" :autosize="{ minRows: 4, maxRows: 4 }" v-model="form.description" />
          </el-form-item>
          <div class="heading">布控设置</div>
          <el-form-item label="布控时间" prop="beginTime">
            <el-date-picker v-model="pickerValue" type="datetimerange" :picker-options="pickerOptions(1)" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" />
            <div class="tip">不设置时间默认为长期有效</div>
          </el-form-item>
          <el-form-item class="m0" prop="endTime" />
          <el-form-item label="布控库" prop="libraries">
            <librarie-select :filtrateNum="[2]" v-model="form.libraries" v-if="isFormDialog" />
          </el-form-item>
          <el-form-item class="m0"  prop="libraryNums"/>
          <el-form-item label="布控个体"  prop="cars">
            <el-button class="txt-btn HandleAdd" size="mini" type="text" icon="el-icon-plus" @click="isHangleAdd('c')">手动添加</el-button>
            <label-select v-model="form.cars" v-if="isFormDialog" />
          </el-form-item>

          <el-form-item label="布控车牌号"  prop="regexArrays">
            <el-button v-if="!form.regexArrays || form.regexArrays.length === 0" type="primary" size="mini"  @click="onAddCarsForm">添加布控车牌号</el-button>
            <div class="flex"  v-for="(item,index) in form.regexArrays" :key="index">
              <div class="live-box">
                <div>
                  <el-radio-group v-model="item.regexLength" @change="autoCarAdd(index)">
                    <el-radio-button v-for="(element, i) in carNumChose" :key="i" :label="element.value" >{{element.label}}</el-radio-button>
                  </el-radio-group>
                </div>
                <div class="carNums" :style="{overflowX: 'auto'}">
                  <div v-for="(e, i) in item.regexVOList" :key="i">
                    <el-input
                      :placeholder="e.type === 5 ? '请填写' : carhead[e.type || 0].label"
                      v-model="e.regexValue"
                      style="width: 100px; marginRight: 5px"
                      :disabled="e.type === 5 ? false : true"
                      :maxlength="e.type === 5 ? 1 : 3"
                    >
                      <el-select v-model="e.type" placeholder="请选择" slot="prepend">
                        <el-option v-for="s in carhead" :key="s.value" :label="s.label" :value="s.value"></el-option>
                      </el-select>
                    </el-input>
                  </div>
                </div>
              </div>
              <div class="btns">
                <i class="el-icon-circle-plus btn-add" @click="onAddCarsForm"></i>
                <i class="el-icon-remove btn-del" @click="onDelCarsForm(index)"></i>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="布控白名单"  prop="whiteList">
            <el-button class="txt-btn HandleAdd" size="mini" type="text" icon="el-icon-plus" @click="isHangleAdd('w')">手动添加</el-button>
            <label-select v-model="form.whiteList" v-if="isFormDialog" />
          </el-form-item>
          <el-form-item class="m0" prop="carInfoIds" />
          <el-form-item class="m0" prop="timeFlag" />
          <div class="heading">推送设置</div>
          <el-form-item label="短信推送" prop="smsPushStatus">
            <el-switch
              v-model="form.smsPushStatus"
              active-text="开"
              inactive-text="关"
              :active-value="1"
              :inactive-value="0"
              >
            </el-switch>
          </el-form-item>
          <el-form-item label="短信模板" prop="smsTemplateId">
            <msg-select v-model="form.smsTemplateId" :disabled="form.smsPushStatus === 0" placeholder="短信模板" :msgData="form" />
          </el-form-item>
          <el-form-item label="推送手机号" prop="smsPushTelPhones">
            <el-input v-model="form.smsPushTelPhones" :disabled="form.smsPushStatus === 0" placeholder="多个手机号码用逗号隔开" />
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12" :style="{padding: '10px 10px 0 0'}">
          <draw-map-area
            v-if="isOpen"
            :mapInitFlag="mapInitFlag"
            :cameraList="cameraList"
            :circleData="form.circleAreas || []"
            :polygonData="form.polygonAreas || []"
            :deviceIds="form.outsideIds || []"
            @changeArea="onMapInfo"
          />
      </el-col>
    </el-row>
    <div slot="footer">
      <el-button size="mini" type="primary" @click="onSubmit">保存</el-button>
      <el-button size="mini" @click="isFormDialog = false">取消</el-button>
    </div>

    <labeladd-Form ref="labeladd" :is-open.sync="isAddFormDialog" @complete="AddCarsOrWhite"/>
  </el-dialog>
</template>
<script>
import { pickerOptions } from "@/utils";

import { PostcarContro, PutcarContro, GetcarContro } from "@/api/carManage";

export default {
  components: {
    ResponsibleSelect: () => import("./ResponsibleSelect"),
    LibrarieSelect: () => import("./LibrarieSelect"),
    LabelSelect: () => import("./LabelSelect"),
    LabeladdForm: () => import("../../carLibrary/components/LabeladdForm"),
  },
  props: {
    id: null,
    cameraList: {
      default: () => [],
      type: Array
    },
    isOpen: {
      default: false,
      type: Boolean,
    }
  },
  data() {
    let formValidatePersonnel = (rule, value, callback) => {
      if (!this.form.libraries.length && !this.form.cars.length && !this.form.regexArrays.length) {
        callback("布控库或布控个体不能为空");
      } else {
        callback();
      }
    };
    return {
      isAddFormDialog: false, //手动添加
      isFormDialog: false,
      pickerValue: null,
      pickerOptions: pickerOptions,
      divCount: 0,
      catalogName: "basics",
      initForm: true,
      controlType: '',
      form: {
        code: null,
        name: null,
        beginTime: null,
        endTime: null,
        description: null,
        status: 1,
        communityIds: null, //社区ID
        regexArrays: [],

        // regexArray: [], // 模糊查询 车牌号 位数
        mobileNums: null, // 推送电话
        smsTemplet: null, //短信模板
        appTemplet: null, //APP模板
        bigDataPush: null, //是否开启推送
        labelNums: null, // 人脸库提交
        leaders: [], // 负责人
        leaderIds: null,
        libraries: [], // 人脸库
        libraryNums: null,
        cars: [], // 布控个体
        whiteList: [],
        carInfoIds: null,
        timeFlag: 0,
        smsTemplateId: null,
        smsPushTelPhones: null,
        smsPushStatus: 0,
        circleAreas: [],
        polygonAreas: [],
        outsideIds: []
      },
      rules: {
        code: { required: true, message: "任务编号不能为空" },
        name: { required: true, message: "任务名称不能为空" },
        leaders: { required: true, message: "负责人不能为空" },
        libraries: { validator: formValidatePersonnel },
        cars: { validator: formValidatePersonnel },
      },
      mapInitFlag: false,
      options: [
        {
          value: 0,
          label: '无'
        },{
          value: 7,
          label: '七位'
        }, {
          value: 8,
          label: '八位'
        }],
      carhead: [
        { value: 0, label: '请选择' },
        { value: 1, label: '省份' },
        { value: 2, label: '字母' },
        { value: 3, label: '数字' },
        { value: 5, label: '自定义' },
      ],
      carNumChose: [
        { value: 7, label: '七位车牌号'},
        { value: 8, label: '八位车牌号'}
      ],
      smsData: [],
      appData: []
    };
  },
  watch: {
    isOpen(val) {
      if (!val) this.mapInitFlag = false;
      this.isFormDialog = val;
    },
    isFormDialog(val) {
      this.form.regexArrays = [];
      if (val) {
        this.divCount = 0;
        this.pickerValue = null;
        this.form.id = null
        // 重置表单，重置结束后开启验证
        this.initForm = true;
        this.$refs.form && this.$refs.form.resetFields();
        // 特殊字段特殊处理
        this.form = {
          ...this.form,
          circleAreas: [],
          polygonAreas: [],
          outsideIds: []
        };
        this.$nextTick(() => {
          this.initForm = false;
        });
        // 判断新增或编辑
        if (this.id) {
          this.getFormDetail();
        } else {
          this.$nextTick(() => {
            this.mapInitFlag = true;
          });
        }
      }
      this.$emit("update:isOpen", val);
    },
    "form.leaders"(val) {
      if (this.initForm) {
        return;
      }
      this.$nextTick(() => {
        this.$refs.form.validateField("leaders");
      });
    },
    "form.regexArrays"() {
      if (this.initForm) {
        return;
      }

      this.$nextTick(() => {
        this.$refs.form.validateField("regexArrays");
      });
    },
    "form.libraries"() {
      if (this.initForm) { return }
      this.$nextTick(() => {
        this.$refs.form.validateField("libraries");
      });
    },
    "form.cars"(val) {
      if (this.initForm) { return }
      this.$nextTick(() => {
        this.$refs.form.validateField("cars");
      });
    }
  },
  methods: {
    //车牌位数添加
    autoCarAdd(val) {
      this.form.regexArrays[val].regexVOList = new Array;
      for (let i = 0; i < this.form.regexArrays[val].regexLength; i++) {
        let data = { orderNum: i + 1, type: null, regexValue: null }
          this.form.regexArrays[val].regexVOList.push(data)
      }
    },
    // 获取表单详情
    getFormDetail() {
      GetcarContro(this.id).then(res => {
        if (res.status == 200) {
          this.form = res.data;
          if (!res.data.regexArrays) {
            this.$set(this.form, 'regexArrays', [])
          }
          this.mapInitFlag = true;
          // 时间处理
          if (this.form.timeFlag == 1) {
            this.pickerValue = [
              this.moment(this.form.beginTime, "YYYY-MM-DD HH:mm:ss")._d,
              this.moment(this.form.endTime, "YYYY-MM-DD HH:mm:ss")._d
            ];
          }
        }
      });
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (!valid) return;
        // 参数处理
        let form = JSON.parse(JSON.stringify(this.form));
        const { circleAreas = [], polygonAreas = [], outsideIds = [] } = form;
        // 地图布控区域必填
        if (circleAreas.length === 0 && polygonAreas.length === 0 && outsideIds.length === 0) {
          this.$message({
            message: '请圈选布控区域',
            type: 'warning'
          });
          return;
        } else {
          // 负责人数据处理
          form.leaderIds = form.leaders.map(item => item.id).join(",");
          delete form.leaders;
          // 布控库
          form.libraryNums = form.libraries.map(item => item.num).join(",");
          delete form.libraries;
          // 布控个体
          form.carInfoIds = form.cars.map(item => item.id).join(",");
          delete form.cars;
          // 布控白名单
          form.whiteListIds = form.whiteList.map(item => item.id).join(",");
          delete form.whiteList;
          // 布控时间
          if (this.pickerValue) {
            form.timeFlag = 1;
            form.beginTime = this.moment(this.pickerValue[0]).format(
              "YYYY-MM-DD HH:mm:ss"
            );
            form.endTime = this.moment(this.pickerValue[1]).format(
              "YYYY-MM-DD HH:mm:ss"
            );
          } else {
            form.timeFlag = 0;
            form.beginTime = null;
            form.endTime = null;
          }

          // api处理
          let api = this.id ? PutcarContro : PostcarContro;
          let request = null;
          // 通用处理
          eval(`(request = api(${JSON.stringify(form)}))`);
          request.then(res => {
            let isSuccess = res.status === 200;
            // 提示处理
            this.$notify({
              title: isSuccess ? "成功" : "失败",
              message: isSuccess
                ? this.id
                  ? "修改成功"
                  : "新增成功"
                : res.message,
              type: isSuccess ? "success" : "error",
              duration: 2000
            });

            if (isSuccess) {
              this.$emit("complete");
              this.isFormDialog = false;
            }
          });
        }
      });
    },
    // 地图区域信息
    onMapInfo(circle, polygon, ids) {
      let circleAreas = JSON.parse(JSON.stringify(circle));
      let polygonAreas = JSON.parse(JSON.stringify(polygon));
      let outsideIds = Array.from(ids);
      this.form = { ...this.form, circleAreas, polygonAreas, outsideIds };
    },
    //手动添加
    isHangleAdd(controlType) {
      this.controlType = controlType;
      this.$nextTick(() => {
        this.isAddFormDialog = true;
      });
    },

    // 添加模糊车牌号
    onAddCarsForm() {
      this.form.regexArrays.push({
        regexLength: 7,
        regexVOList: [
          { orderNum: 1, type: null, regexValue: null },
          { orderNum: 2, type: null, regexValue: null },
          { orderNum: 3, type: null, regexValue: null },
          { orderNum: 4, type: null, regexValue: null },
          { orderNum: 5, type: null, regexValue: null },
          { orderNum: 6, type: null, regexValue: null },
          { orderNum: 7, type: null, regexValue: null },
        ]
      })
    },
    // 删除模糊车牌号
    onDelCarsForm(index) {
      this.form.regexArrays.splice(index, 1);
    },
    AddCarsOrWhite(val) {
      const obj = { id: val.data.id, plateNumber: val.data.plateNumber };
      if (this.controlType === 'c') {
        this.form.cars.push(obj);
      } else if (this.controlType === 'w') {
        this.form.whiteList.push(obj);
      }
    },
    AddCars(val) {
      this.form.cars.push({id: val.data.id, plateNumber: val.data.plateNumber})
    }
  }
};
</script>

<style lang="scss" scoped>
.task-form {
  /deep/ {
    .el-dialog__body {
      max-height: 520px;
    }
  }
  .form-part {
    height: 520px;
    padding: 0 10px;
    overflow-y: auto;
  }
  .task-type {
    font-size: 13px;
    color: #3f4041;
    padding-top: 10px;
    span {
      color: #2e2e2e;
      margin-left: 4px;
    }
  }
  .tip {
    line-height: 100%;
    padding: 6px 0;
    font-size: 12px;
    color: #666;
  }
  .heading {
    position: relative;
    line-height: 50px;
    font-size: 13px;
    font-weight: bold;
    color: #3f4041;
    &:before {
      position: absolute;
      left: 80px;
      right: 0;
      top: 24px;
      background: #eff1f4;
      height: 1px;
      content: "";
    }
  }
  .heightexact {
    margin-right: 3px;
  }
  .custom-input {
    width: 60px;
  }
  .carNum {
    display: flex;
    .carNumHead {
      word-break: keep-all;
      margin-right: 5px;
    }
  }
  .HandleAdd {
    position: absolute;
    left: 113px;
    top: 6px;
  }
  .live-box {
    position: relative;
    background: #f3f4f5;
    overflow: hidden;
    margin-bottom: 20px;
    padding: 5px;
    width: 100%;
    .carNums {
      display: flex;
      margin-top: 5px;
      /deep/ .el-input {
          .el-select {
          width: 37px;
          .el-select__caret {
            cursor: pointer;
          }
        }
      }
    }
  }
  .flex {
    display: flex;
    justify-content: space-between;
  }
  .btns {
    text-align: center;
    line-height: 50px;
    .btn-add {
      font-size: 30px;
      cursor: pointer;
    }
    .btn-del {
      font-size: 30px;
      cursor: pointer;
    }
  }
}
</style>