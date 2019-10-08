<template>
  <div class="img-show" :style="{width: width, height: height, fontSize: size}">
    <div class="null" v-if="!imgSrc">{{txt}}</div>
    <img v-else :src="image" :style="{width:width=='auto'?'atuo':'100%',height:height=='auto'?'atuo':'100%'}" />
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    imgSrc: {
      default: "",
      type: [String, Number]
    },
    base64: {
      default: false,
      type: Boolean
    },
    txt: {
      default: "暂无图片",
      type: String
    },
    size: {
      default: "12px",
      type: String
    },
    width: {
      default: "auto",
      type: String
    },
    height: {
      default: "auto",
      type: String
    }
  },
  computed: {
    image() {
      if (this.base64) {
        return 'data:image/jpeg;base64,' + this.imgSrc
      } else if (typeof this.imgSrc == 'number') {
        return `/api/person/personInfos/${this.imgSrc}/img`
      } else {
        return this.imgSrc
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.img-show {
  position: relative;
  background: #ccc;
  margin: 0 auto;
  overflow: hidden;
  border-radius: 4px;
  .null {
    position: absolute;
    top: 50%;
    left: 50%;
    line-height: 120%;
    transform: translate(-50%, -50%);
  }
  img {
    display: block;
  }
}
</style>
