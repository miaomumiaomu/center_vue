<template>
  <el-dialog :visible.sync="visible" :title="title" width="700px">
    <el-form :model="form" ref="form" :rules="rules" label-width="100px">
      <el-form-item label="警情名称" prop="name">
        <el-input v-model="form.name" clearable />
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="警情编号" prop="code">
            <el-input v-model="form.code" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="警情类型" prop="type">
            <dict-select v-model="form.type" dict-name="police_case_type" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="警情说明" prop="remarks">
        <el-input v-model="form.remarks" type="textarea" clearable />
      </el-form-item>
      <el-form-item label="涉案人员" prop="personArr">
        <div>
          <span>{{ `共${ form.personArr ? form.personArr.length : 0 }人` }}</span>
          <span style="float: right">
            <el-button class="txt-btn" size="mini" type="text" icon="el-icon-plus" @click="onItemAdd()" v-if="!readonly">添加</el-button>
          </span>
        </div>
        <template v-if="form.personArr" v-for="(item, index) in form.personArr">
          <div class="live-box" :key="index">
            <el-col :span="6">
              <img :src="item.personIdPhoto" class="pic" v-if="item.personIdPhoto" />
              <img src="~@/assets/noimage.jpg" class="pic" v-else />
            </el-col>
            <el-col :span="14" :offset="1">
              <ul class="content">
                <li>姓名：{{ item.personName }}</li>
                <li>联系方式：{{ item.personMobile || '暂无' }}</li>
                <li>证件号码：{{ item.identifyNo || '暂无' }}</li>
              </ul>
            </el-col>
            <i class="el-icon-edit btn-add" @click="onItemEdit(item)"></i>
            <i class="el-icon-remove-outline btn-del"  @click="onItemDelete(index)"></i>
          </div>
        </template>
      </el-form-item>
      <el-form-item label="所属辖区" prop="policeAreaCode">
        <jurisdiction-person-search v-model="form.policeAreaCode" :policeName.sync="form.policeAreaName" @policeAreaInfo="setPoliceAreaInfo"></jurisdiction-person-search>
      </el-form-item>
      <el-form-item label="负责人" prop="userArr">
        <responsible-select v-model="form.userArr" @complete="userArrComplete" />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button size="mini" type="primary" @click="onSubmit()">确定</el-button>
      <el-button size="mini" @click="visible = false">取消</el-button>
    </div>

    <label-form :is-open.sync="isFormDialogAdd" :id.sync="personId" @choseMan="editFinish" @complete="addComplete"/>
  </el-dialog>
</template>
<script>
import { addPolicecase, getPolicecaseInfo, putPolicecase } from '@/api/warnManage'

