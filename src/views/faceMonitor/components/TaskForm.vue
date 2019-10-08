<template>
  <el-dialog :title="id?'编辑人脸布控':'添加人脸布控'" class="task-form body0" :visible.sync="isFormDialog" width="1000px">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px">
      <el-row>
        <el-col :span="12" class="form-part">
          <div class="task-type">
            <label>任务类型</label>
            <span>{{getTaskType}}</span>
          </div>
          <div class="heading">任务信息</div>
          <el-form-item label="任务编号" prop="code">
            <el-input v-model="form.code" maxlength='50' placeholder="任务编号不能重复" />
          </el-form-item>
          <el-form-item label="任务名称" prop="name">
            <el-input v-model="form.name" maxlength='100' placeholder="请输入任务名称" />
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
          <el-form-item label="任务描述" prop="remark">
            <el-input type="textarea" resize="none" :autosize="{ minRows: 4, maxRows: 4 }" v-model="form.remark" />
          </el-form-item>
          <div class="heading">布控设置</div>
          <el-form-item v-if="form.alarmType === 2" label="民族" prop="tagMap">
            <el-checkbox-group v-model="form.tagMap[0]">
              <!-- <el-checkbox label="0">汉族</el-checkbox> -->
              <el-checkbox label="1">维族</el-checkbox>
              <!-- <el-checkbox label="2">白人</el-checkbox>
              <el-checkbox label="3">黑人</el-checkbox> -->
            </el-checkbox-group>
          </el-form-item>
          <el-form-item v-if="form.alarmType === 0 || form.alarmType === 1" label="布控库" prop="tags">
            <librarie-select :filtrateNum="[2]" v-model="form.tags" v-if="isFormDialog" />
          </el-form-item>
          <el-form-item v-if="form.alarmType === 0 || form.alarmType === 1" label="布控个体" prop="persons">
            <el-button class="txt-btn HandleAdd" size="mini" type="text" icon="el-icon-plus" @click="isHangleAdd('p')">手动添加</el-button>
            <label-select v-model="form.persons" v-if="isFormDialog" />
          </el-form-item>
          <el-form-item label="布控白名单" prop="whiteList">
            <el-button class="txt-btn HandleAdd" size="mini" type="text" icon="el-icon-plus" @click="isHangleAdd('w')">手动添加</el-button>
            <label-select v-model="form.whiteList" v-if="isFormDialog" />
          </el-form-item>

          <el-form-item label="重复预警" prop="reAlarm">
          <el-switch
            v-model="form.reAlarm"
            active-text="开"
            inactive-text="关"
            active-color="#13ce66"
            :active-value="1"
            :inactive-value="0"
            >
          </el-switch>
        </el-form-item>
          <el-form-item v-if="form.alarmType === 0" label="阈　值" prop="similarity">
            <div class="similarity">
              <el-slider v-model="form.similarity" :step="0.01" :min="0" :max="1" :format-tooltip="val => parseInt(val*100)+'%'"></el-slider>
            </div>
          </el-form-item>
          <el-form-item label="布控时间" prop="beginTime">
            <el-date-picker v-model="pickerValue" type="datetimerange" :picker-options="pickerOptions(1)" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" />
            <div class="tip">不设置时间默认为长期有效</div>
          </el-form-item>
          <el-form-item class="m0" prop="endTime" />
          <el-form-item v-if="form.alarmType === 1" label="预警时间" prop="intervalTime">
            超过
            <el-input v-model.number="form.intervalTime" class="custom-input" size="mini" @focus="form.alarmType = 1" />
            天未捕捉到布控对象时
          </el-form-item>
          <el-form-item class="m0" prop="personIds" />
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
    </el-form>
    <div slot="footer">
      <el-button size="mini" type="primary" @click="onSubmit">保存</el-button>
      <el-button size="mini" @click="isFormDialog = false">取消</el-button>
    </div>
    <label-form ref="labelForm" :id.sync="personId" :is-open.sync="isAddFormDialog" @complete="AddPersonOrWhite" :handletitle="'handleAdd'"/>
  </el-dialog>
</template>

<script>
import { pickerOptions, createMap } from "@/utils";
import {
  postMonitorTask,
  putMonitorTask,
  getMonitorTask
} from "@/api/faceMonitor";

