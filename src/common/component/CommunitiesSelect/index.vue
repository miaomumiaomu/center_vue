<template>
  <el-select v-model="currentValue" @change="update" :placeholder="placeholder" :multiple="multiple" :multiple-limit="multipleLimit" :collapse-tags="collapseTags" :popper-class="popperClass" :clearable="clearable" :size="size" :disabled="disabled">
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
    policeAreaCode: {
      type: [Number, String],
      default: null
    },
    collapseTags: Boolean,
    popperClass: String,
    disabled: {
      type: Boolean,
      default: false
    }
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
      console.log(val)
      this.$emit("input", val);
    },
    policeAreaCode(val, oldval) {
      this.getSelectData();
    }
  },
  created() {
    this.getSelectData();
  },
  methods: {
    getSelectData() {
      let _filter_like_policeAreaCode = this.policeAreaCode
      getCommunitiesList({ _filter_like_policeAreaCode }).then(res => {
        this.selectData = res.data;
      });
    },
    update(val) {
      this.$emit("change", val);
    }
  }
};
</script>