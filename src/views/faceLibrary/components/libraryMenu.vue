<template>
  <div>
    <div class="header">
      <strong>人员库</strong>
    </div>
    <!-- 表单筛选 -->
    <ul class="task-list">
      <li v-for="item in listTableData" :class="currentTagType.id == item.id ? 'choose-item' : ''" @click="onItemDetails(item)" :key="item.id">
        <div class="item-header">
          <span>{{item.name}}</span>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import { getLabelLibraryList } from "@/api/faceLibrary";
export default {
  components: {
  },
  data: () => ({
    listTableData: [],
    currentTagType: {},
  }),
  created() {
    this.getTableList();
  },
  methods: {
    getTableList() {
      getLabelLibraryList().then(res => {
        res.data.unshift({ name: '全部人员库', id: null })
        this.listTableData = res.data
      })
    },
    onItemDetails(data) {
      this.$emit('libChange', data)
      this.currentTagType = data
    }
  }
};
</script>
<style lang="scss" scoped>
.app-container {
  position: relative;
  height: 100%;
}

.header {
  padding: 12px;
  overflow: hidden;
  border-bottom: 1px solid rgba(20,25,42,1);
  strong {
    font-size: 18px;
  }
  .pull-right {
    float: right;
    line-height: 20px;
    cursor: pointer;
  }
}
/deep/ {
  .el-dropdown-link {
    color: #0fa0ff;
  }
}
.f-block {
  display: block;
}
.task-list {
  height: calc(100vh - 258px);
  overflow-y: auto;
  li {
    position: relative;
    border-bottom: 1px solid #0fa0ff;
    padding: 10px 30px;
    cursor: pointer;
    div.item-header {
      width: 100%;
      white-space: nowrap;
      span {
        display: inline-block;
        max-width: calc(100% - 50px);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 14px;
        color: #2e2e2e;
        vertical-align: middle;
      }
    }
    .el-dropdown {
      display: none;
      position: absolute;
      right: 10px;
      top: 50%;
      transform: rotate(90deg) translateX(-50%);
      font-size: 14px;
      color: #2e2e2e;
    }
  }
  li:last-of-type {
    border-bottom: none;
  }
  li:hover {
    background-color: gainsboro;
    .el-dropdown {
      display: inherit;
    }
  }
}
.choose-item {
  background-color: gainsboro;
}
</style>