<template>
  <div class="face-category-list" :class="{list: type==0,card: type==1}" v-if="chosen.length">
    <template v-if="type == 0">
      <template v-for="(item,index) in chosen">
        <div class="item" v-if="data[item]" :key="index" :style="{backgroundColor:data[item].color,color:colorBrightness(data[item].color)}">{{data[item].shortName}}</div>
      </template>
    </template>
    <template v-if="type == 1">
      <template v-for="(item,index) in chosen">
        <div class="item" v-if="data[item]" :key="index" :style="{zIndex:10-index}" :class="className">
          <span :style="{backgroundColor:data[item].color,color:colorBrightness(data[item].color)}">{{data[item].shortName}}</span>
          <i :style="{borderLeftColor:data[item].color}" class="icon"></i>
        </div>
      </template>
    </template>
    <template v-if="type == 2">
      <template v-for="(item,index) in chosen">
        <div class="item" v-if="data[item]" :key="index">{{data[item].name}}<span v-if="!index + 1 === chosen.length">、</span></div>
      </template>
    </template>
  </div>
</template>
<script>
import { colorBrightness } from "@/utils";

export default {
  props: {
    type: Number, // 展示类型。1为表格，2为卡片
    data: Object,
    chosen: Array,
    className: { type: String, default: "" },
    test: Object
  },
  data() {
    return {
      colorBrightness: colorBrightness
    };
  }
};
</script>
<style lang="scss" scoped>
.face-category-list {
  &.list {
    // padding: 4px 0 0;
    padding: 0;
    .item {
      display: inline-block;
      height: 22px;
      line-height: 16px;
      padding: 0 3px;
      margin: 0 4px 4px;
      border: 2px #fff solid;
      border-radius: 99px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      vertical-align: top;
      text-align: center;
      font-size: 12px;
      color: #fff;
    }
  }
  &.card {
    position: absolute;
    top: 0;
    left: 0;
    padding-left: 2px;
    .item {
      position: relative;
      float: left;
      line-height: 18px;
      margin-left: -6px;
      padding-right: 6px;
      overflow: hidden;
      font-size: 12px;
      span {
        display: block;
        padding: 0 2px 0 8px;
      }
      .icon {
        position: absolute;
        top: -9px;
        right: 0;
        width: 0;
        height: 0;
        float: left;
        border-left: 6px solid #fff;
        border-top: 9px solid transparent;
        border-bottom: 18px solid transparent;
        content: "";
      }
    }
  }
}
</style>
