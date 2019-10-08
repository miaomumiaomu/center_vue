<template>
  <div class="house-manage app-container">
    <el-row>
      <!-- 左侧地址菜单 S -->
      <address-menu ref="addressMenu" @change="onMenuChange" @delCallBack="delStreet" />
      <!-- 左侧地址菜单 E -->

      <el-col :span="18">
        <!-- <div class="handle-menu">
          <el-button plain>添加下级地址</el-button>
          <el-button plain>编辑</el-button>
          <el-button plain>删除</el-button>
        </div> -->
        <!-- 内容表单 -->
        <div class="table-box">
          <el-form class="list-form" ref="listForm" size="small" :model="formData" :rules="rules" @submit.native.prevent label-width="80px" v-show="formDisable">
            <div class="list-form-col">
              <template v-if="formStatus === 'add'">
                <el-form-item label="上级地址" prop="label">
                  <div>{{formData.label}}</div>
                </el-form-item>
                <el-form-item label="地址类型" prop="type">
                  <dict-select dict-name="address_type" v-model="formData.type" :disabled="true"/>
                </el-form-item>
                <el-form-item label="建筑类型" prop="buildType" v-if="formData.type == houseType">
                  <el-select v-model="formData.buildType" placeholder="请选择建筑类别" v-if="formStatus !== 'static'">
                    <el-option v-for="item in buildData" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                  <el-input v-else>{{ formData.buildType | commonFilter('address_build_type') }}</el-input>
                </el-form-item>
                <el-form-item label="地址名称" prop="name" v-if="formData.type != 0">
                  <el-input v-model.trim="formData.name" v-if="formStatus !== 'static'"/>
                  <div v-else>{{ formData.name }}</div>
                </el-form-item>
              </template>
              
              <template v-if="formStatus === 'edit'">
                <el-form-item label="地址全称" prop="fullName">
                  <el-input v-model="formData.fullName" readonly></el-input>
                </el-form-item>
                <el-form-item label="地址类型" prop="type">
                  <dict-select dict-name="address_type" v-model="formData.type" :disabled="true"/>
                </el-form-item>
                <el-form-item label="建筑类型" prop="buildType" v-if="formData.type == houseType">
                  <el-select v-model="formData.buildType" placeholder="请选择建筑类别" v-if="formStatus !== 'static'" :disabled="true">
                    <el-option v-for="item in buildData" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                  <el-input v-else>{{ formData.buildType | commonFilter('address_build_type') }}</el-input>
                </el-form-item>
                <el-form-item label="地址名称" prop="name" v-if="formData.type != 0">
                  <el-input v-model.trim="formData.name" v-if="formStatus !== 'static'"/>
                  <div v-else>{{ formData.name }}</div>
                </el-form-item>
                <el-form-item label="系统编码" prop="code">
                  <el-input>{{ formData.code }}</el-input>
                </el-form-item>
                <el-form-item label="地址编码" prop="outerId">
                  <el-input>{{ formData.code }}</el-input>
                </el-form-item>
                <el-form-item label="街路巷村" prop="roadName">
                  <el-input v-model="formData.roadName" readonly></el-input>
                </el-form-item>
                <el-form-item label="门牌号" prop="numberName">
                  <el-input v-model="formData.numberName" readonly></el-input>
                </el-form-item>
                <el-form-item label="房号" prop="houseName">
                  <el-input v-model="formData.houseName" readonly></el-input>
                </el-form-item>
                <el-form-item label="Guid" prop="outerId">
                  <el-input v-model="formData.outerId" :maxlength="50"></el-input>
                </el-form-item>
              </template>

              <el-form-item label="所属小区" prop="communityName">
                <el-input v-model="formData.communityName"></el-input>
              </el-form-item>
              <el-form-item label="派出所" prop="policeStation" v-if="formStatus === 'edit'">
                <el-input v-model="formData.policeStation" readonly></el-input>
              </el-form-item>
              <el-form-item label="警务辖区" prop="policeAreaName" v-if="formStatus === 'edit'">
                <el-input v-model="formData.policeAreaName" readonly></el-input>
              </el-form-item>
              <el-form-item label="乡镇街道" prop="streetName">
                <el-select v-model="formData.streetName" placeholder="请选择" clearable>
                  <el-option
                    v-for="item in streets"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="居村委会" prop="neighborhoodOrg">
                <el-input v-model="formData.neighborhoodOrg"></el-input>
              </el-form-item>
              <el-form-item label="状态" prop="status">
                <dict-select dict-name="enable_status" v-model="formData.status" />
              </el-form-item>
              <!-- <el-form-item label="变更记录" prop="updateTime" v-if="formStatus !== 'add'">
                <div>{{ `${formData.updateTime} ${formData.updateKey}更新` }}</div>
                <div>{{ `${formData.createTime} ${formData.createUser}创建`}}</div>
              </el-form-item> -->
            </div>

            <div class="map-class">
              <el-form-item label="经纬度" prop="location">
                <!-- <el-input placeholder="经纬度" v-model="formData.location" readonly>
                  <el-button slot="append" @click="getLogLat">拾取</el-button>
                </el-input> -->
                <map-location :location="{ lng: formData.lng, lat: formData.lat }" @local="setLocation"></map-location>
              </el-form-item>
              <div style="text-align: center;">
                <el-button type="primary" @click="saveAddrStandard">保存</el-button>
              </div>
            </div>
            
            <!-- <el-form-item label="地址名称" prop="name" v-else>
              <el-select v-model="formData.name" placeholder="请选择乡镇街道" :disabled="formStatus !== 'add'">
                <el-option v-for="item in street" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item> -->
            
          </el-form>
        </div>
      </el-col>
    </el-row>

    <!-- 经纬度拾取 -->
    <!-- <map-location ref="locationDialog" :zoom="16" @local="setLocation" /> -->
  </div>
