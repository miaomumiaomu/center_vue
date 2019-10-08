<template>
  <!-- 编辑车辆库弹层 S -->
    <el-dialog :title="id?'编辑车辆':'新增车辆'" class="form-layer" :visible.sync="isAddFormDialog" width="500px" append-to-body>
      <el-form :rules="rules" :model="form" ref="form" label-width="100px" :style="waterBg">
        <el-form-item prop="pageNo" class="m0" />
        <el-form-item prop="pageSize" class="m0" />
        <el-form-item prop="totalCount" class="m0" />
        <el-form-item label="车牌号" prop="plateNumber">
          <el-input v-model="form.plateNumber" placeholder="请输入车牌号" maxlength="8"></el-input>
        </el-form-item>
        <el-form-item label="车辆库" prop="libraryNums">
          <!-- <el-select v-model="form.libraryNums" placeholder="请选择" style="width: 100%">
            <el-option v-for="(item,index) in type_option" :key="index" :label="item.name" :value="item.num"></el-option>
          </el-select> -->
          <car-library-select style="width: 100%" :filtrateNum="[2]" v-model="form.libraryNums" placeholder="请选择类型" multiple collapse-tags @input="$refs.form.validateField('libraryNums')" v-if="isAddFormDialog" />
        </el-form-item>
        <el-form-item label="车辆类型" prop="vehicleType" >
          <el-select v-model="form.vehicleType" placeholder="请选择" style="width: 100%">
            <el-option v-for="(item,index) in options" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车辆品牌" prop="vehicleBrand">
          <el-input v-model="form.vehicleBrand" placeholder="请输入车辆品牌"></el-input>
        </el-form-item>
        <el-form-item label="车辆型号" prop="vehicleModel">
          <el-input v-model="form.vehicleModel" placeholder="请输入车辆型号"></el-input>
        </el-form-item>
        <el-form-item label="车辆颜色" prop="vehicleColor">
          <el-color-picker v-model="form.vehicleColor" @active-change="onColorChange"></el-color-picker>
        </el-form-item>
        <el-form-item label="备注" prop="carDesc">
          <el-input type="textarea" resize="none" :autosize="{ minRows: 3 }" placeholder="请输入备注信息" v-model="form.carDesc"></el-input>
        </el-form-item>
        <el-form-item label="是否新能源" prop="newEnergy">
          <el-radio v-model="form.newEnergy" label="0">否</el-radio>
          <el-radio v-model="form.newEnergy" label="1">是</el-radio>
        </el-form-item>
      </el-form>
      <div class="heading">
        <span>车主信息</span>
        <span style="float: right">
          <el-button class="txt-btn" size="mini" type="text" icon="el-icon-plus" @click="onItemEditadd()">选择人员库成员</el-button>
          <el-button class="txt-btn" size="mini" type="text" icon="el-icon-plus" @click="onItemEdit()">手动添加</el-button>
        </span>
      </div>
      <div class="live-box" v-if="form.name">
        <el-form>
          <el-form-item>
            <el-col :span="6">
              <img :src="imgShow" class="pic" v-if="imgShow" />
              <img src="~@/assets/noimage.jpg" class="pic" v-else />
            </el-col>
            <el-col :span="15" :offset="1">
              <ul class="content">
                <li>姓名：{{form.name}}</li>
                <li>性别：{{form.sex | commonFilter('comm_sex')}}</li>
                <li>身份证：{{form.identityNo}}</li>
                <li>电话：{{form.phone ? form.phone : '未知'}}</li>
              </ul>
            </el-col>
          </el-form-item>
        </el-form>
      </div>
      <div class="heading-house">
        <span>房屋信息</span>
        <span style="float: right">
          <el-button class="txt-btn" size="mini" type="text" icon="el-icon-plus" v-if="form.id" @click="carHistoryOpen(form.id)">变更历史</el-button>
        </span>
      </div>
      <div>
        <el-form label-width="60px">
          <div class="house-box" v-for="(item,index) in housesForm" :key="index">
            <el-row>
              <el-col :span="24">
                <el-form-item label="房屋" style="margin: 0;">
                  <el-input v-model="housesForm[index].fullName" :title="housesForm[index].fullName" placeholder="实有房屋" @focus="addressDialogOpen(index)" readonly />
                </el-form-item>
              </el-col>
              <!-- <el-col :span="12">
                <el-form-item label="房屋" style="margin: 0;">
                  <el-select v-model="housesForm[index].houseId" placeholder="请选择" v-if="housesForm[index].able">
                    <el-option v-for="item in houseList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                  </el-select>
                  <el-input v-model="housesForm[index].houseName" :title="housesForm[index].houseName" placeholder="请先选择地址" v-else readonly />
                </el-form-item>
              </el-col> -->
            </el-row>
            <i class="el-icon-circle-plus btn-add" @click="onAddHousesForm"></i>
            <i class="el-icon-remove btn-del" @click="onDelHousesForm(index)" v-if="housesForm.length > 1"></i>
          </div>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="onUpdate()">确 定</el-button>
        <el-button size="mini" @click="onCancle()">取 消</el-button>
      </div>
      <!-- 表单详情 -->
      <person-select :is-open.sync="isFormDialogadd" v-on:choseMan="choseMan" ref="SelectForm" title="选择车主"/>

      <label-form ref="labelForm" :is-open.sync="isFormDialog" :id.sync="personId" v-on:choseMan="choseMan"/>
      
      <!-- 车辆变更历史 -->
      <car-history ref="carHistory"></car-history>

      <!-- 辖区混合树 -->
      <!-- 限制到只能到辖区 -->
      <jurisdiction-addr-menu-dialog ref="addressDialog"  @finish="getAddress" :limit="{ type: 2, buildType: 3 }" warnText="请选择到室号"></jurisdiction-addr-menu-dialog>
    </el-dialog>
    <!-- 编辑车辆库弹层 E -->

