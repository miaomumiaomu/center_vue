<template>
  <div class="catalog" :style="waterBg">
    <ul class="catalog-menu" :style="{ width: width }">
      <slot name="catalog-menu-pre"></slot>
      <li v-for="(item,index) in panes" :key="item.$attrs.name" :class="{sel: currentName == item.$attrs.name}" @click="onMenuClick(item,item.$attrs.name,index,$event)"><span>{{index+1}}</span>{{item.$attrs.label}}</li>
    </ul>
    <div class="catalog-content" ref="content" :style="{ height: height, marginLeft: width }" @scroll="onContentScroll">
      <slot></slot>
    </div>
  </div>
</template>
<script>
import { getWaterMark } from '@/api/login'
import { mapState } from "vuex";

export default {
  name: "Catalog",
  props: {
    value: String,
    width: {
      type: String,
      default: "200px"
    },
    height: {
      type: String,
      default: "100%"
    }
  },
  data() {
    return {
      currentName: this.value,
      panes: [],
    };
  },
  computed: {
    panesAttribute() {
      return this.panes.map(item => {
        return {
          name: item.$attrs.name,
          scrollTop: item.$el.offsetTop - this.$refs.content.offsetTop
        };
      });
    },
    ...mapState({
      waterBg: state => state.user.waterBg, // 人脸库标识
    })
  },
  watch: {
    value(value) {
      this.currentName = value;
    },
    currentName(value) {
      this.$emit("input", value);
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.calcPaneInstances();
    });
  },
  updated() {
    this.$nextTick(() => {
      this.calcPaneInstances();
    });
  },
  methods: {
    calcPaneInstances() {
      if (this.$slots.default) {
        const paneSlots = this.$slots.default.filter(
          vnode =>
            vnode.tag &&
            vnode.componentOptions &&
            vnode.componentOptions.Ctor.options.name === "CatalogPane"
        );
        const panes = paneSlots.map(
          ({ componentInstance }) => componentInstance
        );
        // 判断模型是否更新
        if (
          !(
            panes.length === this.panes.length &&
            panes.every((pane, index) => pane === this.panes[index])
          )
        ) {
          this.panes = panes;
        }
      } else if (this.panes.length !== 0) {
        this.panes = [];
      }
    },
    onMenuClick(pane, name, index, event) {
      this.$refs.content.scrollTop = this.panesAttribute[index].scrollTop;

      if (this.$refs.content.scrollTop > this.panesAttribute[index].scrollTop) {
        this.currentName = name;
      }
      this.$emit("menu-click", pane, event);
    },
    onContentScroll(ev) {
      let _arr = this.panesAttribute.filter(
        item => item.scrollTop <= ev.target.scrollTop
      );

      this.currentName = _arr[_arr.length - 1].name;
    }
  }
};
</script>
<style lang="scss" scoped>
.catalog {
  overflow: hidden;
  height: 100%;
}
.catalog-menu {
  float: left;
  position: relative;
  background: transparent;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  // &:after {
  //   position: absolute;
  //   top: 10px;
  //   left: 25px;
  //   bottom: 10px;
  //   background: #333;
  //   width: 1px;
  //   content: "";
  // }
  li {
    position: relative;
    background: #fff;
    line-height: 30px;
    margin-bottom: 20px;
    padding: 5px 0;
    z-index: 10;
    font-size: 14px;
    cursor: pointer;
    &:after {
      position: absolute;
      top: 35px;
      left: 15px;
      bottom: -25px;
      background: rgba(121, 156, 200, 0.368);
      width: 1px;
      content: "";
    }
    &:last-child {
      margin-bottom: 0;
      &:after {
        display: none;
      }
    }
    &.sel {
      span {
        background: #0fa0ff;
        border-color: #0fa0ff;
        color: #fff;
      }
      color: #0fa0ff;
    }
    span {
      display: inline-block;
      background: #fff;
      width: 30px;
      height: 30px;
      line-height: 30px;
      margin-right: 17px;
      border: 1px #333 solid;
      border-radius: 100%;
      text-align: center;
      vertical-align: top;
      color: #333;
    }
  }
}
.catalog-content {
  overflow: auto;
  padding: 0 20px;
  border-left: 1px #e5e5e5 solid;
}
</style>
