<template>
  <el-form ref="form" label-width="80px">
    <el-form-item label="已选标签" style="margin-bottom: 10px;" v-if="isHave">
      <template v-for="(items, indexs) in selected">
        <el-tag v-for="(item, index) in items" :key="indexs + '' + index" class="focusOn" @click.native="tagClick(item, indexs)" @close="tagClose(item)" closable>{{item.name}}</el-tag>
      </template>
    </el-form-item>
    <el-form-item label="人员标签" style="margin-bottom: 10px;">
      <el-tag v-for="(item, index) in allPersonTag" :key="'1-' + index" :class="{ focusOn: item.select }" @click.native="selectTag(index)">{{item.name}}</el-tag>
      <br/>
      <el-tag v-for="(item, index) in currentPersonTag" :key="'2-' + index" :class="{ focusOn: item.select }" @click.native="selectSonTag(index)">{{item.name}}</el-tag>
    </el-form-item>
  </el-form>
</template>
<script>

import { getTagTypeList, getTagById } from '@/api/libTagsManage'
export default {
  props: {
  },
  data() {
    return {
      allPersonTag: [],
      currentIndex: null,
      currentPersonTag: [],
      promiseState: false,
      selected: []
    };
  },
  computed: {
    isHave() {
      let num = this.selected.find(item => item.length)
      return num
    }
  },
  watch: {
  },
  mounted() {
    //获取标签数据
    getTagTypeList().then(res => {
      if (res.status == 200) {
        this.$nextTick(() => {
          this.allPersonTag = res.data;
          let func = (val) => {
            return getTagById({ categoryId: val.id }).then(result => {
              result.data.unshift({ name: '全部', select: false })
              result.data.forEach(item => this.$set(item, 'select', false))
              this.$set(val, 'children', result.data)
            })
          }
          Promise.all(res.data.map(item => {
            this.$set(item, 'select', false)
            return func(item)
          })).then(res => {
            this.promiseState = true
          })
        })
      }
    });
  },
  methods: {
    tagClose(val) {
      if (val.children) {
        val.children.forEach(item => {
          item.select = false
        })
      } else {
        val.select = false
      }
      this.setSelected()
    },
    tagClick(val, indexs) {
      this.allPersonTag[this.currentIndex].select = false
      this.allPersonTag[indexs].select = true
      this.currentIndex = indexs
      this.currentPersonTag = this.allPersonTag[indexs].children
      this.setSelected()
    },
    //一级标签选择
    selectTag(index) {
      if (index == this.currentIndex) {
        return
      }
      this.currentIndex != null ? this.allPersonTag[this.currentIndex].select = false : ''
      this.allPersonTag[index].select = true
      this.currentIndex = index
      this.currentPersonTag = this.allPersonTag[index].children
    },
    //二级标签选择
    selectSonTag(index) {
      let val = this.currentPersonTag.filter(item => item.select)
      if (index) {
        if (this.currentPersonTag[index].select) {
          this.currentPersonTag[index].select = false
          if (val.length === this.currentPersonTag.length) {
            this.currentPersonTag[0].select = false
          }
        } else {
          this.currentPersonTag[index].select = true
          if (val.length === this.currentPersonTag.length - 2) {
            this.currentPersonTag[0].select = true
          }
        }
      } else {
        val = val.length === this.currentPersonTag.length ? false : true
        this.currentPersonTag.forEach(item => item.select = val)
      }
      this.setSelected()
    },
    setSelected() {
      let arr = []
      this.allPersonTag.forEach(items => {
        //二级标签未加载时
        if (!items.children) {
          return
        }
        let val = null
        val = items.children.filter(item => {
          if (item.name == '全部') {
            return false
          }
          return item.select
        })
        if (val.length == items.children.length - 1 && items.children.length !== 1) {
          val = [items]
        }
        arr.push(val)
      })
      this.selected = arr
      this.$emit('tagChange', arr)
    },
  }
};
</script>
<style lang="scss" scoped>
.el-tag{
  margin-right: 10px;
  cursor: pointer;
  background: #202c40;
  border-color: #35425e;
  color: #6b85a6;
}
.focusOn {
  color: #E2E9EE;
  border:1px solid rgba(4,101,193,0.3);
  background:rgba(44,95,198,0.3);
}
</style>