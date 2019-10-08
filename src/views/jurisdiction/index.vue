<template>
  <div class="jurisdiction app-container">
    <el-row>
      <!-- 左侧地址菜单 S -->
      <jurisdiction-menu ref="addressMenu" @change="onMenuChange" />
      <!-- 左侧地址菜单 E -->

      <el-col :span="18" class="table-box" v-show="formDisable">
        <!-- 内容表单 -->
        <el-form class="list-form" ref="listForm" :model="formData" :rules="rules" @submit.native.prevent label-width="80px">
          <el-form-item label="名称" prop="areaName">
            <el-input placeholder="请输入名称" v-model.trim="formData.areaName" />
          </el-form-item>
          <el-form-item label="代码" prop="areaCode" v-if="formStatus !== 'add'" readonly>
            <div>{{formData.areaCode}}</div>
          </el-form-item>
          <el-form-item label="辖区类别" prop="areaType">
            <el-select v-model="formData.areaType" placeholder="请选择地址类别" :disabled="formStatus !== 'add'">
              <el-option v-for="item in seleteData" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上级辖区" prop="label" v-if="formStatus === 'add'">
            <div>{{formData.label}}</div>
          </el-form-item>
          <el-form-item label="经纬度" prop="location">
            <el-input placeholder="经纬度" v-model="formData.location" readonly>
              <el-button slot="append" @click="getLogLat">拾取</el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="辖区地图" prop="rangeList">
            <el-button icon="el-icon-edit-outline" @click="openMap">编辑</el-button>
          </el-form-item>
          <el-form-item label="辖区范围" prop="code" v-if="formStatus !== 'add'">
            <div style="width: 100%;height: 36px;">
              <el-button icon="el-icon-edit-outline" @click="setRoadList" style="float: right;">编辑</el-button>
            </div>
            <div class="tree-bar">
              <el-tree ref="menuTree" :data="formData.roadList" class="tree" highlight-current>
                <div class="menu-item" slot-scope="{ node, data }">
                  <span>{{ data.location.name }}</span>
                  <div class="more">
                    <el-button type="text" size="mini" style="display:content"><i class="el-icon-circle-plus" @click.stop="houseNumOpen(data)" /></el-button>
                    <em />
                    <el-button type="text" size="mini"> <i class="el-icon-circle-close" @click.stop="delAreaLinkRoad(data.id)" /></el-button>
                  </div>
                </div>
              </el-tree>
            </div>
          </el-form-item>
          <div style="text-align: center;">
            <el-button type="primary" @click="onSubmit">保存</el-button>
          </div>
        </el-form>
      </el-col>
    </el-row>

    <!-- 经纬度拾取 -->
    <map-location ref="locationDialog" :zoom="16" @local="setLocation" />
    <!-- 地图绘制 -->
    <map-region-draw :is-open.sync="isRegionDialog" :data="formData.rangeList" @complete="onDrawComplete" />
    <!-- 地址选择树 -->
    <address-checkbox-dialog ref="addressCheckboxDialog" :limitLevel="limitLevel" @finish="selectFinish" :checkedData="formData.roadList"></address-checkbox-dialog>
    <!-- 门牌号组件 -->
    <house-number ref="houseNumber"></house-number>
  </div>
</template>
<script>
import { addLocation, deleteLocations, saveAddrStandard } from "@/api/standardAssets";
import { savepoliceAreas, getAreaLinkRoad, setAreaLinkRoad, getPoliceAreas, delAreaLinkRoad, addPoliceAreas } from "@/api/Jurisdiction";
import { messageTip } from '@/utils'

