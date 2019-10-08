<template>
  <el-select v-model="currentValue" @change="update" :placeholder="placeholder" :multiple="multiple" :multiple-limit="multipleLimit" :collapse-tags="collapseTags" :popper-class="popperClass" :clearable="clearable" :size="size">
    <el-option v-for="item in selectData" :key="item.id" :label="item.name" :value="item.id+''" />
  </el-select>
</template>
<script>
import { getCommunitiesList } from "@/api/faceLibrary";

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
    popperClass: String
  },
  data() {
    return {
      currentValue: [],
      returnValue: null,
      selectData: [
        // {name: '汉族', id: '0'},
        {name: '维族', id: '1'},
        // {name: '白人', id: '2'},
        // {name: '黑人', id: '3'}
      ]
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
    
  },
  methods: {
    update(val) {
      this.$emit("change", val);
    }
  }
};
</script>