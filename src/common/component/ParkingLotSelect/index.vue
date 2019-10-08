<template>
  <el-select v-model="currentValue" @change="update" :placeholder="placeholder" :multiple="multiple" :multiple-limit="multipleLimit" :collapse-tags="collapseTags" :popper-class="popperClass" :clearable="clearable" :size="size">
    <el-option v-for="item in selectData" :key="item.id" :label="item.name" :value="item.outerId+','+item.applicationId+',' + item.id" />
  </el-select>
</template>
<script>
import { getParkingLotList } from "@/api/carManage/parkingLot";

export default {
  props: {
    value: {
      required: true
    },
    // listQuery: Object,
    placeholder: String,
    size: String,
    clearable: Boolean,
    multiple: Boolean,
    multipleLimit: {
      type: Number,
      default: 0
    },
    collapseTags: Boolean,
    popperClass: String
  },
  data() {
    return {
      currentValue: [],
      returnValue: null,
      selectData: [],
      listQuery: {
        pageNo: 0,
        pageSize: 9999
      }
    };
  },
  watch: {
    value: {
      handler(val) {
        this.returnValue = val;
        if (this.multiple) {
          this.currentValue = val ? val.toString().split(",") : [];
        } else {
          this.currentValue = val ? val.toString() : null;
        }
      },
      immediate: true
    },
    currentValue(val) {
      if (this.multiple) {
        this.returnValue = val.length ? val.join(",") : null;
      } else {
        this.returnValue = val;
      }
    },
    returnValue(val) {
      this.$emit("input", val);
    }
  },
  created() {
    this.getSelectData();
  },
  methods: {
    getSelectData() {
      getParkingLotList(this.listQuery).then(res => {
        this.selectData = res.data.rows;
      });
    },
    update(val) {
      this.$emit("change", val);
    }
  }
};
</script>