export default {
  components: {
    JurisdictionMenu: () => import("@/components/JurisdictionMenu"),
    AddressCheckboxDialog: () => import('@/components/AddressCheckboxDialog'),
    HouseNumber: () => import('./components/houseNumber'), 
  },
  data() {
    return {
      formData: {},
      formStatus: null,
      formDisable: false,
      location: '', //新增时，缓存父节点的经纬度
      streets: [],
      treeData:  [],
      rules: 
        {
          areaType: { required: true, message: "辖区类型不能为空" },
          areaName: { required: true, message: "辖区名称不能为空" },
          location: { required: true, message: "经纬度不能为空" },
          address: { required: true, message: "地址不能为空" },
          rangeList: { required: true, message: "辖区地图不能为空" }
        },
      isRegionDialog: false, //绘制地图控制开关
      limitLevel: 1,//多选只能选中的级别
    };
  },
  computed: {
    seleteData() {
      let arr = []
      let dict = JSON.parse(localStorage.getItem('police_area_type'))
      //新增时获取下级类别
      let getType = (status) => {
        for (let item in dict) {
          if (status || this.formData.parentType < item || !dict[Number(item) + 1]) { //!dict[Number(item) + 1]如果后面字典没数据直接用最后一级
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
  },
  methods: {
    onMenuChange(status, data, node) {
      this.formData = data
      this.formStatus = status
      this.formDisable ? '' : this.formDisable = true //第一次点击显示数据
      if (status === 'add') {
        this.$set(this.formData, 'name', '')
        if (data.lng && data.lat) {
          Object.assign(this.formData, { location: `${data.lng},${data.lat}`, lng: data.lng, lat: data.lat })
        } else {
          this.$set(this.formData, 'location', '')
        }
        this.location = this.formData.location
      }else {
        this.$set(this.formData, 'name', data.label)
        if (data.lng && data.lat) {
          Object.assign(this.formData, { location: `${data.lng},${data.lat}`, lng: data.lng, lat: data.lat })
        } else {
          this.$set(this.formData, 'location', '')
        }
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
    openMap() {
      //当路径不是数组时转化
      if (this.formData.rangeList.length && !(this.formData.rangeList[0] instanceof Array)) {
        this.$set(this.formData, 'rangeList', this.formData.rangeList.filter(item => item.lng && item.lat).map(item => {
          return [item.lng, item.lat]
        }))
      }
      this.isRegionDialog = true
    },
    onSubmit() {
      this.$refs.listForm.validate((valid, errArr) => {
        if (!valid) return;
        if (this.formData.rangeList.length && !(this.formData.rangeList[0] instanceof Array)) {
          this.$set(this.formData, 'rangeList', this.formData.rangeList.filter(item => item.lng && item.lat).map(item => {
            return [item.lng, item.lat]
          }))
        }
        if (this.formStatus === 'add') {
          addPoliceAreas(this.formData).then(res => {
            messageTip(res, '新增成功')
            //新增清空数据，并恢复父节点的经纬度
            let lng, lat
            if (this.location) {
              [lng, lat] = this.location.split(',')
            } else {
              [lng, lat] = [null, null]
            }
            Object.assign(this.formData, { name: '', areaType: null, location: this.location, lng, lat })
            this.$nextTick(() => {
              this.$refs.listForm.clearValidate()
            })
            this.$refs.addressMenu.addNode()
          })
        } else {
          savepoliceAreas(this.formData.id, this.formData).then(res => {
            messageTip(res, '修改成功')
            this.$refs.addressMenu.saveNode()
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
    onDrawComplete(data) {
      this.formData.rangeList = data
      this.$refs.form.clearValidate('rangeList')
    },
    setRoadList() {
      this.$refs.addressCheckboxDialog.open()
    },
    getPoliceAreas(data) {
      getPoliceAreas(data.id).then(res => {
        this.formData = res.data
        let { lng, lat } = res.data
        this.$set(this.formData, 'location', lng && lat ? `${lng},${lat}` : '')
      })
    },
    //辖区取消街路巷的关联
    delAreaLinkRoad(id) {
    this.$confirm(`取消路的关联将会同时取消对应的门牌号的关联`, "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        confirmButtonClass: "el-button--mini",
        cancelButtonClass: "el-button--mini fr",
        type: "warning"
      }).then(() => {
        delAreaLinkRoad(id).then(res => {
          messageTip(res, '取消成功')
          this.getPoliceAreas(this.formData)
        })
      });
    },
    //辖区范围选择结束时
    selectFinish(val) {
      setAreaLinkRoad({ policeAreaId: this.formData.id, roadList: val }).then(res => {
        messageTip(res, '关联成功')
        this.getPoliceAreas(this.formData)
      })
    },
    //门牌号打开操作
    houseNumOpen(data) {
      this.$refs.houseNumber.open(data)
    },
  },
};
</script>
<style lang="scss" scoped>
.jurisdiction {
  height: 100%;
  .region {
    height: 46px;
    line-height: 26px;
    padding: 10px 0;
    overflow: hidden;
    font-size: 0;
    label {
      display: inline-block;
      padding: 0 2px 0 10px;
      text-align: right;
      font-size: 13px;
      font-weight: normal;
      color: #3f4041;
    }
    .el-cascader {
      width: 420px;
    }
  }

  .el-row {
    height: 100%;
    .el-col {
      height: 100%;
    }
  }

  .el-pagination {
    padding: 10px;
  }

  .table-box {
    height: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .list-form{
      /deep/ .el-input-group{
        width: 360px;
        .el-input__inner{
          width: 100% !important;
        }
      }
      /deep/ .el-input--medium .el-input__inner{
        width: 360px;
      }
      .tree-bar{
        flex: 1;
        .tree{
          height: 100%;
        }
        .menu-item {
          display: flex;
          width: 100%;
          height: 100%;
          padding: 0 26px 0 6px;
          // &.sel {
          //   background: #d5e6f9;
          // }
          span {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .svg-icon {
            display: inline-block;
            height: 100%;
            margin-right: 4px;
            vertical-align: top;
            font-size: 16px;
            color: #666;
          }
          .more {
            i {
              height: 100%;
              line-height: 38px;
              padding: 0 4px;
              vertical-align: top;
              font-size: 16px;
              color: #666;
              cursor: pointer;
            }
            .el-button{
              display: contents !important;
            }
          }
        }
      }
    }
  }
}
</style>