</template>

<script>
import { saveCarinfos, Editcarinfos, getcarLibraries, getperson } from "@/api/carManage";
import { getHouseList } from "@/api/houseManage";
import { mapState } from "vuex";
import { mapGetters } from 'vuex';

export default {
  name: "LabelAddForm",
  components: {
    LabelForm: () => import("@/components/FaceLabelForm"),
    JurisdictionAddrMenuDialog: () => import("@/components/JurisdictionAddrMenuDialog"),
    carHistory: () => import('./carHistory')
  },
  props: {
    id: Number,
    readonly: {
      default: false,
      type: Boolean
    },
    isOpen: {
      default: false,
      type: Boolean
    }
  },
  data() {
    let minlength = (rule, value, callback) => {
      if (value.length < 6 ) {
        callback("车牌号不能小于六位");
      } else {
        callback();
      }
    };
    return {
      isFormDialogadd: false, //库里选择
      isFormDialog: false, // 控制表单显示
      menuData: null,
      currentRow: {},
      currentIndex: 0,
      imgShow: null,
      // 表单弹窗
      isAddFormDialog: false,
      personId: null,
      form: {
        plateNumber: null, //车牌号
        vehicleColor: "#C7E09C", //   颜色
        vehicleType: null, //车辆 类型
        vehicleBrand: null,  //车辆 品牌
        vehicleModel: null, //车辆 型号
        newEnergy: "1", // 是否新能源
        canDangleAfter: null,
        carDesc: null,
        personId: null,  //人员ID
        name: null,  //人员名称
        identityNo: null, // 人员身份证
        phone: null, // 电话
        // houseId: null, // 房间ID
        sex: null,  //性别
        libraryNums: null,
      },
      housesForm: [
        { fullName: null, houseId: null }
      ],
      houseList: [],
      currentIndex: null,
      rules: {
        plateNumber: [{ required: true, message: "车牌号不能为空" },  { validator: minlength }],
        libraryNums: { required: true, message: "车辆库不能为空" },
      },
      //选择 数据  模拟
      options: [{
            value: 1,
            label: 'n1小型汽车'
          }, {
            value: 2,
            label: 'n2中型汽车'
          }, {
            value: 3,
            label: 'n3大型汽车'
          }, {
            value: 4,
            label: 'n4超大型汽车'
          }, {
            value: 5,
            label: 'n5巨型汽车'
          }],
      type_option: [],
    house_option: []
    }
  },
  
  watch: {
    //自身打开
    isOpen(val) {
      this.isAddFormDialog = val;
    },
    isAddFormDialog(val) {
      if (val) {
        if(this.$refs.form) {
          this.allReset()
          this.housesForm = [{}]
          this.$refs.form.resetFields();
          this.form.vehicleColor = '#C7E09C';
        }
        this.id && this.getFormDetail();
      }
      this.$emit("update:isOpen", val);
    }
  },
  created() {
    this.init();
    getcarLibraries().then(res => {
      if (res.status == 200) {
          this.type_option = res.data;
        }
    })
  },
  computed: {
    ...mapGetters(["userInfo"]),
    ...mapState({
      waterBg: state => state.user.waterBg, // 水印
    })
  },
  methods: {
    allReset() {
      this.form.id = null,
      this.imgShow = null,
      this.form.personId = null,  
      this.form.name = null,  
      this.form.identityNo = null, 
      this.form.phone = null,
      // this.form.houseId = null, 
      this.form.sex = null,
      this.form.libraryNums = null
    },
    choseMan(val) {
      const { id, identityNo, name, sex, tel, imgShow } = val
      this.imgShow = imgShow ? imgShow : val.personInfoImages[0].filePath;
      this.form.personId = id;
      this.form.name = name;
      this.form.identityNo = identityNo;
      this.form.sex = sex;
      tel ? this.form.phone = tel : '';
      this.manModel = true;
      this.getpersonInfo(id);
    },
    
    onItemEditadd() {
      this.$nextTick(() => {
        this.isFormDialogadd = true;
      });
    },
    onUpdate() {
      this.$refs.form.validate(valid => {
        if (!valid) return;
        let _form = { ...this.form }

        _form.loginName = this.userInfo.loginName
        _form.userName = this.userInfo.name
        _form.houseRels = this.housesForm
        saveCarinfos(_form).then(res => {
          let isSuccess = res.status === 200;
          // 提示处理
          this.$notify({
            title: isSuccess ? "成功" : "失败",
            message: isSuccess ? "修改成功" : res.message,
            type: isSuccess ? "success" : "error",
            duration: 2000
          });
          if (isSuccess) {
            this.isAddFormDialog = false;
            this.$emit("complete");
          }
          });
      });
    },
    onCancle() {
      this.isAddFormDialog = false
    },
    // 手动添加
    onItemEdit(id, isReadonly) {
      this.personId = id || null
      this.$nextTick(() => {
        this.isFormDialog = true;
      });
    },
    init() {
      this.id && this.getFormDetail();
    },
    // 获取表单详情
    getFormDetail() {
      Editcarinfos(this.id).then(res => {
        if (res.status == 200) {
          this.form = null;
          this.form = res.data;
          // res.data.houseId ? this.form.houseId = Number(res.data.houseId) : '';
          res.data.vehicleType ? this.form.vehicleType = Number(res.data.vehicleType) : '';
          this.form.newEnergy = this.form.newEnergy.toString()
          res.data.personId && this.getpersonInfo(res.data.personId)
          res.data.houseRels.length ? this.housesForm = res.data.houseRels : this.housesForm = [{}]
        }
      }); 
    },
    //获取人员 信息
    getpersonInfo(val) {
      if(val) {
        getperson(val).then(result => {
          if (result.status == 200) {
            this.imgShow = result.data.identityImgPath
            this.house_option = result.data.houses
            this.form.sex = result.data.sex
            // this.form.phone = result.data.tel
          }
        })
      }
    },
    // colorchange
    onColorChange(data){
      this.form.vehicleColor = data;
    },
    addressDialogOpen(index) {
      this.currentIndex = index
      this.$refs.addressDialog.open()
    },
    getAddress(data, labels) {
      let index = this.currentIndex
      this.$set(this.housesForm, index, Object.assign({}, this.housesForm[index], {
        policeAreaCode: data.areaCode || data.code,
        policeAreaId: data.areaId || data.id,
        locationCode: data.areaCode ? data.code : null,
        locationId: data.areaId ? data.id : null,
        locationId: data.id,
        locationName: data.label,
        fullName: labels,
        able: true,
      }))
      // let { policeAreaCode, locationCode } = this.housesForm[index]
      // this.getHouseList(policeAreaCode, locationCode)
    },
    getHouseList(_filter_like_policeAreaCode, _filter_like_locationCode) {
      getHouseList({ pageNo: 1, pageSize: 9999, _filter_like_policeAreaCode, _filter_like_locationCode }).then(res => {
        this.housesForm[this.currentIndex].houseId = null
        this.houseList = res.data.rows
        if (this.houseList.length === 1) {
          this.$set(this.housesForm[this.currentIndex], 'houseId', this.houseList[0].id)
        }
      })
    },
    onAddHousesForm() {
      if (this.readonly) {
        return 
      }
      this.housesForm.push({});
    },
    onDelHousesForm(index) {
      this.housesForm.splice(index, 1)
    },
    carHistoryOpen(id) {
      this.$refs.carHistory.open(id)
    }
  }
};
</script>
<style lang="scss" scoped>
  .line{
    width: 100%;
    height: 1px;
    background: #e5e5e5;
  }
  .heading, .heading-house {
    position: relative;
    line-height: 50px;
    font-size: 13px;
    font-weight: bold;
    color: #3f4041;
    &:before {
      position: absolute;
      left: 64px;
      right: 0;
      top: 24px;
      background: #eff1f4;
      height: 1px;
      content: "";
      width: 45%;
    }
    .txt-btn{
      margin: 0;
      padding: 0;
    }
  }
  .heading-house{
    &::before{
      width: 68%;
    }
  }
  .live-box {
    position: relative;
    background: #f3f4f5;
    overflow: hidden;
    .houseChose{
      display: flex;
      margin-left: 37px;
    }
    .content{
      list-style: none;
      margin-top: 15px;
      li{
        height: 20px;
      }
    }
    .el-form-item {
      margin-bottom: 5px;
    }
    .pic{
      margin-top: 20px;
      margin-left: 35px;
      width: 70px;
      height: 100px;
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
  .house-box {
    position: relative;
    background: #f3f4f5;
    overflow: hidden;
    padding: 10px 80px 10px 0;
    .btn-add {
      position: absolute;
      top: 50%;
      right: 40px;
      margin-top: -10px;
      font-size: 20px;
      cursor: pointer;
    }
    .btn-del {
      position: absolute;
      top: 50%;
      right: 5px;
      margin-top: -10px;
      font-size: 20px;
      cursor: pointer;
    }
    /deep/{
      .el-input--medium .el-input__inner{
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  }
    
</style>
