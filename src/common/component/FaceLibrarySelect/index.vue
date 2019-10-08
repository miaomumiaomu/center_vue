<template>
  <el-select v-model="currentValue" @change="update" :placeholder="placeholder" :multiple="multiple" :multiple-limit="multipleLimit" :collapse-tags="collapseTags" :popper-class="popperClass" :clearable="clearable" :size="size">
    <el-option v-for="item in selectData" :key="item.id" :label="item.name" :value="item.id+''" />
  </el-select>
</template>
<script>
import { getTagList } from "@/api/libTagsManage";

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
    filtrateNum: Array,
    extraData: null, //获取选中的item中额外属性，监听getExtraData回调获取该属性的值
  },
  data() {
    return {
      currentValue: [],
      returnValue: null,
      selectData: [],
      extraObj: null
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
      if (this.extraData) {
        this.getExtraData()
      }
    }
  },
  created() {
    this.getSelectData();
  },
  methods: {
    async getSelectData() {
      let _data = [];
      await getTagList().then(res => {
        if(this.filtrateNum) {
          res.data.forEach(element => {
            if(this.filtrateNum.includes(element.num)) {
              return
            }else {
              _data.push(element)
            }
          });
        }else {
          _data = res.data
        }
        //如果需要额外返回数据时
        if (this.extraData) {
          this.extraObj = {}
          _data.forEach(item => this.extraObj[item.id] = item)

          //初始化数据时，如果已经有选中的值，自动返回对应的额外数据
          if (this.currentValue.length) {
            this.getExtraData()
          }
        }
      });
      this.selectData = _data;
    },
    update(val) {
      this.$emit("change", val);
    },
    getExtraData() {
      if (!this.extraObj) {
        return
      }
      let _data = null
      if (this.multiple) {
        _data = this.currentValue.map(item => this.extraObj[item][this.extraData]).join(',') || null
      } else {
        _data = this.extraObj[this.currentValue][this.extraData] || null
      }
      this.$emit('extraDataBack', _data)
    }
  }
};
</script>