</template>
<script>
import { mapState } from "vuex";
import { addLocation, deleteLocations, saveAddrStandard, getAddrDistroct, getAddrFull } from "@/api/standardAssets";
import { getCenterConfig } from "@/api/centerConfig";

export default {
  components: {
    AddressMenu: () => import("@/components/AddressMenu"),
    mapLocation: () => import('./components/mapLocation'),
  },
  created() {
    
  },
  mounted() {
    getCenterConfig().then(res => {
      getAddrDistroct({ dictCode: res.data.addrDistrictCode }).then(res => {
        this.streets = res.data
      })
    })
  },
  data() {
    return {
      formData: {},
      formStatus: 'edit',
      formDisable: false,
      location: '', //新增时，缓存父节点的经纬度
      streets: [],
      houseType: 2, //门牌号type
      rules: 
        {
          name: { required: true, message: "地址名称不能为空" },
          type: { required: true, message: "地址类型不能为空" },
          location: { required: true, message: "经纬度不能为空" },
          buildType: { required: true, message: "建筑类别不能为空" }
        },
      currentStreet: [],
    };
  },
  computed: {
    ...mapState({
      userInfo: state=> state.user.userInfo,
    }),
    buildData() {
      let arr = []
      let dict = JSON.parse(localStorage.getItem('address_build_type'))
      //新增时获取下级类别
      let getType = (status) => {
        for (let item in dict) {
          if (status || this.formData.parentBuildType < item || this.formData.parentBuildType == null) {
            arr.push({value: Number(item), label: dict[item]})
          }
        }
      }
      if (this.formStatus !== 'add') {
        getType(true)
      } else {
        getType()
      }
      return arr
    },
    // street() { //剔除已经存在的国标街道
    //   if (this.currentStreet.length) {
    //     return this.streets.filter(item => {
    //       return !this.currentStreet.includes(item.code)
    //     })
    //   }
    //   return this.streets 
    // }
  },
  methods: {
    onMenuChange(status, data, node) {
      this.formData = data;
      this.formStatus = status
      this.formDisable = true
      
      if (status === 'add') {
        // if (node.level === 1) { //获取已有的国标街道code
        // this.updateStreetCode(node)
        // }
        // this.$set(this.formData, 'name', '')
        if (data.lng && data.lat) {
          Object.assign(this.formData, { location: `${data.lng},${data.lat}`, lng: data.lng, lat: data.lat })
        } else {
          this.$set(this.formData, 'location', '')
        }
        this.location = this.formData.location
        this.formData.status = '1'
      } else {
        if (node.level === 1) {
          this.formDisable = false
          return 
        }
        getAddrFull(this.formData.id).then(res => {
          if (res.status === 200) {
            this.formData = res.data;
        
            this.currentStreet = []
            // this.$set(this.formData, 'name', data.label)
            if (data.lng && data.lat) {
              Object.assign(this.formData, { location: `${data.lng},${data.lat}`, lng: data.lng, lat: data.lat })
            } else {
              this.$set(this.formData, 'location', '')
            }
          }
        })
      }
      this.$nextTick(() => {
        this.$refs.listForm.clearValidate()
      })
    },
    //经纬度拾取
    getLogLat() {
      this.$refs.locationDialog.open({
        lng: this.formData.lng,
        lat: this.formData.lat
      });
    },
    saveAddrStandard() {
      this.$refs.listForm.validate((valid, errArr) => {
        if (!valid) return;

        if (this.formStatus === 'add') {
          addLocation(this.formData).then(res => {
            messageTip(res, '新增成功')
            //新增是国标街道时，将街道加到currentStreet
            // if (res.data.type == 0) {
            //   this.currentStreet.push(res.data.code)
            // }
            //新增清空数据，并恢复父节点的经纬度
            let lng, lat
            if (this.location) {
              [lng, lat] = this.location.split(',')
            } else {
              [lng, lat] = [null, null]
            }
            Object.assign(this.formData, { buildType: null, location: this.location, lng, lat })
            this.$nextTick(() => {
              this.$refs.listForm.clearValidate()
            })
            this.$refs.addressMenu.addNode(res)
          })
        } else {
          saveAddrStandard(this.formData.id, this.formData).then(res => {
            messageTip(res, '修改成功')
            this.$refs.addressMenu.saveNode(res)
          })
        }
      })
    },
    setLocation(location) {
      this.formData = Object.assign({}, this.formData, {
        lng: location.lng,
        lat: location.lat,
        location: `${location.lng},${location.lat}`
      });
    },
    updateStreetCode(node) {
      this.currentStreet = node.childNodes.map(item => {
        return item.data.code
      })
    },
    delStreet(code) {
      this.currentStreet.splice(this.currentStreet.indexOf(code), 1)
    },
  }
};
</script>
<style lang="scss" scoped>
.house-manage {
  height: 100%;
  .el-row {
    height: 100%;
    .el-col {
      height: 100%;
    }
  }

  .el-pagination {
    padding: 10px;
  }

  .handle-menu{
    text-align: right;
    margin: 10px 10px 0 0;
  }

  .table-box {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: auto;
    .list-form{
      height: 100%;
      width: 100%;

      .list-form-col {
        height: 50%;
        width: 100%;
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        // align-content: space-around;
        padding: 50px 50px 0 50px;
      }
      .map-class {
        height: 50%;
        width: 100%;
        padding: 0 50px;
        .el-form-item {
          max-width: 100% !important;
        }
        .map-outer {
          width: 100%;
        }
      }
      /deep/ {
        .el-input.is-disabled .el-input__inner {
          background-color: #ffffff;
          color: #606266;
        }
        .el-form-item {
          margin-bottom: 15px;
          max-width: 370px;
        }
      }
    }
  }
}
</style>