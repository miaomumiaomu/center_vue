<template>
  <el-dialog class="form-layer body0" :class="{ 'data-view': false }" :title="title" :visible.sync="isAddFormDialog" width="1040px" append-to-body>
    <el-form class="form-box" :model="form" ref="form" :rules="readonly?null:rules" label-width="120px" :disabled="readonly || isView">
      <el-row>
        <catalog v-model="catalogName" width="150px" height="calc(100vh - 201px)">
          <catalog-pane label="基础信息" name="basics">
            <el-col :span="24" class="heading">基础信息</el-col>
            <el-col :span="6" class="left-box">
              <el-form-item label-width="70px" label="证件照" prop="identityImg" class="pic"/>
              <el-upload class="upload" action accept=".jpeg, .jpg, .png, .bmp" :auto-upload="false" :show-file-list="false" :on-change="onIdentityImgUpload">
                <div class="no-image" v-if="!form.identityImg">
                  <img src="@/assets/big-camera.png">
                  <strong>添加图片</strong>
                </div>
                <img :src="form.identityImg.filePath" class="no-image" style="border-width: 0;" v-else>
              </el-upload>
              <el-form-item label-width="70px" label="人像照" prop="personInfoImages" class="pic"/>
              <div class="no-image">
                <el-upload class="pic-list" :class="{ban: fileListLength == 5 || isView }" ref="uploadList" :limit="5" :file-list="fileList" :on-preview="onUploadPreview" :on-exceed="onUploadExceed" :on-change="onUploadChange" :before-remove="onUploadRemore" action accept=".jpeg, .jpg, .png, .bmp" list-type="picture-card" :auto-upload="false" :multiple="true">
                  <!-- <div class="no-image" style="margin: 0;"  v-if="!fileListLength">
                    <img src="@/assets/big-camera.png">
                    <strong>添加图片</strong>
                  </div> -->
                  <i class="el-icon-plus"></i>
                </el-upload>
              </div>
            </el-col>
            <el-col :span="18" class="right-box">
              <el-form-item prop="id" class="m0" />
              <el-form-item prop="houses" class="m0" />
              <el-row>
                <el-col :span="12">
                  <el-form-item label="姓名" prop="name">
                    <el-autocomplete popper-class="my-autocomplete" v-model="form.name" :fetch-suggestions="querySearch" placeholder="请输入姓名" @select="handleSelect">
                      <template slot-scope="{ item }">
                        <div class="bar">
                          <div class="name">{{ item.name }}</div>
                          <span class="addr">{{ item.identityNo }}</span>
                        </div>
                      </template>
                    </el-autocomplete>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="证件号" prop="identityNo">
                    <el-autocomplete popper-class="my-autocomplete" v-model="form.identityNo" :fetch-suggestions="querySearch" placeholder="请输入身份证号" @select="handleSelect" @change.native="onAutomaticFill">
                      <template slot-scope="{ item }">
                        <div class="bar">
                          <div class="name">{{ item.name }}</div>
                          <span class="addr">{{ item.identityNo }}</span>
                        </div>
                      </template>
                    </el-autocomplete>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="证件类型" prop="certificateType">
                    <dict-select dict-name="document_types" v-model="form.certificateType" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="性别" prop="sex">
                    <dict-select dict-name="comm_sex" v-model="form.sex" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="人员管理类别" prop="householdType">
                    <dict-select dict-name="person_manager_type" v-model="form.householdType" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="民族" prop="nation">
                    <dict-select dict-name="comm_nation" v-model="form.nation" filterable/>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="生日" prop="birthday">
                    <el-date-picker v-model="form.birthday" format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="date" placeholder="生日" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="籍贯" prop="nativePlace">
                    <el-input v-model="form.nativePlace" placeholder="请输入籍贯" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="form.mobile" maxlength="11" placeholder="请输入手机号" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="联系电话" prop="tel">
                    <el-input v-model="form.tel" maxlength="11" placeholder="请输入联系电话" />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="人员标签" prop="personTags">
                    <face-library-select ref="faceLibrarySelect" v-model="form.personTags" placeholder="请选择类型" extraData="libraryId" multiple @extraDataBack="tagSelect" v-if="isAddFormDialog" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="人户分离标识" prop="separateFlag">
                    <dict-select dict-name="separation_mark_types" v-model="form.separateFlag" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="人员库" prop="libraryId">
                    <el-tag v-for="item in librarysName" :key="item" >{{item}}</el-tag>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="证件地址" prop="address">
                <el-input v-model="form.address" placeholder="请输入证件地址" />
              </el-form-item>

              <template v-if="!isView">
                <el-form-item label="实际地址" prop="actualAddress">
                  <el-input v-model="form.actualAddress" placeholder="请输入实际地址" />
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                  <el-input type="textarea" resize="none" :autosize="{ minRows: 3 }" v-model="form.remark" />
                </el-form-item>
              </template>

              <el-form-item prop="crtName" class="m0" />
              <el-form-item prop="crtTime" class="m0" />
              <el-form-item prop="updName" class="m0" />
              <el-form-item prop="updTime" class="m0" />
            </el-col>
          </catalog-pane>
          <catalog-pane label="居住信息" name="live">
            <div class="heading">
              <span>居住信息</span>
              <span style="float:right;">
                <div class="txt-btn" @click="getLiveChange(true)" v-if="id">变更历史</div>
              </span>
            </div>
            <div class="live-box" v-for="(item,index) in housesForm" :key="index">
              <el-col :span="24">
                <el-form-item label="房屋" >
                  <el-input v-model="housesForm[index].locationName" placeholder="实有房屋" @focus="addressDialogOpen(index)" readonly />
                </el-form-item>
              </el-col>
              <!-- <el-col :span="12">
                <el-form-item label="房屋" >
                  <el-select v-model="housesForm[index].houseId" placeholder="请选择" v-if="housesForm[index].able">
                    <el-option v-for="item in houseList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                  </el-select>
                  <el-input v-model="housesForm[index].houseName" placeholder="请先选择地址" v-else readonly />
                </el-form-item>
              </el-col> -->
              <el-col :span="12">
                <el-form-item label="住户类型" class="m0">
                  <dict-select dict-name="label_type" v-model="housesForm[index].userType" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="与业主关系" class="m0">
                  <dict-select dict-name="label_relation" v-model="housesForm[index].userRelation" />
                </el-form-item>
              </el-col>
              <i class="el-icon-circle-plus btn-add" @click="onAddHousesForm" v-if="!isView"></i>
              <i class="el-icon-remove btn-del" v-if="housesForm.length > 1" @click="onDelHousesForm(index)"></i>
            </div>
          </catalog-pane>
          <catalog-pane label="单位信息" name="unit">
            <div class="heading">
              <span>单位信息</span>
              <span style="float:right;">
                <div class="txt-btn" @click="getLiveChange(false)" v-if="id">变更历史</div>
              </span>
            </div>
            <div class="live-box" v-for="(item,index) in unitForm" :key="index">
              <el-form-item label="实有单位" prop="companyId">
                <el-select v-model="item.companyId" clearable filterable>
                  <el-option v-for="item in units" :key="item.id" :value="item.id" :label="item.name" @click.native="itemClick(item, index)"/>
                </el-select>
              </el-form-item>
              <el-col :span="12">
                <el-form-item label="职业类型" prop="professionType" class="m0">
                  <cascader-select :data="professionType" :keyCode="item.professionType" @complete="cascaderFinish"></cascader-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="职业名称" prop="profession" class="m0">
                  <el-input v-model="item.profession" placeholder="请输入职业"/>
                </el-form-item>
              </el-col>
              <i class="el-icon-circle-plus btn-add" @click="onAddUnitForm" v-if="!isView"></i>
              <i class="el-icon-remove btn-del" v-if="unitForm.length > 1" @click="onDelUnitForm(index)"></i>
            </div>
          </catalog-pane>
        </catalog>
      </el-row>
    </el-form>
    <div slot="footer" v-if="!isView">
      <el-button size="mini" type="primary" @click="onSubmit()" v-if="!readonly">确定</el-button>
      <el-button size="mini" @click="isAddFormDialog = false">{{readonly ? '关闭' : '取消'}}</el-button>
    </div>
    <div class="link-to-other" v-if="isView">
      <el-button size="mini" @click="onLinkTo('/#/dataCenter/application/faceTrackAnalysis', { personId: id })">轨迹分析</el-button><em/>
      <el-button size="mini" @click="onLinkTo('/#/dataCenter/application/togetherAnalysis', { personId: id })">同行分析</el-button><em/>
      <el-button size="mini" @click="onRouteTo('/dataCenter/application/super/faceUser', { queryId: id })">超级档案</el-button><em/>
      <el-button size="mini" @click="onLinkTo('/#/dataCenter/application/foothold', { personId: id })">落脚点分析</el-button><em/>
      <el-button size="mini" @click="onLinkTo('/#/dataCenter/dataView/passRecord', { personId: id })">人行记录</el-button>
    </div> 
    <!-- 人像库图片列表 -->
    <picture-list :is-open.sync="isPictureListDialog" :data="fileList" />

    <!-- 人像照放大 -->
    <el-dialog :visible.sync="dialogVisible" title="大图" append-to-body width="600px">
      <img :src="picture" width="100%">
    </el-dialog>

    <!-- 辖区混合树 -->
      <!-- 限制到只能到辖区 -->
    <jurisdiction-addr-menu-dialog ref="addressDialog"  @finish="getAddress" :limit="{ type: 2, buildType: 3 }" warnText="请选择到室号"></jurisdiction-addr-menu-dialog>
    <!-- 变更历史 -->
    <live-change-dialog ref="liveChange" :personId="id"></live-change-dialog>
  </el-dialog>
