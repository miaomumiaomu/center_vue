<template>
  <div class="city-picker">
    <el-select v-model="cityCode" placeholder="省" :loading="provinceLoading" @change="changeProvince" clearable>
      <el-option v-for="item in provinces" :key="item.id" :label="item.label" :value="item.code">
      </el-option>
    </el-select>
    <el-select v-model="districtCode" placeholder="市" :loading="cityLoading" @change="changeCity" clearable>
      <el-option v-for="item in cities" :key="item.id" :label="item.label" :value="item.code">
      </el-option>
    </el-select>
    <el-select v-model="code" placeholder="区县" :loading="districtLoading" @change="changeDistrict" clearable>
      <el-option v-for="item in districts" :key="item.code" :label="item.label" :value="item.code" />
    </el-select>
  </div>
</template>

<script>
import { getByCode } from '@/api/common';
import { getRegionTree } from "@/api/houseManage";

export default {
  props: {
    value: {
      required: false
    }
  },
  data() {
    return {
      provinces: [],
      provinceId: null,
      provinceLoading: true,
      cities: [],
      cityCode: null,
      cityLoading: true,
      districts: [],
      districtCode: null,
      districtLoading: true,
      code: null
    }
  },
  watch: {
    value: {
      handler(val) {
        if (val && !this.cityCode && !this.districtCode && !this.code) {
          // this.code = val;
          this.getAddr(val);
        }
      },
      immediate: true
    },
  },
  methods: {
    getAddr(val) {
      //为0直接加载省
      if (val != 0) {
        getByCode({ code: val }).then(res => {
          let arr = res.data.parentCodes.split(',')
          let code = res.data.code
          arr.length == 1 ? this.cityCode = code : arr.length == 2 ? this.districtCode = code : this.code = code
          arr.forEach((item, index) => {
            index ? index === 1 ? this.cityCode = item : this.districtCode = item : ''
            getRegionTree({ parentCode: item }).then(res => {
              if (!index) {
                this.provinces = res.data;
                this.provinceLoading = false;
              } else if (index === 1) {
                this.cities = res.data;
                this.cityLoading = false;
              } else {
                this.districts = res.data;
                this.districtLoading = false;
              }
            });
          })
          getRegionTree({ parentCode: code }).then(res => {
            if (arr.length === 1) {
              this.cities = res.data;
              this.cityLoading = false;
            } else if (arr.length === 2) {
              this.districts = res.data;
              this.districtLoading = false;
            }
          })
        })
      } else {
        getRegionTree({ parentCode: val }).then(res => {
          this.provinces = res.data;
          this.provinceLoading = false;
        })
      }
    },
    changeProvince(provinceCode) {
      if (provinceCode) {
        this.cityCode = provinceCode;
        this.cityLoading = true;

        this.districtCode = null;
        this.cityLoading = true;
        this.code = null;
        this.districtLoading = true;
        this.$emit('complete', provinceCode)
        getRegionTree({ parentCode: provinceCode }).then(res => {
          this.cities = res.data;
          this.cityLoading = false;
        })
      } else {
        this.$emit('complete', null)
      }
    },
    changeCity(cityCode) {
      if (cityCode) {
        this.districtCode = cityCode;
        this.districtLoading = true;
        this.code = null;
        this.districtLoading = true;
        this.$emit('complete', cityCode)
        getRegionTree({ parentCode: cityCode }).then(res => {
          this.districts = res.data;
          this.districtLoading = false;
        })
      } else {
        this.$emit('complete', this.cityCode)
      }

    },
    changeDistrict(districtCode) {
      if (districtCode) {
        this.code = districtCode
        this.$emit('complete', this.code)
      } else {
        this.$emit('complete', this.districtCode)
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.city-picker .el-input {
  width: 150px;
}
.el-select {
  width: 117px;
}
</style>
