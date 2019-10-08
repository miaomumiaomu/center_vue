<template>
  <el-select v-model="currentValue" @change="update" :placeholder="placeholder" :multiple="multiple" :multiple-limit="multipleLimit" :collapse-tags="collapseTags" :popper-class="popperClass" :clearable="clearable" :size="size">
    <el-option v-for="item in selectData" :key="item.num" :label="item.name" :value="item.num+''" />
  </el-select>
</template>
<script>
import { getcarLibraries } from "@/api/carManage";

export default {
  props: {
    value: {
      required: true
    },
    placeholder: String,
    size: String,
    clearable: Boolean,
    multiple: Boolean,
    multipleLimit: {
      type: Number,
      default: 0
    },
    collapseTags: Boolean,
    popperClass: String,
    filtrateNum: Array
  },
  data() {
    return {
      currentValue: [],
      returnValue: null,
      selectData: []
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
    async getSelectData() {
      await getcarLibraries().then(res => {
        let _data = [];
        if(this.filtrateNum) {
          res.data.forEach(element => {
            if(this.filtrateNum.includes(element.num)) {
              return
            }else {
              _data.push(element)
            }
            return _data
          });
          this.selectData = res.data;
        }else {
          _data = res.data
          return _data
        }
        this.selectData = _data;
      });
    },
    update(val) {
      this.$emit("change", val);
    }
  }
};
</script>