</template>

<script>
import moment from "moment";
import { mapGetters } from 'vuex';
import { checkPhone } from "@/utils";
import { postPicturesUpload, getDictValueTree } from "@/api/common";
import { getLabel, putLabel, postLabel, personSearch } from "@/api/faceLibrary";
import { getTagList } from "@/api/libTagsManage";
import { getLabelLibraryList } from "@/api/faceLibrary";
import { getHouseList } from "@/api/houseManage";
import { addrCompanyList } from "@/api/unitManage";
import { param } from "@/utils/";

let houseInfo = {
  communityId: null,
  houseId: null,
  houseKey: null,
  locationName: null,
  userRelation: null
};

export default {
  props: {
    id: [Number, String],
    readonly: {
      default: false,
      type: Boolean
    },
    isOpen: {
      default: false,
      type: Boolean
    },
    handletitle: null,
    isRealPerson: {
      type: Boolean,
      default: false
    },
    isView: { 
      type: Boolean, 
      default: false
    },
    outData: null, //外部传入需要修改的数据，保存后清空，重新打开置换
  },
  components: {
    liveChangeDialog: () => import('@/components/LiveChangeDialog'),
    JurisdictionAddrMenuDialog: () => import("@/components/JurisdictionAddrMenuDialog"),
  },
  data: () => ({
    moment: moment,
    libraryNum: null,
    isAddFormDialog: false,
    dialogVisible: false,
    picture: '',
    form: {
      id: null,
      name: null,
      identityNo: null,
      identityImg: null,
      nativePlace: null,
      type: null,
      relation: null,
      sex: null,
      nation: null,
      birthday: null,
      mobile: null,
      address: null,
      actualAddress: null,
      remark: null,
      // mlphId: null,
      personTags: null,
      libraryId: null,
      // mlph: {},
      personInfoImages: [],
      houses: [],
      separateFlag: null,
      householdType: null,
      professionType: null,
      profession: null,
      companyId: null,
      certificateType: null
    },
    housesForm: [JSON.parse(JSON.stringify(houseInfo))],
    unitForm: [{}],
    prop: { value: 'code' },
    professionType: [],
    tagName: [],
    library: [],

    fileList: [],
    catalogName: "basics",
    units: [],

    // 房屋选择
    isHouseDialog: false,
    currentHousesIndex: 0,
    currentUnitIndex: 0,
    // 人像库图表列表
    isPictureListDialog: false,
    //头像提交时的MD5 
    houseList: [],
    fileMd5: null,
    rules: {
      name: { required: true, message: "姓名不能为空" },
      identityImg: { required: true, message: "请上传证件照" },
      // certificateType: { required: true, message: "证件类型不能为空" }, 
      // identityNo: [
      //   { required: true, message: "证件号不能为空" },
      // ],
      // householdType: { required: true, message: "人员管理类别不能为空" },
      // nation: { required: true, message: "民族不能为空" },
      // sex: { required: true, message: "性别不能为空" },
      // mobile: [
      //   { required: true, message: "手机号不能为空" },
      //   { validator: checkPhone },
      //   { min: 11, message: "手机号为11位" }
      // ],
      // separateFlag: { required: true, message: "人户分离标识不能为空" },
      personTags: { required: true, message: "人员标签不能为空" },
      // address: { required: true, message: "证件地址不能为空" },
      // actualAddress: { required: true, message: "实际地址不能为空" },
    },
  }),
  computed: {
    ...mapGetters(["userInfo"]),
    fileListLength() {
      return this.fileList.length;
    },
    title() {
      return this.isView ? '查看人员' : this.id ? this.readonly ? '详情' : '编辑': this.handletitle ? '添加实有人口':'添加'
    },
    librarysName() {
      if (!this.form.libraryId || !this.isAddFormDialog) {
        return []
      }
      //libraryId去重
      let _data = Array.from(new Set(this.form.libraryId.split(',')))
      return _data.map(item => this.library.find(i => i.id == item).name)
    }
  },
  watch: {
    isOpen(val) {
      this.isAddFormDialog = val;
    },
    isAddFormDialog(val) {
      if (val) {
        this.housesForm = [JSON.parse(JSON.stringify(houseInfo))];
        this.$refs.form && this.$refs.form.resetFields();

        this.$nextTick(() => {
          //清除验证，有时候会莫名出现
          this.$refs.form.clearValidate()
        })
        if (this.id) {
          this.getFormDetail();
        } else {
          let form = { ...this.form }
          this.handleOutData(form)
          this.housesForm = form.houses.length
            ? form.houses.concat([])
            : [JSON.parse(JSON.stringify(houseInfo))];
          this.unitForm = form.companys.length ? form.companys : [{}]
        }
      } else {
        this.fileList = [];
      }

      this.$emit("update:isOpen", val);
    }
  },
  created() {
    this.addrCompanyList()
    this.getDictValueTree()
    //获取人员标签
    getTagList().then(res => {
      this.tagName = res.data
    })
    //获取人员库
    getLabelLibraryList().then(res => this.library = res.data)
  },
  methods: {
    querySearch(queryString, cb) {
      //添加才能搜索
      if (queryString && !this.id) {
        let keywords = queryString
        personSearch({ keywords }).then(res => {
          cb(res.data)
        })
      } else {
        cb([])
      }
    },
    handleSelect(data) {
      this.$confirm('是否填入此人信息', '提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          confirmButtonClass: "el-button--mini",
          cancelButtonClass: "el-button--mini fr",
          type: 'warning'
        }).then(() => {
          this.$emit("update:id", data.id);
          this.$nextTick(() => {
            this.$refs.form && this.$refs.form.resetFields();
            this.id && this.getFormDetail();
          })
        }).catch(() => {});
    },
    // 获取表单详情
    getFormDetail() {
      getLabel(this.id).then(res => {
        if (res.status == 200) {
          this.form = res.data;
          this.handleOutData(res.data)

          // this.form.mlph = this.form.mlph || {};

          // 处理证件照
          this.$set(
            this.form,
            "identityImg",
            this.form.personInfoImages.filter(item => item.imgFlag == 1)[0]
          );
          // 处理人像库
          this.fileList = this.form.personInfoImages
            .filter(item => item.imgFlag == 0)
            .map(item => {
              return {
                id: item.fileId,
                url: item.filePath
              };
            });
          //处理人员标签
          this.form.personTags = this.form.personTags ? this.form.personTags.split(',') : []

          // 处理房屋信息
          this.housesForm = this.form.houses.length
            ? this.form.houses.concat([])
            : [JSON.parse(JSON.stringify(houseInfo))];
          this.unitForm = this.form.companys.length ? this.form.companys : [{}]
        }
      });
    },
    //处理外部数据
    handleOutData(data) {
      if (this.outData) {
        let { outData } = this
        for(let i in outData) {
          if (outData[i] instanceof Array) {
            if (data[i]) {
              data[i] = data[i].concat(outData[i])
            } else {
              this.$set(data, i, outData[i])
            }
          } else if (typeof outData[i] == 'object') {
            if (data[i]) {
              data[i] = { ...data[i], ...outData[i] }
            } else {
              this.$set(data, i, outData[i])
            }
          } else {
            this.$set(data, i, outData[i])
          }
        }
      }
    },
    // 证件照上传
    onIdentityImgUpload(file) {
      // 判断大小是否超过200KB
      if (file.size / 1024 > 200) {
        setTimeout(() => {
          this.$notify({
            title: "提示",
            message: `图片【${file.name}】超过200KB，请压缩后上传`,
            type: "warning",
            duration: 2000
          });
        }, 10);
        return
      }

      this.pictureBatchUpload([file]).then(res => {
        this.$set(this.form, "identityImg", res[0]);
        this.$set(this, "fileMd5", res[0].fileMd5)
        this.$refs.form.validateField("identityImg");
      });
    },
    // 图片批量上传
    pictureBatchUpload(files) {
      let _arr = [];
      return new Promise((resolve, reject) => {
        let formData = new FormData();
        files.map(file => {
          formData.append("files", file.raw);
        });
        formData.append("id", this.id ? this.id : '');
        formData.append("type", 1)
        postPicturesUpload(formData)
          .then(res => {
            if (res.status == 200) {
              resolve(res.data);
            } else {
              this.$message.error("图片上传失败，请联系管理员！");
              resolve([]);
            }
          })
          // .catch(() => {
          //   this.$message.error("图片上传失败，请联系管理员！");
          //   resolve(false);
          // });
      });
    },
    // 表单提交
    onSubmit() {
      this.$refs.form.validate(async valid => {
        if (!valid) return;

        //设置房屋连带关系
        let houseLength = 0
        let isfinish = this.housesForm.filter(item => {
          if (item.locationName) {
            houseLength ++
            return item.userType != null && item.userType !== '' && item.userRelation != null && item.userRelation !== ''
          }
        })
        if (this.isRealPerson) {
          if (houseLength === 0) {
            this.$notify({ title: "警告", message: "请填写房屋信息", type: "warning", duration: 2000 })
            return
          }
        }
        if (isfinish.length !== houseLength) {
          this.$notify({ title: "警告", message: "房屋信息请填写完整", type: "warning", duration: 2000 })
          return
        }
        // return 
        // 处理提交数据
        let _form = Object.assign({}, this.form);
        // _form.mlphId = _form.mlph.id;


        // 合并人像图片
        _form.personInfoImages = await this.pictureBatchUpload(
          this.$refs.uploadList.uploadFiles.filter(item => item.raw)
        )
        _form.personInfoImages = this.fileList
          .filter(file => !file.raw)
          .map(item => {
            return {
              fileId: item.id,
              filePath: item.url
            };
          })
          .concat(_form.personInfoImages);
        _form.personInfoImages.splice(0, 0, {
          // fileId: _form.identityImg.id,
          filePath: _form.identityImg.filePath,
          fileMd5: this.fileMd5,
        });
        //处理人员标签
        console.log(_form.personTags)
        _form.personTags = _form.personTags instanceof Array ? _form.personTags.join(',') : _form.personTags
        // 处理房屋信息
        _form.houses = this.housesForm;
        _form.companys = this.unitForm

        //添加用户的loginName和userName
        _form.loginName = this.userInfo.loginName
        _form.userName = this.userInfo.name

        // delete _form.mlph;
        delete _form.identityImg;
        //添加信息
        this.$emit("choseMan", _form);
        // 判断提交类型
        if (this.id) {
          // 修改
          _form.id = this.id;
          putLabel(_form).then(res => {
            let isSuccess = res.status === 200;
            // 提示处理
            this.$notify({
              title: isSuccess ? "成功" : "失败",
              message: isSuccess ? "保存成功" : res.message,
              type: isSuccess ? "success" : "error",
              duration: 2000
            });

            if (isSuccess) {
              this.$emit("complete");
              this.isAddFormDialog = false;
            }
          });
        } else {
          // 新增
          postLabel(_form).then(res => {
            let isSuccess = res.status === 200;
            // 提示处理
            this.$notify({
              title: isSuccess ? "成功" : "失败",
              message: isSuccess ? "新增成功" : res.message,
              type: isSuccess ? "success" : "error",
              duration: 2000
            });

            if (isSuccess) {
              this.$emit("complete", res);
              this.isAddFormDialog = false;
            }
          });
        }
      });
    },
     // 输入证件号后自动填充性别生日
    onAutomaticFill() {
      if (this.form.identityNo.length === 18) {
        let _arr = [
          this.form.identityNo.substring(6, 10),
          this.form.identityNo.substring(10, 12),
          this.form.identityNo.substring(12, 14)
        ];
        this.form.sex = !(parseInt(this.form.identityNo.substring(16, 17)) % 2)
          ? "2"
          : "1";
        this.form.birthday = _arr.join("-");
        this.$refs.form.validateField("sex");
      }
    },
    /* 人像库图片上传处理 */
    // 人像库图片删除
    onUploadRemore(file, files) {
      this.fileList = files.filter(item => file.uid != item.uid);
    },

    onUploadPreview(file) {
      this.picture = file.url
      this.dialogVisible = true
    },
    // 上传超出限制
    onUploadExceed() {
      // 提示处理
      this.$notify({
        title: "提示",
        message: "人像库最多上传5张图片",
        type: "warning",
        duration: 2000
      });
    },
    // 图片变更
    onUploadChange(file, files) {
      // 判断大小是否超过200KB
      if (file.size / 1024 > 200) {
        setTimeout(() => {
          this.$notify({
            title: "提示",
            message: `图片【${file.name}】超过200KB，请压缩后上传`,
            type: "warning",
            duration: 2000
          });
        }, 10);
        files.splice(files.length - 1, 1);
      }
    },
    /* 人像库图片上传处理 */
    // 添加居住信息表单
    onAddHousesForm() {
      if (this.readonly) {
        return 
      }
      this.housesForm.push(JSON.parse(JSON.stringify(houseInfo)));
    },
    // 删除居住信息表单
    onDelHousesForm(index) {
      if (this.readonly) {
        return 
      }
      this.housesForm.splice(index, 1);
    },
    // 添加单位信息表单
    onAddUnitForm() {
      if (this.readonly) {
        return 
      }
      this.unitForm.push({});
    },
    // 删除单位信息表单
    onDelUnitForm(index) {
      if (this.readonly) {
        return 
      }
      this.unitForm.splice(index, 1);
    },
    //标准地址弹窗打开
    addressDialogOpen(index) {
      this.currentHousesIndex = index;
      this.$refs.addressDialog.open()
    },
    //返回标准地址
    getAddress(data, labels) {
      this.$set(
        this.housesForm,
        this.currentHousesIndex,
        Object.assign(this.housesForm[this.currentHousesIndex], {
          locationId: data.id,
          locationType: data.type,
          fromType: data.fromType,
          locationName: labels,
          able: true,
          houseId: null,
        })
      );
      // this.getHouseList(data.code)
    },
    getHouseList(_filter_like_code) {
      getHouseList({ pageNo: 1, pageSize: 9999, _filter_like_code }).then(res => {
        this.housesForm[this.currentHousesIndex].houseId = null
        this.houseList = res.data.rows
        if (this.houseList.length === 1) {
          this.$set(this.housesForm[this.currentHousesIndex], 'houseId', this.houseList[0].id)
        }
      })
    },

    // 打开变更历史弹窗
    getLiveChange(val) {
      this.$refs.liveChange.open(val)
    },
    //
    addrCompanyList() {
      addrCompanyList({ pageNo: 1, pageSize: 100000 }).then(res => {
        this.units = res.data.rows
      })
    },
    // selectChange(index) {
    //   if (index)
    //   this.housesForm[index].houseName = this.houseList.filter(item => item.id = this.housesForm[index].houseId )[0].name
    // },
    getDictValueTree() {
      getDictValueTree('professional_types').then(res => {
        this.professionType = res.data
      })
    },
    cascaderFinish(val) {
      this.$set(this.unitForm[this.currentUnitIndex], 'professionType', val)
    },
    itemClick(data, index) {
      this.currentUnitIndex = index
      this.unitForm[index].companyName = data.name
    },
    onLinkTo(url, query) {
      const queryStr = param(query);
      window.open(`${url}?${queryStr}`, 'dataCenter');
    },
    onRouteTo(url, query) {
      let routeUrl = this.$router.resolve({
        path: url,
        query
      });
      window.open(routeUrl.href, 'dataCenter');
    },
    tagSelect(val) {
      this.$set(this.form, 'libraryId', val)
      this.$refs.form.validateField('personTags')
    },
  },
  
};
</script>
<style lang="scss" scoped>
.my-autocomplete {
  .bar {
    line-height: normal;
    padding: 7px;
    .name {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .addr {
      font-size: 12px;
      color: #b4b4b4;
    }
    .highlighted .addr {
      color: #ddd;
    }
  }
}
.form-box {
  .heading {
    position: relative;
    line-height: 50px;
    font-size: 13px;
    font-weight: bold;
    color: #3f4041;
    &:before {
      position: absolute;
      left: 80px;
      right: 80px;
      top: 24px;
      background: #eff1f4;
      height: 1px;
      content: "";
    }
    .txt-btn{
      height: 26px;
      padding: 0 12px;
      color: #0fa0ff;
      font-size: 12px;
      border-radius: 3px;
      cursor: pointer;
    }
  }
  /deep/{
    .el-input.is-disabled .el-input__inner, .el-textarea.is-disabled .el-textarea__inner{
      background-color: white;
      color: #606266;
    }
  }
  .heading-right{
    position: relative;
    line-height: 50px;
    font-size: 13px;
    top: 0;
    right: 0;
    font-weight: bold;
    color: #3f4041;
  }
  .live-box {
    position: relative;
    background: #f3f4f5;
    overflow: hidden;
    margin-bottom: 20px;
    padding: 10px 80px 10px 0;
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
}
.left-box {
  padding-left: 19px;
  text-align: left;
  .no-image{
    width: 124px;
    height: 153px;
    display: flex;
    flex-direction: column;
    margin-left: 16px;
    justify-content: center;
    align-items: center;
    border: 1px dashed rgba(190,190,190,0.7);
    cursor: pointer;
    strong{
      margin-top: 2px;
      font-size:14px;
      color:rgba(144,144,144,1);
      line-height:21px;
      letter-spacing: 1.5px;
    }
  }
  .pic {
    margin-bottom: 0;
    /deep/ {
      .el-form-item__error {
        right: 0;
        text-align: center;
      }
    }
  }
  .pic-list {
    width: 100%;
    height: 100%;
    overflow: auto;
    padding: 10px 5px 0 10px;
    overflow: -moz-scrollbars-none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
      width: 0 !important 
    }
    /deep/ {
      .el-upload-list__item-actions{
        display: flex;
        justify-content: center;
        span{
          margin: 0 auto;
          font-size: 14px;
        }
      }
      &.ban {
        .el-upload--picture-card {
          display: none;
        }
      }
      .el-upload-list__item,
      .el-upload--picture-card {
        width: 46px;
        height: 46px;
        line-height: 46px;
        margin: 0 5px 5px 0;
      }
      .el-upload-list__item {
        float: left;
      }
      .el-upload-list__item-status-label{
        display: none;
      }
      .el-icon-plus {
        line-height: 46px;
      }
      .el-icon-close-tip {
        display: none;
      }
    }
  }
}
.right-box {
  .m0 {
    margin: 0;
  }
  .tip {
    font-size: 13px;
    color: #999;
    span {
      margin-left: 8px;
      border-bottom: 1px solid #0fa0ff;
      color: #0fa0ff;
      cursor: pointer;
    }
  }
  .more {
    line-height: 160%;
    margin-top: 10px;
    text-align: center;
    font-size: 13px;
    color: #999;
    span {
      padding-right: 30px;
    }
  }
  .accesse-box {
    .left {
      float: left;
      width: 80px;
      padding-right: 12px;
      .el-button {
        width: 100%;
        line-height: 34px;
        padding: 0;
      }
    }
    .right {
      margin-left: 80px;
    }
    .accesse-item {
      float: left;
      line-height: 22px;
      margin: 6px 8px 0 0;
      padding: 0 8px;
      border: 1px solid #0fa0ff;
      border-radius: 99px;
      font-size: 12px;
      color: #0fa0ff;
    }
  }
}
.link-to-other {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: absolute;
  left: 20px;
  top: 200px;
  height: 160px;
}
/deep/ {
  .el-select,.el-input,.el-cascader, .el-autocomplete {
    width: 100%;
  }
  .el-upload-list__item-status-label {
    display: none;
  }
}
.data-view{
  .heading, .info-heading{
    color: #6B85A6;
    &::before{
      background-color: rgba(14,94,169, 0.7);
    }
  }
  .pic-list{
    background-color: #0E111B;
    border-color: rgba(14,94,169, 0.7);
  }
  .live-box{
    background-color: #0E111B;
    border: 1px solid rgba(14,94,169, 0.7);
    color: #E2E9EE !important;
  }
  /deep/{
    .el-dialog{
      border: 1px solid rgba(14,94,169, 0.7);
      .el-dialog__title{
        color: #6B85A6;
      }
      .el-dialog__header, .el-dialog__body, .el-dialog__footer{
        background-color: #0E111B;
      }
    }
    .el-form-item__label{
      color: #6B85A6;
    }
    .el-input__inner, .el-textarea__inner{
      background-color: #0E111B !important;
      border-color: rgba(14,94,169, 0.7) !important;
      color: #E2E9EE !important;
    }
    .el-select__caret{
      visibility: hidden;
    }
    .el-input-group__append{
      background-color: #0E111B;
      border-color: #0E111B;
      color: #6B85A6;
    }
    .el-radio__label{
      color: #E2E9EE;
    }
    .el-radio__input.is-checked + .el-radio__label{
      color: #6B85A6;
    }
    .el-upload-list__item,.el-upload--picture-card{
      background-color: #0E111B;
      border-color: rgba(14,94,169, 0.7);
    }
    .catalog-menu li{
      background-color: #0E111B;
      border-color: rgba(14,94,169, 0.7) !important;
      color: #E2E9EE;
    }
    .catalog-content{
      border-width: 0;
    }
  }
}
</style>