export default {
  components: {
    LabelForm: () => import("@/components/FaceLabelForm"),
    ResponsibleSelect: () => import("./ResponsibleSelect"),
    JurisdictionPersonSearch: () => import("./JurisdictionPersonSearch")
  },
  data() {
    return {
      visible: false,
      readonly: false,
      title: '',
      isFormDialogAdd: false,
      personId: null,
      addFlag: true,
      itemAddFlag: true,
      form: {
        name: '',
        code: '',
        type: '',
        remarks: '',
        personArr: [],
        policeAreaId: null,
        policeAreaCode: null,
        policeAreaName: null,
        userArr: [],
      },
      rules: {
        name: { required: true, message: "警情名称不能为空" },
        code: { required: true, message: "警情编号不能为空" },
        type: { required: true, message: "警情类型不能为空", trigger: 'change' },
        personArr: { required: true, message: "涉案人员不能为空", type: 'array', trigger: 'change' },
        policeAreaCode: { required: true, message: "所属辖区不能为空" },
        userArr: { required: true, message: "负责人不能为空", type: 'array', trigger: 'change' },
      },
    }
  },
  methods: {
    showDialog(id = null, title) {
      this.title = title
      if(id) { // 编辑
        this.addFlag = false
        getPolicecaseInfo(id).then(res => {
          if (res.status === 200) {
            this.visible = true
            this.$nextTick(() => {
              this.form = res.data
            })
          }
        })
      } else { // 添加
        this.visible = true
        this.addFlag = true
        this.$nextTick(() => {
          this.$refs.form && this.$refs.form.resetFields()
        })
      }
    },

    // 操作处理
    onItemAdd() {
      this.personId = null
      this.itemAddFlag = true
      this.$nextTick(() => {
        this.isFormDialogAdd = true;
      })
    },
    onItemEdit(row) {
      this.personId = row.personId
      this.itemAddFlag = false
      this.$nextTick(() => {
        this.isFormDialogAdd = true;
      })
    },
    onItemDelete(index) {
      this.form.personArr.splice(index, 1)
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (!valid) return;
        if (!this.addFlag) { // 如果为编辑
          putPolicecase(this.form).then(res => {
            let isSuccess = res.status === 200;
            // 提示处理
            this.$notify({
              title: isSuccess ? "成功" : "失败",
              message: isSuccess ? "编辑成功" : res.message,
              type: isSuccess ? "success" : "error",
              duration: 2000
            })
            if (isSuccess) {
              this.visible = false
              this.$emit('update')
            }
          })
        } else {
          addPolicecase(this.form).then(res => {
            let isSuccess = res.status === 200;
            // 提示处理
            this.$notify({
              title: isSuccess ? "成功" : "失败",
              message: isSuccess ? "新增成功" : res.message,
              type: isSuccess ? "success" : "error",
              duration: 2000
            })
            if (isSuccess) {
              this.visible = false
              this.$emit('update')
            }
          })
        }
      })
    },

    // 组件回调
    editFinish(val) {
      if (!val.id) return
      let updatedObj = {
        personId: val.id,
        personIdPhoto: val.personInfoImages[0].filePath,
        personName: val.name,
        personMobile: val.mobile,
        identifyNo: val.identityNo,
      }
      if (!this.itemAddFlag) {
        for(let obj of this.form.personArr) {
          if (obj.personId === updatedObj.personId) {
            Object.assign(obj, updatedObj)
            break
          }
        }
      } else {
        let flag = true
        for(let obj of this.form.personArr) {
          if (obj.personId === updatedObj.personId) {
            flag = false
            break
          }
        }
        flag && this.form.personArr.push(updatedObj)
      }
      this.$refs.form.validateField('personArr')
    },
    addComplete(res) {
      if (!res) return
      this.form.personArr.push({
        personId: res.data.id,
        personIdPhoto: res.data.personInfoImages[0].filePath,
        personName: res.data.name,
        personMobile: res.data.mobile,
        identifyNo: res.data.identityNo,
      })
      this.$refs.form.validateField('personArr')
    },
    setPoliceAreaInfo(obj) {
      this.form.policeAreaId = obj.id
      this.form.policeAreaCode = obj.code
      this.form.policeAreaName = obj.name
    },
    userArrComplete() {
      this.$nextTick(() => {
        this.$refs.form.validateField('userArr')
      })
    }
  }
}

</script>
<style lang="scss" scoped>
.live-box {
  position: relative;
  background: #f3f4f5;
  overflow: hidden;
  .content{
    list-style: none;
    margin-top: 20px;
    li{
      height: 33px;
      line-height: 33px;
      span{
        margin-left: 10px;
      }
    }
  }
  .pic{
    margin-top: 20px;
    margin-left: 35px;
    width: 106px;
    height: 119px;
  }
  .btn-add {
    position: absolute;
    top: 50%;
    right: 40px;
    margin-top: -15px;
    font-size: 30px;
    cursor: pointer;
  }
  .btn-del {
    position: absolute;
    top: 50%;
    right: 5px;
    margin-top: -15px;
    font-size: 30px;
    cursor: pointer;
  }
}
</style>