export default {
  components: {
    ResponsibleSelect: () => import("./ResponsibleSelect"),
    LibrarieSelect: () => import("./LibrarieSelect"),
    LabelSelect: () => import("./LabelSelect"),
    LabelForm: () => import("@/components/FaceLabelForm"),
  },
  props: {
    id: Number,
    category: Number,
    cameraList: {
      default: () => [],
      type: Array
    },
    isOpen: {
      default: false,
      type: Boolean
    }
  },
  data() {
    let formValidateInterval = (rule, value, cb) => {
      let regexp = /(^[1-9]\d*$)/;
      if (this.form.alarmType == 0) {
        cb();
        return;
      }
      if (value.length === 0 && this.form.alarmType == 1) {
        cb("天数不能为空");
        return;
      }
      if (regexp.test(value)) {
        cb();
      } else { cb("天数不能小于1") }
    };
    let formValidateRace = (rule, value, cb) => {
      if (!this.form.tagMap[0] || this.form.tagMap[0].length === 0) {
        cb("民族不能为空");
      } else { cb() }
    };
    let formValidatePersonnel = (rule, value, cb) => {
      if (!this.form.tags.length && !this.form.persons.length) {
        cb("布控库或布控个体不能为空");
      } else { cb() }
    };
    return {
      isAddFormDialog: false, //手动添加
      isFormDialog: false,
      pickerValue: null,
      pickerOptions: pickerOptions,
      layerGroup: null,
      initForm: true,
      controlType: '',
      personId: null,
      form: {
        code: null,
        name: null,
        beginTime: null,
        endTime: null,
        remark: null,
        status: 1,
        alarmType: 0, // 布控类型
        intervalTime: 3,
        labelNums: null, // 人脸库提交
        leaders: [], // 负责人
        leaderIds: null,
        whiteList: [], // 白名单
        tags: [], // 布控库
        personTags: null,
        persons: [], // 布控个体
        tagMap: { 0: [] }, // 布控特征值
        personIds: null,
        timeFlag: 0,
        similarity: 0.85,
        reAlarm: 0,
        smsPushStatus: 0, // 短信推送
        smsPushTelPhones: null,
        circleAreas: [],
        polygonAreas: [],
        outsideIds: []
      },
      rules: {
        code: { required: true, message: "任务编号不能为空" },
        name: { required: true, message: "任务名称不能为空" },
        leaders: { required: true, message: "负责人不能为空" },
        intervalTime: { validator: formValidateInterval },
        tags: { validator: formValidatePersonnel },
        persons: { validator: formValidatePersonnel },
        tagMap: { validator: formValidateRace }
      },
      mapInitFlag: false,
      smsData: [], //短信模板
      appData: []
    };
  },
  computed: {
    getTaskType() {
      let result = '';
      switch(this.form.alarmType) {
        case 0:
          result = '正向布控';
          break;
        case 1:
          result = '反向布控';
          break;
        case 2:
          result = '特征布控';
          break;
      }
      return result;
    }
  },
  watch: {
    isOpen(val) {
      if (!val) this.mapInitFlag = false;
      this.isFormDialog = val;
    },
    isFormDialog(val) {
      if (val) {
        this.pickerValue = null;
        // 重置表单，重置结束后开启验证
        this.initForm = true;
        this.$refs.form && this.$refs.form.resetFields();
        // 特殊字段特殊处理
        this.form = {
          ...this.form,
          alarmType: this.category,
          endTime: null,
          intervalTime: 3,
          tagMap: { 0: ['1'] },
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
      if (this.initForm) { return }
      this.$nextTick(() => {
        this.$refs.form.validateField("leaders");
      });
    },
    "form.persons"(val) {
      if (this.initForm) { return }
      this.$nextTick(() => {
        if (this.form.alarmType != 2) this.$refs.form.validateField("persons");
      });
    },
    "form.tags"(val) {
      if (this.initForm) { return }
      this.$nextTick(() => {
        if (this.form.alarmType != 2) this.$refs.form.validateField("tags");
      });
    }
  },
  methods: {
    // 获取表单详情
    getFormDetail() {
      getMonitorTask(this.id).then(res => {
        if (res.status == 200) {
          this.form = res.data;
          this.form.tagMap = { 0: ['1'] } // 默认维族 且返回是个{}会覆盖掉数组 导致el-checkbox-group选项出错
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
      this.personId = null
      this.$nextTick(() => {
        this.isAddFormDialog = true;
      });
    },
    AddPersonOrWhite(val) {
      const obj = { id: val.data.id, identityImgPath: val.data.identityImgPath, name: val.data.name };
      if (this.controlType === 'p') {
        this.form.persons.push(obj);
      } else if (this.controlType === 'w') {
        this.form.whiteList.push(obj);
      }
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
          form.personTags = form.tags.map(item => item.num).join(",");
          delete form.tags;
          // 布控白名单
          form.whiteListIds = form.whiteList.map(item => item.id).join(",");
          delete form.whiteList;
          // 布控个体
          form.personIds = form.persons.map(item => item.id).join(",");
          delete form.persons;
          if(form.alarmType !== 2) {
            delete form.tagMap;
          }
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
          let api = this.id ? putMonitorTask : postMonitorTask;
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
  .el-select {
    width: 100%;
  }
  .el-date-editor {
    width: 100%;
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
  .custom-input {
    width: 60px;
  }
  .HandleAdd {
    position: absolute;
    left: 113px;
    top: 6px;
  }
}
</style>