<template>
  <el-select v-model="currentValue" @change="update" :placeholder="placeholder" :disabled="disabled" :clearable="clearable" :filterable="filterable">
    <el-option v-for="item in listData" :key="item.id" :label="item.label" :value="item.value.toString()"></el-option>
  </el-select>
</template>
<script>
import { getDictionary } from "@/api/common";

export default {
  model: {
    event: "change"
  },
  props: {
    value: {
      type: [String, Number]
    },
    dictName: {
      required: true,
      type: [String, Number]
    },
    placeholder: String,
    disabled: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    },
    isInt: {
      type: Boolean,
      default: true
    },
    filterable: [Boolean]
  },
  data() {
    return {
      currentValue: this.value != null ? this.value.toString() : null,
      listData: []
    };
  },
  watch: {
    value(newVal) {
      this.currentValue = this.value != null ? this.value.toString() : null;
    },
    currentValue(newVal) {
      let formatVal = this.formatVal(newVal)
      this.$emit("input", formatVal);
    },
    dictName() {
      this.getDictionary();
    }
  },
  created() {
    this.getDictionary();
  },
  methods: {
    getDictionary() {
      getDictionary(this.dictName).then(res => {
        this.listData = res.data;
      });
    },
    update(val) {
      let formatVal = this.formatVal(val)
      this.$emit("change", formatVal);
    },
    formatVal(newVal) {
      let formatVal = newVal;
      if ( newVal !== '' ) {
        try {
          if (this.isInt) {
            formatVal = parseInt(newVal);
          }
        } catch (error) {
          console.log(error);
        }
        return formatVal;
      }else {
        return newVal;
      }
    }
  }
};
</script>
<style lang="scss" scoped></style>