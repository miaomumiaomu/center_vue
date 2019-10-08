<template>
  <el-dialog :visible.sync="visible" :title="title" width="700px" v-if="visible">
    <el-form :model="form" ref="form" label-width="100px">
      <div class="heading">基础信息</div>

      <el-form-item label="警情名称" prop="name">
        <el-input v-model="form.name" :disabled="true" />
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="警情编号" prop="code">
            <el-input v-model="form.code" :disabled="true" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="警情类型" prop="type">
            <dict-select v-model="form.type" dict-name="police_case_type" :disabled="true" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="警情说明" prop="remarks">
        <el-input v-model="form.remarks" type="textarea" :disabled="true" />
      </el-form-item>
      <el-form-item label="涉案人员" prop="personArr">
        <div>
          <span>{{ `共${ form.personArr ? form.personArr.length : 0 }人` }}</span>
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
          </div>
        </template>
      </el-form-item>
      <el-form-item label="所属辖区" prop="policeAreaName">
        <jurisdiction-person-search v-model="form.policeAreaCode" :policeName="form.policeAreaName"></jurisdiction-person-search>
      </el-form-item>
      <el-form-item label="负责人" prop="userArr">
        <responsible-select v-model="form.userArr" />
      </el-form-item>

      <div class="heading">警情处理</div>

      <el-form-item label="处理说明" prop="handleDesc" v-show="!disabled">
        <el-input v-model="form.handleDesc" type="textarea" />
      </el-form-item>
      <el-form-item label="警情状态" prop="handleStatus">
        <el-radio-group v-model="form.handleStatus" :disabled="disabled">
          <el-radio :label="0">办理中</el-radio>
          <el-radio :label="1">撤案</el-radio>
          <el-radio :label="2">办结</el-radio>
        </el-radio-group>
      </el-form-item>

      <div class="heading">处理历史</div>

      <template v-for="(item, index) in form.handleHistoryArr">
        <el-form-item label-width="0px" :key="index" class="border">
          <div>
            <span>{{ `${item.handleUserName}/${item.handleUserAccount}` }}</span>
            <strong v-if="index == 0 && form.status == 1">{{ `已撤案` }}</strong>
            <strong v-if="index == 0 && form.status == 2">{{ `已办结` }}</strong>
            <span style="float: right">{{ item.createTime }}</span>
          </div>
          <div>{{ item.handleDesc }}</div>
        </el-form-item>
      </template>
    </el-form>
    <div slot="footer">
      <template  v-if="!disabled">
        <el-button size="mini" type="primary" @click="onSubmit()">保存</el-button>
        <el-button size="mini" @click="visible = false">取消</el-button>
      </template>
      <el-button size="mini" @click="visible = false" v-else>关闭</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getPolicecaseInfo, handlePolicecase } from '@/api/warnManage'

export default {
  components: {
    ResponsibleSelect: () => import("./ResponsibleSelect"),
    JurisdictionPersonSearch: () => import("./JurisdictionPersonSearch")
  },
  data() {
    return {
      visible: false,
      disabled: false,
      title: '',
      form: {}
    }
  },
  methods: {
    showDialog(id, title, disabled = false) {
      this.title = title
      this.disabled = disabled
      getPolicecaseInfo(id).then(res => {
        if (res.status === 200) {
          this.visible = true
          this.$nextTick(() => {
            this.form = res.data
            this.$set(this.form, 'userArr', this.form.userArr)
            this.$set(this.form, 'handleStatus', this.form.status)
          })
        }
      })
    },
    onSubmit() {
      handlePolicecase(this.form).then(res => {
        let isSuccess = res.status === 200;
        // 提示处理
        this.$notify({
          title: isSuccess ? "成功" : "失败",
          message: isSuccess ? "处理成功" : res.message,
          type: isSuccess ? "success" : "error",
          duration: 2000
        })
        if (isSuccess) {
          this.visible = false
          this.$emit('update')
        }
      })
    }
  }
}

</script>
<style lang="scss" scoped>
.heading {
  position: relative;
  z-index: 10;
  top: -5px;
  line-height: 30px;
  font-size: 13px;
  font-weight: bold;
  color: #3f4041;
  &:before {
    position: absolute;
    left: 80px;
    right: 0;
    top: 14px;
    background: #eff1f4;
    height: 1px;
    content: "";
  }
}
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
}
.border {
  border-bottom: 1px solid rgba(39, 69, 119, 0.8);
  margin-left: 32px;
  &:last-child {
    border: none;
  }
}
</style>