<template>
  <el-select v-model="currentValue" @change="update" :placeholder="placeholder" :disabled="disabled">
    <el-option v-for="item in listData" :key="item.id" :label="item.smsName" :value="item.smsTemplateId"></el-option>
  </el-select>
</template>
<script>
import { getSmsTemplete } from "@/api/common"

export default {
  model: {
    event: "change"
  },
  props: {
    value: {
      type: [String, Number]
    },
    placeholder: String,
    disabled: {
      type: Boolean,
      default: false
    },
    msgData: Object
  },
  data() {
    return {
      currentValue: this.value != null ? this.value : null,
      listData: []
    };
  },
  watch: {
    msgData(val) {
      this.currentValue = val.smsTemplateId
    },
    value(newVal) {
      this.currentValue = this.value != null ? this.value : null;
    },
    currentValue(newVal) {
      let formatVal = this.formatVal(newVal)
      this.$emit("input", formatVal);
    },
  },
  created() {
    this.getSmsTemplete();
  },
  methods: {
    getSmsTemplete() {
      getSmsTemplete().then(res => {
        this.listData = res.data.map(element => {
          this.$set(element, "smsTemplateId" , element.id)
          return element
        });
      });
    },
    update(val) {
      let formatVal = this.formatVal(val)
      this.$emit("change", formatVal);
    },
    formatVal(newVal) {
      let formatVal = newVal;
      try {
        formatVal = parseInt(newVal);
      } catch (error) {
        console.log(error);
      }
      return formatVal;
    }
  }
};
</script>
<style lang="scss" scoped></style>