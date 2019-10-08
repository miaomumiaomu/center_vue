<template>
  <el-popover placement="bottom" trigger="click" v-model="visible">
    <el-input v-model="policeName" ref="policeInput" clearable slot="reference" placeholder="请输入辖区名称"></el-input>
    <!-- 辖区弹窗 -->
    <el-tree ref="menuTree" :props="props" :data="treeData" class="menu" highlight-current :filter-node-method="filterNode"
    @node-click="onMenuClick"></el-tree>
  </el-popover>
</template>
<script>
import { policeAreasList } from "@/api/Jurisdiction";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      visible: false,
      policeName: '',
      treeData: [],
      props: {
        label: 'areaName',
      },
    }
  },
  props: {
    policeId: String
  },
  model: {
    prop: 'policeId',
    event: 'ayncValue'
  },
  watch: {
    policeName(val) {
      this.$refs.menuTree.filter(val);
      if(val == '') {
        this.$emit('change', null);
        this.$emit('ayncValue', null);
      }
    },
    policeId(val) {
      if (!val) {
        this.policeName = ''
      }
    }
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  mounted() {
    this.policeAreasList();
    this.$nextTick(() => {
      this.policeName = this.userInfo.policeAreaName
      this.$emit('ayncValue', this.userInfo.policeAreaCode);
      this.$emit('policeAreaInfo', {
        code: this.userInfo.policeAreaCode,
        id: this.userInfo.policeAreaId,
        name: this.userInfo.policeAreaName,
      });
    })
  },
  methods: {
    filterNode(value, data, node) {
      if (!value) return true;
      if  (data.areaName.includes(value)) {
        return true;
      }
      return false;
    },
    policeAreasList() {
      policeAreasList().then(res => {
        this.treeData = res.data;
      })
    },
    onMenuClick(row, node) {
      this.policeName = row.areaName;
      this.$emit('change', row.areaCode);
      this.$emit('ayncValue', row.areaCode);
      this.$emit('policeAreaInfo', { code: row.areaCode, id: row.id, name: row.areaName });
      this.visible = false;
    },
    clear() {
      this.policeName = '';
      this.$emit('ayncValue', null);
    },
  }
}
</script>
