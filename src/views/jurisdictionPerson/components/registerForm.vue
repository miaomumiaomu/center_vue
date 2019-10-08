<template>
  <el-dialog title="盘查登记" :visible.sync="isFormDialog" width="500px">
    <div class="user-info">
      <div>{{userInfo.name}}</div>
      <face-category-list :data="faceLibraryData" :type="0" :chosen="userInfo.personTags? userInfo.personTags.split(','):[]"/>
      <div>{{userInfo.identityNo}}</div>
    </div>
    <el-form ref="form" label-width="80px" :model="form" :rules="rules">
      <el-form-item prop="id" class="m0" />
      <el-form-item label="居住信息">
        <div v-for="item of houseList" :key="item.id">{{item.label}}</div>
      </el-form-item>
      <el-form-item label="最近抓拍">
        <div>{{ passRecordsLast.collectTime && passRecordsLast.address ?  passRecordsLast.collectTime + ' ' + passRecordsLast.address : '从未出现' }}</div>
        <div class="camera-list">
          <div>
            <div v-if="passRecordsLast.bgImgPath">
              <img :src="passRecordsLast.bgImgPath" class="image" @click="onDetails(passRecordsLast.bgImgPath)">
              <div>背景图</div>
            </div>
            <div v-else>暂无图片</div>
          </div>
          <div> </div>
          <div>
            <div v-if="passRecordsLast.snapImgPath">
              <img :src="passRecordsLast.snapImgPath" class="image" @click="onDetails(passRecordsLast.snapImgPath)">
              <div>抓拍照片</div>
            </div>
            <div v-else>暂无图片</div>
          </div>
          {{ getpercent(passRecordsLast.similarity) }}
          <div>
            <div v-if="identityImg">
              <img :src="identityImg" class="image"  @click="onDetails(identityImg)">
              <div>证件照片</div>
            </div>
            <div v-else>暂无图片</div>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="盘查登记" prop="remark">
        <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="form.remark"></el-input>
      </el-form-item>
      <el-form-item label="搬离房屋" prop="fullName">
        <el-checkbox-group v-model="form.houses">
          <div v-for="item of houseList" :key="item.id">
            <el-checkbox :label="item.label" ></el-checkbox>
          </div>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="盘查记录">
        <div class="order">
          <div v-for="(item, index) in form.record" :key="index">
            <div class="order-head" :style="{borderTop: index ? '1px dashed #e1e1e1' : '' }">
              <div>{{ item.createName }}</div>
              <div>{{ item.createTime }}</div>
            </div>
            <div>{{ item.remark }}</div>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button size="mini" type="primary" @click="onSubmit()">确定</el-button>
      <el-button size="mini" @click="isFormDialog = false">取消</el-button>
    </div>
    <el-dialog title="背景大图" :visible.sync="isBgDialog" width="600px" height="auto" append-to-body>
      <img :src="rowBgImg" class="w100">
    </el-dialog>
  </el-dialog>
</template>
<script>
import { mapState } from "vuex";
import { getLabel } from "@/api/faceLibrary";
import { getPassRecordsLast } from '@/api/passRecord'
import { savePersonCanHistory, getPersonCanHistory } from '@/api/jurisdictionPerson'
export default {
  data() {
    return{
      isFormDialog: false,
      
      userInfo: {},//用户信息
      houseList: [], //房屋列表
      currentId: null, //判断是否是上次访问的id，是则不刷新数据
      passRecordsLast: {},//最新抓拍数据
      identityImg: '', //身份证照片
      isBgDialog: false,
      rowBgImg: null,
      form: {
        remark: '',
        houses: [],
        record: [],
      },
      rules: {
        remark: { required: true, message: "内容不能为空" },
      }
    }
  },
  computed: {
    ...mapState({
      faceLibraryData: state => state.commonData.faceLibraryData,
      manageInfo: state=> state.user.userInfo,
    }),
  },
  methods: {
    open(id) {
      this.isFormDialog = true
      this.form = { remark: '', houses: [], record: [] }
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
        this.getLiveInfo(id)
        this.getPassRecordsLast(id)
        this.getPersonCanHistory(id)
        this.currentId = id
      })
    },
    getLiveInfo(id) {
      getLabel(id).then(res => {
        this.identityImg = res.data.identityImgPath
        let { name, personTags, identityNo } = res.data
        this.userInfo = Object.assign({}, { name, personTags, identityNo })
        this.houseList = res.data.houses.map(item => {
          return { label: item.locationName + ' ' + item.houseName, id: item.houseId, code: item.houseCode, locationId: item.locationId }
        })
      })
    },
    getPassRecordsLast(id) {
      getPassRecordsLast({ personId: id }).then(res => {
        this.passRecordsLast = res.data
      })
    },
    getPersonCanHistory(id) {
      getPersonCanHistory({ personId: id }).then(res => {
        this.$set(this.form, 'record', res.data)
      })
    },
    savePersonCanHistory(data) {
      savePersonCanHistory(data).then(res => {
        let isSuccess = res.status === 200;
        this.$notify({
          title: isSuccess ? "成功" : "失败",
          message: isSuccess ? "保存成功" : res.message,
          type: isSuccess ? "success" : "error",
          duration: 2000
        });
        this.isFormDialog = false
        this.$emit('complete')
      })
    },
    onSubmit() {
      this.$refs.form.validate((valid, errArr) => {
        if (!valid) return;
        let locationIds = this.houseList.filter(item => this.form.houses.includes(item.label)).map(item => item.locationId).join(',')
        this.savePersonCanHistory({ personId: this.currentId, createName: this.manageInfo.name, createLoginName: this.manageInfo.loginName , locationIds, remark: this.form.remark })
      })
    },
    onDetails(url) {
      this.rowBgImg = url;
      this.isBgDialog = true;
    },
    getpercent(val) {
      if (!val) {
        return
      }
      let num = Math.round(val * 1000) / 10
      num = num.toString().substr(0, 4)
      return num + '%'
    }
  }
} 
</script>
<style lang="scss" scoped>
.user-info{
  width: 50%;
  display: flex;
  margin-left: 13px;
  margin-bottom: 20px;
  align-items: center;
  *{
    margin-right: 20px;
    white-space: nowrap;
  }
}
.camera-list{
  width: calc(100% - 80px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: center;
  line-height: 1;
  .image{
    width: 80px;
    height: 90px;
    border-radius: 5px;
    margin-bottom: 5px;
    cursor: pointer;
  }
}
.order{
  max-height: 150px;
  overflow: auto;
  .order-head{
    display: flex;
    div{
      margin-right: 20px;
    }
  }
}

</style>

