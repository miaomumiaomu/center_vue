<template>
  <el-dialog :visible.sync="visible" :title="title" width="600px">

    <div class="container">
      <div class="pre">人员信息</div>
      <div>公安内网数据信息</div>
      <div>互联网数据信息</div>
    </div>

    <template v-for="(item, index) in labelList">
      <div class="container" :key="index">
        <div class="pre">{{ item.label }}</div>
        <div>{{ isShowPolice(item.key) }}</div>
        <div :class="{ 'is-diff': judgeDiff(item.key) }">{{ isShowInternet(item.key) }}</div>
      </div>
    </template>
   
    <div slot="footer" class="footer-class">
      <div class="tooltip">是否将数据覆盖到公安内网?</div>
      <!-- <div class="tooltip">数据已被丢弃</div>
      <div class="tooltip">数据已覆盖到公安内网?</div> -->
      <el-button type="primary" size="mini" @click="onSubmit">覆盖</el-button>
      <el-button type="danger" size="mini" @click="visible=false">丢弃</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      labelList: [
        { label: '姓名', key: 'name' },
        { label: '性别', key: 'sex' },
        { label: '人员类别', key: 'type' },
        { label: '证件号码', key: 'identity' },
        { label: '联系方式', key: 'mobile' },
        { label: '关联房屋', key: 'house' }
      ],
      policeForm: {
        name: '测试',
        sex: '男'
      },
      internetForm: {},
      title: '实有人口采集审核',
      visible: false
    }
  },
  methods: {
    showDialog (row) {
      this.internetForm = row
      this.visible = true
    },
    isShowPolice (key) {
      return this.policeForm[key] ? this.policeForm[key] : '------'
    },
    isShowInternet (key) {
      return this.internetForm[key] ? this.internetForm[key] : '------'
    },
    judgeDiff (key) {
      return !(this.internetForm[key] === this.policeForm[key])
    },
    onSubmit () {

    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  .pre {
    width: 120px;
    text-align: left;
  }
  .is-diff {
    color: red;
  }
  div {
    display: inline-block;
    width: 200px;
    text-align: center;
    padding: 5px 0 5px;
  }
}
.footer-class {
  text-align: center;
}
.tooltip {
  font-size: 14px;
  margin-bottom: 7px;
}
</style>
